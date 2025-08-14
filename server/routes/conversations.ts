import type { Express } from "express";
import { isAuthenticated } from "../replitAuth.js";
import { storage } from "../storage.js";

export function registerConversationRoutes(app: Express) {
  // Get user conversations
  app.get('/api/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userBots = await storage.getUserBots(userId);
      const botIds = userBots.map(bot => bot.id);
      
      if (botIds.length === 0) {
        return res.json([]);
      }

      // Get conversations for user's bots
      const conversations = await storage.getBotConversations(botIds[0]); // For now, get first bot's conversations
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
}