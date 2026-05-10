import { z } from "zod"

export const aboutContentTextSchema = z.object({
  hero_title: z.string().trim().max(240),
  hero_subtitle: z.string().trim().max(1200),
  mission_title: z.string().trim().max(160),
  mission_body: z.string().trim().max(8000),
  vision_title: z.string().trim().max(160),
  vision_body: z.string().trim().max(8000),
  company_story_paragraphs: z.string().trim().max(30000),
  hero_image_alt: z.string().trim().max(500).optional(),
  story_image_alt: z.string().trim().max(500).optional(),
  gallery_strip_alt: z.string().trim().max(500).optional(),
  gallery_why_alt: z.string().trim().max(500).optional(),
  gallery_partner_alt: z.string().trim().max(500).optional(),
})

export type AboutContentTextInput = z.infer<typeof aboutContentTextSchema>
