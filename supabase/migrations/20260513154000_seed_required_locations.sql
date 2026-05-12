-- Ensure the three public Euromiti locations exist in the CMS source tables.
-- Existing admin-edited non-empty fields are preserved.

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
  ('83d91637-6ac6-49cf-a166-aad3d3d1b018', 'euromiti-media', 'seed/locations-prishtina-main-googleusercontent.jpg', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsNa_ar016Z5HDibQivrNY67SzYbUZKe0WG7DpwaQHOKOeVj-l6ZjPd9UkJT1LCPzEazL1wiBZ_RJs9BpODXlhQ15zQeb6u4Nx9Nw-TjdxnGqubvhDM82tXM8JsA2oTjSFJ4y1qXyW3SUrLKH_wekefXvyL7ptLyD22du9apP7qiRMyUQ3K6MmfOBWGJHfTIGApzf9cLuk4qB-e21yQ_5cIDKKx-sHZi2k9Zg-Bh_v3gfG2DeskV7uxZU4VgQlaoepKSRqoRtu7kaI', 'image/jpeg', 0, 'locations-prishtina-main-googleusercontent.jpg', 'Euromiti Prishtina hub', 'locations', 'location-prishtina-main'),
  ('4f9cb8fb-4c88-464d-9ab2-0db9e039a6e9', 'euromiti-media', 'seed/locations-ferizaj-main-googleusercontent.jpg', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5B-EZQOzTwHzaJouKcr9yQO3K-Hk-IRy8BE8Ki-CfYOAcowCglwAkLnWGo3gxp9I8SWwkseEt4ec_dcrrlQ5PlXU-dvzihluc25gLZzXDg6W1KpB9F_RuP2um6dBGeJBhF9c5A4vMm4gKFc6vmAz_5kX91gXJaNfzJg8EjLOe1KlooGf3HE-SpR5JZdqV4cN5tKfl2c9jHtLwuxihK_j-eI8ihDwHi3YHiuA5pZvV1mhqQdFZIToFAYN-OCN5uzFSLi9u8GLmcbpg', 'image/jpeg', 0, 'locations-ferizaj-main-googleusercontent.jpg', 'Euromiti Ferizaj station', 'locations', 'location-ferizaj-main'),
  ('3928e863-bb67-4324-a81a-cbc91caf48b2', 'euromiti-media', 'seed/locations-gjilan-main-googleusercontent.jpg', 'https://lh3.googleusercontent.com/aida-public/AB6AXuADBeDZHZAtBNzWpI3FuV1jEa6H11obUs1HMHbSv5Zq31pEaAk3k0_J9lmSHyevmofr9x6u9IkBC13JB_uFuoxhcWz9i_7jKVDQ-o600nNmnnJ1N7mZkdWplFQqHCFh3gmdcuM73ogs0CuTr01Nr0_fw1omR2tfkyOppnSNWACg532puP7mwJ24hOUNewWtcXQmc5i_X-F3WWixk6cZmBY0rYnZP1YBIRWM5YVSmxDkBvv9PATxITYI0ps6A6oxyx4CapUKnd3yebha', 'image/jpeg', 0, 'locations-gjilan-main-googleusercontent.jpg', 'Euromiti Gjilan station', 'locations', 'location-gjilan-main'),
  ('6d29d39e-8a22-489f-b3de-e6e3755db49c', 'euromiti-media', 'seed/locations-gallery-carwash-googleusercontent.jpg', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5B-EZQOzTwHzaJouKcr9yQO3K-Hk-IRy8BE8Ki-CfYOAcowCglwAkLnWGo3gxp9I8SWwkseEt4ec_dcrrlQ5PlXU-dvzihluc25gLZzXDg6W1KpB9F_RuP2um6dBGeJBhF9c5A4vMm4gKFc6vmAz_5kX91gXJaNfzJg8EjLOe1KlooGf3HE-SpR5JZdqV4cN5tKfl2c9jHtLwuxihK_j-eI8ihDwHi3YHiuA5pZvV1mhqQdFZIToFAYN-OCN5uzFSLi9u8GLmcbpg', 'image/jpeg', 0, 'locations-gallery-carwash-googleusercontent.jpg', 'Artisan detailing', 'locations', 'location-gallery'),
  ('2fbd7a97-a285-4de8-afc5-1325f2f4da84', 'euromiti-media', 'seed/locations-gallery-restaurant-googleusercontent.jpg', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPKs5AJzRkauqdXtM7yLTO6l56xgVi1VzK0cbCvcsjrqT5AKK2W11vv8YB_1ivxFco2-SwDHc2E8H2C4WvX343X0MYu2iwbt7gbP7Ep8rRutnIdXagmB5NaZjg_LOc94cqL9QwWXGXdvRvwWzSl0QxLh0ayahu5U1sSEub31iPfFcGeLE4sw9o-036RPVsN8kOkJRILbUtkXV5vgZcnY2A12PKydoodk6Rbju4VM7MPSXl9Cnoh-umnRT66SPgYuU0olF4g_IJCeGn', 'image/jpeg', 0, 'locations-gallery-restaurant-googleusercontent.jpg', 'The Euromiti Atelier', 'locations', 'location-gallery'),
  ('5e17c168-d81e-4841-b435-87fcdf3fcd9d', 'euromiti-media', 'seed/locations-gallery-family-googleusercontent.jpg', 'https://lh3.googleusercontent.com/aida-public/AB6AXuADBeDZHZAtBNzWpI3FuV1jEa6H11obUs1HMHbSv5Zq31pEaAk3k0_J9lmSHyevmofr9x6u9IkBC13JB_uFuoxhcWz9i_7jKVDQ-o600nNmnnJ1N7mZkdWplFQqHCFh3gmdcuM73ogs0CuTr01Nr0_fw1omR2tfkyOppnSNWACg532puP7mwJ24hOUNewWtcXQmc5i_X-F3WWixk6cZmBY0rYnZP1YBIRWM5YVSmxDkBvv9PATxITYI0ps6A6oxyx4CapUKnd3yebha', 'image/jpeg', 0, 'locations-gallery-family-googleusercontent.jpg', 'Family playground', 'locations', 'location-gallery'),
  ('9ee5fed9-4ef9-406b-ab5f-8f7acbf39546', 'euromiti-media', 'seed/locations-gallery-market-googleusercontent.jpg', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8S5hGP1c18sfDFaDaUppXHP46HuuFboTBzwrqQDLf7q4PSXQTe0SHQG7TgmOTwEgK_fe43LVqQDJd-ScVPoQmq2-IZ09lTYyfOVH2CgTTVUp3hmTEclyYGaizppdWNgj2QGg4XhRZLcJIbha9lPBCt9W6Q9m2SOJDCdQ5Xz7pXeGDNZyxInOd8uNm8CgWuG8qHD7fHBjrmpn7zbQ8inK6ovO6PTn14B98DPNG1iUWZjZycpN9aikm-EFxByyLyk_ct8EGIQZlbgJB', 'image/jpeg', 0, 'locations-gallery-market-googleusercontent.jpg', 'Boutique mini market', 'locations', 'location-gallery')
ON CONFLICT (id) DO UPDATE SET
  public_url = excluded.public_url,
  alt_text = excluded.alt_text,
  category = excluded.category,
  usage_section = excluded.usage_section;

INSERT INTO public.locations (
  slug,
  city,
  address,
  phone,
  contact_email,
  opening_hours,
  services,
  google_maps_url,
  sort_order,
  is_active,
  main_media_id,
  page_heading,
  page_summary
)
VALUES
  ('prishtina', 'Prishtina', 'Magjistralja Prishtinë–Ferizaj, KM 7', '+383 44 000 111', 'prishtina@euromiti.com', 'Open 24/7', ARRAY['petrol','restaurant','carwash','mini_market']::public.location_amenity[], 'https://maps.google.com/?q=Prishtina', 10, TRUE, '83d91637-6ac6-49cf-a166-aad3d3d1b018', 'Prishtina — Central', 'Capital station with full Euromiti services.'),
  ('ferizaj', 'Ferizaj', 'Rruga Prishtinës, Ferizaj 70000', '+383 44 000 222', 'ferizaj@euromiti.com', '05:30 – 23:00 daily', ARRAY['petrol','mini_market','carwash']::public.location_amenity[], 'https://maps.google.com/?q=Ferizaj', 20, TRUE, '4f9cb8fb-4c88-464d-9ab2-0db9e039a6e9', 'Ferizaj — South Station', 'City station for quick stops and daily routes.'),
  ('gjilan', 'Gjilan', 'Zona Industriale, Gjilan 60000', '+383 44 000 333', 'gjilan@euromiti.com', '06:00 – 23:30 daily', ARRAY['petrol','restaurant']::public.location_amenity[], 'https://maps.google.com/?q=Gjilan', 30, TRUE, '3928e863-bb67-4324-a81a-cbc91caf48b2', 'Gjilan — East Gate', 'Eastern city station for reliable refueling and rest.')
ON CONFLICT (slug) DO UPDATE SET
  city = COALESCE(NULLIF(public.locations.city, ''), excluded.city),
  address = COALESCE(NULLIF(public.locations.address, ''), excluded.address),
  phone = COALESCE(NULLIF(public.locations.phone, ''), excluded.phone),
  contact_email = COALESCE(NULLIF(public.locations.contact_email, ''), excluded.contact_email),
  opening_hours = COALESCE(NULLIF(public.locations.opening_hours, ''), excluded.opening_hours),
  services = CASE WHEN cardinality(public.locations.services) = 0 THEN excluded.services ELSE public.locations.services END,
  google_maps_url = COALESCE(NULLIF(public.locations.google_maps_url, ''), excluded.google_maps_url),
  sort_order = CASE WHEN public.locations.sort_order = 0 THEN excluded.sort_order ELSE public.locations.sort_order END,
  is_active = TRUE,
  main_media_id = COALESCE(public.locations.main_media_id, excluded.main_media_id),
  page_heading = COALESCE(NULLIF(public.locations.page_heading, ''), excluded.page_heading),
  page_summary = COALESCE(NULLIF(public.locations.page_summary, ''), excluded.page_summary);

WITH gallery_seed AS (
  SELECT l.id AS location_id, v.sort_order, v.media_id::uuid
  FROM public.locations l
  JOIN (
    VALUES
      ('prishtina', 0, '6d29d39e-8a22-489f-b3de-e6e3755db49c'),
      ('prishtina', 1, '2fbd7a97-a285-4de8-afc5-1325f2f4da84'),
      ('ferizaj', 0, '5e17c168-d81e-4841-b435-87fcdf3fcd9d'),
      ('ferizaj', 1, '9ee5fed9-4ef9-406b-ab5f-8f7acbf39546'),
      ('gjilan', 0, '6d29d39e-8a22-489f-b3de-e6e3755db49c'),
      ('gjilan', 1, '2fbd7a97-a285-4de8-afc5-1325f2f4da84')
  ) AS v(slug, sort_order, media_id) ON v.slug = l.slug
)
INSERT INTO public.location_images (location_id, sort_order, media_id)
SELECT location_id, sort_order, media_id
FROM gallery_seed
ON CONFLICT (location_id, sort_order) DO NOTHING;
