/*
  Euromiti — Phase 10 structured editorial schema (replacing KV homepage/restaurant CMS).

  Run AFTER 20260510180000_phase6_initial_schema.sql (+ optional seed migrations).

  CHANGES SUMMARY:
  - Renames legacy key-value homepage_content / restaurant_content tables (policies stripped on legacy).
  - Introduces singleton tables (CHECK id = 1) where a single editable document fits the model.
  - Extends locations, media_uploads, fuel_prices; adds jobs, contact_info, site_settings, structured pages.
*/

-- ---------------------------------------------------------------------------
-- 0 · Detach KV CMS tables — keep backup, lock down anon access
-- ---------------------------------------------------------------------------

ALTER TABLE public.homepage_content RENAME TO homepage_content_kv_legacy;

ALTER TABLE public.restaurant_content RENAME TO restaurant_content_kv_legacy;

DROP TRIGGER IF EXISTS tr_homepage_content_updated ON public.homepage_content_kv_legacy;

DROP TRIGGER IF EXISTS tr_restaurant_content_updated ON public.restaurant_content_kv_legacy;

DROP POLICY IF EXISTS "Public read homepage content" ON public.homepage_content_kv_legacy;

DROP POLICY IF EXISTS "Admins manage homepage_content" ON public.homepage_content_kv_legacy;

DROP POLICY IF EXISTS "Public read restaurant content" ON public.restaurant_content_kv_legacy;

DROP POLICY IF EXISTS "Admins manage restaurant_content" ON public.restaurant_content_kv_legacy;

-- KV backups: admins/service-role only (no anon policy)
ALTER TABLE public.homepage_content_kv_legacy ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.restaurant_content_kv_legacy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Legacy KV homepage admin-only" ON public.homepage_content_kv_legacy FOR ALL TO authenticated USING (
  public.is_admin ()
)
WITH
  CHECK (public.is_admin ());

CREATE POLICY "Legacy KV restaurant admin-only" ON public.restaurant_content_kv_legacy FOR ALL TO authenticated USING (
  public.is_admin ()
)
WITH
  CHECK (public.is_admin ());

-- ---------------------------------------------------------------------------
-- 1 · MEDIA_ADDONS (extend existing media_uploads)
-- ---------------------------------------------------------------------------

ALTER TABLE public.media_uploads
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS usage_section TEXT;

COMMENT ON COLUMN public.media_uploads.category IS 'Logical bucket: homepage, footer, restaurant, careers, misc.';

COMMENT ON COLUMN public.media_uploads.usage_section IS 'Human hint for editors: e.g. "home-hero", "footer-logo".';

-- ---------------------------------------------------------------------------
-- 2 · SITE_SETTINGS (singleton) — branding + footer prose + social URLs
-- ---------------------------------------------------------------------------

CREATE TABLE public.site_settings (
  id SMALLINT PRIMARY KEY CHECK (id = 1),
  logo_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  company_name TEXT NOT NULL DEFAULT 'Euromiti',
  social_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  footer_body TEXT NOT NULL DEFAULT '',
  footer_copyright_line TEXT DEFAULT 'Euromiti Kosovo',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.admins (user_id) ON DELETE SET NULL,
  CONSTRAINT site_settings_valid_social CHECK (jsonb_typeof (social_links) = 'array')
);

COMMENT ON TABLE public.site_settings IS 'Singleton (id must be 1) — navbar/footer brand knobs.';

COMMENT ON COLUMN public.site_settings.social_links IS 'JSON array of { "platform", "url" } objects for global social URLs.';

INSERT INTO public.site_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 3 · HOMEPAGE_CONTENT — structured homepage singleton
-- ---------------------------------------------------------------------------

CREATE TABLE public.homepage_content (
  id SMALLINT PRIMARY KEY CHECK (id = 1),
  hero_headline_line1 TEXT NOT NULL DEFAULT '',
  hero_headline_line2 TEXT NOT NULL DEFAULT '',
  hero_subtitle TEXT NOT NULL DEFAULT '',
  hero_image_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  hero_cta_primary_label TEXT NOT NULL DEFAULT '',
  hero_cta_primary_href TEXT NOT NULL DEFAULT '/services',
  hero_cta_secondary_label TEXT NOT NULL DEFAULT '',
  hero_cta_secondary_href TEXT NOT NULL DEFAULT '/locations',
  about_preview_text TEXT NOT NULL DEFAULT '',
  restaurant_highlight_text TEXT NOT NULL DEFAULT '',
  carwash_intro_text TEXT NOT NULL DEFAULT '',
  mini_market_intro_text TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.admins (user_id) ON DELETE SET NULL
);

