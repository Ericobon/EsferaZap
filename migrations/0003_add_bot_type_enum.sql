-- Migration to add bot_type enum and update bots table
-- Created: 2025-01-17

-- Create new enum for bot types
DO $$ BEGIN
    CREATE TYPE bot_type AS ENUM ('text', 'audio', 'voice');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add new column with enum type (temporarily nullable)
ALTER TABLE bots ADD COLUMN IF NOT EXISTS bot_type_enum bot_type;

-- Update existing records to use 'text' as default
UPDATE bots SET bot_type_enum = 'text' WHERE bot_type_enum IS NULL;

-- Make the column NOT NULL after setting defaults
ALTER TABLE bots ALTER COLUMN bot_type_enum SET NOT NULL;

-- Set default for new records
ALTER TABLE bots ALTER COLUMN bot_type_enum SET DEFAULT 'text';

-- You can drop the old bot_type column after verifying the migration worked correctly
-- ALTER TABLE bots DROP COLUMN IF EXISTS bot_type;

-- Rename the new column to replace the old one (optional)
-- ALTER TABLE bots RENAME COLUMN bot_type_enum TO bot_type;