import { z } from "zod"

const href = z
  .string()
  .trim()
  .min(1, "Required")
  .max(500)
  .refine(
    (v) =>
      v.startsWith("/") ||
      v.startsWith("http://") ||
      v.startsWith("https://") ||
      v.startsWith("#") ||
      v.startsWith("mailto:") ||
      v.startsWith("tel:"),
    "Use a path (/) or full URL"
  )

const alt = z.string().trim().max(500).optional()

export const homepageContentFormSchema = z
  .object({
    hero_headline_line1: z.string().trim().max(240),
    hero_headline_line2: z.string().trim().max(240),
    hero_subtitle: z.string().trim().max(1200),
    hero_cta_primary_label: z.string().trim().min(1, "Primary button label is required").max(120),
    hero_cta_primary_href: href,
    hero_cta_secondary_label: z.string().trim().max(120),
    hero_cta_secondary_href: z.string().trim().max(500),
    about_preview_text: z.string().trim().max(4000),
    restaurant_highlight_text: z.string().trim().max(4000),
    carwash_intro_text: z.string().trim().max(4000),
    mini_market_intro_text: z.string().trim().max(4000),
    hero_image_alt: alt,

    services_intro_title: z.string().trim().max(200),
    services_intro_body: z.string().trim().max(4000),
    locations_band_kicker: z.string().trim().max(120),
    locations_band_heading: z.string().trim().max(240),
    locations_band_subtitle: z.string().trim().max(600),
    restaurant_home_headline_primary: z.string().trim().max(240),
    restaurant_home_headline_accent: z.string().trim().max(240),

    services_intro_image_alt: alt,
    restaurant_main_alt: alt,
    restaurant_float_1_alt: alt,
    restaurant_float_2_alt: alt,
    carwash_image_alt: alt,
    mini_market_image_alt: alt,
  })
  .superRefine((val, ctx) => {
    if (!val.hero_cta_secondary_label) return
    const r = href.safeParse(val.hero_cta_secondary_href)
    if (!r.success) {
      ctx.addIssue({
        code: "custom",
        path: ["hero_cta_secondary_href"],
        message: "Use a path (/) or full URL for the second button",
      })
    }
  })

export type HomepageContentFormInput = z.infer<typeof homepageContentFormSchema>
