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
  real,
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
export const messageStatusEnum = pgEnum('message_status', ['pending', 'sent', 'delivered', 'read', 'failed', 'received']);
export const messageTypeEnum = pgEnum('message_type', ['text', 'image', 'audio', 'document', 'video']);
export const messageDirectionEnum = pgEnum('message_direction', ['inbound', 'outbound']);

export const bots = pgTable("bots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  phoneNumber: varchar("phone_number").notNull(),
  status: botStatusEnum("status").default('inactive'),
  prompt: text("prompt"),
  maxTokens: integer("max_tokens").default(1000),
  temperature: varchar("temperature").default('0.7'),
  // Bot type and capabilities
  botType: varchar("bot_type").default('business'), // 'business' or 'personal'
  qrCode: text("qr_code"), // Generated QR code for WhatsApp connection
  supportsText: boolean("supports_text").default(true),
  supportsAudio: boolean("supports_audio").default(false),
  supportsImages: boolean("supports_images").default(false),
  // Trigger settings
  humanHandoffEnabled: boolean("human_handoff_enabled").default(false),
  humanHandoffMessage: text("human_handoff_message").default("Um agente humano entrará na conversa em breve."),
  triggerWords: text("trigger_words").array().default([]), // Array of trigger words
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
  botId: varchar("bot_id").notNull().references(() => bots.id),
  whatsappMessageId: varchar("whatsapp_message_id"),
  conversationId: varchar("conversation_id").references(() => conversations.id),
  fromNumber: varchar("from_number").notNull(),
  toNumber: varchar("to_number").notNull(),
  content: text("content").notNull(),
  messageType: messageTypeEnum("message_type").default('text'),
  direction: messageDirectionEnum("direction").notNull(),
  status: messageStatusEnum("status").default('pending'),
  timestamp: timestamp("timestamp").defaultNow(),
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
  qrCode: true,
}).extend({
  botType: z.string().default('business'),
  supportsText: z.boolean().default(true),
  supportsAudio: z.boolean().default(false),
  supportsImages: z.boolean().default(false),
  humanHandoffEnabled: z.boolean().default(false),
  humanHandoffMessage: z.string().default("Um agente humano entrará na conversa em breve."),
  triggerWords: z.array(z.string()).default([]),
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

// Contacts CRM table
export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  botId: varchar("bot_id").notNull().references(() => bots.id),
  phoneNumber: varchar("phone_number").notNull(),
  name: varchar("name"),
  surname: varchar("surname"),
  email: varchar("email"),
  type: varchar("type").default("personal"), // personal, business
  title: varchar("title"),
  birthday: timestamp("birthday"),
  timezone: varchar("timezone"),
  gender: varchar("gender"),
  languages: jsonb("languages").default([]),
  currency: varchar("currency"),
  status: varchar("status").default("active"), // active, blocked, archived
  assignedAt: timestamp("assigned_at"),
  firstMessage: timestamp("first_message"),
  lastActivity: timestamp("last_activity"),
  labels: jsonb("labels").default([]),
  metadata: jsonb("metadata").default({}),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics metrics table for detailed tracking
export const analyticsMetrics = pgTable("analytics_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  botId: varchar("bot_id").notNull().references(() => bots.id),
  date: timestamp("date").defaultNow(),
  metric: varchar("metric").notNull(), // active_chats, new_chats, resolved_chats, etc.
  value: integer("value").default(0),
  previousValue: integer("previous_value").default(0),
  changePercent: real("change_percent").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnalyticsMetricSchema = createInsertSchema(analyticsMetrics).omit({
  id: true,
  createdAt: true,
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type AnalyticsMetric = typeof analyticsMetrics.$inferSelect;
export type InsertAnalyticsMetric = z.infer<typeof insertAnalyticsMetricSchema>;
