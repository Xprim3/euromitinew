-- Translate existing seeded homepage restaurant highlight copy to Albanian.
-- Only replaces the original English seed values, preserving admin custom edits.

UPDATE public.homepage_content
SET restaurant_home_headline_primary = 'Shije të kuruara.'
WHERE restaurant_home_headline_primary = 'Curated Dining.';

UPDATE public.homepage_content
SET restaurant_home_headline_accent = 'Pushim i rafinuar.'
WHERE restaurant_home_headline_accent = 'Refined Pause.';

UPDATE public.homepage_content
SET restaurant_highlight_text = 'Aty ku përbërësit vendorë takohen me përgatitje të kujdesshme. Çdo pjatë sjell freski, cilësi dhe një pushim të këndshëm gjatë rrugës.'
WHERE restaurant_highlight_text = 'Where local harvests meet global mastery. Every dish is a narrative of freshness and quality downtime.';
