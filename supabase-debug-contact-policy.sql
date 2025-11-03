-- DEBUG ONLY: Check current policies and RLS status
-- This file is for troubleshooting - not needed for normal operations
-- Run this to see what's actually set up in your database

-- 1. Check if RLS is enabled
SELECT 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'contact_messages';

-- 2. List ALL policies on contact_messages
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'contact_messages';

-- 3. If policies look wrong, drop ALL and recreate
-- Uncomment below if you need to reset everything:

-- DROP POLICY IF EXISTS "Allow all inserts to contact_messages" ON contact_messages;
-- DROP POLICY IF EXISTS "Anonymous users can insert contact messages" ON contact_messages;
-- DROP POLICY IF EXISTS "Authenticated users can insert contact messages" ON contact_messages;
-- DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
-- DROP POLICY IF EXISTS "Public can insert contact messages" ON contact_messages;

-- CREATE POLICY "Allow all inserts" ON contact_messages
--   FOR INSERT
--   TO public
--   WITH CHECK (true);

