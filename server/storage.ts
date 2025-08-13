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
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUid(uid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(uid: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Bots
  getBot(id: string): Promise<Bot | undefined>;
  getBotsByUserId(userId: string): Promise<Bot[]>;
  createBot(bot: InsertBot): Promise<Bot>;
  updateBot(id: string, updates: Partial<Bot>): Promise<Bot | undefined>;
  deleteBot(id: string): Promise<boolean>;
  
  // WhatsApp Sessions
  getWhatsappSession(botId: string): Promise<WhatsappSession | undefined>;
  getWhatsappSessionBySessionId(sessionId: string): Promise<WhatsappSession | undefined>;
  createWhatsappSession(session: InsertWhatsappSession): Promise<WhatsappSession>;
  updateWhatsappSession(botId: string, updates: Partial<WhatsappSession>): Promise<WhatsappSession | undefined>;
  deleteWhatsappSession(botId: string): Promise<boolean>;
  
  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByBot(botId: string, limit?: number): Promise<Message[]>;
  getMessagesBySession(sessionId: string, limit?: number): Promise<Message[]>;
}

class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private bots: Map<string, Bot> = new Map();
  private whatsappSessions: Map<string, WhatsappSession> = new Map();
  private messages: Map<string, Message> = new Map();

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.uid === uid);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      company: insertUser.company ?? null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(uid: string, updates: Partial<User>): Promise<User | undefined> {
    const existingUser = await this.getUserByUid(uid);
    if (!existingUser) return undefined;

    const updatedUser = { ...existingUser, ...updates };
    this.users.set(existingUser.id, updatedUser);
    return updatedUser;
  }

  // Bots
  async getBot(id: string): Promise<Bot | undefined> {
    return this.bots.get(id);
  }

  async getBotsByUserId(userId: string): Promise<Bot[]> {
    return Array.from(this.bots.values()).filter(bot => bot.userId === userId);
  }

  async createBot(insertBot: InsertBot): Promise<Bot> {
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
    this.bots.set(id, bot);
    return bot;
  }

  async updateBot(id: string, updates: Partial<Bot>): Promise<Bot | undefined> {
    const existingBot = this.bots.get(id);
    if (!existingBot) return undefined;

    const updatedBot = { ...existingBot, ...updates };
    this.bots.set(id, updatedBot);
    return updatedBot;
  }

  async deleteBot(id: string): Promise<boolean> {
    return this.bots.delete(id);
  }

  // WhatsApp Sessions
  async getWhatsappSession(botId: string): Promise<WhatsappSession | undefined> {
    return Array.from(this.whatsappSessions.values()).find(session => session.botId === botId);
  }

  async getWhatsappSessionBySessionId(sessionId: string): Promise<WhatsappSession | undefined> {
    return Array.from(this.whatsappSessions.values()).find(session => session.sessionId === sessionId);
  }

  async createWhatsappSession(insertSession: InsertWhatsappSession): Promise<WhatsappSession> {
    const id = randomUUID();
    const session: WhatsappSession = {
      ...insertSession,
      id,
      status: insertSession.status ?? "disconnected",
      qrCode: insertSession.qrCode ?? null,
      lastSeen: null,
      createdAt: new Date(),
    };
    this.whatsappSessions.set(id, session);
    return session;
  }

  async updateWhatsappSession(botId: string, updates: Partial<WhatsappSession>): Promise<WhatsappSession | undefined> {
    const existingSession = await this.getWhatsappSession(botId);
    if (!existingSession) return undefined;

    const updatedSession = { ...existingSession, ...updates };
    this.whatsappSessions.set(existingSession.id, updatedSession);
    return updatedSession;
  }

  async deleteWhatsappSession(botId: string): Promise<boolean> {
    const session = await this.getWhatsappSession(botId);
    if (!session) return false;
    
    return this.whatsappSessions.delete(session.id);
  }

  // Messages
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      timestamp: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessagesByBot(botId: string, limit: number = 100): Promise<Message[]> {
    const messages = Array.from(this.messages.values())
      .filter(message => message.botId === botId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
    
    return messages;
  }

  async getMessagesBySession(sessionId: string, limit: number = 100): Promise<Message[]> {
    const messages = Array.from(this.messages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
    
    return messages;
  }
}

// Export classes for use by storage factory
export { MemStorage };

// Main storage instance is created by storage/index.ts
// Use: import { storage } from './storage/index' for the configured instance
// IStorage interface is already exported above
