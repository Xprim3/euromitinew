import { cache } from "react"

import { contactPageMock } from "@/data/mock/contact"
import { createPublicSupabaseServerClient } from "@/lib/supabase/public-server-client"
import type { ContactInfoRow } from "@/types/supabase-cms"

export type SocialLinkItem = { platform: string; url: string }

export type SiteFooterPublic = {
  companyName: string
  logoUrl: string | null
  logoAlt: string
  footerBody: string
  /** Shown after © {year} — e.g. "Euromiti Kosovo" */
  footerCopyrightLine: string
  socialLinks: SocialLinkItem[]
}

export type ContactDetailsPublic = {
  phone: string
  email: string
  hqAddress: string
  mapLink: string
  /** /contact HQ band — upper label (falls back to mock when CMS empty). */
  hqEyebrow: string
  /** /contact HQ band — main title */
  hqHeading: string
  /** /contact HQ band — intro paragraph */
  hqDescription: string
  weekdayHours: string
  weekendHours: string
  careersEmail: string
  /** Label for the careers CTA button (e.g. “Apply by Email”). */
  careersApplyCtaLabel: string
  socialLinks: SocialLinkItem[]
}

const DEFAULT_FOOTER_BODY =
  "Një rrjet modern karburanti dhe shërbimesh në Prishtinë, Ferizaj dhe Gjilan, që bashkon cilësinë, komoditetin dhe mikpritjen profesionale për një përvojë të plotë në çdo ndalesë."

export function parseSocialLinks(raw: unknown): SocialLinkItem[] {
  if (!Array.isArray(raw)) return []
  const out: SocialLinkItem[] = []
  for (const item of raw) {
    if (!item || typeof item !== "object") continue
    const o = item as Record<string, unknown>
    const platform = typeof o.platform === "string" ? o.platform.trim() : ""
    const url = typeof o.url === "string" ? o.url.trim() : ""
    if (platform && url) out.push({ platform, url })
  }
  return out
}

function defaultFooter(): SiteFooterPublic {
  return {
    companyName: "Euromiti",
    logoUrl: null,
    logoAlt: "Euromiti",
    footerBody: DEFAULT_FOOTER_BODY,
    footerCopyrightLine: "Euromiti. Të gjitha të drejtat e rezervuara.",
    socialLinks: [],
  }
}

function defaultContact(): ContactDetailsPublic {
  const m = contactPageMock
  return {
    phone: m.phone,
    email: m.email,
    hqAddress: m.hqAddressCompact,
    mapLink: m.googleMapsUrl,
    hqEyebrow: m.hqEyebrow,
    hqHeading: m.hqHeading,
    hqDescription: m.hqDescription,
    weekdayHours: m.weekdayHours,
    weekendHours: m.weekendHours,
    careersEmail: m.careersEmail,
    careersApplyCtaLabel: m.careersCtaApplyByEmail,
    socialLinks: [],
  }
}

function normalizeContactInfo(raw: Record<string, unknown>): ContactInfoRow {
  return {
    id: Number(raw.id) || 1,
    phone: typeof raw.phone === "string" ? raw.phone : "",
    email: typeof raw.email === "string" ? raw.email : "",
    hq_address: typeof raw.hq_address === "string" ? raw.hq_address : "",
    map_link: typeof raw.map_link === "string" ? raw.map_link : "",
    social_links: raw.social_links ?? [],
    weekday_hours: typeof raw.weekday_hours === "string" ? raw.weekday_hours : null,
    weekend_hours: typeof raw.weekend_hours === "string" ? raw.weekend_hours : null,
    careers_email: typeof raw.careers_email === "string" ? raw.careers_email : null,
    careers_apply_instructions: typeof raw.careers_apply_instructions === "string" ? raw.careers_apply_instructions : null,
    hq_eyebrow: typeof raw.hq_eyebrow === "string" ? raw.hq_eyebrow : "",
    hq_heading: typeof raw.hq_heading === "string" ? raw.hq_heading : "",
    hq_description: typeof raw.hq_description === "string" ? raw.hq_description : "",
    updated_at: typeof raw.updated_at === "string" ? raw.updated_at : "",
    updated_by: typeof raw.updated_by === "string" ? raw.updated_by : null,
  }
}

export const getSiteFooterPublic = cache(async (): Promise<SiteFooterPublic> => {
  const supabase = createPublicSupabaseServerClient()
  const fb = defaultFooter()
  if (!supabase) return fb

  const { data, error } = await supabase.from("site_settings").select("social_links").eq("id", 1).maybeSingle()
  if (error || !data) {
    if (error) console.warn("[getSiteFooterPublic]", error.message)
    return fb
  }

  const socialFromDb = parseSocialLinks((data as Record<string, unknown>).social_links)
  return {
    ...fb,
    socialLinks: socialFromDb.length > 0 ? socialFromDb : fb.socialLinks,
  }
})

export const getContactDetailsPublic = cache(async (): Promise<ContactDetailsPublic> => {
  const supabase = createPublicSupabaseServerClient()
  const fb = defaultContact()
  if (!supabase) return fb

  const { data, error } = await supabase.from("contact_info").select("*").eq("id", 1).maybeSingle()
  if (error || !data) {
    if (error) console.warn("[getContactDetailsPublic]", error.message)
    return fb
  }

  const row = normalizeContactInfo(data as Record<string, unknown>)
  return {
    phone: row.phone.trim(),
    email: row.email.trim(),
    hqAddress: row.hq_address.trim(),
    mapLink: row.map_link.trim(),
    hqEyebrow: row.hq_eyebrow.trim() || fb.hqEyebrow,
    hqHeading: row.hq_heading.trim() || fb.hqHeading,
    hqDescription: row.hq_description.trim() || fb.hqDescription,
    weekdayHours: row.weekday_hours?.trim() ?? "",
    weekendHours: row.weekend_hours?.trim() ?? "",
    careersEmail: row.careers_email?.trim() ?? "",
    careersApplyCtaLabel: row.careers_apply_instructions?.trim() ?? "",
    socialLinks: parseSocialLinks(row.social_links),
  }
})
