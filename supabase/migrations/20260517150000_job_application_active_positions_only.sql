-- Public apply form and new applications only for positions with is_active = true.

CREATE OR REPLACE FUNCTION public.job_application_job_must_exist () RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.jobs j
    WHERE j.id = NEW.job_id
      AND j.is_active = TRUE
  ) THEN
    RAISE EXCEPTION 'job_not_accepting_applications';
  END IF;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.job_application_job_must_exist () IS 'Ensures job_id references a job that is accepting applications (is_active).';

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
    j.is_active = TRUE
    AND char_length(trim(j.slug)) > 0
    AND char_length(trim(j.title)) > 0
  ORDER BY
    j.title ASC;
$$;
