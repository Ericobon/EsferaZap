// Provedor Baileys simplificado para MVP
import { Boom } from '@hapi/boom';
import makeWASocket, { 
  ConnectionState, 
  DisconnectReason, 
  useMultiFileAuthState,
  WASocket,
  proto
} from '@whiskeysockets/baileys';
import P from 'pino';
import QRCode from 'qrcode';
import { storage } from '../storage';

interface BaileysBot {
  socket: WASocket | null;
  qrCode: string | null;
  status: 'disconnected' | 'connecting' | 'connected' | 'qr_required';
}

class BaileysProvider {
  private bots: Map<string, BaileysBot> = new Map();

  /**
   * Conecta um bot usando Baileys
   */
  async connectBot(botId: string): Promise<{ success: boolean; qrCode?: string; error?: string }> {
    try {
      const bot = await storage.getBot(botId);
      if (!bot) {
        return { success: false, error: 'Bot não encontrado' };
      }

      // Configurar auth state (em prod usar banco de dados)
      const authDir = `./auth_baileys_${botId}`;
      const { state, saveCreds } = await useMultiFileAuthState(authDir);

      // Logger minimalista
      const logger = P({ level: 'silent' });

      // Criar socket Baileys
      const sock = makeWASocket({
        auth: state,
        logger,
        browser: ['EsferaZap', 'Chrome', '110.0.0'],
        markOnlineOnConnect: false,
        syncFullHistory: false,
        // getMessage: async (key) => {
        //   // Buscar mensagem do banco de dados
        //   return undefined;
        // }
      });

      const botInstance: BaileysBot = {
        socket: sock,
        qrCode: null,
        status: 'connecting'
      };

      this.bots.set(botId, botInstance);

      // Event listeners
      sock.ev.on('creds.update', saveCreds);

      sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          // Gerar QR Code como string
          const qrString = await QRCode.toString(qr, { type: 'terminal' });
          const qrDataURL = await QRCode.toDataURL(qr);
          
          botInstance.qrCode = qrDataURL;
          botInstance.status = 'qr_required';
          
          // Salvar QR no banco
          await storage.updateBot(botId, {
            qrCode: qrDataURL,
            connectionStatus: 'qr_required',
            lastConnectionCheck: new Date()
          });

          console.log(`QR Code gerado para bot ${botId}:`, qrString);
        }

        if (connection === 'open') {
          botInstance.status = 'connected';
          botInstance.qrCode = null;
          
          await storage.updateBot(botId, {
            connectionStatus: 'connected',
            lastConnectionCheck: new Date(),
            qrCode: null
          });

          console.log(`Bot ${botId} conectado com sucesso!`);
        }

        if (connection === 'close') {
          const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
          
          botInstance.status = 'disconnected';
          await storage.updateBot(botId, {
            connectionStatus: 'disconnected',
            lastConnectionCheck: new Date()
          });

          if (shouldReconnect) {
            console.log(`Reconectando bot ${botId}...`);
            // Reconectar após 5 segundos
            setTimeout(() => this.connectBot(botId), 5000);
          } else {
            console.log(`Bot ${botId} foi deslogado`);
            this.bots.delete(botId);
          }
        }
      });

      // Event listener para mensagens recebidas
      sock.ev.on('messages.upsert', async (messageUpdate) => {
        for (const message of messageUpdate.messages) {
          if (message.key.fromMe) continue; // Ignorar mensagens próprias

          const fromNumber = message.key.remoteJid;
          const messageContent = message.message?.conversation || 
                               message.message?.extendedTextMessage?.text || '';

          if (fromNumber && messageContent) {
            await this.processIncomingMessage(botId, fromNumber, messageContent);
          }
        }
      });

      return { success: true };

    } catch (error) {
      console.error(`Erro ao conectar bot ${botId}:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }

  /**
   * Processa mensagem recebida
   */
  private async processIncomingMessage(botId: string, fromNumber: string, content: string) {
    try {
      const bot = await storage.getBot(botId);
      if (!bot || !bot.prompt) return;

      // Gerar resposta com IA
      const { generateWhatsAppResponse } = await import('./gemini.js');
      const aiResponse = await generateWhatsAppResponse(content, [], bot.prompt);

      // Enviar resposta
      await this.sendMessage(botId, fromNumber, aiResponse);

      // Salvar conversa no banco
      await this.saveConversation(botId, fromNumber, content, aiResponse);

    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    }
  }

  /**
   * Enviar mensagem
   */
  async sendMessage(botId: string, toNumber: string, content: string): Promise<boolean> {
    try {
      const botInstance = this.bots.get(botId);
      if (!botInstance || !botInstance.socket || botInstance.status !== 'connected') {
        return false;
      }

      await botInstance.socket.sendMessage(toNumber, { text: content });
      return true;

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return false;
    }
  }

  /**
   * Obter QR Code do bot
   */
  getQRCode(botId: string): string | null {
    const botInstance = this.bots.get(botId);
    return botInstance?.qrCode || null;
  }

  /**
   * Obter status da conexão
   */
  getConnectionStatus(botId: string): string {
    const botInstance = this.bots.get(botId);
    return botInstance?.status || 'disconnected';
  }

  /**
   * Desconectar bot
   */
  async disconnectBot(botId: string): Promise<void> {
    const botInstance = this.bots.get(botId);
    if (botInstance?.socket) {
      await botInstance.socket.logout();
      this.bots.delete(botId);
    }
  }

  /**
   * Salvar conversa no banco
   */
  private async saveConversation(botId: string, phoneNumber: string, userMessage: string, botResponse: string) {
    try {
      // Criar ou encontrar conversa
      let conversation = await storage.getConversationByPhone(botId, phoneNumber);
      if (!conversation) {
        conversation = await storage.createConversation({
          botId,
          customerPhone: phoneNumber,
          customerName: phoneNumber,
          isActive: true,
          assignedToAgent: false
        });
      }

      // Salvar mensagem do usuário
      await storage.createMessage({
        botId,
        conversationId: conversation.id,
        fromNumber: phoneNumber,
        toNumber: botId,
        content: userMessage,
        messageType: 'text',
        direction: 'inbound',
        status: 'received'
      });

      // Salvar resposta do bot
      await storage.createMessage({
        botId,
        conversationId: conversation.id,
        fromNumber: botId,
        toNumber: phoneNumber,
        content: botResponse,
        messageType: 'text',
        direction: 'outbound',
        status: 'sent'
      });

      // Atualizar timestamp da conversa
      await storage.updateConversation(conversation.id, {
        lastMessageAt: new Date()
      });

    } catch (error) {
      console.error('Erro ao salvar conversa:', error);
    }
  }
}

// Singleton instance
export const baileysProvider = new BaileysProvider();