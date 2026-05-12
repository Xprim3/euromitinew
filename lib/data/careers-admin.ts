import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { JobRow } from "@/types/supabase-cms"

export function normalizeJobRow(raw: Record<string, unknown>): JobRow {
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

export async function listJobsAdmin(): Promise<JobRow[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.from("jobs").select("*").order("updated_at", { ascending: false })
  if (error || !data?.length) return []
  return data.map((row) => normalizeJobRow(row as Record<string, unknown>))
}

export async function getJobByIdAdmin(id: string): Promise<JobRow | null> {
  if (!id) return null
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle()
  if (error || !data) return null
  return normalizeJobRow(data as Record<string, unknown>)
}
