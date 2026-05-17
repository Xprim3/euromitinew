-- Allow applications for any existing job (not only active listings).

DROP TRIGGER IF EXISTS tr_job_application_active_job ON public.job_applications;

DROP FUNCTION IF EXISTS public.job_application_job_must_be_active ();

CREATE OR REPLACE FUNCTION public.job_application_job_must_exist () RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.jobs j
    WHERE j.id = NEW.job_id
  ) THEN
    RAISE EXCEPTION 'invalid_job';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER tr_job_application_job_must_exist BEFORE INSERT ON public.job_applications FOR EACH ROW
EXECUTE FUNCTION public.job_application_job_must_exist ();

COMMENT ON FUNCTION public.job_application_job_must_exist () IS 'Ensures job_id references an existing jobs row (active or not).';

-- Dropdown options for the public apply form (slug + title only; SECURITY DEFINER bypasses active-only RLS).
CREATE OR REPLACE FUNCTION public.get_application_job_options () RETURNS TABLE (
  slug TEXT,
  title TEXT,
  is_active BOOLEAN
) LANGUAGE sql STABLE SECURITY DEFINER
SET
  search_path = public AS $$
  SELECT
    j.slug,
    j.title,
    j.is_active
  FROM public.jobs j
  WHERE
    char_length(trim(j.slug)) > 0
    AND char_length(trim(j.title)) > 0
  ORDER BY
    j.is_active DESC,
    j.title ASC;
$$;

GRANT
EXECUTE ON FUNCTION public.get_application_job_options () TO anon,
authenticated;
