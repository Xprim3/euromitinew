-- Seed the current visible homepage hero into the structured CMS singleton.
-- Text fields are only filled when blank so existing admin edits are not overwritten.

INSERT INTO public.media_uploads (
  id,
  storage_bucket,
  object_path,
  public_url,
  mime_type,
  byte_size,
  original_filename,
  alt_text,
  category,
  usage_section
)
VALUES (
  '7d2394ee-491c-4fa5-a4b0-a6c46df10901',
  'euromiti-media',
  'seed/homepage-hero-googleusercontent.jpg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDFsEp-KUrU8cQdOnecAyAXQ3U2uog4dKT9CEQ0KLP5lw7Uy2LOCgmrdIbSFJxm-gaKCbSddItdHeeCnvGoBT76hp-l1mMPI_QNVBoOj2pCYlTaqQMJxt7ZVKYgdNecvKH5BeD48RNw6xR0TOUcsOOMWbUvRg40pqdlDDDzxDvH3QNdvxuFs5ngWphmM4E1cZItguJG7IvSRxxjgXjbBLf656eOUfau2iJqht7PDXcJcZm8ohoznL9t3s6Z18Zge2HJMn4mPxD3pjU5',
  'image/jpeg',
  0,
  'homepage-hero-googleusercontent.jpg',
  'Modern Euromiti petrol station canopy at dusk with warm lighting',
  'homepage',
  'hero'
)
ON CONFLICT (id) DO UPDATE
SET
  public_url = excluded.public_url,
  alt_text = excluded.alt_text,
  category = excluded.category,
  usage_section = excluded.usage_section;

INSERT INTO public.homepage_content (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

UPDATE public.homepage_content
SET
  hero_headline_line1 = COALESCE(NULLIF(hero_headline_line1, ''), 'Excellence in'),
  hero_headline_line2 = COALESCE(NULLIF(hero_headline_line2, ''), 'Every Drop.'),
  hero_subtitle = COALESCE(NULLIF(hero_subtitle, ''), 'Petrol, restaurant, mini market, and carwash across Prishtina, Ferizaj, and Gjilan — paired with bright forecourts and the routes you rely on.'),
  hero_cta_primary_label = COALESCE(NULLIF(hero_cta_primary_label, ''), 'Our Services'),
  hero_cta_primary_href = COALESCE(NULLIF(hero_cta_primary_href, ''), '/services'),
  hero_cta_secondary_label = COALESCE(NULLIF(hero_cta_secondary_label, ''), 'Locations'),
  hero_cta_secondary_href = COALESCE(NULLIF(hero_cta_secondary_href, ''), '/locations'),
  hero_image_media_id = COALESCE(hero_image_media_id, '7d2394ee-491c-4fa5-a4b0-a6c46df10901'::uuid)
WHERE id = 1;
