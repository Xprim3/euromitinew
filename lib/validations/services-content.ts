import { z } from "zod"

const text = z.string().trim()

const alt = text.max(500).optional()

export const servicesContentFormSchema = z.object({
  hero_page_title: text.max(240),
  hero_page_subtitle: text.max(1600),
  why_choose_kicker: text.max(120),
  why_choose_title: text.max(240),
  why_choose_body: text.max(1600),
  why_choose_featured_title: text.max(240),
  why_choose_featured_body: text.max(1600),

  petrol_section_title: text.max(240),
  petrol_description: text.max(5000),

  restaurant_section_title: text.max(240),
  restaurant_description: text.max(5000),

  carwash_section_title: text.max(240),
  carwash_description: text.max(5000),

  mini_market_section_title: text.max(240),
  mini_market_description: text.max(5000),

  petrol_highlights: z.string().max(32000),
  restaurant_highlights: z.string().max(32000),
  carwash_highlights: z.string().max(32000),
  mini_market_highlights: z.string().max(32000),

  petrol_image_alt: alt,
  restaurant_image_alt: alt,
  carwash_image_alt: alt,
  mini_market_image_alt: alt,
})

export type ServicesContentFormInput = z.infer<typeof servicesContentFormSchema>

const MAX_SERVICE_HIGHLIGHTS = 24
const MAX_HIGHLIGHT_CHARS = 300

/** One bullet per line; empty lines omitted. Used by admin save action. */
export function parseServiceHighlightsLines(raw: string, label = "Bullets"):
  | { ok: true; value: string[] }
  | { ok: false; message: string } {
  const lines = raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)

  if (lines.length > MAX_SERVICE_HIGHLIGHTS) {
    return { ok: false, message: `${label}: at most ${MAX_SERVICE_HIGHLIGHTS} lines.` }
  }
  for (const line of lines) {
    if (line.length > MAX_HIGHLIGHT_CHARS) {
      return { ok: false, message: `${label}: each line must be ${MAX_HIGHLIGHT_CHARS} characters or fewer.` }
    }
  }

  return { ok: true, value: lines }
}

export function parsePetrolHighlightsLines(raw: string) {
  return parseServiceHighlightsLines(raw, "Petrol bullets")
}
