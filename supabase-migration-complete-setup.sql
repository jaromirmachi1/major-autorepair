-- Complete Supabase Migration Script
-- Run this SQL in the Supabase SQL Editor

-- ===========================================
-- 1. CREATE CONTACT MESSAGES TABLE
-- ===========================================

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

-- ===========================================
-- 2. ADD ENGINE FIELDS TO CARS TABLE
-- ===========================================

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

-- ===========================================
-- 3. FIX ADMIN PERMISSIONS FOR CARS
-- ===========================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can insert cars" ON cars;
DROP POLICY IF EXISTS "Users can update their own cars" ON cars;
DROP POLICY IF EXISTS "Users can delete their own cars" ON cars;

-- Create new policies that allow any authenticated user to manage cars
CREATE POLICY "Authenticated users can insert cars" ON cars
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update cars" ON cars
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete cars" ON cars
  FOR DELETE USING (auth.role() = 'authenticated');

-- ===========================================
-- 4. FIX STORAGE POLICIES FOR CAR IMAGES
-- ===========================================

-- Also update storage policies to be more permissive for admin users
DROP POLICY IF EXISTS "Users can update their own car images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own car images" ON storage.objects;

CREATE POLICY "Authenticated users can update car images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'car-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete car images" ON storage.objects
  FOR DELETE USING (bucket_id = 'car-images' AND auth.role() = 'authenticated');

-- ===========================================
-- 5. CREATE STORAGE BUCKET FOR CAR IMAGES (if not exists)
-- ===========================================

-- Create storage bucket for car images (safe to run multiple times)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('car-images', 'car-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for car images (safe to run multiple times)
DO $$
BEGIN
    -- Create policy for viewing car images
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Anyone can view car images'
    ) THEN
        CREATE POLICY "Anyone can view car images" ON storage.objects
        FOR SELECT USING (bucket_id = 'car-images');
    END IF;

    -- Create policy for uploading car images
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Authenticated users can upload car images'
    ) THEN
        CREATE POLICY "Authenticated users can upload car images" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'car-images' AND auth.role() = 'authenticated');
    END IF;
END $$;
