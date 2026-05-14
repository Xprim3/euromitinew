import { z } from "zod"

const optionalUrl = z
  .string()
  .trim()
  .max(2000)
  .refine((s) => s.length === 0 || /^https?:\/\//i.test(s), "Use a full URL starting with http:// or https://")

export const siteContactFormSchema = z.object({
  phone: z.string().trim().min(1, "Phone is required.").max(120),
  email: z.string().trim().min(1, "Email is required.").email(),
  hq_address: z.string().trim().min(1, "Address is required.").max(2000),
  map_link: optionalUrl,
  weekday_hours: z.string().trim().max(500).optional(),
  weekend_hours: z.string().trim().max(500).optional(),
  hq_eyebrow: z.string().trim().max(200).optional(),
  hq_heading: z.string().trim().max(500).optional(),
  hq_description: z.string().trim().max(4000).optional(),
})

export type SiteContactFormParsed = z.infer<typeof siteContactFormSchema>

export type SocialLinkInput = { platform: string; url: string }

export function socialLinksFromFormData(formData: FormData, slots = 6): SocialLinkInput[] {
  const out: SocialLinkInput[] = []
  for (let i = 0; i < slots; i++) {
    const platform = String(formData.get(`social_platform_${i}`) ?? "").trim()
    const url = String(formData.get(`social_url_${i}`) ?? "").trim()
    if (!url) continue
    out.push({ platform: platform || "Link", url })
  }
  return out
}

export function validateSocialUrls(links: SocialLinkInput[]): string | null {
  for (const { url } of links) {
    if (!/^https?:\/\//i.test(url)) return `Social URL must start with http:// or https:// (${url})`
  }
  return null
}
