-- Intro / "dining room" band (headline + body + image beside text) — CMS fields.

ALTER TABLE public.restaurant_content
  ADD COLUMN IF NOT EXISTS intro_eyebrow text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS intro_headline_line1 text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS intro_headline_line2 text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS intro_body text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS intro_image_media_id uuid REFERENCES public.media_uploads (id) ON DELETE SET NULL;

COMMENT ON COLUMN public.restaurant_content.intro_eyebrow IS 'Small uppercase label above the Playfair headline in the intro band.';
COMMENT ON COLUMN public.restaurant_content.intro_headline_line1 IS 'First line of the intro headline (roman weight).';
COMMENT ON COLUMN public.restaurant_content.intro_headline_line2 IS 'Second line of the intro headline (italic span).';
COMMENT ON COLUMN public.restaurant_content.intro_body IS 'Intro copy; separate paragraphs with a blank line. Falls back to hero_description when empty for legacy rows.';
COMMENT ON COLUMN public.restaurant_content.intro_image_media_id IS 'Image beside intro copy; falls back to page hero image when null.';

UPDATE public.restaurant_content
SET
  intro_eyebrow = 'The dining room',
  intro_headline_line1 = 'Freshness',
  intro_headline_line2 = 'Redefined',
  intro_body = COALESCE(
    NULLIF(trim(intro_body), ''),
    NULLIF(trim(hero_description), ''),
    $p$Euromiti Restaurant brings quality cooking, considerate service, and a composed dining room together in one place. A meal here is more than sustenance—it is the pause inside a journey, the moment where conversation opens, and a careful walk through Kosovo’s seasonal larder.

Whether you are stopping mid-route or gathering for something to celebrate, the room is tuned for acoustics and light—clean, restorative, memorable long after dessert.$p$
  )
WHERE id = 1;
