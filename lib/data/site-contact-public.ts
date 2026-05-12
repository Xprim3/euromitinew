import { cache } from "react"

import { contactPageMock } from "@/data/mock/contact"
import { createPublicSupabaseServerClient } from "@/lib/supabase/public-server-client"
import type { ContactInfoRow, SiteSettingsRow } from "@/types/supabase-cms"

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
  weekdayHours: string
  weekendHours: string
  careersEmail: string
  /** Label for the careers CTA button (e.g. “Apply by Email”). */
  careersApplyCtaLabel: string
  socialLinks: SocialLinkItem[]
}

const DEFAULT_FOOTER_BODY =
  "Pioneering transit fuel and hospitality experiences in Kosovo — built on safety, brightness, and craft across Prishtina, Ferizaj, and Gjilan."

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
    footerCopyrightLine: "Euromiti Kosovo",
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
    weekdayHours: m.weekdayHours,
    weekendHours: m.weekendHours,
    careersEmail: m.careersEmail,
    careersApplyCtaLabel: m.careersCtaApplyByEmail,
    socialLinks: [],
  }
}

async function resolveLogoUrl(supabase: NonNullable<ReturnType<typeof createPublicSupabaseServerClient>>, mediaId: string | null) {
  if (!mediaId) return null
  const { data } = await supabase.from("media_uploads").select("public_url, alt_text").eq("id", mediaId).maybeSingle()
  const url = data?.public_url
  const alt = typeof data?.alt_text === "string" ? data.alt_text.trim() : ""
  if (typeof url !== "string" || !url.trim()) return null
  return { url: url.trim(), alt: alt || "Euromiti" }
}

function normalizeSiteSettings(raw: Record<string, unknown>): SiteSettingsRow {
  return {
    id: Number(raw.id) || 1,
    logo_media_id: typeof raw.logo_media_id === "string" && raw.logo_media_id ? raw.logo_media_id : null,
    company_name: typeof raw.company_name === "string" ? raw.company_name.trim() : "",
    social_links: raw.social_links ?? [],
    footer_body: typeof raw.footer_body === "string" ? raw.footer_body : "",
    footer_copyright_line: typeof raw.footer_copyright_line === "string" ? raw.footer_copyright_line.trim() : "",
    updated_at: typeof raw.updated_at === "string" ? raw.updated_at : "",
    updated_by: typeof raw.updated_by === "string" ? raw.updated_by : null,
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
    updated_at: typeof raw.updated_at === "string" ? raw.updated_at : "",
    updated_by: typeof raw.updated_by === "string" ? raw.updated_by : null,
  }
}

export const getSiteFooterPublic = cache(async (): Promise<SiteFooterPublic> => {
  const supabase = createPublicSupabaseServerClient()
  const fb = defaultFooter()
  if (!supabase) return fb

  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle()
  if (error || !data) {
    if (error) console.warn("[getSiteFooterPublic]", error.message)
    return fb
  }

  const row = normalizeSiteSettings(data as Record<string, unknown>)
  let logoUrl: string | null = null
  let logoAlt = row.company_name
  if (row.logo_media_id) {
    const resolved = await resolveLogoUrl(supabase, row.logo_media_id)
    if (resolved) {
      logoUrl = resolved.url
      logoAlt = resolved.alt
    }
  }

  return {
    companyName: row.company_name,
    logoUrl,
    logoAlt,
    footerBody: row.footer_body,
    footerCopyrightLine: row.footer_copyright_line ?? "",
    socialLinks: parseSocialLinks(row.social_links),
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
    weekdayHours: row.weekday_hours?.trim() ?? "",
    weekendHours: row.weekend_hours?.trim() ?? "",
    careersEmail: row.careers_email?.trim() ?? "",
    careersApplyCtaLabel: row.careers_apply_instructions?.trim() ?? "",
    socialLinks: parseSocialLinks(row.social_links),
  }
})
