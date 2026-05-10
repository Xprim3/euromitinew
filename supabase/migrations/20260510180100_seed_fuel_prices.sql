-- Optional seed aligning with mocks — safe to run after Phase 6 schema (idempotent).
INSERT INTO public.fuel_prices (product_key, fuel_type, price_numeric, currency, label_status)
VALUES
  ('diesel', 'Euro Diesel', 1.340, 'EUR', 'active'),
  ('euro95', 'Euro 95', 1.380, 'EUR', 'active'),
  ('lpg', 'LPG', 0.720, 'EUR', 'updated')
ON CONFLICT (product_key) DO NOTHING;
