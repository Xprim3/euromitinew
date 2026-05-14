-- Public job applications with CV files in a private bucket (PDF only, 5 MB).

CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  job_id UUID NOT NULL REFERENCES public.jobs (id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  cover_letter TEXT NOT NULL DEFAULT '',
  cv_bucket TEXT NOT NULL DEFAULT 'euromiti-career-cvs',
  cv_object_path TEXT NOT NULL,
  cv_original_filename TEXT,
  cv_mime_type TEXT NOT NULL,
  cv_byte_size BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT job_app_email_len_chk CHECK (char_length(trim(email)) >= 5),
  CONSTRAINT job_app_name_len_chk CHECK (char_length(trim(full_name)) >= 2)
);

COMMENT ON TABLE public.job_applications IS 'Applications submitted from the public site; CVs stored under euromiti-career-cvs/applications/{job_id}/.';

CREATE INDEX idx_job_applications_job_created ON public.job_applications (job_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.job_application_job_must_be_active () RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.jobs j
    WHERE
      j.id = NEW.job_id
      AND j.is_active IS TRUE
  ) THEN
    RAISE EXCEPTION 'invalid_job';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER tr_job_application_active_job BEFORE INSERT ON public.job_applications FOR EACH ROW
EXECUTE FUNCTION public.job_application_job_must_be_active ();

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert job applications" ON public.job_applications;

CREATE POLICY "Public insert job applications" ON public.job_applications FOR INSERT TO anon, authenticated
WITH
  CHECK (TRUE);

DROP POLICY IF EXISTS "Admins manage job applications" ON public.job_applications;

CREATE POLICY "Admins manage job applications" ON public.job_applications FOR ALL TO authenticated USING (public.is_admin ())
WITH
  CHECK (public.is_admin ());

GRANT INSERT ON TABLE public.job_applications TO anon, authenticated;

GRANT SELECT, DELETE ON TABLE public.job_applications TO authenticated;

-- Private bucket: no public object URLs; admins read via Storage policies + dashboard.
INSERT INTO
  storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'euromiti-career-cvs',
  'euromiti-career-cvs',
  FALSE,
  5242880,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE
SET
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

DROP POLICY IF EXISTS "Career CV public upload" ON storage.objects;

CREATE POLICY "Career CV public upload" ON storage.objects FOR INSERT TO anon, authenticated
WITH
  CHECK (
    bucket_id = 'euromiti-career-cvs'
    AND name ~ '^applications/[0-9a-fA-F-]{36}/'
  );

DROP POLICY IF EXISTS "Career CV admin read" ON storage.objects;

CREATE POLICY "Career CV admin read" ON storage.objects FOR
SELECT
  TO authenticated USING (
    bucket_id = 'euromiti-career-cvs'
    AND public.is_admin ()
  );

DROP POLICY IF EXISTS "Career CV admin delete" ON storage.objects;

CREATE POLICY "Career CV admin delete" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'euromiti-career-cvs'
  AND public.is_admin ()
);
