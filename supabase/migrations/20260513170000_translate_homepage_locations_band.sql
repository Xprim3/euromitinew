-- Translate existing seeded homepage locations band copy to Albanian.
-- Only replaces original English seed values, preserving admin custom edits.

UPDATE public.homepage_content
SET locations_band_kicker = 'Lokacionet'
WHERE locations_band_kicker = 'Locations';

UPDATE public.homepage_content
SET locations_band_heading = 'Stacionet tona në qytet'
WHERE locations_band_heading = 'Our City Stations';

UPDATE public.homepage_content
SET locations_band_subtitle = 'Prishtinë, Ferizaj dhe Gjilan - hapni cilëndo kartë për detaje të plota të lokacionit.'
WHERE locations_band_subtitle = 'Prishtina, Ferizaj, and Gjilan - tap any card to view full location details.';
