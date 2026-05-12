-- Make homepage services intro highlight chips editable from the admin panel.

ALTER TABLE public.homepage_content
ADD COLUMN IF NOT EXISTS services_intro_chips_json jsonb;

UPDATE public.homepage_content
SET services_intro_chips_json = COALESCE(
  services_intro_chips_json,
  '[
    {"icon":"verified","label":"Cilësi e lartë"},
    {"icon":"eco","label":"Emetime të ulëta"}
  ]'::jsonb
)
WHERE id = 1;
