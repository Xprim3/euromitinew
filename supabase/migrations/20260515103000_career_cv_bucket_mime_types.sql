-- Allow common resume formats in addition to PDF (bucket upload MIME allow-list).

UPDATE storage.buckets
SET
  allowed_mime_types = ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/rtf',
    'text/rtf',
    'application/vnd.oasis.opendocument.text'
  ]
WHERE
  id = 'euromiti-career-cvs';
