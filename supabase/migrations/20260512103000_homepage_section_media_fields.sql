-- Extra homepage singleton fields — public sections wired from `homepage_content` (services/restaurant/teasers + locations band copy).

ALTER TABLE public.homepage_content
  ADD COLUMN IF NOT EXISTS services_intro_title TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS services_intro_body TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS services_intro_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,

  ADD COLUMN IF NOT EXISTS restaurant_home_headline_primary TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS restaurant_home_headline_accent TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS restaurant_home_main_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS restaurant_home_float_1_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS restaurant_home_float_2_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,

  ADD COLUMN IF NOT EXISTS carwash_intro_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS mini_market_intro_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,

  ADD COLUMN IF NOT EXISTS locations_band_kicker TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS locations_band_heading TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS locations_band_subtitle TEXT NOT NULL DEFAULT '';

COMMENT ON COLUMN public.homepage_content.services_intro_title IS 'Homepage “Elite / services intro” headline (dark band).';

COMMENT ON COLUMN public.homepage_content.restaurant_home_headline_primary IS 'Restaurant homepage block — first headline line before accent.';
