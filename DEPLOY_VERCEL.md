# Vercel deployment — Euromiti

## Prerequisites

- GitHub (or GitLab/Bitbucket) repo connected to [Vercel](https://vercel.com/).
- Production domain DNS pointed at Vercel when ready.

## One-time project setup

1. **Import repo** → Framework Preset **Next.js** (auto).
2. **Root directory:** repository root (`euromiti`).
3. **Build:** `npm run build` · **Install:** default `npm install`.
4. **Environment variables** — add each for Production (and Preview if you want Supabase previews):

| Variable                     | Purpose |
|-----------------------------|---------|
| `NEXT_PUBLIC_SITE_URL`      | Production URL (`https://your-domain.com`). Drives metadata base, `sitemap.xml`, `robots.txt`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key (RLS-enforced reads). |
| `REVALIDATE_SECRET` _(optional)_ | Long random secret. Enables `POST /api/revalidate` with `Authorization: Bearer <secret>` to refresh ISR caches (e.g. after editing `fuel_prices` in the dashboard). |

Do **not** add `SUPABASE_SERVICE_ROLE_KEY` unless you intentionally use it in dedicated server routes (never `NEXT_PUBLIC_*`).

## After deploy

1. Open **Deployments → first production URL** and smoke-test `/`, `/news`, `/admin/login`.
2. **Supabase Storage:** if `<Image>` sources use public buckets under `*.supabase.co`, `next.config.ts` already allows those hostnames.
3. **Database:** run SQL migrations (`supabase/migrations`) on your hosted Supabase project.

## ISR / CMS refresh

Homepage fuel strip uses `revalidate = 120` seconds. To flush immediately after a DB change:

```bash
curl -X POST "https://YOUR_VERCEL_URL/api/revalidate" \
  -H "Authorization: Bearer YOUR_REVALIDATE_SECRET" \
  -H "Content-Type: application/json" \
  -d "{\"paths\":[\"/\"]}"
```

## Admin “save to database”

Admin forms are still **UI-first**; persisting edits requires authenticated Supabase (or server actions with role key) in a follow-up. Until then: edit data in Supabase Table Editor and **revalidate** as above.

## Production checklist

- [ ] `NEXT_PUBLIC_SITE_URL` matches canonical domain  
- [ ] No secrets in `.env.example` — only placeholders  
- [ ] Run `npm run lint` && `npm run build` locally on `main` before merge  
- [ ] `/robots.txt` and `/sitemap.xml` reachable  
