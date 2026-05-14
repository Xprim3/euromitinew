import { z } from "zod"

const text = z.string().trim()

export const ADMIN_RESTAURANT_MENU_SLOTS = 6
export const ADMIN_RESTAURANT_GALLERY_SLOTS = 5
/** Four-column promise band between Skanom and atmosphere gallery. */
export const ADMIN_RESTAURANT_PILLAR_SLOTS = 4

export const restaurantContentFormSchema = z.object({
  hero_title: text.max(240),
  hero_subtitle: text.max(1200),
  intro_eyebrow: text.max(160),
  intro_headline_line1: text.max(240),
  intro_headline_line2: text.max(240),
  intro_body: text.max(12000),
  hero_image_alt: text.max(500).optional(),
  skanom_eyebrow: text.max(120),
  skanom_title: text.max(240),
  skanom_description: text.max(2400),
  skanom_cta_label: text.max(120),
  skanom_cta_href: text.max(500),
  skanom_image_alt: text.max(500).optional(),
  editorial_eyebrow: text.max(160),
  editorial_title_line1: text.max(240),
  editorial_title_line2: text.max(240),
  editorial_description: text.max(2400),
  editorial_quote_line: text.max(500),
  editorial_quote_attribution: text.max(320),
  editorial_image_alt: text.max(500).optional(),
  intro_image_alt: text.max(500).optional(),
})

export type RestaurantContentFormParsed = z.infer<typeof restaurantContentFormSchema>
