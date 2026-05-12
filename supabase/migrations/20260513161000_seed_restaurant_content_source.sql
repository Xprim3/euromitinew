-- Seed current visible `/restaurant` page content into the structured CMS singleton.
-- Existing admin-edited non-empty text/media values are preserved.

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
  ('fd1a7b68-9289-4624-8e29-2d29f967fa92', 'euromiti-media', 'seed/restaurant-hero-googleusercontent.jpg', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPKs5AJzRkauqdXtM7yLTO6l56xgVi1VzK0cbCvcsjrqT5AKK2W11vv8YB_1ivxFco2-SwDHc2E8H2C4WvX343X0MYu2iwbt7gbP7Ep8rRutnIdXagmB5NaZjg_LOc94cqL9QwWXGXdvRvwWzSl0QxLh0ayahu5U1sSEub31iPfFcGeLE4sw9o-036RPVsN8kOkJRILbUtkXV5vgZcnY2A12PKydoodk6Rbju4VM7MPSXl9Cnoh-umnRT66SPgYuU0olF4g_IJCeGn', 'image/jpeg', 0, 'restaurant-hero-googleusercontent.jpg', 'Euromiti restaurant interior and dining ambience', 'restaurant', 'restaurant-hero'),
  ('5cfb0699-741b-4123-bfa4-ad1416f39847', 'euromiti-media', 'seed/restaurant-menu-breakfast-unsplash.jpg', 'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=960&q=85', 'image/jpeg', 0, 'restaurant-menu-breakfast-unsplash.jpg', 'Breakfast spread with coffee and pastries', 'restaurant', 'restaurant-menu-0'),
  ('ce3dd35f-d6fc-467d-95d5-08cb20799d92', 'euromiti-media', 'seed/restaurant-menu-mains-unsplash.jpg', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=960&q=85', 'image/jpeg', 0, 'restaurant-menu-mains-unsplash.jpg', 'Plated seafood main course with herbs and lemon', 'restaurant', 'restaurant-menu-1'),
  ('75f6c5a5-b448-4d4d-a61f-41f8e03a0349', 'euromiti-media', 'seed/restaurant-menu-grill-unsplash.jpg', 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=960&q=85', 'image/jpeg', 0, 'restaurant-menu-grill-unsplash.jpg', 'Grilled meat with char and garnish', 'restaurant', 'restaurant-menu-2'),
  ('8d2e4bdd-1b1c-48fd-ae99-95373badca67', 'euromiti-media', 'seed/restaurant-menu-garden-unsplash.jpg', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=960&q=85', 'image/jpeg', 0, 'restaurant-menu-garden-unsplash.jpg', 'Fresh gourmet salad bowl with vegetables', 'restaurant', 'restaurant-menu-3'),
  ('46d2c00a-2df4-4f36-a61f-934b41f70942', 'euromiti-media', 'seed/restaurant-menu-dessert-unsplash.jpg', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=960&q=85', 'image/jpeg', 0, 'restaurant-menu-dessert-unsplash.jpg', 'Artistic dessert plating with berry and cream', 'restaurant', 'restaurant-menu-4'),
  ('2d6bebd0-4fcb-4507-976c-a6ac7ebd10a9', 'euromiti-media', 'seed/restaurant-menu-coffee-unsplash.jpg', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=960&q=85', 'image/jpeg', 0, 'restaurant-menu-coffee-unsplash.jpg', 'Artisan coffee and bar service detail', 'restaurant', 'restaurant-menu-5'),
  ('4c6eef35-34b3-48ed-9d78-8af9ceba33ec', 'euromiti-media', 'seed/restaurant-gallery-hero-googleusercontent.jpg', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCR1xtchlPTysXXn1qvIjEsuoAaAlWULNR3KcJPsnq6sOlg2bd50Uy1_pQjHr9ANkfYpg249jal3oR0TjTCF6Ag7TlmhfwuRJW_yeYlhKnx6tnb1VZFoyP9rwQ_mJFXAbVH-kMZbaH1ApA5-TzqmIY6k_b_j2J7ydgn_qifKxeEIOor6j9q_oYLcaDnc5oGs4Rkgvc1CqlPbAD8RXBaIbjh1CCQVtXz6k80FvzJ1M-Ww3Z8pm0MvWeIGW73M-WirsyL1VRCs759dC0N', 'image/jpeg', 0, 'restaurant-gallery-hero-googleusercontent.jpg', 'Soft evening light across the Euromiti dining room', 'restaurant', 'restaurant-gallery-0'),
  ('1ae0bc97-32da-4597-b615-a0ea3dba4e4c', 'euromiti-media', 'seed/restaurant-gallery-wine-unsplash.jpg', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=85', 'image/jpeg', 0, 'restaurant-gallery-wine-unsplash.jpg', 'Wine wall washed in warm amber light', 'restaurant', 'restaurant-gallery-1'),
  ('8912a2f2-156d-48e5-898b-69e3ccc48fe4', 'euromiti-media', 'seed/restaurant-gallery-chef-unsplash.jpg', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1400&q=85', 'image/jpeg', 0, 'restaurant-gallery-chef-unsplash.jpg', 'Chef plating at the pass with precision', 'restaurant', 'restaurant-gallery-2'),
  ('572c858d-9b95-48cf-b4a3-cbe7776af0a0', 'euromiti-media', 'seed/restaurant-gallery-guests-unsplash.jpg', 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=1400&q=85', 'image/jpeg', 0, 'restaurant-gallery-guests-unsplash.jpg', 'Guests at linen tables in the dining salon', 'restaurant', 'restaurant-gallery-3'),
  ('060c28e7-3706-4f7a-9533-e45b32a6c10b', 'euromiti-media', 'seed/restaurant-gallery-counter-unsplash.jpg', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=85', 'image/jpeg', 0, 'restaurant-gallery-counter-unsplash.jpg', 'Course spread along the chef’s counter', 'restaurant', 'restaurant-gallery-4')
ON CONFLICT (id) DO UPDATE SET
  public_url = excluded.public_url,
  alt_text = excluded.alt_text,
  category = excluded.category,
  usage_section = excluded.usage_section;

INSERT INTO public.restaurant_content (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

UPDATE public.restaurant_content
SET
  hero_title = COALESCE(NULLIF(hero_title, ''), 'Restaurant'),
  hero_subtitle = COALESCE(
    NULLIF(hero_subtitle, ''),
    'Chef-led dining, curated menus, and hospitality standards designed to elevate every Euromiti stop.'
  ),
  hero_description = COALESCE(
    NULLIF(hero_description, ''),
    'Euromiti Restaurant brings quality cooking, considerate service, and a composed dining room together in one place. A meal here is more than sustenance—it is the pause inside a journey, the moment where conversation opens, and a careful walk through Kosovo’s seasonal larder.' || E'\n\n' ||
    'Whether you are stopping mid-route or gathering for something to celebrate, the room is tuned for acoustics and light—clean, restorative, memorable long after dessert.'
  ),
  hero_image_media_id = COALESCE(hero_image_media_id, 'fd1a7b68-9289-4624-8e29-2d29f967fa92'::uuid),
  menu_highlights_json = CASE
    WHEN menu_highlights_json = '[]'::jsonb THEN
      '[
        {"title":"The Breakfast Service","body":"Artisan viennoiserie and morning classics in a light-filled salon beside the forecourt.","image_media_id":"5cfb0699-741b-4123-bfa4-ad1416f39847"},
        {"title":"Signature Mains","body":"Sea bass with salmoriglio, mountain herb risotto, and wood-grilled cuts from trusted suppliers.","image_media_id":"ce3dd35f-d6fc-467d-95d5-08cb20799d92"},
        {"title":"Flame & Grill","body":"Aged beef and open-flame cooking for depth, smoke, and a crisp, caramelised finish.","image_media_id":"75f6c5a5-b448-4d4d-a61f-41f8e03a0349"},
        {"title":"Garden Plates","body":"Seasonal greens, mountain herbs, and house dressings — bright counterpoints to richer courses.","image_media_id":"8d2e4bdd-1b1c-48fd-ae99-95373badca67"},
        {"title":"Dolce & Finis","body":"Pastry trolley signatures and restrained desserts conceived to close the meal without heaviness.","image_media_id":"46d2c00a-2df4-4f36-a61f-934b41f70942"},
        {"title":"Bar & Brew","body":"Specialty espresso, cold infusions, and a concise list of wines chosen for pace and palate.","image_media_id":"2d6bebd0-4fcb-4507-976c-a6ac7ebd10a9"}
      ]'::jsonb
    ELSE menu_highlights_json
  END,
  gallery_media_ids = CASE
    WHEN gallery_media_ids IS NULL OR cardinality(gallery_media_ids) = 0 THEN
      ARRAY[
        '4c6eef35-34b3-48ed-9d78-8af9ceba33ec',
        '1ae0bc97-32da-4597-b615-a0ea3dba4e4c',
        '8912a2f2-156d-48e5-898b-69e3ccc48fe4',
        '572c858d-9b95-48cf-b4a3-cbe7776af0a0',
        '060c28e7-3706-4f7a-9533-e45b32a6c10b'
      ]::uuid[]
    ELSE gallery_media_ids
  END,
  opening_hours = COALESCE(NULLIF(opening_hours, ''), 'Daily · 08:00 – 23:00'),
  contact_phone = COALESCE(NULLIF(contact_phone, ''), '+383 44 000 100'),
  contact_email = COALESCE(NULLIF(contact_email, ''), 'restaurant@euromiti.com'),
  contact_notes = COALESCE(NULLIF(contact_notes, ''), 'For reservations and group enquiries, contact the restaurant desk before your visit.')
WHERE id = 1;
