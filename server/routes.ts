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

  // Registration endpoint for custom form
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { fullName, email, phone, company, sector, password } = req.body;
      
      // Basic validation
      if (!fullName || !email || !phone || !company || !sector || !password) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "Email já cadastrado" });
      }

      // Create user with extended info
      const userData = {
        email,
        fullName,
        phone,
        company,
        sector,
        registrationMethod: 'form',
        isProfileComplete: true,
        firstName: fullName.split(' ')[0],
        lastName: fullName.split(' ').slice(1).join(' '),
      };

      const user = await storage.createUserWithExtendedInfo(userData);
      
      res.status(201).json({ 
        message: "Usuário cadastrado com sucesso",
        user: { id: user.id, email: user.email, fullName: user.fullName }
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
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

  // Contacts routes
  app.get('/api/contacts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userBots = await storage.getUserBots(userId);
      
      if (userBots.length === 0) {
        return res.json([]);
      }

      // Get contacts for the first bot (can be enhanced later)
      const contacts = await storage.getBotContacts(userBots[0].id);
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  // Get detailed analytics
  app.get('/api/analytics/detailed', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userBots = await storage.getUserBots(userId);
      
      if (userBots.length === 0) {
        return res.json({
          metrics: [],
          charts: []
        });
      }

      // Get detailed analytics for the first bot
      const analytics = await storage.getDetailedAnalytics(userBots[0].id);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching detailed analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Google Calendar Integration Routes
  app.get('/api/calendar/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      res.json({
        connected: !!user?.calendarIntegrationEnabled,
        hasTokens: !!(user?.googleCalendarAccessToken && user?.googleCalendarRefreshToken)
      });
    } catch (error) {
      console.error("Error checking calendar status:", error);
      res.status(500).json({ message: "Failed to check calendar status" });
    }
  });

  app.post('/api/calendar/connect', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Import the service (dynamic import to avoid server startup issues)
      const { googleCalendarService } = await import('./services/googleCalendar.js');
      const authUrl = googleCalendarService.getAuthUrl(userId);
      
      res.json({ authUrl });
    } catch (error) {
      console.error("Error connecting calendar:", error);
      res.status(500).json({ message: "Failed to generate calendar auth URL" });
    }
  });

  app.get('/api/calendar/callback', async (req, res) => {
    try {
      const { code, state: userId } = req.query;
      
      if (!code || !userId) {
        return res.status(400).json({ message: "Missing authorization code or user ID" });
      }

      const { googleCalendarService } = await import('./services/googleCalendar.js');
      const tokens = await googleCalendarService.getAccessToken(code as string);
      
      // Save tokens to user record
      await storage.updateUserCalendarTokens(userId as string, {
        googleCalendarAccessToken: tokens.access_token,
        googleCalendarRefreshToken: tokens.refresh_token,
        calendarIntegrationEnabled: true
      });

      // Redirect back to calendar integration page
      res.redirect('/calendar-integration?connected=true');
    } catch (error) {
      console.error("Error in calendar callback:", error);
      res.redirect('/calendar-integration?error=auth_failed');
    }
  });

  app.post('/api/calendar/disconnect', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      await storage.updateUserCalendarTokens(userId, {
        googleCalendarAccessToken: null,
        googleCalendarRefreshToken: null,
        calendarIntegrationEnabled: false
      });

      res.json({ message: "Calendar disconnected successfully" });
    } catch (error) {
      console.error("Error disconnecting calendar:", error);
      res.status(500).json({ message: "Failed to disconnect calendar" });
    }
  });

  app.get('/api/calendar/events', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.calendarIntegrationEnabled || !user?.googleCalendarAccessToken) {
        return res.status(400).json({ message: "Calendar not connected" });
      }

      const { googleCalendarService } = await import('./services/googleCalendar.js');
      googleCalendarService.setCredentials({
        access_token: user.googleCalendarAccessToken,
        refresh_token: user.googleCalendarRefreshToken
      });

      const events = await googleCalendarService.getUpcomingEvents(10);
      res.json(events);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      res.status(500).json({ message: "Failed to fetch calendar events" });
    }
  });

  app.get('/api/calendar/business-hours', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.calendarIntegrationEnabled || !user?.googleCalendarAccessToken) {
        return res.status(400).json({ message: "Calendar not connected" });
      }

      const { googleCalendarService } = await import('./services/googleCalendar.js');
      googleCalendarService.setCredentials({
        access_token: user.googleCalendarAccessToken,
        refresh_token: user.googleCalendarRefreshToken
      });

      const businessHours = await googleCalendarService.getBusinessHours();
      res.json(businessHours);
    } catch (error) {
      console.error("Error fetching business hours:", error);
      res.status(500).json({ message: "Failed to fetch business hours" });
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
