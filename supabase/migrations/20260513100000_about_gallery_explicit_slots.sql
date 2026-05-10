-- Deterministic About-page image slots (mission strip, Why Choose Us sidebar, Partnerships teaser).
-- Migrates positions from legacy `gallery_media_ids` UUID[] where present.

ALTER TABLE public.about_content
  ADD COLUMN IF NOT EXISTS gallery_strip_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS gallery_why_us_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS gallery_partnerships_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL;

UPDATE public.about_content c
SET
  gallery_strip_media_id = COALESCE(
    gallery_strip_media_id,
    CASE
      WHEN c.gallery_media_ids IS NOT NULL
      AND cardinality(c.gallery_media_ids) >= 1 THEN c.gallery_media_ids[1]
    END
  ),
  gallery_why_us_media_id = COALESCE(
    gallery_why_us_media_id,
    CASE
      WHEN c.gallery_media_ids IS NOT NULL
      AND cardinality(c.gallery_media_ids) >= 2 THEN c.gallery_media_ids[2]
    END
  ),
  gallery_partnerships_media_id = COALESCE(
    gallery_partnerships_media_id,
    CASE
      WHEN c.gallery_media_ids IS NOT NULL
      AND cardinality(c.gallery_media_ids) >= 3 THEN c.gallery_media_ids[3]
    END
  )
WHERE
  id = 1;

COMMENT ON COLUMN public.about_content.gallery_strip_media_id IS 'About page Mission/Vision footer strip image.';
COMMENT ON COLUMN public.about_content.gallery_why_us_media_id IS 'About page Why Choose Us right-column image.';
COMMENT ON COLUMN public.about_content.gallery_partnerships_media_id IS 'About page Partnerships / contact teaser image.';
