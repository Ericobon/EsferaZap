import axios from 'axios';
import QRCode from 'qrcode';

export interface QRCodeResponse {
  qrCode: string;
  status: 'pending' | 'connected' | 'error';
  message?: string;
  expires?: Date;
}

export interface WhatsAppConnectionConfig {
  provider: 'meta_business' | 'twilio' | 'evolution_api' | 'baileys' | 'wppconnect' | 'venom';
  apiKey?: string;
  accessToken?: string;
  phoneNumberId?: string;
  businessAccountId?: string;
  serverUrl?: string;
  instanceId?: string;
  webhookSecret?: string;
}

export abstract class BaseWhatsAppProvider {
  protected config: WhatsAppConnectionConfig;

  constructor(config: WhatsAppConnectionConfig) {
    this.config = config;
  }

  abstract generateQRCode(): Promise<QRCodeResponse>;
  abstract checkConnection(): Promise<{ connected: boolean; status: string }>;
  abstract sendMessage(to: string, message: string): Promise<any>;
  abstract validateWebhook(payload: any, signature?: string): boolean;
}

// Meta Business API Provider
export class MetaBusinessProvider extends BaseWhatsAppProvider {
  private baseUrl = 'https://graph.facebook.com/v18.0';

  async generateQRCode(): Promise<QRCodeResponse> {
    try {
      // Meta Business API doesn't use QR codes, it uses OAuth flow
      const oauthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${this.config.businessAccountId}&redirect_uri=${encodeURIComponent(process.env.WEBHOOK_URL || '')}&scope=whatsapp_business_management,whatsapp_business_messaging`;
      
      const qrCodeDataURL = await QRCode.toDataURL(oauthUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      return {
        qrCode: qrCodeDataURL,
        status: 'pending',
        message: 'Escaneie o QR Code ou acesse o link para autorizar a conexão com Meta Business API',
        expires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      };
    } catch (error) {
      return {
        qrCode: '',
        status: 'error',
        message: `Erro ao gerar QR Code para Meta Business: ${error}`
      };
    }
  }

  async checkConnection(): Promise<{ connected: boolean; status: string }> {
    if (!this.config.accessToken || !this.config.phoneNumberId) {
      return { connected: false, status: 'Credenciais não configuradas' };
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/${this.config.phoneNumberId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`
          }
        }
      );
      return { connected: true, status: 'Conectado ao Meta Business API' };
    } catch (error: any) {
      return { 
        connected: false, 
        status: `Erro de conexão: ${error.response?.data?.error?.message || error.message}`
      };
    }
  }

  async sendMessage(to: string, message: string): Promise<any> {
    const response = await axios.post(
      `${this.baseUrl}/${this.config.phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }

  validateWebhook(payload: any, signature?: string): boolean {
    // Implement Meta webhook validation
    return true;
  }
}

// Evolution API Provider
export class EvolutionApiProvider extends BaseWhatsAppProvider {
  async generateQRCode(): Promise<QRCodeResponse> {
    try {
      const response = await axios.get(
        `${this.config.serverUrl}/instance/connect/${this.config.instanceId}`,
        {
          headers: {
            'apikey': this.config.apiKey
          }
        }
      );

      if (response.data.qrcode) {
        return {
          qrCode: response.data.qrcode,
          status: 'pending',
          message: 'Escaneie o QR Code com seu WhatsApp',
          expires: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
        };
      }

      return {
        qrCode: '',
        status: 'error',
        message: 'Não foi possível gerar o QR Code'
      };
    } catch (error: any) {
      return {
        qrCode: '',
        status: 'error',
        message: `Erro ao conectar com Evolution API: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async checkConnection(): Promise<{ connected: boolean; status: string }> {
    try {
      const response = await axios.get(
        `${this.config.serverUrl}/instance/fetchInstances`,
        {
          headers: {
            'apikey': this.config.apiKey
          }
        }
      );

      const instance = response.data.find((inst: any) => inst.instance.instanceName === this.config.instanceId);
      if (instance && instance.instance.state === 'open') {
        return { connected: true, status: 'Conectado ao Evolution API' };
      }

      return { connected: false, status: 'Instância não conectada' };
    } catch (error: any) {
      return { 
        connected: false, 
        status: `Erro: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async sendMessage(to: string, message: string): Promise<any> {
    const response = await axios.post(
      `${this.config.serverUrl}/message/sendText/${this.config.instanceId}`,
      {
        number: to,
        text: message
      },
      {
        headers: {
          'apikey': this.config.apiKey,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }

  validateWebhook(payload: any): boolean {
    return true;
  }
}

// Twilio Provider
export class TwilioProvider extends BaseWhatsAppProvider {
  private baseUrl = 'https://api.twilio.com/2010-04-01';

  async generateQRCode(): Promise<QRCodeResponse> {
    try {
      // Twilio WhatsApp sandbox setup URL
      const sandboxUrl = `https://wa.me/14155238886?text=join%20${this.config.instanceId || 'your-sandbox-keyword'}`;
      
      const qrCodeDataURL = await QRCode.toDataURL(sandboxUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      return {
        qrCode: qrCodeDataURL,
        status: 'pending',
        message: 'Escaneie o QR Code para aderir ao Twilio Sandbox do WhatsApp',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      };
    } catch (error) {
      return {
        qrCode: '',
        status: 'error',
        message: `Erro ao gerar QR Code para Twilio: ${error}`
      };
    }
  }

  async checkConnection(): Promise<{ connected: boolean; status: string }> {
    if (!this.config.apiKey) {
      return { connected: false, status: 'API Key do Twilio não configurada' };
    }

    try {
      // Check Twilio account status
      const response = await axios.get(
        `${this.baseUrl}/Accounts.json`,
        {
          auth: {
            username: this.config.instanceId || '',
            password: this.config.apiKey
          }
        }
      );
      return { connected: true, status: 'Conectado ao Twilio WhatsApp' };
    } catch (error: any) {
      return { 
        connected: false, 
        status: `Erro de conexão Twilio: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async sendMessage(to: string, message: string): Promise<any> {
    const response = await axios.post(
      `${this.baseUrl}/Accounts/${this.config.instanceId}/Messages.json`,
      new URLSearchParams({
        From: `whatsapp:${this.config.phoneNumberId}`,
        To: `whatsapp:${to}`,
        Body: message
      }),
      {
        auth: {
          username: this.config.instanceId || '',
          password: this.config.apiKey || ''
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data;
  }

  validateWebhook(payload: any): boolean {
    return true;
  }
}

// Baileys Provider (Open source WhatsApp Web API)
export class BaileysProvider extends BaseWhatsAppProvider {
  async generateQRCode(): Promise<QRCodeResponse> {
    try {
      const response = await axios.post(
        `${this.config.serverUrl}/api/sessions`,
        {
          sessionId: this.config.instanceId
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      if (response.data.qr) {
        const qrCodeDataURL = await QRCode.toDataURL(response.data.qr, {
          width: 256,
          margin: 2
        });

        return {
          qrCode: qrCodeDataURL,
          status: 'pending',
          message: 'Escaneie o QR Code com seu WhatsApp',
          expires: new Date(Date.now() + 2 * 60 * 1000) // 2 minutes
        };
      }

      return {
        qrCode: '',
        status: 'error',
        message: 'QR Code não disponível'
      };
    } catch (error: any) {
      return {
        qrCode: '',
        status: 'error',
        message: `Erro ao conectar com Baileys: ${error.message}`
      };
    }
  }

  async checkConnection(): Promise<{ connected: boolean; status: string }> {
    try {
      const response = await axios.get(
        `${this.config.serverUrl}/api/sessions/${this.config.instanceId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      return { 
        connected: response.data.connected, 
        status: response.data.connected ? 'Conectado via Baileys' : 'Desconectado'
      };
    } catch (error: any) {
      return { connected: false, status: `Erro: ${error.message}` };
    }
  }

  async sendMessage(to: string, message: string): Promise<any> {
    const response = await axios.post(
      `${this.config.serverUrl}/api/messages/text`,
      {
        sessionId: this.config.instanceId,
        to: to,
        text: message
      },
      {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }

  validateWebhook(payload: any): boolean {
    return true;
  }
}

// Factory function to create the appropriate provider
export function createWhatsAppProvider(config: WhatsAppConnectionConfig): BaseWhatsAppProvider {
  switch (config.provider) {
    case 'meta_business':
      return new MetaBusinessProvider(config);
    case 'evolution_api':
      return new EvolutionApiProvider(config);
    case 'twilio':
      return new TwilioProvider(config);
    case 'baileys':
      return new BaileysProvider(config);
    case 'wppconnect':
    case 'venom':
      // These could be implemented similarly to Baileys
      return new BaileysProvider(config); // Fallback for now
    default:
      throw new Error(`Provider ${config.provider} não suportado`);
  }
}