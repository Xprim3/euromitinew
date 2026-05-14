import type { LocationRow } from "@/types/supabase-cms"

/** Coerce `/admin/locations/*` payloads from loosely typed selects. */
export function normalizeLocationRow(raw: Record<string, unknown>): LocationRow {
  return {
    id: String(raw.id ?? ""),
    slug: typeof raw.slug === "string" ? raw.slug : "",
    city: typeof raw.city === "string" ? raw.city : "",
    address: typeof raw.address === "string" ? raw.address : "",
    phone: typeof raw.phone === "string" ? raw.phone : "",
    opening_hours: typeof raw.opening_hours === "string" ? raw.opening_hours : "",
    services: Array.isArray(raw.services)
      ? raw.services.filter((x): x is string => typeof x === "string")
      : [],
    google_maps_url: typeof raw.google_maps_url === "string" ? raw.google_maps_url : "",
    contact_email:
      typeof raw.contact_email === "string" && raw.contact_email.trim().length > 0 ? raw.contact_email.trim() : null,
    main_media_id: typeof raw.main_media_id === "string" && raw.main_media_id.length > 0 ? raw.main_media_id : null,
    sort_order:
      typeof raw.sort_order === "number" ? raw.sort_order : Math.max(0, Math.round(Number(raw.sort_order) || 0)),
    is_active: Boolean(raw.is_active),
    page_heading: typeof raw.page_heading === "string" ? raw.page_heading : "",
    page_summary: typeof raw.page_summary === "string" ? raw.page_summary : "",
    created_at: typeof raw.created_at === "string" ? raw.created_at : "",
    updated_at: typeof raw.updated_at === "string" ? raw.updated_at : "",
  }
}
