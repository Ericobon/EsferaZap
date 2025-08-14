class WhatsAppService {
  private baseUrl = 'https://graph.facebook.com/v18.0';

  async sendMessage(apiKey: string, to: string, message: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          text: { body: message },
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  }

  async setupWebhook(botId: string, apiKey: string): Promise<boolean> {
    try {
      const webhookUrl = `${process.env.BASE_URL || 'https://your-domain.com'}/api/webhook/whatsapp/${botId}`;
      
      const response = await fetch(`${this.baseUrl}/webhook`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhook_url: webhookUrl,
          verify_token: process.env.WEBHOOK_VERIFY_TOKEN || 'default_verify_token',
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error setting up webhook:', error);
      return false;
    }
  }

  async getProfile(apiKey: string, phoneNumber: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${phoneNumber}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error getting WhatsApp profile:', error);
      return null;
    }
  }
}

export const whatsappService = new WhatsAppService();
