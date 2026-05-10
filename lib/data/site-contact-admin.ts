import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { ContactInfoRow, SiteSettingsRow } from "@/types/supabase-cms"

function normalizeSiteSettings(raw: Record<string, unknown>): SiteSettingsRow {
  return {
    id: Number(raw.id) || 1,
    logo_media_id: typeof raw.logo_media_id === "string" && raw.logo_media_id ? raw.logo_media_id : null,
    company_name: typeof raw.company_name === "string" ? raw.company_name : "",
    social_links: raw.social_links ?? [],
    footer_body: typeof raw.footer_body === "string" ? raw.footer_body : "",
    footer_copyright_line: typeof raw.footer_copyright_line === "string" ? raw.footer_copyright_line : null,
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

export async function getSiteSettingsAdmin(): Promise<SiteSettingsRow | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle()
  if (error || !data) return null
  return normalizeSiteSettings(data as Record<string, unknown>)
}

export async function getContactInfoAdmin(): Promise<ContactInfoRow | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.from("contact_info").select("*").eq("id", 1).maybeSingle()
  if (error || !data) return null
  return normalizeContactInfo(data as Record<string, unknown>)
}

export async function getLogoPreviewUrlAdmin(mediaId: string | null): Promise<string | null> {
  if (!mediaId) return null
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.from("media_uploads").select("public_url").eq("id", mediaId).maybeSingle()
  const url = data?.public_url
  return typeof url === "string" && url.trim() ? url.trim() : null
}
