import { z } from "zod"

export const aboutContentTextSchema = z.object({
  hero_title: z.string().trim().max(240),
  hero_subtitle: z.string().trim().max(1200),
  mission_title: z.string().trim().max(160),
  mission_body: z.string().trim().max(8000),
  vision_title: z.string().trim().max(160),
  vision_body: z.string().trim().max(8000),
  company_story_paragraphs: z.string().trim().max(30000),
  why_choose_heading: z.string().trim().max(180),
  offer_label: z.string().trim().max(120),
  offer_title: z.string().trim().max(240),
  offer_description: z.string().trim().max(1200),
  offer_fuel_title: z.string().trim().max(160),
  offer_fuel_body: z.string().trim().max(2000),
  offer_restaurant_title: z.string().trim().max(160),
  offer_restaurant_body: z.string().trim().max(2000),
  offer_playground_title: z.string().trim().max(160),
  offer_playground_body: z.string().trim().max(2000),
  offer_carwash_title: z.string().trim().max(160),
  offer_carwash_body: z.string().trim().max(2000),
  offer_mini_market_title: z.string().trim().max(160),
  offer_mini_market_body: z.string().trim().max(2000),
  hero_image_alt: z.string().trim().max(500).optional(),
  story_image_alt: z.string().trim().max(500).optional(),
  gallery_strip_alt: z.string().trim().max(500).optional(),
  gallery_why_alt: z.string().trim().max(500).optional(),
  gallery_partner_alt: z.string().trim().max(500).optional(),
})

export type AboutContentTextInput = z.infer<typeof aboutContentTextSchema>
