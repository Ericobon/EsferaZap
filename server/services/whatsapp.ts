import axios from 'axios';

export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'image' | 'document' | 'template';
  text?: {
    body: string;
  };
  image?: {
    link: string;
    caption?: string;
  };
  document?: {
    link: string;
    filename?: string;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components?: any[];
  };
}

export interface WhatsAppWebhook {
  object: string;
  entry: {
    id: string;
    changes: {
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: {
          profile: {
            name: string;
          };
          wa_id: string;
        }[];
        messages?: {
          from: string;
          id: string;
          timestamp: string;
          text?: {
            body: string;
          };
          type: string;
        }[];
        statuses?: {
          id: string;
          status: string;
          timestamp: string;
          recipient_id: string;
        }[];
      };
      field: string;
    }[];
  }[];
}

export class WhatsAppService {
  private baseUrl: string;
  private accessToken: string;
  private phoneNumberId: string;

  constructor(accessToken: string, phoneNumberId: string) {
    this.baseUrl = 'https://graph.facebook.com/v18.0';
    this.accessToken = accessToken;
    this.phoneNumberId = phoneNumberId;
  }

  async sendMessage(message: WhatsAppMessage): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        message,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('WhatsApp send message error:', error.response?.data || error.message);
      throw new Error(`Failed to send WhatsApp message: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async markAsRead(messageId: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('WhatsApp mark as read error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getMediaUrl(mediaId: string): Promise<string> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${mediaId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );
      return response.data.url;
    } catch (error: any) {
      console.error('WhatsApp get media URL error:', error.response?.data || error.message);
      throw error;
    }
  }

  async downloadMedia(mediaUrl: string): Promise<Buffer> {
    try {
      const response = await axios.get(mediaUrl, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data);
    } catch (error: any) {
      console.error('WhatsApp download media error:', error.response?.data || error.message);
      throw error;
    }
  }

  validateWebhook(mode: string, token: string, challenge: string, verifyToken: string): string | null {
    if (mode === 'subscribe' && token === verifyToken) {
      return challenge;
    }
    return null;
  }

  processWebhook(webhook: WhatsAppWebhook): {
    messages: any[];
    statuses: any[];
  } {
    const messages: any[] = [];
    const statuses: any[] = [];

    webhook.entry.forEach((entry) => {
      entry.changes.forEach((change) => {
        if (change.value.messages) {
          change.value.messages.forEach((message) => {
            messages.push({
              ...message,
              phoneNumberId: change.value.metadata.phone_number_id,
              displayPhoneNumber: change.value.metadata.display_phone_number,
            });
          });
        }

        if (change.value.statuses) {
          change.value.statuses.forEach((status) => {
            statuses.push({
              ...status,
              phoneNumberId: change.value.metadata.phone_number_id,
            });
          });
        }
      });
    });

    return { messages, statuses };
  }
}