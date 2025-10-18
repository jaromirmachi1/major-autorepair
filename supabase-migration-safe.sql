-- Safe Migration Script - Handles existing tables
-- Run this SQL in the Supabase SQL Editor

-- Create contact_messages table only if it doesn't exist
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (safe to run multiple times)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can view all messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can update messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can delete messages" ON contact_messages;

-- Create policies for public access (contact form)
CREATE POLICY "Anyone can insert contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view all messages" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update messages" ON contact_messages
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete messages" ON contact_messages
  FOR DELETE USING (auth.role() = 'authenticated');

-- Add new columns to the cars table (only if they don't exist)
DO $$ 
BEGIN
    -- Add engine_volume column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cars' AND column_name = 'engine_volume') THEN
        ALTER TABLE cars ADD COLUMN engine_volume TEXT;
    END IF;
    
    -- Add power column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cars' AND column_name = 'power') THEN
        ALTER TABLE cars ADD COLUMN power TEXT;
    END IF;
END $$;

-- Update existing records with default values (only for NULL values)
UPDATE cars 
SET engine_volume = 'N/A', power = 'N/A' 
WHERE engine_volume IS NULL OR power IS NULL;

-- Add comments to document the new columns (safe to run multiple times)
COMMENT ON COLUMN cars.engine_volume IS 'Engine volume/displacement (e.g., 2.0L, 3.0L, Electric)';
COMMENT ON COLUMN cars.power IS 'Engine power output (e.g., 150 kW, 200 HP)';
