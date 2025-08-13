import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage/index";
import { authenticateToken, AuthenticatedRequest } from "./middleware/auth";
import { 
  multiTenantMiddleware, 
  validateBotOwnership, 
  validateSessionOwnership,
  tenantRateLimit,
  auditLogger,
  ensureUserExists
} from "./middleware/multi-tenant";
import { whatsappService } from "./services/whatsapp";
import { insertBotSchema } from "@shared/schema";
import { Request, Response } from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Protected routes - require authentication and multi-tenancy
  app.use("/api/bots", authenticateToken, ensureUserExists, multiTenantMiddleware, tenantRateLimit(100, 60000), auditLogger);
  app.use("/api/whatsapp", authenticateToken, ensureUserExists, multiTenantMiddleware, tenantRateLimit(200, 60000), auditLogger);
  app.use("/api/stats", authenticateToken, ensureUserExists, multiTenantMiddleware, tenantRateLimit(50, 60000), auditLogger);
  app.use("/api/user", authenticateToken, ensureUserExists, multiTenantMiddleware, tenantRateLimit(30, 60000), auditLogger);

  // Bots routes
  app.get("/api/bots", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const bots = await req.tenant!.getUserBots();
      res.json(bots);
    } catch (error) {
      console.error("Error fetching bots:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/bots", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const validation = insertBotSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Dados inválidos", 
          errors: validation.error.issues 
        });
      }

      const botData = {
        ...validation.data,
        userId: req.user!.id, // Use the database user ID
      };

      const bot = await storage.createBot(botData);
      res.status(201).json(bot);
    } catch (error) {
      console.error("Error creating bot:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/bots/:id", validateBotOwnership, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const bot = await storage.getBot(req.params.id);
      if (!bot) {
        return res.status(404).json({ message: "Bot não encontrado" });
      }

      res.json(bot);
    } catch (error) {
      console.error("Error fetching bot:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.put("/api/bots/:id", validateBotOwnership, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const updatedBot = await storage.updateBot(req.params.id, req.body);
      if (!updatedBot) {
        return res.status(404).json({ message: "Bot não encontrado" });
      }
      
      res.json(updatedBot);
    } catch (error) {
      console.error("Error updating bot:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.delete("/api/bots/:id", validateBotOwnership, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const success = await storage.deleteBot(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Bot não encontrado" });
      }

      res.json({ message: "Bot deletado com sucesso" });
    } catch (error) {
      console.error("Error deleting bot:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // User and Stats routes
  app.get("/api/user/profile", async (req: AuthenticatedRequest, res: Response) => {
    try {
      res.json({
        id: req.user!.id,
        uid: req.user!.uid,
        name: req.user!.name,
        email: req.user!.email,
        company: req.user!.company,
        createdAt: req.user!.createdAt
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/stats/dashboard", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const stats = await req.tenant!.getUserStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Bot-specific routes with ownership validation
  app.get("/api/bots/:id/messages", validateBotOwnership, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const messages = await storage.getMessagesByBot(req.params.id, limit);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching bot messages:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Export conversations for backup
  app.get("/api/bots/:id/export", validateBotOwnership, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if ('exportConversations' in storage && typeof storage.exportConversations === 'function') {
        const conversations = await (storage as any).exportConversations(req.params.id);
        res.json({
          botId: req.params.id,
          exportDate: new Date().toISOString(),
          totalMessages: conversations.length,
          conversations
        });
      } else {
        // Fallback for MemStorage
        const messages = await storage.getMessagesByBot(req.params.id, 10000);
        res.json({
          botId: req.params.id,
          exportDate: new Date().toISOString(),
          totalMessages: messages.length,
          conversations: messages
        });
      }
    } catch (error) {
      console.error("Error exporting conversations:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Delete bot route
  app.delete("/api/bots/:id", multiTenantMiddleware, validateBotOwnership, async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Disconnect WhatsApp session if active
      whatsappService.disconnectSession(req.params.id);
      
      // Delete WhatsApp session data
      await storage.deleteWhatsappSession(req.params.id);
      
      // Delete the bot
      const deleted = await storage.deleteBot(req.params.id);
      
      if (deleted) {
        res.json({ message: "Bot excluído com sucesso" });
      } else {
        res.status(500).json({ message: "Erro ao excluir bot" });
      }
    } catch (error) {
      console.error("Error deleting bot:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // WhatsApp routes
  app.get("/api/whatsapp/qr/:botId", async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.uid) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Verify bot ownership
      const bot = await storage.getBot(req.params.botId);
      if (!bot || bot.userId !== req.user.uid) {
        return res.status(403).json({ message: "Acesso negado" });
      }

      const session = await whatsappService.getSession(req.params.botId);
      
      if (!session) {
        return res.status(404).json({ 
          message: "Sessão não encontrada",
          status: "disconnected" 
        });
      }

      res.json({
        qrCode: session.qrCode,
        status: session.status,
        sessionId: session.sessionId,
      });
    } catch (error) {
      console.error("Error fetching QR code:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/whatsapp/generate-qr/:botId", async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.uid) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Verify bot ownership
      const bot = await storage.getBot(req.params.botId);
      if (!bot || bot.userId !== req.user.uid) {
        return res.status(403).json({ message: "Acesso negado" });
      }

      const session = await whatsappService.generateQRCode(req.params.botId);
      
      res.json({
        qrCode: session.qrCode,
        status: session.status,
        sessionId: session.sessionId,
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      res.status(500).json({ message: "Erro ao gerar QR Code" });
    }
  });

  app.post("/api/whatsapp/disconnect/:botId", async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.uid) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Verify bot ownership
      const bot = await storage.getBot(req.params.botId);
      if (!bot || bot.userId !== req.user.uid) {
        return res.status(403).json({ message: "Acesso negado" });
      }

      const disconnected = whatsappService.disconnectSession(req.params.botId);
      
      if (disconnected) {
        await storage.updateBot(req.params.botId, { status: "disconnected" });
        res.json({ message: "WhatsApp desconectado com sucesso" });
      } else {
        res.status(404).json({ message: "Sessão não encontrada" });
      }
    } catch (error) {
      console.error("Error disconnecting WhatsApp:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Stats route
  app.get("/api/stats", async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.uid) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const bots = await storage.getBotsByUserId(req.user.uid);
      const connectedBots = bots.filter(bot => bot.status === "connected");
      
      // Calculate today's messages (simplified for MVP)
      let todayMessages = 0;
      for (const bot of bots) {
        const messages = await storage.getMessagesByBot(bot.id, 1000);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        todayMessages += messages.filter(msg => 
          msg.timestamp >= today
        ).length;
      }

      const stats = {
        totalBots: bots.length,
        connectedBots: connectedBots.length,
        todayMessages,
        responseRate: bots.length > 0 ? "94%" : "0%", // Simplified for MVP
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // WhatsApp service event handlers
  whatsappService.on("connected", async ({ botId, sessionId }) => {
    try {
      await storage.updateBot(botId, { 
        status: "connected", 
        lastActive: new Date() 
      });
      
      // Create or update WhatsApp session record
      const existingSession = await storage.getWhatsappSession(botId);
      if (existingSession) {
        await storage.updateWhatsappSession(botId, {
          status: "connected",
          lastSeen: new Date(),
        });
      } else {
        await storage.createWhatsappSession({
          botId,
          sessionId,
          status: "connected",
          qrCode: null,
        });
      }
    } catch (error) {
      console.error("Error updating bot status on connection:", error);
    }
  });

  whatsappService.on("qr-updated", async ({ botId, qrCode, status }) => {
    try {
      await storage.updateBot(botId, { status: "connecting" });
      
      const existingSession = await storage.getWhatsappSession(botId);
      if (existingSession) {
        await storage.updateWhatsappSession(botId, {
          qrCode,
          status,
        });
      }
    } catch (error) {
      console.error("Error updating QR code:", error);
    }
  });

  whatsappService.on("session-ended", async ({ botId }) => {
    try {
      await storage.updateBot(botId, { status: "disconnected" });
      await storage.deleteWhatsappSession(botId);
    } catch (error) {
      console.error("Error handling session end:", error);
    }
  });

  whatsappService.on("message", async ({ botId, messages }) => {
    try {
      const session = await whatsappService.getSession(botId);
      if (!session) return;

      for (const msg of messages) {
        if (!msg.key.fromMe && msg.message) { // Only process received messages
          await storage.createMessage({
            botId,
            sessionId: session.sessionId,
            fromUser: true,
            content: msg.message.conversation || 
                    msg.message.extendedTextMessage?.text || 
                    "[Media message]",
          });
        }
      }
    } catch (error) {
      console.error("Error storing messages:", error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
