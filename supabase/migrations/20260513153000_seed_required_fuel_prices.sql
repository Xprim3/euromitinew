-- Ensure the public homepage has the three required active fuel rows.
-- Existing admin-edited prices are not overwritten.

INSERT INTO public.fuel_prices (
  product_key,
  fuel_type,
  price_numeric,
  currency,
  label_status,
  is_active
)
VALUES
  ('diesel', 'Diesel', 1.340, 'EUR', 'active', TRUE),
  ('euro95', 'Petrol', 1.380, 'EUR', 'active', TRUE),
  ('lpg', 'LPG', 0.720, 'EUR', 'updated', TRUE)
ON CONFLICT (product_key) DO NOTHING;
