-- Editorial hero (Playfair band below page hero) — text + optional dedicated image.

ALTER TABLE public.restaurant_content
  ADD COLUMN IF NOT EXISTS editorial_eyebrow text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS editorial_title_line1 text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS editorial_title_line2 text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS editorial_description text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS editorial_quote_line text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS editorial_quote_attribution text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS editorial_image_media_id uuid REFERENCES public.media_uploads (id) ON DELETE SET NULL;

COMMENT ON COLUMN public.restaurant_content.editorial_eyebrow IS 'Small uppercase label above the Playfair headline.';
COMMENT ON COLUMN public.restaurant_content.editorial_title_line1 IS 'First line of the editorial hero title (before line break).';
COMMENT ON COLUMN public.restaurant_content.editorial_title_line2 IS 'Second line of the editorial hero title (after line break).';
COMMENT ON COLUMN public.restaurant_content.editorial_description IS 'Supporting paragraph under the editorial hero title.';
COMMENT ON COLUMN public.restaurant_content.editorial_quote_line IS 'Featured quote text (desktop floating slab).';
COMMENT ON COLUMN public.restaurant_content.editorial_quote_attribution IS 'Quote attribution line.';
COMMENT ON COLUMN public.restaurant_content.editorial_image_media_id IS 'Large right-column image for the editorial hero; falls back to main hero image when null.';

UPDATE public.restaurant_content
SET
  editorial_eyebrow = 'The culinary issue',
  editorial_title_line1 = 'The Art of',
  editorial_title_line2 = 'Slow Dining',
  editorial_description = $d$Experience a refined sanctuary where seasonal flavors meet architectural elegance. A comfort stop reimagined for the modern connoisseur.$d$,
  editorial_quote_line = $q$"A masterpiece of atmosphere."$q$,
  editorial_quote_attribution = '— Kosova Hospitality Review'
WHERE id = 1;
