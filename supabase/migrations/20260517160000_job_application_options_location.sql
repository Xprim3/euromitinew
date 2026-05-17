-- Include location on apply-form options for location + position dropdowns.
-- Must drop first: return type (OUT columns) changed from prior migration.

DROP FUNCTION IF EXISTS public.get_application_job_options ();

CREATE FUNCTION public.get_application_job_options () RETURNS TABLE (
  slug TEXT,
  title TEXT,
  location_city TEXT,
  is_active BOOLEAN
) LANGUAGE sql STABLE SECURITY DEFINER
SET
  search_path = public AS $$
  SELECT
    j.slug,
    j.title,
    NULLIF(trim(j.location_city), '') AS location_city,
    j.is_active
  FROM public.jobs j
  WHERE
    j.is_active = TRUE
    AND char_length(trim(j.slug)) > 0
    AND char_length(trim(j.title)) > 0
    AND j.location_city IS NOT NULL
    AND char_length(trim(j.location_city)) > 0
  ORDER BY
    j.location_city ASC,
    j.title ASC;
$$;

GRANT
EXECUTE ON FUNCTION public.get_application_job_options () TO anon,
authenticated;
