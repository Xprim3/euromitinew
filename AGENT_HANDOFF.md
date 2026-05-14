# Agent handoff — Euromiti

Last updated for continuity: **2026-05-14** (workspace session).

## How to use this file

- Update this file when you finish a meaningful chunk of work or before switching agents.
- Keep it factual: what changed, what is untested, what migrations still need applying.

## Project quick facts

- **Stack:** Next.js 16 (App Router), React 19, Tailwind v4, Supabase (Postgres + auth + storage).
- **Rules:** Read `AGENTS.md` / `CLAUDE.md`; Next.js APIs may differ from older training — check `node_modules/next/dist/docs/` when unsure.
- **Verify locally:** `npm run lint`, `npm run build`.

## Where we left off (recent work)

### About page (`/about`)

- **Owner section:** Added under the first “Kush jemi” story block; image on the right; CMS-backed.
- **Removed:** Small “PRONARI” kicker on public owner section; “Standard i qëndrueshëm” callout under story; admin visible “Small label” for owner (still submitted as hidden field for DB compatibility).
- **Owner image:** Uses `object-cover object-center` in `AboutPageView`.
- **Key files:** `components/about/AboutPageView.tsx`, `lib/data/about-content-public.ts`, `components/admin/AboutContentForm.tsx`, `app/admin/(panel)/about/actions.ts`, `types/supabase-cms.ts`.

### Services page (`/services`)

- **“Why Choose Euromiti” dark section:** No longer hardcoded English. Albanian defaults + **editable in** `/admin/services` (kicker, title, body, featured title/body, four cards). Data: new text columns + `why_sections_json` for cards.
- **Nearest location CTA:** Heading, description, and button translated to Albanian in `ServicesPageView` (still **not** CMS — only copy in component).
- **Key files:** `components/services/ServicesPageView.tsx`, `lib/data/services-content-public.ts`, `components/admin/ServicesContentForm.tsx`, `app/admin/(panel)/services/actions.ts`, `lib/validations/services-content.ts`, `types/supabase-cms.ts`.

## Migrations the next deploy / DB must include

Apply in order if not already on the remote DB:

| Migration | Purpose |
|-----------|---------|
| `20260513183000_add_about_owner_section.sql` | About owner fields + `owner_media_id` |
| `20260513184000_services_why_choose_cms_copy.sql` | Services why-choose text columns + seed `why_sections_json` when empty |

(Other recent chain items in repo: `20260513182000_services_all_section_highlights.sql`, homepage/about seeds — ensure full migration history is applied on Supabase.)

## Optional follow-ups (not done unless requested)

- Move the **services “nearest location”** block from hardcoded Albanian in `ServicesPageView` into `services_content` + admin form (parity with why-choose CMS).
- Expose **featured Material icon** for the services why-choose panel in admin (currently fixed to `shield_with_heart` in resolver defaults / UI).
- **Services page hero / breadcrumbs** may still be English in places — audit `ServicesPageView` + `PageImageHero` trail if full Albanian is required.

## Useful paths

| Area | Path |
|------|------|
| Public About | `app/about/`, `components/about/AboutPageView.tsx` |
| Admin About | `app/admin/(panel)/about/` |
| Public Services | `app/services/`, `components/services/ServicesPageView.tsx` |
| Admin Services | `app/admin/(panel)/services/` |
| CMS types | `types/supabase-cms.ts` |
| Migrations | `supabase/migrations/` |

---

*Next agent: skim this file, run migrations on Supabase if needed, then `npm run build` before larger changes.*
