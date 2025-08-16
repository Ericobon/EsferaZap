// Simulador de WhatsApp para MVP - Permite testar o chatbot sem conexão real
export class WhatsAppSimulator {
  
  /**
   * Simula o envio de uma mensagem para o chatbot
   */
  static async simulateMessage(botId: string, message: string, fromNumber: string = '+5511999999999') {
    try {
      const { storage } = await import('../storage');
      const bot = await storage.getBot(botId);
      
      if (!bot || !bot.prompt) {
        throw new Error('Bot não encontrado ou sem prompt configurado');
      }

      // Gerar resposta com IA
      const { generateWhatsAppResponse } = await import('./gemini.js');
      const aiResponse = await generateWhatsAppResponse(message, [], bot.prompt);

      // Simular conversa no banco
      let conversation = await storage.getConversationByPhone(botId, fromNumber);
      if (!conversation) {
        conversation = await storage.createConversation({
          botId,
          customerPhone: fromNumber,
          customerName: `Cliente Teste ${fromNumber}`,
          isActive: true,
          assignedToAgent: false
        });
      }

      // Salvar mensagem do usuário
      await storage.createMessage({
        botId,
        conversationId: conversation.id,
        fromNumber,
        toNumber: bot.phoneNumber,
        content: message,
        messageType: 'text',
        direction: 'inbound',
        status: 'received'
      });

      // Salvar resposta do bot
      await storage.createMessage({
        botId,
        conversationId: conversation.id,
        fromNumber: bot.phoneNumber,
        toNumber: fromNumber,
        content: aiResponse,
        messageType: 'text',
        direction: 'outbound',
        status: 'sent'
      });

      // Atualizar timestamp da conversa
      await storage.updateConversation(conversation.id, {
        lastMessageAt: new Date()
      });

      return {
        success: true,
        userMessage: message,
        botResponse: aiResponse,
        conversationId: conversation.id,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Erro na simulação:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Gera um QR code fake para demonstração
   */
  static generateFakeQR(botId: string): string {
    // Gerar um QR code base64 simples para demonstração
    const qrData = `EsferaZap-MVP-Bot-${botId}-${Date.now()}`;
    
    // Simular um QR code em base64 (seria um QR real em produção)
    const fakeQRBase64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;
    
    return fakeQRBase64;
  }

  /**
   * Simula diferentes estados de conexão
   */
  static getConnectionStates() {
    return {
      'qr_required': 'QR Code necessário - Escaneie para conectar',
      'connecting': 'Conectando ao WhatsApp...',
      'connected': 'Conectado e pronto para receber mensagens',
      'disconnected': 'Desconectado - Clique para reconectar'
    };
  }

  /**
   * Simula o status de um bot
   */
  static async simulateConnectionStatus(botId: string): Promise<{
    status: string;
    message: string;
    qrCode?: string;
    lastCheck: string;
  }> {
    const states = this.getConnectionStates();
    const statusKeys = Object.keys(states);
    const randomStatus = statusKeys[Math.floor(Math.random() * statusKeys.length)];
    
    const result = {
      status: randomStatus,
      message: states[randomStatus as keyof typeof states],
      lastCheck: new Date().toISOString()
    };

    // Se precisa de QR, gerar um fake
    if (randomStatus === 'qr_required') {
      return {
        ...result,
        qrCode: this.generateFakeQR(botId)
      };
    }

    return result;
  }

  /**
   * Simula mensagens de exemplo para testar o bot
   */
  static getExampleMessages() {
    return [
      "Olá! Como você pode me ajudar?",
      "Qual é o horário de funcionamento?",
      "Preciso de informações sobre produtos",
      "Como faço para entrar em contato?",
      "Obrigado pela atenção!",
      "Qual é o preço do serviço?",
      "Vocês fazem entrega?",
      "Tenho uma dúvida sobre meu pedido"
    ];
  }
}