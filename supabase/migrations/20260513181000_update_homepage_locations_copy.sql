-- Refresh homepage locations band copy.
-- Only replaces the previously seeded Albanian copy, preserving admin custom edits.

UPDATE public.homepage_content
SET locations_band_heading = 'Afër jush në çdo ndalesë'
WHERE locations_band_heading = 'Stacionet tona në qytet';

UPDATE public.homepage_content
SET locations_band_subtitle = 'Zgjidhni lokacionin që ju përshtatet dhe shikoni detajet e plota për shërbimet, orarin dhe informacionet e stacionit Euromiti.'
WHERE locations_band_subtitle = 'Prishtinë, Ferizaj dhe Gjilan - hapni cilëndo kartë për detaje të plota të lokacionit.';
