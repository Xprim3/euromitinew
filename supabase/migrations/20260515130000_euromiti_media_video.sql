-- Homepage / CMS band: allow short MP4/WebM/MOV uploads in euromiti-media (up to 48 MB).

UPDATE storage.buckets
SET
  file_size_limit = 50331648,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/heic',
    'image/heif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-m4v'
  ]
WHERE
  id = 'euromiti-media';
