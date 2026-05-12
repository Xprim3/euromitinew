-- Seed the visible About page content into Supabase so admin and public pages
-- share the same source of truth. Existing editor changes are preserved.

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
    'd518cb83-dd58-475d-8986-c7fab1b80d0b',
    'euromiti-media',
    'seed/about-hero-googleusercontent.jpg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDFsEp-KUrU8cQdOnecAyAXQ3U2uog4dKT9CEQ0KLP5lw7Uy2LOCgmrdIbSFJxm-gaKCbSddItdHeeCnvGoBT76hp-l1mMPI_QNVBoOj2pCYlTaqQMJxt7ZVKYgdNecvKH5BeD48RNw6xR0TOUcsOOMWbUvRg40pqdlDDDzxDvH3QNdvxuFs5ngWphmM4E1cZItguJG7IvSRxxjgXjbBLf656eOUfau2iJqht7PDXcJcZm8ohoznL9t3s6Z18Zge2HJMn4mPxD3pjU5',
    'image/jpeg',
    0,
    'about-hero-googleusercontent.jpg',
    'Modern Euromiti petrol station canopy at dusk with warm lighting',
    'about',
    'about-hero'
  ),
  (
    'ac3d9663-a610-456e-a87d-bcb4b7d3b553',
    'euromiti-media',
    'seed/about-story-prishtina-hub-googleusercontent.jpg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBsNa_ar016Z5HDibQivrNY67SzYbUZKe0WG7DpwaQHOKOeVj-l6ZjPd9UkJT1LCPzEazL1wiBZ_RJs9BpODXlhQ15zQeb6u4Nx9Nw-TjdxnGqubvhDM82tXM8JsA2oTjSFJ4y1qXyW3SUrLKH_wekefXvyL7ptLyD22du9apP7qiRMyUQ3K6MmfOBWGJHfTIGApzf9cLuk4qB-e21yQ_5cIDKKx-sHZi2k9Zg-Bh_v3gfG2DeskV7uxZU4VgQlaoepKSRqoRtu7kaI',
    'image/jpeg',
    0,
    'about-story-prishtina-hub-googleusercontent.jpg',
    'Euromiti Prishtina hub',
    'about',
    'about-story'
  ),
  (
    '67d21e8f-b4db-45ac-ac28-8f0b217ed7f1',
    'euromiti-media',
    'seed/about-mission-strip-ferizaj-googleusercontent.jpg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD5B-EZQOzTwHzaJouKcr9yQO3K-Hk-IRy8BE8Ki-CfYOAcowCglwAkLnWGo3gxp9I8SWwkseEt4ec_dcrrlQ5PlXU-dvzihluc25gLZzXDg6W1KpB9F_RuP2um6dBGeJBhF9c5A4vMm4gKFc6vmAz_5kX91gXJaNfzJg8EjLOe1KlooGf3HE-SpR5JZdqV4cN5tKfl2c9jHtLwuxihK_j-eI8ihDwHi3YHiuA5pZvV1mhqQdFZIToFAYN-OCN5uzFSLi9u8GLmcbpg',
    'image/jpeg',
    0,
    'about-mission-strip-ferizaj-googleusercontent.jpg',
    'Euromiti Ferizaj station',
    'about',
    'about-gallery-strip'
  ),
  (
    'ee4632ef-32d7-4c89-8bd3-417772ba6f80',
    'euromiti-media',
    'seed/about-why-us-hero-googleusercontent.jpg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDFsEp-KUrU8cQdOnecAyAXQ3U2uog4dKT9CEQ0KLP5lw7Uy2LOCgmrdIbSFJxm-gaKCbSddItdHeeCnvGoBT76hp-l1mMPI_QNVBoOj2pCYlTaqQMJxt7ZVKYgdNecvKH5BeD48RNw6xR0TOUcsOOMWbUvRg40pqdlDDDzxDvH3QNdvxuFs5ngWphmM4E1cZItguJG7IvSRxxjgXjbBLf656eOUfau2iJqht7PDXcJcZm8ohoznL9t3s6Z18Zge2HJMn4mPxD3pjU5',
    'image/jpeg',
    0,
    'about-why-us-hero-googleusercontent.jpg',
    'Euromiti forecourt experience',
    'about',
    'about-gallery-why-us'
  ),
  (
    '3f87932b-8d57-42b3-92fd-e6e65a710084',
    'euromiti-media',
    'seed/about-partnerships-restaurant-googleusercontent.jpg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCR1xtchlPTysXXn1qvIjEsuoAaAlWULNR3KcJPsnq6sOlg2bd50Uy1_pQjHr9ANkfYpg249jal3oR0TjTCF6Ag7TlmhfwuRJW_yeYlhKnx6tnb1VZFoyP9rwQ_mJFXAbVH-kMZbaH1ApA5-TzqmIY6k_b_j2J7ydgn_qifKxeEIOor6j9q_oYLcaDnc5oGs4Rkgvc1CqlPbAD8RXBaIbjh1CCQVtXz6k80FvzJ1M-Ww3Z8pm0MvWeIGW73M-WirsyL1VRCs759dC0N',
    'image/jpeg',
    0,
    'about-partnerships-restaurant-googleusercontent.jpg',
    'Euromiti hospitality and partnership support',
    'about',
    'about-gallery-partnerships'
  )
