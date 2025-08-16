-- Add WhatsApp provider enum type
CREATE TYPE whatsapp_provider AS ENUM ('meta_business', 'twilio', 'evolution_api', 'baileys', 'wppconnect', 'venom');

-- Add new columns to bots table
ALTER TABLE bots 
ADD COLUMN qr_code_expires TIMESTAMP,
ADD COLUMN whatsapp_provider whatsapp_provider DEFAULT 'meta_business',
ADD COLUMN api_key VARCHAR,
ADD COLUMN access_token TEXT,
ADD COLUMN refresh_token TEXT,
ADD COLUMN phone_number_id VARCHAR,
ADD COLUMN business_account_id VARCHAR,
ADD COLUMN webhook_url VARCHAR,
ADD COLUMN webhook_secret VARCHAR,
ADD COLUMN instance_id VARCHAR,
ADD COLUMN server_url VARCHAR,
ADD COLUMN connection_status VARCHAR DEFAULT 'disconnected',
ADD COLUMN last_connection_check TIMESTAMP;

-- Update existing bots to have default provider
UPDATE bots SET whatsapp_provider = 'meta_business' WHERE whatsapp_provider IS NULL;