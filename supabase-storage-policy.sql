-- Run this in Supabase SQL Editor to set up storage policies

-- Allow public access to view logos
CREATE POLICY "Allow Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-logos');

-- Allow authenticated users to upload
CREATE POLICY "Allow Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'event-logos');

-- Allow authenticated users to replace/update
CREATE POLICY "Allow Authenticated Update"
ON storage.objects FOR UPDATE
WITH CHECK (bucket_id = 'event-logos');

-- Allow authenticated users to delete
CREATE POLICY "Allow Authenticated Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'event-logos');
