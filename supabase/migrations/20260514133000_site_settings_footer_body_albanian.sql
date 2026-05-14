-- Replace legacy English footer tagline with Albanian default (idempotent for already-updated DBs).

UPDATE public.site_settings
SET
  footer_body = 'Një rrjet modern karburanti dhe shërbimesh në Prishtinë, Ferizaj dhe Gjilan, që bashkon cilësinë, komoditetin dhe mikpritjen profesionale për një përvojë të plotë në çdo ndalesë.'
WHERE
  id = 1
  AND position('Pioneering transit fuel' in footer_body) > 0;
