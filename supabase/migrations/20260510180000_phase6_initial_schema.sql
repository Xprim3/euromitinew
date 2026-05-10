/*
  Euromiti — Phase 6 initial schema (Supabase / Postgres).

  Apply with Supabase CLI (`supabase db push`) or paste into SQL Editor.
  RLS: tighten service-role usage in Edge Functions / server routes as you wire the app.
*/

-- ---------------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------------

CREATE TYPE public.location_amenity AS ENUM (
  'petrol',
  'restaurant',
  'carwash',
  'mini_market',
  'ev'
);

CREATE TYPE public.fuel_price_label_status AS ENUM (
  'active',
  'updated'
);

CREATE TYPE public.news_post_status AS ENUM (
  'draft',
  'published',
  'archived'
);

-- ---------------------------------------------------------------------------
-- ADMINS (Console operators; links to Supabase Auth)
-- Purpose: Know who may use the admin API / editor. Auth still lives in auth.users.
-- Public site: Never shown.
-- Admin: Managed by super-admins (invite / insert). Optional self row on first login hook.
-- ---------------------------------------------------------------------------

CREATE TABLE public.admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.admins IS 'Back-office users linked 1:1 to auth.users; use for RLS and audit FKs.';

-- ---------------------------------------------------------------------------
-- MEDIA_UPLOADS (Storage metadata; files live in Storage buckets)
-- Purpose: Canonical record for images/documents used across pages and posts.
-- Relationships: Referenced by news_posts, optional on locations; homepage/restaurant can store media UUIDs in JSON or add FK columns later.
-- Public site: URLs (public bucket) or signed URLs used in <Image src=…>, galleries, news hero.
-- Admin: Upload, replace, alt text, delete (with referential checks in app layer).
-- ---------------------------------------------------------------------------

CREATE TABLE public.media_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  storage_bucket TEXT NOT NULL DEFAULT 'euromiti-media',
  object_path TEXT NOT NULL,
  public_url TEXT,
  mime_type TEXT NOT NULL,
  byte_size BIGINT NOT NULL CHECK (byte_size >= 0),
  original_filename TEXT,
  alt_text TEXT,
  uploaded_by UUID REFERENCES public.admins (user_id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (storage_bucket, object_path)
);

COMMENT ON TABLE public.media_uploads IS 'Metadata for Supabase Storage objects; object_path is the key inside the bucket.';

CREATE INDEX idx_media_uploads_created_at ON public.media_uploads (created_at DESC);

-- ---------------------------------------------------------------------------
-- LOCATIONS (Stations / forecourts)
-- Purpose: Locations page, contact section, restaurant “stations” band, maps links.
-- Relationships: Optional hero_image_id → media_uploads. Hospitality email on-site (currently mock per location).
-- Public site: City, address, phone, hours, services chips, maps link, concierge email (if you expose it).
-- Admin: Full CRUD per station, publish toggle, ordering, optional hero image pick.
-- ---------------------------------------------------------------------------

CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  slug TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  opening_hours TEXT NOT NULL,
  services public.location_amenity [] NOT NULL DEFAULT '{}',
  google_maps_url TEXT NOT NULL,
  hospitality_email TEXT,
  hero_image_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.locations IS 'Forecourt/station records for marketing and contact surfaces.';

CREATE INDEX idx_locations_sort ON public.locations (is_published, sort_order, city);

-- ---------------------------------------------------------------------------
-- FUEL_PRICES (Retail pump prices shown on homepage “Today’s Fuel Rates”)
-- Purpose: One logical price list (network-wide MVP). product_key maps to UI cards (diesel, euro95, lpg).
-- Relationships: None required; optional location_id later for per-station pricing.
-- Public site: Product label, €/L price, “live/updated” tone, last-updated display.
-- Admin: Edit prices, status flag, timestamps (or trigger on update).
-- ---------------------------------------------------------------------------

CREATE TABLE public.fuel_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  product_key TEXT NOT NULL UNIQUE,
  fuel_type TEXT NOT NULL,
  price_numeric NUMERIC(10, 3) NOT NULL CHECK (price_numeric >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  label_status public.fuel_price_label_status NOT NULL DEFAULT 'active',
  effective_from TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.fuel_prices IS 'Network default pump prices by product SKU (homepage fuel band).';

-- ---------------------------------------------------------------------------
-- NEWS_POSTS (Archive + article pages)
-- Purpose: `/news` list and `/news/[slug]` body.
-- Relationships: hero_media_id → featured image row in media_uploads.
-- Public site: Only rows with status=published: title, slug, excerpt, date, category, hero image+alt, body paragraphs.
-- Admin: Draft/publish, slug, SEO fields, body (paragraphs JSON), hero asset, category.
-- ---------------------------------------------------------------------------

CREATE TABLE public.news_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  slug TEXT NOT NULL UNIQUE,
  status public.news_post_status NOT NULL DEFAULT 'draft',
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category TEXT,
  published_at TIMESTAMPTZ,
  hero_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  hero_image_alt TEXT,
  body JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT news_posts_slug_format CHECK (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  CONSTRAINT news_posts_body_is_array CHECK (jsonb_typeof (body) = 'array')
);

COMMENT ON TABLE public.news_posts IS 'Editorial posts; body is JSON array of paragraph strings.';
COMMENT ON COLUMN public.news_posts.body IS 'Example: ["First paragraph...", "Second..."]';

CREATE INDEX idx_news_posts_published ON public.news_posts (status, published_at DESC NULLS LAST);

-- ---------------------------------------------------------------------------
-- HOMEPAGE_CONTENT (Key/value blocks for hero, fuel band copy, modular sections)
-- Purpose: Editable strings/paragraphs/home modules without redeploy (aligned with Phase 5 admin homepage UI).
-- Relationships: Values may reference media UUIDs as plain text URLs or future *_media_id columns.
-- Public site: Resolved map (section + field_key) merged into homepage components.
-- Admin: Per-field textarea inputs; locale column for future i18n.
-- ---------------------------------------------------------------------------

CREATE TABLE public.homepage_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  section TEXT NOT NULL,
  field_key TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.admins (user_id) ON DELETE SET NULL,
  UNIQUE (section, field_key, locale)
);

