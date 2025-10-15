# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login
3. Create a new project
4. Choose a name and database password
5. Wait for project to be ready

## 2. Get Your Credentials

1. Go to Project Settings → API
2. Copy your:
   - Project URL
   - Anon (public) key

## 3. Create .env.local File

Create a `.env.local` file in your project root with:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Database Setup

Run this SQL in the Supabase SQL Editor:

```sql
-- Create cars table
CREATE TABLE cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  year INTEGER NOT NULL,
  price INTEGER NOT NULL,
  price_formatted TEXT,
  mileage INTEGER NOT NULL,
  fuel TEXT NOT NULL,
  transmission TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_urls TEXT[],
  featured BOOLEAN DEFAULT false,
  pinned BOOLEAN DEFAULT false,
  features TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all cars" ON cars
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert cars" ON cars
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own cars" ON cars
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own cars" ON cars
  FOR DELETE USING (auth.uid() = created_by);

-- Create storage bucket for car images
INSERT INTO storage.buckets (id, name, public) VALUES ('car-images', 'car-images', true);

-- Create storage policies
CREATE POLICY "Anyone can view car images" ON storage.objects
  FOR SELECT USING (bucket_id = 'car-images');

CREATE POLICY "Authenticated users can upload car images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'car-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own car images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'car-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own car images" ON storage.objects
  FOR DELETE USING (bucket_id = 'car-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## 5. Test the Setup

1. Restart your development server
2. Check browser console for "✅ Supabase initialized successfully"
3. Try logging into admin panel
4. Try adding a car

## 6. Migration from localStorage

Your existing data will be migrated automatically when you:

1. Set up Supabase
2. Restart the app
3. The app will use Supabase instead of localStorage
