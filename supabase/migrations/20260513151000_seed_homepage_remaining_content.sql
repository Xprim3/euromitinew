-- Seed current visible homepage content into existing CMS fields.
-- This keeps Supabase as the main source while preserving existing admin edits.

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
VALUES
  (
    '85cc43c2-66e2-4b22-8d51-6f5f9e7c4dd1',
    'euromiti-media',
    'seed/homepage-services-intro-googleusercontent.jpg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDFsEp-KUrU8cQdOnecAyAXQ3U2uog4dKT9CEQ0KLP5lw7Uy2LOCgmrdIbSFJxm-gaKCbSddItdHeeCnvGoBT76hp-l1mMPI_QNVBoOj2pCYlTaqQMJxt7ZVKYgdNecvKH5BeD48RNw6xR0TOUcsOOMWbUvRg40pqdlDDDzxDvH3QNdvxuFs5ngWphmM4E1cZItguJG7IvSRxxjgXjbBLf656eOUfau2iJqht7PDXcJcZm8ohoznL9t3s6Z18Zge2HJMn4mPxD3pjU5',
    'image/jpeg',
    0,
    'homepage-services-intro-googleusercontent.jpg',
    'Elite fueling station',
    'homepage',
    'services-intro'
  ),
  (
    'b71bbf22-747b-48bf-a287-ae1f2226a9e4',
    'euromiti-media',
    'seed/homepage-restaurant-main-googleusercontent.jpg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAPKs5AJzRkauqdXtM7yLTO6l56xgVi1VzK0cbCvcsjrqT5AKK2W11vv8YB_1ivxFco2-SwDHc2E8H2C4WvX343X0MYu2iwbt7gbP7Ep8rRutnIdXagmB5NaZjg_LOc94cqL9QwWXGXdvRvwWzSl0QxLh0ayahu5U1sSEub31iPfFcGeLE4sw9o-036RPVsN8kOkJRILbUtkXV5vgZcnY2A12PKydoodk6Rbju4VM7MPSXl9Cnoh-umnRT66SPgYuU0olF4g_IJCeGn',
    'image/jpeg',
    0,
    'homepage-restaurant-main-googleusercontent.jpg',
    'The Euromiti Atelier',
    'homepage',
    'restaurant-home-main'
  ),
  (
    'c42d2f91-0ed7-4df5-b964-af35964e71a2',
    'euromiti-media',
    'seed/homepage-carwash-googleusercontent.jpg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD5B-EZQOzTwHzaJouKcr9yQO3K-Hk-IRy8BE8Ki-CfYOAcowCglwAkLnWGo3gxp9I8SWwkseEt4ec_dcrrlQ5PlXU-dvzihluc25gLZzXDg6W1KpB9F_RuP2um6dBGeJBhF9c5A4vMm4gKFc6vmAz_5kX91gXJaNfzJg8EjLOe1KlooGf3HE-SpR5JZdqV4cN5tKfl2c9jHtLwuxihK_j-eI8ihDwHi3YHiuA5pZvV1mhqQdFZIToFAYN-OCN5uzFSLi9u8GLmcbpg',
    'image/jpeg',
    0,
    'homepage-carwash-googleusercontent.jpg',
    'Artisan detailing',
    'homepage',
    'carwash-card'
  ),
  (
    'd25e41c5-90df-4e86-a908-766188d18778',
    'euromiti-media',
    'seed/homepage-mini-market-googleusercontent.jpg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD8S5hGP1c18sfDFaDaUppXHP46HuuFboTBzwrqQDLf7q4PSXQTe0SHQG7TgmOTwEgK_fe43LVqQDJd-ScVPoQmq2-IZ09lTYyfOVH2CgTTVUp3hmTEclyYGaizppdWNgj2QGg4XhRZLcJIbha9lPBCt9W6Q9m2SOJDCdQ5Xz7pXeGDNZyxInOd8uNm8CgWuG8qHD7fHBjrmpn7zbQ8inK6ovO6PTn14B98DPNG1iUWZjZycpN9aikm-EFxByyLyk_ct8EGIQZlbgJB',
    'image/jpeg',
    0,
    'homepage-mini-market-googleusercontent.jpg',
    'Boutique mini market',
    'homepage',
    'minimarket-card'
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
  services_intro_title = COALESCE(NULLIF(services_intro_title, ''), 'Elite Fueling'),
  services_intro_body = COALESCE(NULLIF(services_intro_body, ''), 'Our proprietary Euro 6+ standards are meticulously engineered for peak thermal efficiency and long-term carbon reduction.'),
  services_intro_media_id = COALESCE(services_intro_media_id, '85cc43c2-66e2-4b22-8d51-6f5f9e7c4dd1'::uuid),
  about_preview_text = COALESCE(NULLIF(about_preview_text, ''), 'Euromiti is a Kosovo-grown fuel and roadside service company operating with dependable standards in Prishtina, Ferizaj, and Gjilan.'),
  restaurant_home_headline_primary = COALESCE(NULLIF(restaurant_home_headline_primary, ''), 'Shije të kuruara.'),
  restaurant_home_headline_accent = COALESCE(NULLIF(restaurant_home_headline_accent, ''), 'Pushim i rafinuar.'),
  restaurant_highlight_text = COALESCE(NULLIF(restaurant_highlight_text, ''), 'Aty ku përbërësit vendorë takohen me përgatitje të kujdesshme. Çdo pjatë sjell freski, cilësi dhe një pushim të këndshëm gjatë rrugës.'),
  restaurant_home_main_media_id = COALESCE(restaurant_home_main_media_id, 'b71bbf22-747b-48bf-a287-ae1f2226a9e4'::uuid),
  carwash_intro_text = COALESCE(NULLIF(carwash_intro_text, ''), 'PH-neutral solutions and filtered water systems for a lasting showroom finish.'),
  carwash_intro_media_id = COALESCE(carwash_intro_media_id, 'c42d2f91-0ed7-4df5-b964-af35964e71a2'::uuid),
  mini_market_intro_text = COALESCE(NULLIF(mini_market_intro_text, ''), 'Exquisite essentials for the road, from artisanal snacks to premium travel accessories.'),
  mini_market_intro_media_id = COALESCE(mini_market_intro_media_id, 'd25e41c5-90df-4e86-a908-766188d18778'::uuid)
WHERE id = 1;
