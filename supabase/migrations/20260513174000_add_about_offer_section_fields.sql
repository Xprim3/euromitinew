-- Make the About page "What we offer" section editable from About admin.

ALTER TABLE public.about_content
  ADD COLUMN IF NOT EXISTS offer_label TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS offer_title TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS offer_description TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS offer_fuel_title TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS offer_fuel_body TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS offer_fuel_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS offer_restaurant_title TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS offer_restaurant_body TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS offer_restaurant_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS offer_playground_title TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS offer_playground_body TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS offer_playground_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS offer_carwash_title TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS offer_carwash_body TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS offer_carwash_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS offer_mini_market_title TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS offer_mini_market_body TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS offer_mini_market_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL;

UPDATE public.about_content
SET
  offer_label = COALESCE(NULLIF(offer_label, ''), 'Çfarë ofrojmë'),
  offer_title = COALESCE(NULLIF(offer_title, ''), 'Shërbime të integruara në një ekosistem premium'),
  offer_description = COALESCE(NULLIF(offer_description, ''), 'Nga furnizimi me karburant deri te pushimi për kafe, çdo shërbim funksionon me standardet e Euromitit.'),
  offer_fuel_title = COALESCE(NULLIF(offer_fuel_title, ''), 'Karburant cilësor'),
  offer_fuel_body = COALESCE(NULLIF(offer_fuel_body, ''), 'Standarde cilësore të karburantit, operim i kujdesshëm në stacion dhe qëndrueshmëri në çdo lokacion të Euromitit.'),
  offer_restaurant_title = COALESCE(NULLIF(offer_restaurant_title, ''), 'Restaurant'),
  offer_restaurant_body = COALESCE(NULLIF(offer_restaurant_body, ''), 'Ushqim i freskët, kafe e përzgjedhur dhe ndalesë e qetë për familje dhe udhëtarë.'),
  offer_playground_title = COALESCE(NULLIF(offer_playground_title, ''), 'Këndi i lojërave'),
  offer_playground_body = COALESCE(NULLIF(offer_playground_body, ''), 'Hapësira familjare në stacione të përzgjedhura ku fëmijët pushojnë dhe luajnë të sigurt.'),
  offer_mini_market_title = COALESCE(NULLIF(offer_mini_market_title, ''), 'Mini Market'),
  offer_mini_market_body = COALESCE(NULLIF(offer_mini_market_body, ''), 'Produkte për rrugë, ushqime, pije dhe artikuj praktikë në një ndalesë të lehtë.'),
  offer_carwash_title = COALESCE(NULLIF(offer_carwash_title, ''), 'Autolarje'),
  offer_carwash_body = COALESCE(NULLIF(offer_carwash_body, ''), 'Larje e shpejtë dhe e kujdesshme për udhëtime të përditshme dhe rrugë të gjata.')
WHERE id = 1;
