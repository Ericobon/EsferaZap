import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const botStatusEnum = pgEnum('bot_status', ['active', 'inactive', 'configuring']);
export const messageStatusEnum = pgEnum('message_status', ['pending', 'sent', 'delivered', 'read', 'failed']);
export const messageTypeEnum = pgEnum('message_type', ['text', 'image', 'audio', 'document']);

export const bots = pgTable("bots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  phoneNumber: varchar("phone_number").notNull(),
  apiKey: varchar("api_key"), // WhatsApp API key
  webhookUrl: varchar("webhook_url"),
  status: botStatusEnum("status").default('inactive'),
  prompt: text("prompt"),
  geminiApiKey: varchar("gemini_api_key"),
  maxTokens: integer("max_tokens").default(1000),
  temperature: varchar("temperature").default('0.7'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  botId: varchar("bot_id").notNull().references(() => bots.id),
  customerPhone: varchar("customer_phone").notNull(),
  customerName: varchar("customer_name"),
  isActive: boolean("is_active").default(true),
  assignedToAgent: boolean("assigned_to_agent").default(false),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => conversations.id),
  content: text("content").notNull(),
  type: messageTypeEnum("type").default('text'),
  isFromBot: boolean("is_from_bot").default(false),
  status: messageStatusEnum("status").default('pending'),
  metadata: jsonb("metadata"), // Additional data like tokens used, response time
  createdAt: timestamp("created_at").defaultNow(),
});

export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  botId: varchar("bot_id").notNull().references(() => bots.id),
  date: timestamp("date").notNull(),
  totalMessages: integer("total_messages").default(0),
  botMessages: integer("bot_messages").default(0),
  customerMessages: integer("customer_messages").default(0),
  averageResponseTime: integer("average_response_time").default(0), // in milliseconds
  tokensUsed: integer("tokens_used").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertBotSchema = createInsertSchema(bots).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Bot = typeof bots.$inferSelect;
export type InsertBot = z.infer<typeof insertBotSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
