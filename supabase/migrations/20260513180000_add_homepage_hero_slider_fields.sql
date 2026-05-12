-- Add admin-managed advertising slides for the homepage hero.
-- Existing single hero fields remain as fallback/compatibility.

ALTER TABLE public.homepage_content
  ADD COLUMN IF NOT EXISTS hero_slides_json JSONB;

COMMENT ON COLUMN public.homepage_content.hero_slides_json IS
  'Ordered homepage hero advertising slides: title, body, and mediaId.';

UPDATE public.homepage_content
SET hero_slides_json = jsonb_build_array(
  jsonb_build_object(
    'title', COALESCE(NULLIF(hero_headline_line1, ''), 'Shërbime të besueshme për çdo ndalesë'),
    'body', COALESCE(NULLIF(hero_subtitle, ''), 'Karburant, restorant, autolarje dhe mini market në pikat kryesore të Euromiti.'),
    'mediaId', hero_image_media_id
  ),
  jsonb_build_object(
    'title', 'Karburant cilësor',
    'body', 'Standardet tona Euro 6+ janë të zhvilluara për efikasitet, performancë dhe emetime më të ulëta.',
    'mediaId', hero_image_media_id
  ),
  jsonb_build_object(
    'title', 'Pusho në Euromiti',
    'body', 'Restorant, mini market dhe shërbime të shpejta për një ndalesë më të rehatshme gjatë rrugës.',
    'mediaId', hero_image_media_id
  )
)
WHERE id = 1
  AND hero_slides_json IS NULL;
