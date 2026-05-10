import { z } from "zod"

const text = z.string().trim()

const alt = text.max(500).optional()

export const servicesContentFormSchema = z.object({
  hero_page_title: text.max(240),
  hero_page_subtitle: text.max(1600),

  petrol_section_title: text.max(240),
  petrol_description: text.max(5000),

  restaurant_section_title: text.max(240),
  restaurant_description: text.max(5000),

  carwash_section_title: text.max(240),
  carwash_description: text.max(5000),

  mini_market_section_title: text.max(240),
  mini_market_description: text.max(5000),

  petrol_highlights: z.string().max(32000),

  petrol_image_alt: alt,
  restaurant_image_alt: alt,
  carwash_image_alt: alt,
  mini_market_image_alt: alt,
})

export type ServicesContentFormInput = z.infer<typeof servicesContentFormSchema>

const MAX_PETROL_HIGHLIGHTS = 24
const MAX_HIGHLIGHT_CHARS = 300

/** One bullet per line; empty lines omitted. Used by admin save action. */
export function parsePetrolHighlightsLines(raw: string):
  | { ok: true; value: string[] }
  | { ok: false; message: string } {
  const lines = raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)

  if (lines.length > MAX_PETROL_HIGHLIGHTS) {
    return { ok: false, message: `Petrol bullets: at most ${MAX_PETROL_HIGHLIGHTS} lines.` }
  }
  for (const line of lines) {
    if (line.length > MAX_HIGHLIGHT_CHARS) {
      return { ok: false, message: `Each bullet must be ${MAX_HIGHLIGHT_CHARS} characters or fewer.` }
    }
  }

  return { ok: true, value: lines }
}
