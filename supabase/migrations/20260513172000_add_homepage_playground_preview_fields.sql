-- Make the homepage playground card editable with the other Services Preview cards.

ALTER TABLE public.homepage_content
  ADD COLUMN IF NOT EXISTS playground_intro_text TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS playground_intro_media_id UUID REFERENCES public.media_uploads (id) ON DELETE SET NULL;

UPDATE public.homepage_content
SET playground_intro_text = COALESCE(
  NULLIF(playground_intro_text, ''),
  'Hapësira të sigurta dhe argëtuese ku fëmijët mund të luajnë gjatë ndalesës.'
)
WHERE id = 1;
