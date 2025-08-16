-- Add provider tier enum and column
DO $$ BEGIN
    CREATE TYPE "provider_tier" AS ENUM('free_personal', 'official_paid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add the provider tier column to bots table
ALTER TABLE "bots" ADD COLUMN "provider_tier" "provider_tier" DEFAULT 'official_paid';

-- Update existing records based on provider type
UPDATE "bots" SET "provider_tier" = 'free_personal' 
WHERE "whatsapp_provider" IN ('baileys', 'wppconnect', 'venom');

UPDATE "bots" SET "provider_tier" = 'official_paid' 
WHERE "whatsapp_provider" IN ('meta_business', 'twilio', 'evolution_api');