import { normalizeNewsPostRow } from "@/lib/data/news-public"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { NewsPostRow } from "@/types/supabase-cms"

/** All posts including drafts/archived — admin authenticated RLS only. */
export async function listNewsPostsAdmin(): Promise<NewsPostRow[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.from("news_posts").select("*").order("updated_at", { ascending: false })

  if (error || !data?.length) return []
  return data.map((r) => normalizeNewsPostRow(r as Record<string, unknown>))
}

export async function getNewsPostByIdAdmin(id: string): Promise<NewsPostRow | null> {
  if (!id) return null
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.from("news_posts").select("*").eq("id", id).maybeSingle()
  if (error || !data) return null
  return normalizeNewsPostRow(data as Record<string, unknown>)
}

export async function getMediaPublicUrlAdmin(mediaId: string | null): Promise<string | null> {
  if (!mediaId) return null
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.from("media_uploads").select("public_url").eq("id", mediaId).maybeSingle()
  const url = data?.public_url
  return typeof url === "string" && url.length > 0 ? url.trim() : null
}
