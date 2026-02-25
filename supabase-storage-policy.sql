-- Run this in Supabase SQL Editor to set up storage bucket and policies

-- 1. Create the bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-logos', 'event-logos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on storage.objects (usually already enabled by Supabase)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if they exist (ignore errors if not exist)
DROP POLICY IF EXISTS "Allow Public Access to Event Logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow Service Role Upload to Event Logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow Service Role Update Event Logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow Service Role Delete Event Logos" ON storage.objects;

-- 4. Allow public access to view logos (important for display)
CREATE POLICY "Allow Public Access to Event Logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-logos');

-- 5. Allow service role to upload (for server-side uploads)
CREATE POLICY "Allow Service Role Upload to Event Logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'event-logos');

-- 6. Allow service role to update/replace
CREATE POLICY "Allow Service Role Update Event Logos"
ON storage.objects FOR UPDATE
WITH CHECK (bucket_id = 'event-logos');

-- 7. Allow service role to delete
CREATE POLICY "Allow Service Role Delete Event Logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'event-logos');
