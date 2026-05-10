-- Marketing copy blocks for `/locations` detail strips (distinct from bare `city`).
ALTER TABLE public.locations
  ADD COLUMN IF NOT EXISTS page_heading TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS page_summary TEXT NOT NULL DEFAULT '';

COMMENT ON COLUMN public.locations.page_heading IS 'H2 shown on `/locations` (e.g. Prishtina flagship location).';
COMMENT ON COLUMN public.locations.page_summary IS 'Lead paragraph beneath the heading.';
