import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';
import { z } from 'zod';
import PQueue from 'p-queue';

// Schemas de validação
const TextMessageSchema = z.object({
  to: z.string(),
  text: z.string()
});

const MediaMessageSchema = z.object({
  to: z.string(),
  mediaUrl: z.string().url(),
  caption: z.string().optional(),
  type: z.enum(['image', 'video', 'audio', 'document'])
});

const InteractiveMessageSchema = z.object({
  to: z.string(),
  type: z.enum(['button', 'list']),
  body: z.string(),
  header: z.string().optional(),
  footer: z.string().optional(),
  buttons: z.array(z.object({
    id: z.string(),
    title: z.string()
  })).optional(),
  sections: z.array(z.object({
    title: z.string(),
    rows: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional()
    }))
  })).optional()
});

export class WhatsAppService {
  private client: AxiosInstance;
  private phoneNumberId: string;
  private accessToken: string;
  private queue: PQueue;

  constructor() {
    this.phoneNumberId = process.env.WA_PHONE_NUMBER_ID!;
    this.accessToken = process.env.WA_ACCESS_TOKEN!;
    
    // Rate limiting queue - WhatsApp permite 80 msgs/segundo
    this.queue = new PQueue({ 
      concurrency: 50,
      interval: 1000,
      intervalCap: 80
    });

    this.client = axios.create({
      baseURL: `https://graph.facebook.com/v18.0/${this.phoneNumberId}`,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    // Interceptor para retry automático
    this.client.interceptors.response.use(
      response => response,
      async error => {
        const { config, response } = error;
        
        if (response?.status === 429 && config._retry < 3) {
          config._retry = (config._retry || 0) + 1;
          const delay = Math.pow(2, config._retry) * 1000;
          
          logger.warn(`Rate limited, retrying in ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          return this.client(config);
        }
        
        throw error;
      }
    );
  }

  // Enviar mensagem de texto
  async sendText(data: z.infer<typeof TextMessageSchema>) {
    const validated = TextMessageSchema.parse(data);
    
    return this.queue.add(async () => {
      try {
        const response = await this.client.post('/messages', {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: validated.to,
          type: 'text',
          text: {
            preview_url: true,
            body: validated.text
          }
        });

        logger.info(`Text message sent to ${validated.to}`, {
          messageId: response.data.messages[0].id
        });

        return response.data;
      } catch (error: any) {
        logger.error('Failed to send text message', {
          to: validated.to,
          error: error.response?.data || error.message
        });
        throw error;
      }
    });
  }

  // Enviar mídia (imagem, vídeo, áudio, documento)
  async sendMedia(data: z.infer<typeof MediaMessageSchema>) {
    const validated = MediaMessageSchema.parse(data);
    
    return this.queue.add(async () => {
      try {
        const mediaPayload: any = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: validated.to,
          type: validated.type
        };

        // Configurar payload baseado no tipo
        const mediaConfig: any = {
          link: validated.mediaUrl
        };

        if (validated.caption && ['image', 'video'].includes(validated.type)) {
          mediaConfig.caption = validated.caption;
        }

        mediaPayload[validated.type] = mediaConfig;

        const response = await this.client.post('/messages', mediaPayload);

        logger.info(`${validated.type} message sent to ${validated.to}`, {
          messageId: response.data.messages[0].id
        });

        return response.data;
      } catch (error: any) {
        logger.error(`Failed to send ${validated.type} message`, {
          to: validated.to,
          error: error.response?.data || error.message
        });
        throw error;
      }
    });
  }

  // Enviar mensagem interativa (botões ou lista)
  async sendInteractive(data: z.infer<typeof InteractiveMessageSchema>) {
    const validated = InteractiveMessageSchema.parse(data);
    
    return this.queue.add(async () => {
      try {
        const interactivePayload: any = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: validated.to,
          type: 'interactive',
          interactive: {
            type: validated.type,
            body: { text: validated.body }
          }
        };

        if (validated.header) {
          interactivePayload.interactive.header = { 
            type: 'text', 
            text: validated.header 
          };
        }

        if (validated.footer) {
          interactivePayload.interactive.footer = { 
            text: validated.footer 
          };
        }

        if (validated.type === 'button' && validated.buttons) {
          interactivePayload.interactive.action = {
            buttons: validated.buttons.map(btn => ({
              type: 'reply',
              reply: {
                id: btn.id,
                title: btn.title
              }
            }))
          };
        }

        if (validated.type === 'list' && validated.sections) {
          interactivePayload.interactive.action = {
            button: 'Selecionar',
            sections: validated.sections
          };
        }

        const response = await this.client.post('/messages', interactivePayload);

        logger.info(`Interactive message sent to ${validated.to}`, {
          messageId: response.data.messages[0].id,
          type: validated.type
        });

        return response.data;
      } catch (error: any) {
        logger.error('Failed to send interactive message', {
          to: validated.to,
          error: error.response?.data || error.message
        });
        throw error;
      }
    });
  }

  // Enviar template de mensagem (para mensagens proativas)
  async sendTemplate(to: string, templateName: string, components?: any[]) {
    return this.queue.add(async () => {
      try {
        const payload: any = {
          messaging_product: 'whatsapp',
          to,
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: 'pt_BR'
            }
          }
        };

        if (components) {
          payload.template.components = components;
        }

        const response = await this.client.post('/messages', payload);

        logger.info(`Template message sent to ${to}`, {
          messageId: response.data.messages[0].id,
          template: templateName
        });

        return response.data;
      } catch (error: any) {
        logger.error('Failed to send template message', {
          to,
          template: templateName,
          error: error.response?.data || error.message
        });
        throw error;
      }
    });
  }

  // Marcar mensagem como lida
  async markAsRead(messageId: string) {
    try {
      const response = await this.client.post('/messages', {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId
      });

      logger.info(`Message marked as read`, { messageId });
      return response.data;
    } catch (error: any) {
      logger.error('Failed to mark message as read', {
        messageId,
        error: error.response?.data || error.message
      });
      throw error;
    }
  }

  // Download de mídia recebida
  async downloadMedia(mediaId: string): Promise<Buffer> {
    try {
      // Primeiro, obter URL da mídia
      const mediaResponse = await this.client.get(`/${mediaId}`);
      const mediaUrl = mediaResponse.data.url;

      // Download do arquivo
      const fileResponse = await axios.get(mediaUrl, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        responseType: 'arraybuffer'
      });

      logger.info(`Media downloaded`, { 
        mediaId, 
        size: fileResponse.data.length 
      });

      return Buffer.from(fileResponse.data);
    } catch (error: any) {
      logger.error('Failed to download media', {
        mediaId,
        error: error.response?.data || error.message
      });
      throw error;
    }
  }

  // Upload de mídia para WhatsApp
  async uploadMedia(buffer: Buffer, mimeType: string): Promise<string> {
    try {
      const formData = new FormData();
      const blob = new Blob([buffer], { type: mimeType });
      formData.append('file', blob);
      formData.append('messaging_product', 'whatsapp');

      const response = await this.client.post('/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      logger.info(`Media uploaded`, { 
        mediaId: response.data.id,
        size: buffer.length
      });

      return response.data.id;
    } catch (error: any) {
      logger.error('Failed to upload media', {
        mimeType,
        size: buffer.length,
        error: error.response?.data || error.message
      });
      throw error;
    }
  }

  // Obter informações do perfil de negócios
  async getBusinessProfile() {
    try {
      const response = await this.client.get('/whatsapp_business_profile', {
        params: {
          fields: 'about,address,description,email,profile_picture_url,websites,vertical'
        }
      });

      return response.data.data[0];
    } catch (error: any) {
      logger.error('Failed to get business profile', {
        error: error.response?.data || error.message
      });
      throw error;
    }
  }

  // Atualizar perfil de negócios
  async updateBusinessProfile(profile: any) {
    try {
      const response = await this.client.post('/whatsapp_business_profile', {
        messaging_product: 'whatsapp',
        ...profile
      });

      logger.info('Business profile updated');
      return response.data;
    } catch (error: any) {
      logger.error('Failed to update business profile', {
        error: error.response?.data || error.message
      });
      throw error;
    }
  }
}