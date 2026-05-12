-- Editable bullet lists for all `/services` page sections.

ALTER TABLE public.services_content
  ADD COLUMN IF NOT EXISTS restaurant_highlights_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS carwash_highlights_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS mini_market_highlights_json JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.services_content.restaurant_highlights_json IS 'Marketing bullets for restaurant section (plain strings JSON array).';
COMMENT ON COLUMN public.services_content.carwash_highlights_json IS 'Marketing bullets for carwash section (plain strings JSON array).';
COMMENT ON COLUMN public.services_content.mini_market_highlights_json IS 'Marketing bullets for mini market section (plain strings JSON array).';

ALTER TABLE public.services_content
DROP CONSTRAINT IF EXISTS services_restaurant_highlights_json_array;

ALTER TABLE public.services_content
DROP CONSTRAINT IF EXISTS services_carwash_highlights_json_array;

ALTER TABLE public.services_content
DROP CONSTRAINT IF EXISTS services_mini_market_highlights_json_array;

ALTER TABLE public.services_content
ADD CONSTRAINT services_restaurant_highlights_json_array CHECK (jsonb_typeof(restaurant_highlights_json) = 'array');

ALTER TABLE public.services_content
ADD CONSTRAINT services_carwash_highlights_json_array CHECK (jsonb_typeof(carwash_highlights_json) = 'array');

ALTER TABLE public.services_content
ADD CONSTRAINT services_mini_market_highlights_json_array CHECK (jsonb_typeof(mini_market_highlights_json) = 'array');

UPDATE public.services_content
SET
  restaurant_highlights_json = CASE
    WHEN restaurant_highlights_json = '[]'::jsonb THEN
      '["Fresh food", "Comfortable dining space", "Quality service", "Premium experience"]'::jsonb
    ELSE restaurant_highlights_json
  END,
  carwash_highlights_json = CASE
    WHEN carwash_highlights_json = '[]'::jsonb THEN
      '["Clean vehicle care", "Professional washing service", "Convenient location access", "Practical for everyday drivers"]'::jsonb
    ELSE carwash_highlights_json
  END,
  mini_market_highlights_json = CASE
    WHEN mini_market_highlights_json = '[]'::jsonb THEN
      '["Drinks and snacks", "Travel essentials", "Daily products", "Convenient shopping"]'::jsonb
    ELSE mini_market_highlights_json
  END
WHERE id = 1;
