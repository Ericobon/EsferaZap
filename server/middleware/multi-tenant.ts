import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage/index';
import { User } from '@shared/schema';

// Extend Express Request to include user and tenant info
declare global {
  namespace Express {
    interface Request {
      user?: User;
      tenant?: {
        userId: string;
        canAccessBot: (botId: string) => Promise<boolean>;
        canAccessSession: (sessionId: string) => Promise<boolean>;
        getUserBots: () => Promise<any[]>;
        getUserStats: () => Promise<any>;
      };
    }
  }
}

/**
 * Multi-tenant middleware that ensures data isolation between users
 * This middleware should be used after authentication middleware
 */
export const multiTenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'User must be authenticated to access tenant resources'
      });
    }

    const userId = req.user.id;

    // Create tenant context with helper methods
    req.tenant = {
      userId,
      
      // Check if user can access a specific bot
      canAccessBot: async (botId: string): Promise<boolean> => {
        try {
          const bot = await storage.getBot(botId);
          return bot ? bot.userId === userId : false;
        } catch (error) {
          console.error('Error checking bot access:', error);
          return false;
        }
      },

      // Check if user can access a WhatsApp session
      canAccessSession: async (sessionId: string): Promise<boolean> => {
        try {
          const session = await storage.getWhatsappSessionBySessionId(sessionId);
          if (!session) return false;
          
          const bot = await storage.getBot(session.botId);
          return bot ? bot.userId === userId : false;
        } catch (error) {
          console.error('Error checking session access:', error);
          return false;
        }
      },

      // Get all bots for the current user
      getUserBots: async () => {
        try {
          return await storage.getBotsByUserId(userId);
        } catch (error) {
          console.error('Error getting user bots:', error);
          return [];
        }
      },

      // Get user statistics
      getUserStats: async () => {
        try {
          if ('getUserStats' in storage && typeof storage.getUserStats === 'function') {
            return await (storage as any).getUserStats(userId);
          }
          
          // Fallback for MemStorage
          const bots = await storage.getBotsByUserId(userId);
          const activeBots = bots.filter(bot => bot.status === 'connected').length;
          
          let totalMessages = 0;
          for (const bot of bots) {
            const messages = await storage.getMessagesByBot(bot.id);
            totalMessages += messages.length;
          }
          
          return {
            totalBots: bots.length,
            activeBots,
            totalMessages
          };
        } catch (error) {
          console.error('Error getting user stats:', error);
          return { totalBots: 0, activeBots: 0, totalMessages: 0 };
        }
      }
    };

    next();
  } catch (error) {
    console.error('Multi-tenant middleware error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to initialize tenant context'
    });
  }
};

/**
 * Middleware to validate bot ownership
 * Use this for routes that operate on specific bots
 */
export const validateBotOwnership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const botId = req.params.botId || req.body.botId;
    
    if (!botId) {
      return res.status(400).json({ 
        error: 'Bot ID required',
        message: 'Bot ID must be provided in request parameters or body'
      });
    }

    if (!req.tenant) {
      return res.status(500).json({ 
        error: 'Tenant context not initialized',
        message: 'Multi-tenant middleware must be applied first'
      });
    }

    const canAccess = await req.tenant.canAccessBot(botId);
    
    if (!canAccess) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'You do not have permission to access this bot'
      });
    }

    next();
  } catch (error) {
    console.error('Bot ownership validation error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to validate bot ownership'
    });
  }
};

/**
 * Middleware to validate session ownership
 * Use this for routes that operate on WhatsApp sessions
 */
export const validateSessionOwnership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.params.sessionId || req.body.sessionId;
    
    if (!sessionId) {
      return res.status(400).json({ 
        error: 'Session ID required',
        message: 'Session ID must be provided in request parameters or body'
      });
    }

    if (!req.tenant) {
      return res.status(500).json({ 
        error: 'Tenant context not initialized',
        message: 'Multi-tenant middleware must be applied first'
      });
    }

    const canAccess = await req.tenant.canAccessSession(sessionId);
    
    if (!canAccess) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'You do not have permission to access this session'
      });
    }

    next();
  } catch (error) {
    console.error('Session ownership validation error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to validate session ownership'
    });
  }
};

/**
 * Rate limiting middleware per tenant
 * Prevents abuse by limiting requests per user
 */
const userRequestCounts = new Map<string, { count: number; resetTime: number }>();

export const tenantRateLimit = (maxRequests: number = 100, windowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userId = req.user.id;
    const now = Date.now();
    const userLimit = userRequestCounts.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
      // Reset or initialize counter
      userRequestCounts.set(userId, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    if (userLimit.count >= maxRequests) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: `Too many requests. Limit: ${maxRequests} per ${windowMs / 1000} seconds`,
        retryAfter: Math.ceil((userLimit.resetTime - now) / 1000)
      });
    }

    userLimit.count++;
    next();
  };
};

/**
 * Middleware to log tenant activities for audit purposes
 */
export const auditLogger = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.tenant) {
    const logData = {
      userId: req.user.id,
      userEmail: req.user.email,
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };

    // Log to console (in production, you might want to use a proper logging service)
    console.log('🔍 Tenant Activity:', JSON.stringify(logData));
    
    // You could also store this in Firebase/GCS for compliance
    // await auditLogService.log(logData);
  }
  
  next();
};

/**
 * Helper function to ensure user exists in database
 * Creates user if it doesn't exist (useful for first-time Firebase users)
 */
export const ensureUserExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next();
    }

    // Check if user exists in our database
    const existingUser = await storage.getUserByUid(req.user.uid);
    
    if (!existingUser) {
      // Create user in our database
      const newUser = await storage.createUser({
        uid: req.user.uid,
        name: req.user.name,
        email: req.user.email,
        company: req.user.company || null
      });
      
      req.user = newUser;
      console.log(`✅ Created new user in database: ${newUser.email}`);
    } else {
      req.user = existingUser;
    }

    next();
  } catch (error) {
    console.error('Error ensuring user exists:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to initialize user account'
    });
  }
};