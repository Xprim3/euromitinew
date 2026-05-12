-- Make the About page "Why Choose Us" reasons editable from About admin.

ALTER TABLE public.about_content
  ADD COLUMN IF NOT EXISTS why_choose_heading TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS why_choose_reasons_json JSONB NOT NULL DEFAULT '[]'::jsonb;

UPDATE public.about_content
SET
  why_choose_heading = COALESCE(NULLIF(why_choose_heading, ''), 'Pse të na zgjidhni'),
  why_choose_reasons_json = CASE
    WHEN jsonb_typeof(why_choose_reasons_json) = 'array' AND jsonb_array_length(why_choose_reasons_json) > 0
      THEN why_choose_reasons_json
    ELSE
      '[
        {
          "icon_material": "verified",
          "title": "Standarde të qëndrueshme cilësie",
          "body": "Standarde të unifikuara për karburantin, pastërtinë dhe gatishmërinë e shërbimit."
        },
        {
          "icon_material": "groups",
          "title": "Ekipe me kulturë mikpritjeje",
          "body": "Shërbim i respektueshëm dhe efikas, i ndërtuar rreth kujdesit real për klientin."
        },
        {
          "icon_material": "bolt",
          "title": "Përvojë e shpejtë dhe e besueshme",
          "body": "Qarkullim i optimizuar në stacion dhe shërbime të shpejta për ndalesa më të lehta."
        },
        {
          "icon_material": "workspace_premium",
          "title": "Ekosistem premium në rrugë",
          "body": "Karburant, restaurant, market, autolarje dhe shërbime familjare në një vend."
        },
        {
          "icon_material": "construction",
          "title": "Stacione të pastra dhe të mirëmbajtura",
          "body": "Mirëmbajtja e rregullt i mban stacionet të ndriçuara, të sigurta dhe funksionale."
        },
        {
          "icon_material": "support_agent",
          "title": "Mbështetje lokale e shpejtë",
          "body": "Ekipet në lokacion i zgjidhin kërkesat shpejt, me përgjegjësi praktike dhe lokale."
        }
      ]'::jsonb
  END
WHERE id = 1;
