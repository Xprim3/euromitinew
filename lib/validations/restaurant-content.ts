import { z } from "zod"

const text = z.string().trim()

export const ADMIN_RESTAURANT_MENU_SLOTS = 8
export const ADMIN_RESTAURANT_GALLERY_SLOTS = 2

export const restaurantContentFormSchema = z.object({
  hero_title: text.max(240),
  hero_subtitle: text.max(1200),
  hero_description: text.max(12000),
  opening_hours: text.max(2400),
  contact_phone: text.max(160),
  contact_email: z
    .string()
    .trim()
    .max(200)
    .refine((s) => s.length === 0 || z.string().email().safeParse(s).success, "Invalid email"),
  contact_notes: text.max(2400),
  hero_image_alt: text.max(500).optional(),
  skanom_eyebrow: text.max(120),
  skanom_title: text.max(240),
  skanom_description: text.max(2400),
  skanom_cta_label: text.max(120),
  skanom_cta_href: text.max(500),
  skanom_image_alt: text.max(500).optional(),
})

export type RestaurantContentFormParsed = z.infer<typeof restaurantContentFormSchema>
