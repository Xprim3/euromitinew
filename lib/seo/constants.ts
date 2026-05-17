/**
 * SEO data policy: never invent address, phone, opening hours, geo coordinates,
 * or other factual business fields. Use CMS/public data only; omit JSON-LD fields
 * when empty. Ask the site owner before adding missing real details.
 */

/** Canonical production domain (override with NEXT_PUBLIC_SITE_URL). */
export const DEFAULT_SITE_URL = "https://www.euromiti-ks.com"

export const SITE_NAME = "Euromiti"

export const SITE_LOCALE = "sq_AL"

/** Default meta description for home, Open Graph, and site-wide fallbacks. */
export const SITE_DEFAULT_DESCRIPTION =
  "Euromiti është kompani moderne në Kosovë që ofron karburant cilësor, restaurant, autolarje në Ferizaj, Prishtinë dhe Gjilan, me shërbim profesional dhe përkushtim ndaj klientit."

export const SITE_DEFAULT_TITLE = "Euromiti - Faqja Zyrtare"

/**
 * Default social preview (Facebook, WhatsApp, LinkedIn, X).
 * File: `public/logo.png` — use PNG/JPEG here; SVG is not supported by most platforms.
 */
export const DEFAULT_OG_IMAGE_PATH = "/logo.png"

export const DEFAULT_KEYWORDS = [
  "Euromiti",
  "karburant",
  "stacion karburanti",
  "Kosovë",
  "Prishtinë",
  "Ferizaj",
  "Gjilan",
  "restaurant",
  "autolarje",
  "mini market",
  "benzinë",
  "naftë",
] as const

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!raw) return DEFAULT_SITE_URL
  try {
    return new URL(raw).origin
  } catch {
    return DEFAULT_SITE_URL
  }
}
