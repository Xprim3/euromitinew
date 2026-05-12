-- Editable copy for the `/services` Why Choose Euromiti section.

ALTER TABLE public.services_content
  ADD COLUMN IF NOT EXISTS why_choose_kicker TEXT NOT NULL DEFAULT 'Standardi Euromiti',
  ADD COLUMN IF NOT EXISTS why_choose_title TEXT NOT NULL DEFAULT 'Pse të zgjidhni Euromitin',
  ADD COLUMN IF NOT EXISTS why_choose_body TEXT NOT NULL DEFAULT 'Çdo ndalesë është menduar rreth besueshmërisë, komoditetit dhe shërbimit të pastër, nga hapësira e karburantit deri te tavolina.',
  ADD COLUMN IF NOT EXISTS why_choose_featured_title TEXT NOT NULL DEFAULT 'E ndërtuar rreth shërbimit të besueshëm.',
  ADD COLUMN IF NOT EXISTS why_choose_featured_body TEXT NOT NULL DEFAULT 'Nga cilësia e karburantit deri te mikpritja, Euromiti i mban shërbimet kryesore të organizuara, të pastra dhe të qëndrueshme për çdo ndalesë.';

UPDATE public.services_content
SET why_sections_json = '[
  {
    "icon": "diamond",
    "title": "Përvojë premium",
    "body": "Komoditet, kujdes dhe atmosferë e rregullt në çdo ndalesë."
  },
  {
    "icon": "map",
    "title": "Lokacione strategjike",
    "body": "Pika shërbimi të vendosura për qasje të lehtë në rrugët kryesore."
  },
  {
    "icon": "flatware",
    "title": "Ushqim cilësor",
    "body": "Ushqim i freskët dhe ambient i rehatshëm për udhëtarë dhe familje."
  },
  {
    "icon": "cleaning_services",
    "title": "Hapësira të pastra",
    "body": "Autolarje, market dhe ambiente të mirëmbajtura me kujdes të vazhdueshëm."
  }
]'::jsonb
WHERE why_sections_json = '[]'::jsonb;

COMMENT ON COLUMN public.services_content.why_choose_kicker IS 'Small label above the services why-choose section.';
COMMENT ON COLUMN public.services_content.why_choose_title IS 'Heading for the services why-choose section.';
COMMENT ON COLUMN public.services_content.why_choose_body IS 'Intro paragraph for the services why-choose section.';
COMMENT ON COLUMN public.services_content.why_choose_featured_title IS 'Large featured statement in the services why-choose section.';
COMMENT ON COLUMN public.services_content.why_choose_featured_body IS 'Featured statement body in the services why-choose section.';
