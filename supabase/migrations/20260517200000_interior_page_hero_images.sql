-- Interior page header images (PageImageHero) — admin-uploadable per page.

ALTER TABLE public.services_content
  ADD COLUMN IF NOT EXISTS hero_page_image_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS hero_page_image_alt TEXT NOT NULL DEFAULT '';

COMMENT ON COLUMN public.services_content.hero_page_image_media_id IS 'Top banner image on /services.';
COMMENT ON COLUMN public.services_content.hero_page_image_alt IS 'Alt text for /services page hero image.';

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS contact_page_hero_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS contact_page_hero_image_alt TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS locations_page_hero_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS locations_page_hero_image_alt TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS careers_page_hero_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS careers_page_hero_image_alt TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS news_page_hero_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS news_page_hero_image_alt TEXT NOT NULL DEFAULT '';

COMMENT ON COLUMN public.site_settings.contact_page_hero_media_id IS 'Top banner image on /contact.';
COMMENT ON COLUMN public.site_settings.locations_page_hero_media_id IS 'Top banner image on /locations listing.';
COMMENT ON COLUMN public.site_settings.careers_page_hero_media_id IS 'Top banner image on /careers.';
COMMENT ON COLUMN public.site_settings.news_page_hero_media_id IS 'Top banner image on /news listing.';
