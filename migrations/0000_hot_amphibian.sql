CREATE TYPE "public"."bot_status" AS ENUM('active', 'inactive', 'configuring');--> statement-breakpoint
CREATE TYPE "public"."message_direction" AS ENUM('inbound', 'outbound');--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('pending', 'sent', 'delivered', 'read', 'failed', 'received');--> statement-breakpoint
CREATE TYPE "public"."message_type" AS ENUM('text', 'image', 'audio', 'document', 'video');--> statement-breakpoint
CREATE TABLE "analytics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bot_id" varchar NOT NULL,
	"date" timestamp NOT NULL,
	"total_messages" integer DEFAULT 0,
	"bot_messages" integer DEFAULT 0,
	"customer_messages" integer DEFAULT 0,
	"average_response_time" integer DEFAULT 0,
	"tokens_used" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "analytics_metrics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bot_id" varchar NOT NULL,
	"date" timestamp DEFAULT now(),
	"metric" varchar NOT NULL,
	"value" integer DEFAULT 0,
	"previous_value" integer DEFAULT 0,
	"change_percent" real DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bots" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"phone_number" varchar NOT NULL,
	"status" "bot_status" DEFAULT 'inactive',
	"prompt" text,
	"max_tokens" integer DEFAULT 1000,
	"temperature" varchar DEFAULT '0.7',
	"bot_type" varchar DEFAULT 'business',
	"qr_code" text,
	"supports_text" boolean DEFAULT true,
	"supports_audio" boolean DEFAULT false,
	"supports_images" boolean DEFAULT false,
	"human_handoff_enabled" boolean DEFAULT false,
	"human_handoff_message" text DEFAULT 'Um agente humano entrará na conversa em breve.',
	"trigger_words" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bot_id" varchar NOT NULL,
	"phone_number" varchar NOT NULL,
	"name" varchar,
	"surname" varchar,
	"email" varchar,
	"type" varchar DEFAULT 'personal',
	"title" varchar,
	"birthday" timestamp,
	"timezone" varchar,
	"gender" varchar,
	"languages" jsonb DEFAULT '[]'::jsonb,
	"currency" varchar,
	"status" varchar DEFAULT 'active',
	"assigned_at" timestamp,
	"first_message" timestamp,
	"last_activity" timestamp,
	"labels" jsonb DEFAULT '[]'::jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bot_id" varchar NOT NULL,
	"customer_phone" varchar NOT NULL,
	"customer_name" varchar,
	"is_active" boolean DEFAULT true,
	"assigned_to_agent" boolean DEFAULT false,
	"last_message_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bot_id" varchar NOT NULL,
	"whatsapp_message_id" varchar,
	"conversation_id" varchar,
	"from_number" varchar NOT NULL,
	"to_number" varchar NOT NULL,
	"content" text NOT NULL,
	"message_type" "message_type" DEFAULT 'text',
	"direction" "message_direction" NOT NULL,
	"status" "message_status" DEFAULT 'pending',
	"timestamp" timestamp DEFAULT now(),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"full_name" varchar,
	"phone" varchar,
	"company" varchar,
	"sector" varchar,
	"registration_method" varchar DEFAULT 'replit',
	"is_profile_complete" boolean DEFAULT false,
	"google_calendar_access_token" varchar,
	"google_calendar_refresh_token" varchar,
	"calendar_integration_enabled" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_bot_id_bots_id_fk" FOREIGN KEY ("bot_id") REFERENCES "public"."bots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_metrics" ADD CONSTRAINT "analytics_metrics_bot_id_bots_id_fk" FOREIGN KEY ("bot_id") REFERENCES "public"."bots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bots" ADD CONSTRAINT "bots_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_bot_id_bots_id_fk" FOREIGN KEY ("bot_id") REFERENCES "public"."bots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_bot_id_bots_id_fk" FOREIGN KEY ("bot_id") REFERENCES "public"."bots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_bot_id_bots_id_fk" FOREIGN KEY ("bot_id") REFERENCES "public"."bots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");