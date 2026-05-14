-- Public /contact headquarters intro (eyebrow, title, body) — editable in admin Site & contact.

ALTER TABLE public.contact_info
  ADD COLUMN IF NOT EXISTS hq_eyebrow TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hq_heading TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hq_description TEXT NOT NULL DEFAULT '';

COMMENT ON COLUMN public.contact_info.hq_eyebrow IS 'Upper label above the HQ heading on /contact.';
COMMENT ON COLUMN public.contact_info.hq_heading IS 'Main HQ section heading on /contact.';
COMMENT ON COLUMN public.contact_info.hq_description IS 'Intro paragraph under the HQ heading on /contact.';

UPDATE public.contact_info
SET
  hq_eyebrow = COALESCE(NULLIF(trim(hq_eyebrow), ''), 'Euromiti · Prishtina'),
  hq_heading = COALESCE(NULLIF(trim(hq_heading), ''), 'Selia qendrore'),
  hq_description = COALESCE(
    NULLIF(trim(hq_description), ''),
    $desc$
Bisedat për bashkëpunime, kujdesi për mysafirët dhe pyetjet e medias i drejtohen ekipit tonë në qendër. Për kërkesat me shkrim, përdorni emailin — ne përgjigjemi gjatë orarëve të renditur më poshtë.
$desc$
  )
WHERE id = 1;
