-- Make the homepage About preview fully editable from Homepage admin.

ALTER TABLE public.homepage_content
  ADD COLUMN IF NOT EXISTS about_preview_kicker TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_preview_headline TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_preview_eyebrow TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_preview_why_title TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_preview_why_text TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_preview_button_label TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_preview_button_href TEXT NOT NULL DEFAULT '/about',
  ADD COLUMN IF NOT EXISTS about_preview_image_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL;

UPDATE public.homepage_content
SET
  about_preview_kicker = COALESCE(NULLIF(about_preview_kicker, ''), 'Rreth nesh'),
  about_preview_headline = COALESCE(NULLIF(about_preview_headline, ''), 'Të ndërtuar në Kosovë. Të besuar në çdo rrugë.'),
  about_preview_eyebrow = COALESCE(NULLIF(about_preview_eyebrow, ''), 'Kush jemi'),
  about_preview_why_title = COALESCE(NULLIF(about_preview_why_title, ''), 'Pse të na zgjidhni'),
  about_preview_why_text = COALESCE(NULLIF(about_preview_why_text, ''), 'Cilësi e qëndrueshme e karburantit, shërbime praktike në një vend dhe ekip i fokusuar në shpejtësi, siguri dhe kujdes premium.'),
  about_preview_button_label = COALESCE(NULLIF(about_preview_button_label, ''), 'Lexo më shumë për ne'),
  about_preview_button_href = COALESCE(NULLIF(about_preview_button_href, ''), '/about')
WHERE id = 1;

UPDATE public.homepage_content
SET about_preview_text = 'Euromiti është kompani vendore në Kosovë për karburante dhe shërbime rrugore, me standarde të besueshme në Prishtinë, Ferizaj dhe Gjilan.'
WHERE about_preview_text = 'Euromiti is a Kosovo-grown fuel and roadside service company operating with dependable standards in Prishtina, Ferizaj, and Gjilan.';
