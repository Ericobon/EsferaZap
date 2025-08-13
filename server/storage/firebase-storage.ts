import { 
  User, 
  InsertUser, 
  Bot, 
  InsertBot, 
  WhatsappSession, 
  InsertWhatsappSession,
  Message,
  InsertMessage 
} from "@shared/schema";
import { adminDb } from "../services/firebase";
import { randomUUID } from "crypto";
import { IStorage } from "../storage";

export class FirebaseStorage implements IStorage {
  private db = adminDb;

  constructor() {
    if (!this.db) {
      throw new Error("Firebase Admin not initialized. Please configure Firebase credentials.");
    }
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    try {
      const doc = await this.db.collection('users').doc(id).get();
      if (!doc.exists) return undefined;
      return { id: doc.id, ...doc.data() } as User;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    try {
      const snapshot = await this.db.collection('users').where('uid', '==', uid).limit(1).get();
      if (snapshot.empty) return undefined;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as User;
    } catch (error) {
      console.error('Error getting user by uid:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const id = randomUUID();
      const user: User = {
        ...insertUser,
        id,
        company: insertUser.company ?? null,
        createdAt: new Date(),
      };
      
      await this.db.collection('users').doc(id).set(user);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(uid: string, updates: Partial<User>): Promise<User | undefined> {
    try {
      const existingUser = await this.getUserByUid(uid);
      if (!existingUser) return undefined;

      const updatedUser = { ...existingUser, ...updates };
      await this.db.collection('users').doc(existingUser.id).update(updates);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }

  // Bots
  async getBot(id: string): Promise<Bot | undefined> {
    try {
      const doc = await this.db.collection('bots').doc(id).get();
      if (!doc.exists) return undefined;
      return { id: doc.id, ...doc.data() } as Bot;
    } catch (error) {
      console.error('Error getting bot:', error);
      return undefined;
    }
  }

  async getBotsByUserId(userId: string): Promise<Bot[]> {
    try {
      const snapshot = await this.db.collection('bots').where('userId', '==', userId).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bot));
    } catch (error) {
      console.error('Error getting bots by user:', error);
      return [];
    }
  }

  async createBot(insertBot: InsertBot): Promise<Bot> {
    try {
      const id = randomUUID();
      const bot: Bot = {
        ...insertBot,
        id,
        description: insertBot.description ?? null,
        aiProvider: insertBot.aiProvider ?? "openai",
        status: "disconnected",
        lastActive: null,
        createdAt: new Date(),
      };
      
      await this.db.collection('bots').doc(id).set(bot);
      return bot;
    } catch (error) {
      console.error('Error creating bot:', error);
      throw error;
    }
  }

  async updateBot(id: string, updates: Partial<Bot>): Promise<Bot | undefined> {
    try {
      const existingBot = await this.getBot(id);
      if (!existingBot) return undefined;

      const updatedBot = { ...existingBot, ...updates };
      await this.db.collection('bots').doc(id).update(updates);
      return updatedBot;
    } catch (error) {
      console.error('Error updating bot:', error);
      return undefined;
    }
  }

  async deleteBot(id: string): Promise<boolean> {
    try {
      await this.db.collection('bots').doc(id).delete();
      // Also delete related WhatsApp sessions and messages
      await this.deleteWhatsappSession(id);
      await this.deleteMessagesByBot(id);
      return true;
    } catch (error) {
      console.error('Error deleting bot:', error);
      return false;
    }
  }

  // WhatsApp Sessions
  async getWhatsappSession(botId: string): Promise<WhatsappSession | undefined> {
    try {
      const snapshot = await this.db.collection('whatsapp_sessions').where('botId', '==', botId).limit(1).get();
      if (snapshot.empty) return undefined;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as WhatsappSession;
    } catch (error) {
      console.error('Error getting WhatsApp session:', error);
      return undefined;
    }
  }

  async getWhatsappSessionBySessionId(sessionId: string): Promise<WhatsappSession | undefined> {
    try {
      const snapshot = await this.db.collection('whatsapp_sessions').where('sessionId', '==', sessionId).limit(1).get();
      if (snapshot.empty) return undefined;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as WhatsappSession;
    } catch (error) {
      console.error('Error getting WhatsApp session by sessionId:', error);
      return undefined;
    }
  }

  async createWhatsappSession(insertSession: InsertWhatsappSession): Promise<WhatsappSession> {
    try {
      const id = randomUUID();
      const session: WhatsappSession = {
        ...insertSession,
        id,
        qrCode: insertSession.qrCode ?? null,
        status: "disconnected",
        lastSeen: null,
        createdAt: new Date(),
      };
      
      await this.db.collection('whatsapp_sessions').doc(id).set(session);
      return session;
    } catch (error) {
      console.error('Error creating WhatsApp session:', error);
      throw error;
    }
  }

  async updateWhatsappSession(botId: string, updates: Partial<WhatsappSession>): Promise<WhatsappSession | undefined> {
    try {
      const existingSession = await this.getWhatsappSession(botId);
      if (!existingSession) return undefined;

      const updatedSession = { ...existingSession, ...updates };
      await this.db.collection('whatsapp_sessions').doc(existingSession.id).update(updates);
      return updatedSession;
    } catch (error) {
      console.error('Error updating WhatsApp session:', error);
      return undefined;
    }
  }

  async deleteWhatsappSession(botId: string): Promise<boolean> {
    try {
      const session = await this.getWhatsappSession(botId);
      if (!session) return true;
      
      await this.db.collection('whatsapp_sessions').doc(session.id).delete();
      return true;
    } catch (error) {
      console.error('Error deleting WhatsApp session:', error);
      return false;
    }
  }

  // Messages
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    try {
      const id = randomUUID();
      const message: Message = {
        ...insertMessage,
        id,
        timestamp: new Date(),
      };
      
      await this.db.collection('messages').doc(id).set(message);
      return message;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  async getMessagesByBot(botId: string, limit: number = 100): Promise<Message[]> {
    try {
      const snapshot = await this.db.collection('messages')
        .where('botId', '==', botId)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
    } catch (error) {
      console.error('Error getting messages by bot:', error);
      return [];
    }
  }

  async getMessagesBySession(sessionId: string, limit: number = 100): Promise<Message[]> {
    try {
      const snapshot = await this.db.collection('messages')
        .where('sessionId', '==', sessionId)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
    } catch (error) {
      console.error('Error getting messages by session:', error);
      return [];
    }
  }

  // Helper method to delete messages by bot
  private async deleteMessagesByBot(botId: string): Promise<void> {
    try {
      const snapshot = await this.db.collection('messages').where('botId', '==', botId).get();
      const batch = this.db.batch();
      
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error deleting messages by bot:', error);
    }
  }

  // Multi-tenant helper methods
  async getUserStats(userId: string): Promise<{ totalBots: number; activeBots: number; totalMessages: number }> {
    try {
      const bots = await this.getBotsByUserId(userId);
      const activeBots = bots.filter(bot => bot.status === 'connected').length;
      
      let totalMessages = 0;
      for (const bot of bots) {
        const messages = await this.getMessagesByBot(bot.id);
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

  // Conversation export for GCS backup
  async exportConversations(botId: string): Promise<any[]> {
    try {
      const messages = await this.getMessagesByBot(botId, 10000); // Get all messages
      return messages.map(msg => ({
        id: msg.id,
        botId: msg.botId,
        sessionId: msg.sessionId,
        fromUser: msg.fromUser,
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }));
    } catch (error) {
      console.error('Error exporting conversations:', error);
      return [];
    }
  }
}