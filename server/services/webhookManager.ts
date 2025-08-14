import { WhatsAppService, type WhatsAppWebhook } from './whatsapp.js';
import { processWithGemini } from './gemini.js';
import { storage } from '../storage.js';
import crypto from 'crypto';

export class WebhookManager {
  private whatsappServices: Map<string, WhatsAppService> = new Map();

  async handleWhatsAppWebhook(body: WhatsAppWebhook, phoneNumberId: string): Promise<void> {
    try {
      // Get bot configuration for this phone number
      const bot = await storage.getBotByPhoneNumberId(phoneNumberId);
      if (!bot) {
        console.log(`No bot found for phone number ID: ${phoneNumberId}`);
        return;
      }

      // Get or create WhatsApp service instance
      let whatsappService = this.whatsappServices.get(phoneNumberId);
      if (!whatsappService) {
        whatsappService = new WhatsAppService(bot.accessToken, phoneNumberId);
        this.whatsappServices.set(phoneNumberId, whatsappService);
      }

      // Process webhook data
      const { messages, statuses } = whatsappService.processWebhook(body);

      // Handle incoming messages
      for (const message of messages) {
        await this.handleIncomingMessage(message, bot, whatsappService);
      }

      // Handle message statuses
      for (const status of statuses) {
        await this.handleMessageStatus(status, bot);
      }
    } catch (error) {
      console.error('Webhook handling error:', error);
      throw error;
    }
  }

  private async handleIncomingMessage(
    message: any,
    bot: any,
    whatsappService: WhatsAppService
  ): Promise<void> {
    try {
      // Save incoming message to database
      await storage.createMessage({
        botId: bot.id,
        whatsappMessageId: message.id,
        fromNumber: message.from,
        toNumber: bot.phoneNumber,
        content: message.text?.body || '',
        messageType: message.type,
        direction: 'inbound',
        timestamp: new Date(parseInt(message.timestamp) * 1000),
        status: 'received',
      });

      // Mark message as read
      await whatsappService.markAsRead(message.id);

      // Only process text messages for AI responses
      if (message.type === 'text' && message.text?.body) {
        await this.generateAndSendAIResponse(message, bot, whatsappService);
      }
    } catch (error) {
      console.error('Error handling incoming message:', error);
    }
  }

  private async generateAndSendAIResponse(
    incomingMessage: any,
    bot: any,
    whatsappService: WhatsAppService
  ): Promise<void> {
    try {
      // Generate AI response using Gemini
      const aiResponse = await processWithGemini(
        incomingMessage.text.body,
        bot.prompt || 'You are a helpful WhatsApp assistant.'
      );

      if (!aiResponse) {
        console.log('No AI response generated');
        return;
      }

      // Send response via WhatsApp
      const sentMessage = await whatsappService.sendMessage({
        to: incomingMessage.from,
        type: 'text',
        text: {
          body: aiResponse,
        },
      });

      // Save outbound message to database
      await storage.createMessage({
        botId: bot.id,
        whatsappMessageId: sentMessage.messages[0].id,
        fromNumber: bot.phoneNumber,
        toNumber: incomingMessage.from,
        content: aiResponse,
        messageType: 'text',
        direction: 'outbound',
        timestamp: new Date(),
        status: 'sent',
      });

      console.log(`AI response sent to ${incomingMessage.from}`);
    } catch (error) {
      console.error('Error generating/sending AI response:', error);
    }
  }

  private async handleMessageStatus(status: any, bot: any): Promise<void> {
    try {
      // Update message status in database  
      await storage.updateMessageStatus(status.id, status.status);
      
      console.log(`Message ${status.id} status updated to: ${status.status}`);
    } catch (error) {
      console.error('Error handling message status:', error);
    }
  }

  validateWebhookSignature(payload: string, signature: string, secret: string): boolean {
    // Implementation for webhook signature validation
    // This would typically use HMAC-SHA256
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return signature === `sha256=${expectedSignature}`;
  }
}

export const webhookManager = new WebhookManager();