import { unstable_noStore } from "next/cache"
import { cache } from "react"

import { createPublicSupabaseServerClient } from "@/lib/supabase/public-server-client"
import type { JobRow } from "@/types/supabase-cms"

function normalizePublicJobRow(raw: Record<string, unknown>): JobRow {
  const text = (key: string): string | null =>
    typeof raw[key] === "string" && (raw[key] as string).trim().length > 0 ? (raw[key] as string) : null

  return {
    id: String(raw.id ?? ""),
    title: typeof raw.title === "string" ? raw.title : "",
    slug: typeof raw.slug === "string" ? raw.slug : "",
    location_city: text("location_city"),
    summary: text("summary"),
    description: raw.description ?? [],
    requirements: raw.requirements ?? [],
    is_active: Boolean(raw.is_active),
    apply_channel: typeof raw.apply_channel === "string" ? raw.apply_channel : "email",
    apply_email: text("apply_email"),
    apply_phone: text("apply_phone"),
    apply_url: text("apply_url"),
    apply_instructions: text("apply_instructions"),
    hero_media_id: text("hero_media_id"),
    posted_at: text("posted_at"),
    created_at: typeof raw.created_at === "string" ? raw.created_at : "",
    updated_at: typeof raw.updated_at === "string" ? raw.updated_at : "",
  }
}

export function textArrayFromJson(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean)
}

export const getActiveJobsPublic = cache(async (): Promise<JobRow[]> => {
  unstable_noStore()
  const supabase = createPublicSupabaseServerClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .order("posted_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.warn("[getActiveJobsPublic]", error.message)
    return []
  }

  return (data ?? []).map((row) => normalizePublicJobRow(row as Record<string, unknown>))
})

export const getActiveJobBySlugPublic = cache(async (slug: string): Promise<JobRow | null> => {
  unstable_noStore()
  const supabase = createPublicSupabaseServerClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle()

  if (error) {
    console.warn("[getActiveJobBySlugPublic]", error.message)
    return null
  }

  return data ? normalizePublicJobRow(data as Record<string, unknown>) : null
})
