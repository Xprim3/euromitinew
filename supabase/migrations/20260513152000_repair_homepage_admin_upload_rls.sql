-- Repair homepage CMS upload permissions.
-- Allows the first authenticated admin user to bootstrap an admins row,
-- then keeps homepage/media writes restricted to public.is_admin().

DROP POLICY IF EXISTS "Bootstrap first admin self" ON public.admins;

CREATE POLICY "Bootstrap first admin self"
ON public.admins
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND NOT EXISTS (SELECT 1 FROM public.admins)
);

DROP POLICY IF EXISTS "Admins manage media_uploads" ON public.media_uploads;

CREATE POLICY "Admins manage media_uploads"
ON public.media_uploads
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

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
DROP POLICY IF EXISTS "Euromiti media admin upload homepage" ON storage.objects;
DROP POLICY IF EXISTS "Euromiti media admin insert" ON storage.objects;
DROP POLICY IF EXISTS "Euromiti media admin update" ON storage.objects;
DROP POLICY IF EXISTS "Euromiti media admin delete" ON storage.objects;

CREATE POLICY "Euromiti media public read"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'euromiti-media');

CREATE POLICY "Euromiti media admin insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'euromiti-media'
  AND public.is_admin()
);

CREATE POLICY "Euromiti media admin update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'euromiti-media'
  AND public.is_admin()
)
WITH CHECK (
  bucket_id = 'euromiti-media'
  AND public.is_admin()
);

CREATE POLICY "Euromiti media admin delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'euromiti-media'
  AND public.is_admin()
);
