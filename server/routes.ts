import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { WhatsAppService } from "./services/whatsapp.js";
import { webhookManager } from "./services/webhookManager.js";
import { mediaHandler, upload } from "./services/mediaHandler.js";
import { processWithGemini, analyzeSentiment } from "./services/gemini.js";
import { insertBotSchema, insertConversationSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Bot management routes
  app.get('/api/bots', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bots = await storage.getUserBots(userId);
      res.json(bots);
    } catch (error) {
      console.error("Error fetching bots:", error);
      res.status(500).json({ message: "Failed to fetch bots" });
    }
  });

  app.post('/api/bots', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const botData = insertBotSchema.parse({ ...req.body, userId });
      const bot = await storage.createBot(botData);
      
      // Bot created successfully
      res.status(201).json(bot);
    } catch (error) {
      console.error("Error creating bot:", error);
      res.status(500).json({ message: "Failed to create bot" });
    }
  });

  app.put('/api/bots/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = insertBotSchema.partial().parse(req.body);
      const bot = await storage.updateBot(id, updates);
      
      if (!bot) {
        return res.status(404).json({ message: "Bot not found" });
      }
      
      res.json(bot);
    } catch (error) {
      console.error("Error updating bot:", error);
      res.status(500).json({ message: "Failed to update bot" });
    }
  });

  app.delete('/api/bots/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteBot(id);
      
      if (!success) {
        return res.status(404).json({ message: "Bot not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting bot:", error);
      res.status(500).json({ message: "Failed to delete bot" });
    }
  });

  // Conversation routes
  app.get('/api/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const { botId } = req.query;
      if (!botId) {
        return res.status(400).json({ message: "Bot ID is required" });
      }
      
      const conversations = await storage.getBotConversations(botId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.get('/api/conversations/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getConversationMessages(id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get('/api/analytics/bot/:botId', isAuthenticated, async (req: any, res) => {
    try {
      const { botId } = req.params;
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate as string) : new Date();
      
      const analytics = await storage.getBotAnalytics(botId, start, end);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching bot analytics:", error);
      res.status(500).json({ message: "Failed to fetch bot analytics" });
    }
  });

  // WhatsApp webhook handler
  app.post('/api/webhook/whatsapp/:botId', async (req, res) => {
    try {
      const { botId } = req.params;
      const webhookData = req.body;
      
      // Get bot configuration
      const bot = await storage.getBot(botId);
      if (!bot) {
        return res.status(404).json({ message: "Bot not found" });
      }

      // Process incoming message
      if (webhookData.messages && webhookData.messages.length > 0) {
        const incomingMessage = webhookData.messages[0];
        const customerPhone = incomingMessage.from;
        
        // Find or create conversation
        let conversation = await storage.getActiveConversationByPhone(botId, customerPhone);
        if (!conversation) {
          conversation = await storage.createConversation({
            botId,
            customerPhone,
            customerName: incomingMessage.profile?.name || 'Unknown',
          });
        }

        // Save incoming message
        const messageContent = incomingMessage.text?.body || incomingMessage.caption || '[Media]';
        await storage.createMessage({
          conversationId: conversation.id,
          content: messageContent,
          type: incomingMessage.type || 'text',
          isFromBot: false,
          status: 'delivered',
        });

        // Generate AI response if bot is active and conversation is not assigned to agent
        if (bot.status === 'active' && !conversation.assignedToAgent) {
          const response = await generateWhatsAppResponse(
            messageContent,
            [], // conversation history - can be expanded later
            bot.prompt || 'Você é um assistente útil de atendimento ao cliente.',
            parseFloat(bot.temperature || '0.7')
          );

          if (response) {
            // Save bot response
            const botMessage = await storage.createMessage({
              conversationId: conversation.id,
              content: response,
              type: 'text',
              isFromBot: true,
              status: 'pending',
            });

            // Send response via WhatsApp
            await whatsappService.sendMessage(
              bot.apiKey || '',
              customerPhone,
              response
            );

            // Update message status
            await storage.updateMessageStatus(botMessage.id, 'sent');

            // Broadcast to connected clients via WebSocket
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'new_message',
                  conversationId: conversation.id,
                  message: botMessage,
                }));
              }
            });
          }
        }

        // Update conversation timestamp
        await storage.updateConversation(conversation.id, {
          lastMessageAt: new Date(),
        });
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ message: "Failed to process webhook" });
    }
  });

  // Webhook verification for WhatsApp
  app.get('/api/webhook/whatsapp/:botId', (req, res) => {
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    if (token === process.env.WEBHOOK_VERIFY_TOKEN) {
      res.send(challenge);
    } else {
      res.status(403).send('Invalid verify token');
    }
  });

  // Conversation routes
  app.get('/api/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userBots = await storage.getUserBots(userId);
      
      if (userBots.length === 0) {
        return res.json([]);
      }

      // Get conversations for the first bot (can be enhanced later)
      const conversations = await storage.getBotConversations(userBots[0].id);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Get conversation messages
  app.get('/api/conversations/:conversationId/messages', isAuthenticated, async (req, res) => {
    try {
      const { conversationId } = req.params;
      const messages = await storage.getConversationMessages(conversationId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Send message
  app.post('/api/messages', isAuthenticated, async (req, res) => {
    try {
      const messageData = req.body;
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  return httpServer;
}
