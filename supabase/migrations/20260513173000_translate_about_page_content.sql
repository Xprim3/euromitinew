-- Translate existing seeded About page content to Albanian.
-- Only replaces the original English seed values, preserving later admin edits.

UPDATE public.about_content
SET hero_title = 'Rreth Euromitit'
WHERE id = 1
  AND hero_title = 'About Euromiti';

UPDATE public.about_content
SET hero_subtitle = 'Një rrjet i organizuar shërbimesh në Prishtinë, Ferizaj dhe Gjilan, që bashkon karburante cilësore, restaurant, komoditet dhe kujdes për veturën.'
WHERE id = 1
  AND hero_subtitle = 'A disciplined roadside network anchored in Prishtina, Ferizaj, and Gjilan - blending premium fuels with dining, convenience, and car care.';

UPDATE public.about_content
SET company_story = '[
  "Euromiti operon një rrjet të organizuar pikash shërbimi në Kosovë, duke bashkuar karburante të besueshme me restaurant, mini market dhe kujdes për veturën aty ku udhëtarët kanë më shumë nevojë.",
  "Nga Prishtina në Ferizaj dhe Gjilan, ekipet tona kujdesen për ambiente të ndriçuara, të sigurta, rafte të përgatitura me kujdes dhe mikpritje për klientët lokalë dhe udhëtarët në rrugë."
]'::jsonb
WHERE id = 1
  AND company_story = '[
    "Euromiti operates a disciplined network of forecourts across Kosovo - pairing dependable fuels with dining, mini market essentials, and car care where travellers need them most.",
    "From Prishtina to Ferizaj and Gjilan, our teams obsess over bright, safe canopy experiences, thoughtfully stocked aisles, and hospitality that honours both locals and highway guests."
  ]'::jsonb;

UPDATE public.about_content
SET
  mission_title = 'Misioni',
  mission_body = 'Të ofrojmë një përvojë premium në rrugë, të qëndrueshme dhe njerëzore, të mbështetur në furnizim të sigurt me karburant dhe kulturë të sinqertë shërbimi.'
WHERE id = 1
  AND mission_title = 'Mission'
  AND mission_body = 'Deliver a premium roadside experience that feels consistent, humane, and unmistakably European - anchored by safe fuelling and genuine service culture.';

UPDATE public.about_content
SET
  vision_title = 'Vizioni',
  vision_body = 'Të jemi standardi i Kosovës për mikpritje të integruar në lëvizje: karburante të besueshme, restorante të qeta, market praktik dhe hapësira të pastra për çdo udhëtim.'
WHERE id = 1
  AND vision_title = 'Vision'
  AND vision_body = 'Be Kosovo''s benchmark for integrated mobility hospitality: trusted fuels, calm restaurants, purposeful retail, and spotless lanes that welcome every journey.';

UPDATE public.about_content
SET values_json = '[
  {"icon_material":"verified","title":"Besueshmëri","body":"Ndërtojmë cilësi të qëndrueshme në karburant, ushqim dhe shërbim, që klientët ta dinë gjithmonë çfarë të presin."},
  {"icon_material":"favorite","title":"Kujdes","body":"Nga pastërtia e stacionit te mbështetja e klientit, çdo vizitë trajtohet si moment mikpritjeje premium."},
  {"icon_material":"trending_up","title":"Përparim","body":"Përmirësojmë vazhdimisht standardet, trajnimin dhe përvojën në stacione për të ngritur standardin në Kosovë."},
  {"icon_material":"handshake","title":"Integritet","body":"Veprojmë me transparencë dhe përgjegjësi ndaj klientëve, partnerëve dhe komuniteteve."},
  {"icon_material":"groups_3","title":"Punë ekipore","body":"Stacionet tona funksionojnë si një ekip i koordinuar për të ofruar shërbim të qëndrueshëm çdo ditë."},
  {"icon_material":"bolt","title":"Efikasitet","body":"Përmirësojmë rrjedhën e punës për të kursyer kohën e klientëve pa cenuar cilësinë."}
]'::jsonb
WHERE id = 1
  AND values_json = '[
    {"icon_material":"verified","title":"Reliability","body":"We build predictable quality into fuel, food, and service so customers always know what to expect."},
    {"icon_material":"favorite","title":"Care","body":"From forecourt cleanliness to guest support, we treat every visit as a premium hospitality moment."},
    {"icon_material":"trending_up","title":"Progress","body":"We continuously refine standards, training, and station experiences to raise the benchmark in Kosovo."},
    {"icon_material":"handshake","title":"Integrity","body":"We act transparently and responsibly in how we serve guests, partners, and communities."},
    {"icon_material":"groups_3","title":"Teamwork","body":"Our stations perform as one coordinated team to deliver consistent service every day."},
    {"icon_material":"bolt","title":"Efficiency","body":"We improve operational flow to save customer time without compromising quality."}
  ]'::jsonb;
