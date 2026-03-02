-- Run this in Supabase SQL Editor to set up storage bucket and policies
-- IMPORTANT: Run this entire script in your Supabase SQL Editor

-- 1. Create the bucket (if not exists) - MUST BE PUBLIC for images to display
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('event-logos', 'event-logos', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

-- 2. Enable RLS on storage.objects (usually already enabled by Supabase)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if they exist (ignore errors if not exist)
DROP POLICY IF EXISTS "Allow Public Access to Event Logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow Authenticated Upload to Event Logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow Service Role Upload to Event Logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow Service Role Update Event Logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow Service Role Delete Event Logos" ON storage.objects;

-- 4. Allow public access to view logos (important for display)
-- This allows anyone to view the images in the bucket
CREATE POLICY "Allow Public Access to Event Logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-logos');

-- 5. Allow authenticated users to upload (for server-side uploads using service role)
-- The service role key bypasses RLS, but this policy ensures uploads work correctly
CREATE POLICY "Allow Authenticated Upload to Event Logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'event-logos' AND
  (storage.foldername(name))[1] IN ('event-logos', 'sponsor-logos')
);

-- 6. Allow authenticated users to update/replace
CREATE POLICY "Allow Authenticated Update Event Logos"
ON storage.objects FOR UPDATE
WITH CHECK (bucket_id = 'event-logos');

-- 7. Allow authenticated users to delete
CREATE POLICY "Allow Authenticated Delete Event Logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'event-logos');

-- NOTE: Service role key (SUPABASE_SERVICE_ROLE_KEY) bypasses RLS entirely,
-- so it can upload/delete regardless of these policies. The policies above
-- are for authenticated (anon key) operations and for proper documentation.
