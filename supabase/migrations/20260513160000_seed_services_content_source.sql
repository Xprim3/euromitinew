-- Seed current visible `/services` page content into the structured CMS singleton.
-- Existing admin-edited non-empty fields/media selections are preserved.

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
  ('fd482720-9d4b-49db-9648-18c4e63fb3ec', 'euromiti-media', 'seed/services-petrol-googleusercontent.jpg', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFsEp-KUrU8cQdOnecAyAXQ3U2uog4dKT9CEQ0KLP5lw7Uy2LOCgmrdIbSFJxm-gaKCbSddItdHeeCnvGoBT76hp-l1mMPI_QNVBoOj2pCYlTaqQMJxt7ZVKYgdNecvKH5BeD48RNw6xR0TOUcsOOMWbUvRg40pqdlDDDzxDvH3QNdvxuFs5ngWphmM4E1cZItguJG7IvSRxxjgXjbBLf656eOUfau2iJqht7PDXcJcZm8ohoznL9t3s6Z18Zge2HJMn4mPxD3pjU5', 'image/jpeg', 0, 'services-petrol-googleusercontent.jpg', 'Euromiti petrol station with car fueling', 'services', 'services-petrol'),
  ('291718f3-8135-4bd4-b6b0-ad5ba2bb6c2f', 'euromiti-media', 'seed/services-restaurant-googleusercontent.jpg', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPKs5AJzRkauqdXtM7yLTO6l56xgVi1VzK0cbCvcsjrqT5AKK2W11vv8YB_1ivxFco2-SwDHc2E8H2C4WvX343X0MYu2iwbt7gbP7Ep8rRutnIdXagmB5NaZjg_LOc94cqL9QwWXGXdvRvwWzSl0QxLh0ayahu5U1sSEub31iPfFcGeLE4sw9o-036RPVsN8kOkJRILbUtkXV5vgZcnY2A12PKydoodk6Rbju4VM7MPSXl9Cnoh-umnRT66SPgYuU0olF4g_IJCeGn', 'image/jpeg', 0, 'services-restaurant-googleusercontent.jpg', 'Premium restaurant dining at Euromiti', 'services', 'services-restaurant'),
  ('c3b98d83-96cc-4644-8dd1-99752aa03eb8', 'euromiti-media', 'seed/services-carwash-googleusercontent.jpg', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5B-EZQOzTwHzaJouKcr9yQO3K-Hk-IRy8BE8Ki-CfYOAcowCglwAkLnWGo3gxp9I8SWwkseEt4ec_dcrrlQ5PlXU-dvzihluc25gLZzXDg6W1KpB9F_RuP2um6dBGeJBhF9c5A4vMm4gKFc6vmAz_5kX91gXJaNfzJg8EjLOe1KlooGf3HE-SpR5JZdqV4cN5tKfl2c9jHtLwuxihK_j-eI8ihDwHi3YHiuA5pZvV1mhqQdFZIToFAYN-OCN5uzFSLi9u8GLmcbpg', 'image/jpeg', 0, 'services-carwash-googleusercontent.jpg', 'Professional Euromiti carwash service', 'services', 'services-carwash'),
  ('455bbd00-3b54-4073-bfb6-e5c9a65ae2b6', 'euromiti-media', 'seed/services-mini-market-googleusercontent.jpg', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8S5hGP1c18sfDFaDaUppXHP46HuuFboTBzwrqQDLf7q4PSXQTe0SHQG7TgmOTwEgK_fe43LVqQDJd-ScVPoQmq2-IZ09lTYyfOVH2CgTTVUp3hmTEclyYGaizppdWNgj2QGg4XhRZLcJIbha9lPBCt9W6Q9m2SOJDCdQ5Xz7pXeGDNZyxInOd8uNm8CgWuG8qHD7fHBjrmpn7zbQ8inK6ovO6PTn14B98DPNG1iUWZjZycpN9aikm-EFxByyLyk_ct8EGIQZlbgJB', 'image/jpeg', 0, 'services-mini-market-googleusercontent.jpg', 'Mini market products and essentials at Euromiti', 'services', 'services-mini-market')
ON CONFLICT (id) DO UPDATE SET
  public_url = excluded.public_url,
  alt_text = excluded.alt_text,
  category = excluded.category,
  usage_section = excluded.usage_section;

INSERT INTO public.services_content (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

UPDATE public.services_content
SET
  hero_page_title = COALESCE(NULLIF(hero_page_title, ''), 'Services'),
  hero_page_subtitle = COALESCE(
    NULLIF(hero_page_subtitle, ''),
    'Fuel, food, vehicle care, and everyday convenience across Prishtina, Ferizaj, and Gjilan.'
  ),
  petrol_section_title = COALESCE(NULLIF(petrol_section_title, ''), 'Petrol Station'),
  petrol_description = COALESCE(
    NULLIF(petrol_description, ''),
    'Euromiti provides reliable fuel services designed for drivers, travelers, and businesses. Our stations focus on convenience, clean service, and easy access, with current fuel prices and trusted service across our locations.'
  ),
  petrol_highlights_json = CASE
    WHEN petrol_highlights_json = '[]'::jsonb THEN
      '["Reliable fuel service", "Easy access locations", "Updated fuel pricing", "Professional customer service"]'::jsonb
    ELSE petrol_highlights_json
  END,
  petrol_image_media_id = COALESCE(petrol_image_media_id, 'fd482720-9d4b-49db-9648-18c4e63fb3ec'::uuid),
  restaurant_section_title = COALESCE(NULLIF(restaurant_section_title, ''), 'Premium Restaurant'),
  restaurant_description = COALESCE(
    NULLIF(restaurant_description, ''),
    'Euromiti offers a premium restaurant experience with quality food, a comfortable environment, and welcoming service. The restaurant is designed to give customers a pleasant and relaxing stop during their visit.'
  ),
  restaurant_image_media_id = COALESCE(restaurant_image_media_id, '291718f3-8135-4bd4-b6b0-ad5ba2bb6c2f'::uuid),
  carwash_section_title = COALESCE(NULLIF(carwash_section_title, ''), 'Carwash'),
  carwash_description = COALESCE(
    NULLIF(carwash_description, ''),
    'Euromiti’s carwash service gives drivers a practical and professional way to keep their vehicles clean. It is designed as a convenient stop for everyday use and customer comfort.'
  ),
  carwash_image_media_id = COALESCE(carwash_image_media_id, 'c3b98d83-96cc-4644-8dd1-99752aa03eb8'::uuid),
  mini_market_section_title = COALESCE(NULLIF(mini_market_section_title, ''), 'Mini Market'),
  mini_market_description = COALESCE(
    NULLIF(mini_market_description, ''),
    'Our mini market provides everyday convenience for drivers and visitors, offering drinks, snacks, travel essentials, and daily products in one easy stop.'
  ),
  mini_market_image_media_id = COALESCE(mini_market_image_media_id, '455bbd00-3b54-4073-bfb6-e5c9a65ae2b6'::uuid)
WHERE id = 1;
