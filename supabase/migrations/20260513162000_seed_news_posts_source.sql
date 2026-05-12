-- Seed current visible mock news into real CMS rows.
-- Existing posts with the same slug are preserved.

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
  ('9f351a53-2151-404c-9397-1dd0b4b7ace9', 'euromiti-media', 'seed/news-expansion-prishtina-unsplash.jpg', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=960&q=80', 'image/jpeg', 0, 'news-expansion-prishtina-unsplash.jpg', 'Executive handshake overlooking the city skyline', 'news', 'news-expansion-in-prishtina'),
  ('e9c40365-89b8-4611-af09-036229394a6c', 'euromiti-media', 'seed/news-zero-emissions-unsplash.jpg', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=960&q=80', 'image/jpeg', 0, 'news-zero-emissions-unsplash.jpg', 'Solar panels with blue sky', 'news', 'news-path-to-zero-emissions'),
  ('c757ace3-f691-4058-956e-9e8c4fbd0d43', 'euromiti-media', 'seed/news-premium-diesel-unsplash.jpg', 'https://images.unsplash.com/photo-1581093843351-3c2b14d6d30d?auto=format&fit=crop&w=960&q=80', 'image/jpeg', 0, 'news-premium-diesel-unsplash.jpg', 'Close-up of a fuel dispenser nozzle', 'news', 'news-premium-diesel-launch'),
  ('be5657a0-f5de-401c-acb2-265b69fb64d5', 'euromiti-media', 'seed/news-stem-scholarship-unsplash.jpg', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=960&q=80', 'image/jpeg', 0, 'news-stem-scholarship-unsplash.jpg', 'Team collaborating in a bright workspace', 'news', 'news-stem-scholarship-2026'),
  ('73e21531-49ee-4c7b-ad68-87a14c6d4c9c', 'euromiti-media', 'seed/news-ferizaj-corridor-unsplash.jpg', 'https://images.unsplash.com/photo-1578575437130-527eed3edb54?auto=format&fit=crop&w=960&q=80', 'image/jpeg', 0, 'news-ferizaj-corridor-unsplash.jpg', 'Logistics roadway and trucking infrastructure', 'news', 'news-ferizaj-route-reliability'),
  ('67504bca-7489-43b0-8759-b7b03c298a38', 'euromiti-media', 'seed/news-contactless-payments-unsplash.jpg', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=960&q=80', 'image/jpeg', 0, 'news-contactless-payments-unsplash.jpg', 'Payment terminal interaction', 'news', 'news-contactless-rollout-complete')
ON CONFLICT (id) DO UPDATE SET
  public_url = excluded.public_url,
  alt_text = excluded.alt_text,
  category = excluded.category,
  usage_section = excluded.usage_section;

INSERT INTO public.news_posts (
  slug,
  status,
  title,
  excerpt,
  category,
  teaser_label,
  published_at,
  hero_media_id,
  hero_image_alt,
  body
)
VALUES
  (
    'expansion-in-prishtina',
    'published',
    'Expansion in the Heart of Prishtina',
    'Euromiti deepens coverage in the capital with renewed forecourt lighting and refreshed retail bays.',
    'Company Updates',
    'Network update',
    '2026-04-18T00:00:00Z',
    '9f351a53-2151-404c-9397-1dd0b4b7ace9',
    'Executive handshake overlooking the city skyline',
    '[
      "Prishtina travellers will notice brighter, safer forecourts as Euromiti completes a capital-wide refresh of LED lighting, canopy refinishing, and modernised pump islands.",
      "Retail bays are being re-merchandised for faster grab-and-go journeys, with expanded coffee, pastry, and travel essentials tailored to morning commuters.",
      "The programme keeps operations live 24/7 on our flagship route while teams work in phased night windows to limit disruption for drivers and corporate accounts.",
      "We extend our thanks to municipal partners and neighbours for their collaboration as we elevate the roadside experience in Kosovo’s economic centre."
    ]'::jsonb
  ),
  (
    'path-to-zero-emissions',
    'published',
    'Our Path to Cleaner Operations',
    'Solar readiness studies and efficiency upgrades are rolling out across every Euromiti location.',
    'Sustainability',
    'Sustainability',
    '2026-03-22T00:00:00Z',
    'e9c40365-89b8-4611-af09-036229394a6c',
    'Solar panels with blue sky',
    '[
      "Energy efficiency is now an operating priority: we are auditing every location for LED retrofits, refrigeration performance, and optimised HVAC cycles without compromising guest comfort.",
      "Solar feasibility studies are underway roof-by-roof with local engineers, targeting partial on-site generation before wider battery storage trials.",
      "Fleet and logistics partners will see consolidated reporting on embodied carbon for major construction packages as we align procurement with EU disclosure norms.",
      "This roadmap is iterative — we will publish milestone updates as audits complete and pilots go live across Prishtina, Ferizaj, and Gjilan."
    ]'::jsonb
  ),
  (
    'premium-diesel-launch',
    'published',
    'Premium Diesel Euro 5+ Launch',
    'Drivers can now access our latest certified diesel blend tuned for modern EURO engines.',
    'Innovation',
    'Innovation',
    '2026-02-05T00:00:00Z',
    'c757ace3-f691-4058-956e-9e8c4fbd0d43',
    'Close-up of a fuel dispenser nozzle',
    '[
      "Euromiti Premium Diesel Euro 5+ is formulated for modern high-pressure common rail engines, helping sustain fuel-system cleanliness alongside everyday performance.",
      "Dispensers clearly label the new blend; attendants remain on hand nightly to advise hauliers and touring drivers who rely on torque for Kosovo’s motorway grades.",
      "Quality assurance includes batched certifications with independent labs — traceability slips are archived for corporate fuel partners who audit their supply chains.",
      "Thank you for choosing Euromiti as your dependable roadside partner — we continue to invest in fuels that reflect European standards and Kosovo’s ambitions."
    ]'::jsonb
  ),
  (
    'stem-scholarship-2026',
    'published',
    'Euromiti STEM Scholarship Programme 2026',
    'Applications are open for students pursuing engineering and energy disciplines — mentoring and awards across our Kosovo network.',
    'Community',
    'Community',
    '2026-01-28T00:00:00Z',
    'be5657a0-f5de-401c-acb2-265b69fb64d5',
    'Team collaborating in a bright workspace',
    '[
      "Euromiti is deepening its commitment to young talent through a structured STEM scholarship with mentoring from operations and hospitality leaders.",
      "Eligible applicants are enrolled in accredited Kosovo universities and demonstrate academic strength alongside community involvement.",
      "Recipients receive phased awards aligned with semesters, invitations to facility tours, and optional summer placements at Euromiti stations.",
      "The programme reflects our belief that Kosovo’s corridor economy thrives when technical skills meet practical roadside experience."
    ]'::jsonb
  ),
  (
    'ferizaj-route-reliability',
    'published',
    'Ferizaj Corridor Hours & Hospitality Refresh',
    'Extended evening cover and redesigned restaurant pacing keep the central route dependable for fleets and families.',
    'Company Updates',
    'Company Updates',
    '2026-01-12T00:00:00Z',
    '73e21531-49ee-4c7b-ad68-87a14c6d4c9c',
    'Logistics roadway and trucking infrastructure',
    '[
      "Fleet managers servicing Prishtina–Gjilan routes will find expanded evening concierge support at Euromiti Ferizaj with clarified pump priority lanes.",
      "Restaurant seating and kitchen choreography were tuned for faster table turns during peak commuter windows without shortening guest rest time.",
      "Digital queue boards pilot at the dessert counter minimise crowding — feedback from January guests already shows higher satisfaction scores.",
      "Operational leadership will publish KPI snapshots quarterly so partners can benchmark dwell time against regional averages."
    ]'::jsonb
  ),
  (
    'contactless-rollout-complete',
    'published',
    'Contactless Payments Across Every Euromiti Pump Lane',
    'Tap-to-pay terminals now standard indoor and outdoor, reducing queue friction during winter peaks.',
    'Innovation',
    'Innovation',
    '2025-12-08T00:00:00Z',
    '67504bca-7489-43b0-8759-b7b03c298a38',
    'Payment terminal interaction',
    '[
      "We completed a network-wide rollout of EMV-certified contactless readers tethered to each dispenser head and cashier island.",
      "Attendants underwent scenario training for receipt requests, VAT documentation, and corporate account reconciliation.",
      "Security operations monitor transaction velocity with anomaly alerts while PCI scope remains partitioned from guest Wi-Fi.",
      "Drivers who prefer prepaid wallet integrations can watch for pilot announcements mid-year as we certify partners."
    ]'::jsonb
  )
ON CONFLICT (slug) DO NOTHING;
