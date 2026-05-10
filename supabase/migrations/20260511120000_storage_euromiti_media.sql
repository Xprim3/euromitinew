-- Public asset bucket + Storage RLS aligned with `media_uploads.storage_bucket` default.
-- Admins (public.admins row) may upload under `homepage/` prefix; public may read objects in this bucket.

INSERT INTO
  storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'euromiti-media',
  'euromiti-media',
  TRUE,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

DROP POLICY IF EXISTS "Euromiti media public read" ON storage.objects;

CREATE POLICY "Euromiti media public read" ON storage.objects FOR
SELECT
  TO anon,
  authenticated USING (bucket_id = 'euromiti-media');

DROP POLICY IF EXISTS "Euromiti media admin upload homepage" ON storage.objects;

CREATE POLICY "Euromiti media admin upload homepage" ON storage.objects FOR INSERT TO authenticated
WITH
  CHECK (
    bucket_id = 'euromiti-media'
    AND name LIKE 'homepage/%'
    AND public.is_admin ()
  );

DROP POLICY IF EXISTS "Euromiti media admin update" ON storage.objects;

CREATE POLICY "Euromiti media admin update" ON storage.objects FOR
UPDATE TO authenticated USING (bucket_id = 'euromiti-media' AND public.is_admin ())
WITH
  CHECK (bucket_id = 'euromiti-media' AND public.is_admin ());

DROP POLICY IF EXISTS "Euromiti media admin delete" ON storage.objects;

CREATE POLICY "Euromiti media admin delete" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'euromiti-media'
  AND public.is_admin ()
);
