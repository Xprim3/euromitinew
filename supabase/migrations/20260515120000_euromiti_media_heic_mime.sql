-- Allow HEIC/HEIF from iPhone cameras in euromiti-media bucket.

UPDATE storage.buckets
SET
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/heic',
    'image/heif'
  ]
WHERE
  id = 'euromiti-media';
