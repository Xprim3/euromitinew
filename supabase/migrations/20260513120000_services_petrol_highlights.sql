-- Editable petrol bullet list on `/services` (stored as JSON string array).

ALTER TABLE public.services_content
  ADD COLUMN IF NOT EXISTS petrol_highlights_json JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.services_content.petrol_highlights_json IS 'Marketing bullets for petrol section (plain strings JSON array).';

ALTER TABLE public.services_content
DROP CONSTRAINT IF EXISTS services_petrol_highlights_json_array;

ALTER TABLE public.services_content
ADD CONSTRAINT services_petrol_highlights_json_array CHECK (jsonb_typeof(petrol_highlights_json) = 'array');
