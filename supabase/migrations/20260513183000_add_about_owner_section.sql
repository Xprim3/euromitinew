-- Owner / founder section for the public About page.

ALTER TABLE public.about_content
  ADD COLUMN IF NOT EXISTS owner_section_kicker TEXT NOT NULL DEFAULT 'Pronari',
  ADD COLUMN IF NOT EXISTS owner_section_title TEXT NOT NULL DEFAULT 'Njerëzit pas standardit Euromiti',
  ADD COLUMN IF NOT EXISTS owner_name TEXT NOT NULL DEFAULT 'Pronari i Euromitit',
  ADD COLUMN IF NOT EXISTS owner_role TEXT NOT NULL DEFAULT 'Themelues dhe drejtues i kompanisë',
  ADD COLUMN IF NOT EXISTS owner_body TEXT NOT NULL DEFAULT 'Euromiti është ndërtuar me vizion vendor: të krijojë ndalesa të besueshme ku karburanti, ushqimi, marketi dhe shërbimi funksionojnë me kujdes të njëjtë. Që nga fillimi, fokusi ka qenë tek cilësia, pastërtia dhe respekti ndaj klientit.',
  ADD COLUMN IF NOT EXISTS owner_media_id UUID REFERENCES public.media_uploads(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.about_content.owner_section_kicker IS 'Small label above the owner/founder section.';
COMMENT ON COLUMN public.about_content.owner_section_title IS 'Main heading for the owner/founder section.';
COMMENT ON COLUMN public.about_content.owner_name IS 'Owner/founder display name.';
COMMENT ON COLUMN public.about_content.owner_role IS 'Owner/founder role or title.';
COMMENT ON COLUMN public.about_content.owner_body IS 'Owner/founder company message.';
COMMENT ON COLUMN public.about_content.owner_media_id IS 'Portrait or owner image shown on the public About page.';
