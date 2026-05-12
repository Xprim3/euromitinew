import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { MediaUploadRow } from "@/types/supabase-cms"

export function normalizeMediaUploadRow(raw: Record<string, unknown>): MediaUploadRow {
  const text = (key: string): string | null =>
    typeof raw[key] === "string" && (raw[key] as string).trim().length > 0 ? (raw[key] as string) : null

  return {
    id: String(raw.id ?? ""),
    storage_bucket: typeof raw.storage_bucket === "string" ? raw.storage_bucket : "euromiti-media",
    object_path: typeof raw.object_path === "string" ? raw.object_path : "",
    public_url: text("public_url"),
    mime_type: typeof raw.mime_type === "string" ? raw.mime_type : "",
    byte_size: typeof raw.byte_size === "number" ? raw.byte_size : Number(raw.byte_size ?? 0),
    original_filename: text("original_filename"),
    alt_text: text("alt_text"),
    uploaded_by: text("uploaded_by"),
    category: text("category"),
    usage_section: text("usage_section"),
    created_at: typeof raw.created_at === "string" ? raw.created_at : "",
  }
}

export async function listMediaUploadsAdmin(): Promise<MediaUploadRow[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.from("media_uploads").select("*").order("created_at", { ascending: false })
  if (error || !data?.length) return []
  return data.map((row) => normalizeMediaUploadRow(row as Record<string, unknown>))
}
