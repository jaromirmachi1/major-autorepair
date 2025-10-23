-- Fix admin permissions for cars table
-- This allows any authenticated user to manage cars (for admin dashboard)

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

-- Also update storage policies to be more permissive for admin users
DROP POLICY IF EXISTS "Users can update their own car images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own car images" ON storage.objects;

CREATE POLICY "Authenticated users can update car images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'car-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete car images" ON storage.objects
  FOR DELETE USING (bucket_id = 'car-images' AND auth.role() = 'authenticated');
