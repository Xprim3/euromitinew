-- CMS fields for the Restaurant page "Digital menu (Skanom)" band.

ALTER TABLE public.restaurant_content
  ADD COLUMN IF NOT EXISTS skanom_eyebrow TEXT NOT NULL DEFAULT 'Digital menu',
  ADD COLUMN IF NOT EXISTS skanom_title TEXT NOT NULL DEFAULT 'Taste everything before your table arrives.',
  ADD COLUMN IF NOT EXISTS skanom_description TEXT NOT NULL DEFAULT 'Our live menu unfolds on Skanom—photography paced like the dining room, wine and coffee corridors side by side, and allergen cues that track the pass in real time. Open it beside the motorway or tucked into a banquet before dessert.',
  ADD COLUMN IF NOT EXISTS skanom_image_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS skanom_cta_label TEXT NOT NULL DEFAULT 'View menu online',
  ADD COLUMN IF NOT EXISTS skanom_cta_href TEXT NOT NULL DEFAULT 'https://skanom.com/';

COMMENT ON COLUMN public.restaurant_content.skanom_eyebrow IS 'Small label above the Skanom / digital menu section.';
COMMENT ON COLUMN public.restaurant_content.skanom_title IS 'Main headline for the Skanom section.';
COMMENT ON COLUMN public.restaurant_content.skanom_description IS 'Body copy for the Skanom section.';
COMMENT ON COLUMN public.restaurant_content.skanom_image_media_id IS 'Left-column hero image for the Skanom section.';
COMMENT ON COLUMN public.restaurant_content.skanom_cta_label IS 'Primary CTA button label (opens skanom_cta_href).';
COMMENT ON COLUMN public.restaurant_content.skanom_cta_href IS 'Primary CTA URL for the digital menu.';

UPDATE public.restaurant_content
SET
  skanom_image_media_id = COALESCE(
    skanom_image_media_id,
    '5cfb0699-741b-4123-bfa4-ad1416f39847'::uuid
  )
WHERE id = 1;