ON CONFLICT (id) DO UPDATE SET
  public_url = excluded.public_url,
  alt_text = excluded.alt_text,
  category = excluded.category,
  usage_section = excluded.usage_section;

INSERT INTO public.about_content (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

UPDATE public.about_content
SET
  hero_title = COALESCE(NULLIF(hero_title, ''), 'About Euromiti'),
  hero_subtitle = COALESCE(
    NULLIF(hero_subtitle, ''),
    'A disciplined roadside network anchored in Prishtina, Ferizaj, and Gjilan - blending premium fuels with dining, convenience, and car care.'
  ),
  company_story = CASE
    WHEN company_story = '[]'::jsonb THEN
      '[
        "Euromiti operates a disciplined network of forecourts across Kosovo - pairing dependable fuels with dining, mini market essentials, and car care where travellers need them most.",
        "From Prishtina to Ferizaj and Gjilan, our teams obsess over bright, safe canopy experiences, thoughtfully stocked aisles, and hospitality that honours both locals and highway guests."
      ]'::jsonb
    ELSE company_story
  END,
  mission_title = COALESCE(NULLIF(mission_title, ''), 'Mission'),
  mission_body = COALESCE(
    NULLIF(mission_body, ''),
    'Deliver a premium roadside experience that feels consistent, humane, and unmistakably European - anchored by safe fuelling and genuine service culture.'
  ),
  vision_title = COALESCE(NULLIF(vision_title, ''), 'Vision'),
  vision_body = COALESCE(
    NULLIF(vision_body, ''),
    'Be Kosovo''s benchmark for integrated mobility hospitality: trusted fuels, calm restaurants, purposeful retail, and spotless lanes that welcome every journey.'
  ),
  values_json = CASE
    WHEN values_json = '[]'::jsonb THEN
      '[
        {"icon_material":"verified","title":"Reliability","body":"We build predictable quality into fuel, food, and service so customers always know what to expect."},
        {"icon_material":"favorite","title":"Care","body":"From forecourt cleanliness to guest support, we treat every visit as a premium hospitality moment."},
        {"icon_material":"trending_up","title":"Progress","body":"We continuously refine standards, training, and station experiences to raise the benchmark in Kosovo."},
        {"icon_material":"handshake","title":"Integrity","body":"We act transparently and responsibly in how we serve guests, partners, and communities."},
        {"icon_material":"groups_3","title":"Teamwork","body":"Our stations perform as one coordinated team to deliver consistent service every day."},
        {"icon_material":"bolt","title":"Efficiency","body":"We improve operational flow to save customer time without compromising quality."}
      ]'::jsonb
    ELSE values_json
  END,
  hero_media_id = COALESCE(hero_media_id, 'd518cb83-dd58-475d-8986-c7fab1b80d0b'::uuid),
  story_media_id = COALESCE(story_media_id, 'ac3d9663-a610-456e-a87d-bcb4b7d3b553'::uuid),
  gallery_strip_media_id = COALESCE(gallery_strip_media_id, '67d21e8f-b4db-45ac-ac28-8f0b217ed7f1'::uuid),
  gallery_why_us_media_id = COALESCE(gallery_why_us_media_id, 'ee4632ef-32d7-4c89-8bd3-417772ba6f80'::uuid),
  gallery_partnerships_media_id = COALESCE(gallery_partnerships_media_id, '3f87932b-8d57-42b3-92fd-e6e65a710084'::uuid)
WHERE id = 1;