COMMENT ON TABLE public.homepage_content IS 'CMS key-value rows for the marketing homepage.';

-- ---------------------------------------------------------------------------
-- RESTAURANT_CONTENT (Same pattern for /restaurant editorial sections)
-- Purpose: Copy for hero, galleries labels, reservation band, Skajnom, etc.
-- Relationships: Same as homepage — media refs can be UUID strings in value or dedicated columns later.
-- Public site: Restaurant route reads component + field_key for each block.
-- Admin: Table/section editor mirroring Phase 5 restaurant admin screen.
-- ---------------------------------------------------------------------------

CREATE TABLE public.restaurant_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  component TEXT NOT NULL,
  field_key TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.admins (user_id) ON DELETE SET NULL,
  UNIQUE (component, field_key, locale)
);

COMMENT ON TABLE public.restaurant_content IS 'CMS key-value rows for the restaurant marketing page.';

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY (baseline)
-- ---------------------------------------------------------------------------

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.media_uploads ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.fuel_prices ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.restaurant_content ENABLE ROW LEVEL SECURITY;

-- Helper: is the current JWT an admin?
CREATE OR REPLACE FUNCTION public.is_admin () RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER
SET
  search_path = public AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins a
    WHERE a.user_id = auth.uid()
  );
$$;

-- Admins: only rows for self (or expand later for super-admin listing)
CREATE POLICY "Admins read self" ON public.admins FOR
SELECT
  TO authenticated USING (user_id = auth.uid ());

-- Public read for published marketing data (anon + authenticated visitors)
CREATE POLICY "Public read published locations" ON public.locations FOR
SELECT
  TO anon,
  authenticated USING (is_published = TRUE);

CREATE POLICY "Public read fuel prices" ON public.fuel_prices FOR
SELECT
  TO anon,
  authenticated USING (TRUE);

CREATE POLICY "Public read published news" ON public.news_posts FOR
SELECT
  TO anon,
  authenticated USING (status = 'published');

CREATE POLICY "Public read homepage content" ON public.homepage_content FOR
SELECT
  TO anon,
  authenticated USING (TRUE);

CREATE POLICY "Public read restaurant content" ON public.restaurant_content FOR
SELECT
  TO anon,
  authenticated USING (TRUE);

-- Media: allow read if you use public URLs only; else use signed URLs from service role and REVOKE anon select.
-- Here: authenticated public can read metadata (tighten to “published only” in production if needed).
CREATE POLICY "Public read media metadata" ON public.media_uploads FOR
SELECT
  TO anon,
  authenticated USING (TRUE);

-- Admin full access (authenticated + is_admin)
CREATE POLICY "Admins manage locations" ON public.locations FOR ALL TO authenticated USING (public.is_admin ())
WITH
  CHECK (public.is_admin ());

CREATE POLICY "Admins manage fuel_prices" ON public.fuel_prices FOR ALL TO authenticated USING (public.is_admin ())
WITH
  CHECK (public.is_admin ());

CREATE POLICY "Admins manage news_posts" ON public.news_posts FOR ALL TO authenticated USING (public.is_admin ())
WITH
  CHECK (public.is_admin ());

CREATE POLICY "Admins manage homepage_content" ON public.homepage_content FOR ALL TO authenticated USING (public.is_admin ())
WITH
  CHECK (public.is_admin ());

CREATE POLICY "Admins manage restaurant_content" ON public.restaurant_content FOR ALL TO authenticated USING (public.is_admin ())
WITH
  CHECK (public.is_admin ());

CREATE POLICY "Admins manage media_uploads" ON public.media_uploads FOR ALL TO authenticated USING (public.is_admin ())
WITH
  CHECK (public.is_admin ());

-- Bootstrap: INSERT first admins row via Supabase Dashboard / SQL Editor (service role bypasses RLS).
-- Do not grant INSERT on admins to anon/authenticated (would allow self-promotion).

-- Optional: allow admins to list all admins for a team screen (revoke if too open)
CREATE POLICY "Admins read all admins" ON public.admins FOR
SELECT
  TO authenticated USING (public.is_admin ());

-- ---------------------------------------------------------------------------
-- updated_at triggers (optional convenience)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at () RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER tr_admins_updated BEFORE
UPDATE ON public.admins FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at ();

CREATE TRIGGER tr_locations_updated BEFORE
UPDATE ON public.locations FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at ();

CREATE TRIGGER tr_news_posts_updated BEFORE
UPDATE ON public.news_posts FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at ();

CREATE TRIGGER tr_homepage_content_updated BEFORE
UPDATE ON public.homepage_content FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at ();

CREATE TRIGGER tr_restaurant_content_updated BEFORE
UPDATE ON public.restaurant_content FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at ();

CREATE TRIGGER tr_fuel_prices_updated BEFORE
UPDATE ON public.fuel_prices FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at ();
