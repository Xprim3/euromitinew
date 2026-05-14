-- Seed the current visible Contact page and Footer content into CMS singleton tables.
-- Existing admin-edited non-empty text values are preserved.
-- The current public header/footer brand is text-only, so logo_media_id remains unchanged.

INSERT INTO public.contact_info (
  id,
  phone,
  email,
  hq_address,
  map_link,
  social_links,
  weekday_hours,
  weekend_hours,
  careers_email,
  careers_apply_instructions
)
VALUES (
  1,
  '+383 44 000 100',
  'hello@euromiti.com',
  'Sheshi Nënë Tereza, 10000 Prishtina · Kosovo',
  'https://maps.google.com/?q=Prishtina+Kosovo',
  '[]'::jsonb,
  'Mon – Fri · 08:30 – 18:00 (CET)',
  'Sat · 09:00 – 14:00',
  'careers@euromiti.com',
  'Apply by Email'
)
ON CONFLICT (id) DO UPDATE SET
  phone = COALESCE(NULLIF(public.contact_info.phone, ''), excluded.phone),
  email = COALESCE(NULLIF(public.contact_info.email, ''), excluded.email),
  hq_address = COALESCE(NULLIF(public.contact_info.hq_address, ''), excluded.hq_address),
  map_link = COALESCE(NULLIF(public.contact_info.map_link, ''), excluded.map_link),
  social_links = CASE
    WHEN public.contact_info.social_links = '[]'::jsonb THEN excluded.social_links
    ELSE public.contact_info.social_links
  END,
  weekday_hours = COALESCE(NULLIF(public.contact_info.weekday_hours, ''), excluded.weekday_hours),
  weekend_hours = COALESCE(NULLIF(public.contact_info.weekend_hours, ''), excluded.weekend_hours),
  careers_email = COALESCE(NULLIF(public.contact_info.careers_email, ''), excluded.careers_email),
  careers_apply_instructions = COALESCE(
    NULLIF(public.contact_info.careers_apply_instructions, ''),
    excluded.careers_apply_instructions
  );

INSERT INTO public.site_settings (
  id,
  company_name,
  social_links,
  footer_body,
  footer_copyright_line
)
VALUES (
  1,
  'Euromiti',
  '[]'::jsonb,
  'Një rrjet modern karburanti dhe shërbimesh në Prishtinë, Ferizaj dhe Gjilan, që bashkon cilësinë, komoditetin dhe mikpritjen profesionale për një përvojë të plotë në çdo ndalesë.',
  'Euromiti Kosovo'
)
ON CONFLICT (id) DO UPDATE SET
  company_name = COALESCE(NULLIF(public.site_settings.company_name, ''), excluded.company_name),
  social_links = CASE
    WHEN public.site_settings.social_links = '[]'::jsonb THEN excluded.social_links
    ELSE public.site_settings.social_links
  END,
  footer_body = COALESCE(NULLIF(public.site_settings.footer_body, ''), excluded.footer_body),
  footer_copyright_line = COALESCE(NULLIF(public.site_settings.footer_copyright_line, ''), excluded.footer_copyright_line);
