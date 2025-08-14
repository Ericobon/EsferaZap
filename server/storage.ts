import {
  users,
  bots,
  conversations,
  messages,
  analytics,
  type User,
  type UpsertUser,
  type Bot,
  type InsertBot,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type Analytics,
  type InsertAnalytics,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Bot operations
  getUserBots(userId: string): Promise<Bot[]>;
  getBot(id: string): Promise<Bot | undefined>;
  getBotByPhoneNumberId(phoneNumberId: string): Promise<Bot | undefined>;
  createBot(bot: InsertBot): Promise<Bot>;
  updateBot(id: string, updates: Partial<InsertBot>): Promise<Bot | undefined>;
  deleteBot(id: string): Promise<boolean>;
  getBotConversations(botId: string, limit?: number): Promise<Conversation[]>;
  
  // Conversation operations
  getBotConversations(botId: string, limit?: number): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, updates: Partial<InsertConversation>): Promise<Conversation | undefined>;
  getActiveConversationByPhone(botId: string, customerPhone: string): Promise<Conversation | undefined>;
  
  // Message operations
  getConversationMessages(conversationId: string, limit?: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessageStatus(whatsappMessageId: string, status: string): Promise<Message | undefined>;
  
  // Analytics operations
  getBotAnalytics(botId: string, startDate: Date, endDate: Date): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getUserDashboardStats(userId: string): Promise<{
    totalMessages: number;
    activeBots: number;
    averageResponseTime: number;
    unreadConversations: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Bot operations
  async getUserBots(userId: string): Promise<Bot[]> {
    return await db
      .select()
      .from(bots)
      .where(eq(bots.userId, userId))
      .orderBy(desc(bots.createdAt));
  }

  async getBot(id: string): Promise<Bot | undefined> {
    const [bot] = await db.select().from(bots).where(eq(bots.id, id));
    return bot;
  }

  async getBotByPhoneNumberId(phoneNumberId: string): Promise<Bot | undefined> {
    const [bot] = await db.select().from(bots).where(eq(bots.phoneNumberId, phoneNumberId));
    return bot;
  }

  async createBot(bot: InsertBot): Promise<Bot> {
    const [newBot] = await db.insert(bots).values(bot).returning();
    return newBot;
  }

  async updateBot(id: string, updates: Partial<InsertBot>): Promise<Bot | undefined> {
    const [updatedBot] = await db
      .update(bots)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(bots.id, id))
      .returning();
    return updatedBot;
  }

  async deleteBot(id: string): Promise<boolean> {
    const result = await db.delete(bots).where(eq(bots.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Conversation operations
  async getBotConversations(botId: string, limit = 50): Promise<Conversation[]> {
    return await db
      .select()
      .from(conversations)
      .where(eq(conversations.botId, botId))
      .orderBy(desc(conversations.lastMessageAt))
      .limit(limit);
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));
    return conversation;
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const [newConversation] = await db
      .insert(conversations)
      .values(conversation)
      .returning();
    return newConversation;
  }

  async updateConversation(id: string, updates: Partial<InsertConversation>): Promise<Conversation | undefined> {
    const [updatedConversation] = await db
      .update(conversations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(conversations.id, id))
      .returning();
    return updatedConversation;
  }

  async getActiveConversationByPhone(botId: string, customerPhone: string): Promise<Conversation | undefined> {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.botId, botId),
          eq(conversations.customerPhone, customerPhone),
          eq(conversations.isActive, true)
        )
      );
    return conversation;
  }

  // Message operations
  async getConversationMessages(conversationId: string, limit = 100): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt))
      .limit(limit);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async updateMessageStatus(whatsappMessageId: string, status: string): Promise<Message | undefined> {
    const [updatedMessage] = await db
      .update(messages)
      .set({ status: status as any })
      .where(eq(messages.whatsappMessageId, whatsappMessageId))
      .returning();
    return updatedMessage;
  }

  // Analytics operations
  async getBotAnalytics(botId: string, startDate: Date, endDate: Date): Promise<Analytics[]> {
    return await db
      .select()
      .from(analytics)
      .where(
        and(
          eq(analytics.botId, botId),
          gte(analytics.date, startDate),
          lte(analytics.date, endDate)
        )
      )
      .orderBy(desc(analytics.date));
  }

  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const [newAnalytics] = await db
      .insert(analytics)
      .values(analyticsData)
      .returning();
    return newAnalytics;
  }

  async getUserDashboardStats(userId: string): Promise<{
    totalMessages: number;
    activeBots: number;
    averageResponseTime: number;
    unreadConversations: number;
  }> {
    // Get user's bots
    const userBots = await this.getUserBots(userId);
    const botIds = userBots.map(bot => bot.id);

    if (botIds.length === 0) {
      return {
        totalMessages: 0,
        activeBots: 0,
        averageResponseTime: 0,
        unreadConversations: 0,
      };
    }

    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayAnalytics = await db
      .select({
        totalMessages: sql<number>`sum(${analytics.totalMessages})`,
        averageResponseTime: sql<number>`avg(${analytics.averageResponseTime})`,
      })
      .from(analytics)
      .where(
        and(
          sql`${analytics.botId} = ANY(${botIds})`,
          gte(analytics.date, today)
        )
      );

    const activeBots = userBots.filter(bot => bot.status === 'active').length;

    // Count unread conversations (simplified - could be enhanced with proper unread tracking)
    const unreadConversations = await db
      .select({ count: sql<number>`count(*)` })
      .from(conversations)
      .where(
        and(
          sql`${conversations.botId} = ANY(${botIds})`,
          eq(conversations.isActive, true),
          eq(conversations.assignedToAgent, false)
        )
      );

    return {
      totalMessages: todayAnalytics[0]?.totalMessages || 0,
      activeBots,
      averageResponseTime: todayAnalytics[0]?.averageResponseTime || 0,
      unreadConversations: unreadConversations[0]?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
