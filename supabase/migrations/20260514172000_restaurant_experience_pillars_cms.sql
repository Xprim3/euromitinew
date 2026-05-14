-- Four-column experience pillars (between Skanom and atmosphere gallery).

ALTER TABLE public.restaurant_content
  ADD COLUMN IF NOT EXISTS experience_pillars_json jsonb NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.restaurant_content.experience_pillars_json IS 'Ordered array of {title, body} for the four experience pillar cards on /restaurant.';

UPDATE public.restaurant_content
SET
  experience_pillars_json = $j$
[
  {"title":"Purity of Origin","body":"We work with growers and distributors we trust across the region so every ingredient clears the same freshness and traceability benchmarks as our fuels."},
  {"title":"Quiet Luxury","body":"Interiors favour calm materials, natural light on the banquettes, and an acoustic plan that keeps conversations private even when the room is humming."},
  {"title":"Intuitive Service","body":"Hosting is understated: pacing is read from the table, allergens and wine notes are clarified without flourish, and the team moves as one disciplined floor."},
  {"title":"Total Well-being","body":"Kitchen and dining protocols align with Euromiti's wider hygiene ladder — from line checks to plated delivery — so comfort extends beyond flavour alone."}
]
$j$::jsonb
WHERE id = 1;