COMMENT ON TABLE public.homepage_content IS 'Singleton homepage copy + hero CTAs matching marketing layout.';

INSERT INTO public.homepage_content (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER tr_homepage_content_updated BEFORE
UPDATE ON public.homepage_content FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at ();

-- ---------------------------------------------------------------------------
-- 4 · ABOUT_CONTENT — singleton (+ JSON value cards)
-- ---------------------------------------------------------------------------

CREATE TABLE public.about_content (
  id SMALLINT PRIMARY KEY CHECK (id = 1),
  hero_title TEXT NOT NULL DEFAULT '',
  hero_subtitle TEXT NOT NULL DEFAULT '',
  company_story JSONB NOT NULL DEFAULT '[]'::jsonb,
  mission_title TEXT NOT NULL DEFAULT '',
  mission_body TEXT NOT NULL DEFAULT '',
  vision_title TEXT NOT NULL DEFAULT '',
  vision_body TEXT NOT NULL DEFAULT '',
  values_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  hero_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  story_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  gallery_media_ids UUID [] DEFAULT '{}'::uuid[],
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.admins (user_id) ON DELETE SET NULL,
  CONSTRAINT about_story_array CHECK (jsonb_typeof (company_story) = 'array'),
  CONSTRAINT about_values_array CHECK (jsonb_typeof (values_json) = 'array')
);

COMMENT ON TABLE public.about_content IS 'Singleton About page prose; gallery_media_ids preserves editor ordering.';

COMMENT ON COLUMN public.about_content.values_json IS 'Array of cards: [{ "title", "body", "icon_material"? }].';

INSERT INTO public.about_content (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER tr_about_content_updated BEFORE
UPDATE ON public.about_content FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at ();

-- ---------------------------------------------------------------------------
-- 5 · SERVICES_CONTENT — four vertical sections (+ optional WHY grid stored JSON)
-- ---------------------------------------------------------------------------

CREATE TABLE public.services_content (
  id SMALLINT PRIMARY KEY CHECK (id = 1),
  petrol_section_title TEXT NOT NULL DEFAULT '',
  petrol_description TEXT NOT NULL DEFAULT '',
  petrol_image_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  restaurant_section_title TEXT NOT NULL DEFAULT '',
  restaurant_description TEXT NOT NULL DEFAULT '',
  restaurant_image_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  carwash_section_title TEXT NOT NULL DEFAULT '',
  carwash_description TEXT NOT NULL DEFAULT '',
  carwash_image_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  mini_market_section_title TEXT NOT NULL DEFAULT '',
  mini_market_description TEXT NOT NULL DEFAULT '',
  mini_market_image_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  hero_page_title TEXT DEFAULT 'Services',
  hero_page_subtitle TEXT DEFAULT '',
  why_sections_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.admins (user_id) ON DELETE SET NULL,
  CONSTRAINT services_why_json CHECK (
    jsonb_typeof (why_sections_json) = 'array'
  )
);

COMMENT ON TABLE public.services_content IS 'Singleton describing /services pillar layout.';

COMMENT ON COLUMN public.services_content.why_sections_json IS 'Optional why-choose-us cards [{ "title", "body", "icon" }].';

INSERT INTO public.services_content (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER tr_services_content_updated BEFORE
UPDATE ON public.services_content FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at ();

-- ---------------------------------------------------------------------------
-- 6 · LOCATIONS — align naming + galleries
-- ---------------------------------------------------------------------------

ALTER TABLE public.locations RENAME COLUMN hero_image_id TO main_media_id;

ALTER TABLE public.locations RENAME COLUMN hospitality_email TO contact_email;

ALTER TABLE public.locations RENAME COLUMN is_published TO is_active;

DROP INDEX IF EXISTS public.idx_locations_sort;

CREATE INDEX idx_locations_active_sort ON public.locations (is_active, sort_order, city);

CREATE TABLE public.location_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  location_id UUID NOT NULL REFERENCES public.locations (id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES public.media_uploads (id) ON DELETE CASCADE,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  UNIQUE (location_id, sort_order),
  UNIQUE (location_id, media_id)
);

CREATE INDEX idx_location_images_loc ON public.location_images (location_id, sort_order);

COMMENT ON TABLE public.location_images IS 'Ordered gallery rows for Locations page + teaser surfaces.';

-- Refresh locations policy wording (column rename)
DROP POLICY IF EXISTS "Public read published locations" ON public.locations;

CREATE POLICY "Public read active locations" ON public.locations FOR
SELECT
  TO anon,
  authenticated USING (is_active = TRUE);

-- Replace admin policy cleanly
DROP POLICY IF EXISTS "Admins manage locations" ON public.locations;

CREATE POLICY "Admins manage locations v2" ON public.locations FOR ALL TO authenticated USING (public.is_admin ())
WITH
  CHECK (public.is_admin ());

-- ---------------------------------------------------------------------------
-- 7 · RESTAURANT_CONTENT — structured singleton
-- ---------------------------------------------------------------------------

CREATE TABLE public.restaurant_content (
  id SMALLINT PRIMARY KEY CHECK (id = 1),
  hero_title TEXT NOT NULL DEFAULT '',
  hero_subtitle TEXT NOT NULL DEFAULT '',
  hero_description TEXT NOT NULL DEFAULT '',
  hero_image_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  opening_hours TEXT NOT NULL DEFAULT '',
  contact_phone TEXT,
  contact_email TEXT,
  contact_notes TEXT,
  menu_highlights_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  gallery_media_ids UUID [] DEFAULT '{}'::uuid[],
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.admins (user_id) ON DELETE SET NULL,
  CONSTRAINT restaurant_menu_json CHECK (
    jsonb_typeof (menu_highlights_json) = 'array'
  )
);

COMMENT ON TABLE public.restaurant_content IS 'Singleton /restaurant headline + highlights + imagery ordering.';

COMMENT ON COLUMN public.restaurant_content.menu_highlights_json IS 'Menu highlight cards [{ "title", "body", "image_media_id" }].';

COMMENT ON COLUMN public.restaurant_content.gallery_media_ids IS 'Additional ordered gallery FKs referencing media_uploads.';

INSERT INTO public.restaurant_content (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER tr_restaurant_content_struct_updated BEFORE
UPDATE ON public.restaurant_content FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at ();

-- ---------------------------------------------------------------------------
-- 8 · NEWS_POSTS tweaks (explicit published flag semantics already via status enum)
-- ---------------------------------------------------------------------------

ALTER TABLE public.news_posts
ADD COLUMN IF NOT EXISTS teaser_label TEXT;

COMMENT ON COLUMN public.news_posts.teaser_label IS 'Optional badge shown on archives (Innovation / Network update).';

-- ---------------------------------------------------------------------------
-- 9 · JOBS — Careers listings
-- ---------------------------------------------------------------------------

CREATE TYPE public.job_apply_channel AS ENUM ('email', 'phone', 'url', 'instructions');

CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  location_city TEXT,
  summary TEXT DEFAULT '',
  description JSONB NOT NULL DEFAULT '[]'::jsonb,
  requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  apply_channel public.job_apply_channel NOT NULL DEFAULT 'email',
  apply_email TEXT,
  apply_phone TEXT,
  apply_url TEXT,
  apply_instructions TEXT,
  hero_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  posted_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT jobs_slug_chk CHECK (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  CONSTRAINT jobs_desc_array_chk CHECK (
    jsonb_typeof (description) = 'array'
  ),
  CONSTRAINT jobs_req_array_chk CHECK (
    jsonb_typeof (requirements) = 'array'
  )
);

COMMENT ON TABLE public.jobs IS 'Careers postings; anon reads only rows with is_active = true.';

CREATE INDEX idx_jobs_active ON public.jobs (is_active, posted_at DESC NULLS LAST);

CREATE TRIGGER tr_jobs_updated BEFORE
UPDATE ON public.jobs FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at ();

-- ---------------------------------------------------------------------------
--10 · CONTACT_INFO — HQ singleton (distinct from locations[] rows)
-- ---------------------------------------------------------------------------

CREATE TABLE public.contact_info (
  id SMALLINT PRIMARY KEY CHECK (id = 1),
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  hq_address TEXT NOT NULL DEFAULT '',
  map_link TEXT NOT NULL DEFAULT '',
  social_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  weekday_hours TEXT,
  weekend_hours TEXT,
  careers_email TEXT,
  careers_apply_instructions TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.admins (user_id) ON DELETE SET NULL,
  CONSTRAINT contact_social_chk CHECK (
    jsonb_typeof (social_links) = 'array'
  )
);

COMMENT ON TABLE public.contact_info IS 'Singleton HQ + press/careers contact fields; overlaps site_settings.social — prefer consolidating later.';

INSERT INTO public.contact_info (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER tr_contact_info_updated BEFORE
UPDATE ON public.contact_info FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at ();

-- ---------------------------------------------------------------------------
--11 · FUEL_PRICES — editorial visibility toggle
-- ---------------------------------------------------------------------------

ALTER TABLE public.fuel_prices
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

COMMENT ON COLUMN public.fuel_prices.label_status IS 'Marketing tone (legacy); pair with is_active for visibility.';

UPDATE public.fuel_prices SET is_active = TRUE WHERE TRUE;

DROP POLICY IF EXISTS "Public read fuel prices" ON public.fuel_prices;

CREATE POLICY "Public read active fuel rows" ON public.fuel_prices FOR
SELECT
  TO anon,
  authenticated USING (is_active = TRUE);

DROP POLICY IF EXISTS "Admins manage fuel_prices" ON public.fuel_prices;

CREATE POLICY "Admins manage fuel_prices_v2" ON public.fuel_prices FOR ALL TO authenticated USING (public.is_admin ())
WITH
  CHECK (public.is_admin ());

-- ---------------------------------------------------------------------------
-- RLS · New structured tables & jobs
-- ---------------------------------------------------------------------------

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.services_content ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.location_images ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.restaurant_content ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site settings" ON public.site_settings FOR
SELECT
  TO anon,
  authenticated USING (TRUE);

CREATE POLICY "Public read homepage content singleton" ON public.homepage_content FOR
SELECT
  TO anon,
  authenticated USING (TRUE);

CREATE POLICY "Public read about singleton" ON public.about_content FOR
SELECT
  TO anon,
  authenticated USING (TRUE);

CREATE POLICY "Public read services singleton" ON public.services_content FOR
SELECT
  TO anon,
  authenticated USING (TRUE);

CREATE POLICY "Public read restaurant singleton" ON public.restaurant_content FOR
SELECT
  TO anon,
  authenticated USING (TRUE);

CREATE POLICY "Public read contact singleton" ON public.contact_info FOR
SELECT
  TO anon,
  authenticated USING (TRUE);

CREATE POLICY "Public read location galleries" ON public.location_images FOR
SELECT
  TO anon,
  authenticated USING (
    EXISTS (
      SELECT 1
      FROM public.locations l
      WHERE
        l.id = location_images.location_id
        AND l.is_active = TRUE
    )
  );

CREATE POLICY "Public read jobs active" ON public.jobs FOR
SELECT
  TO anon,
  authenticated USING (is_active = TRUE);

-- Admin write access
CREATE POLICY "Admin manage site settings" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin ())
WITH
  CHECK (public.is_admin ());

CREATE POLICY "Admin manage homepage singleton" ON public.homepage_content FOR ALL TO authenticated USING (public.is_admin ())
WITH
  CHECK (public.is_admin ());

CREATE POLICY "Admin manage about singleton" ON public.about_content FOR ALL TO authenticated USING (public.is_admin ())
WITH
  CHECK (public.is_admin ());

CREATE POLICY "Admin manage services singleton" ON public.services_content FOR ALL TO authenticated USING (public.is_admin ())
WITH
  CHECK (public.is_admin ());

CREATE POLICY "Admin manage restaurant singleton v2" ON public.restaurant_content FOR ALL TO authenticated USING (public.is_admin ())
WITH
  CHECK (public.is_admin ());

CREATE POLICY "Admin manage contact singleton" ON public.contact_info FOR ALL TO authenticated USING (public.is_admin ())
WITH
  CHECK (public.is_admin ());

CREATE POLICY "Admin manage location images" ON public.location_images FOR ALL TO authenticated USING (public.is_admin ())
WITH
  CHECK (public.is_admin ());

CREATE POLICY "Admin manage jobs" ON public.jobs FOR ALL TO authenticated USING (public.is_admin ())
WITH
  CHECK (public.is_admin ());
