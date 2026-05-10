import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/** Server-only anon Supabase client for public SELECT (RLS-approved rows). Returns null when env is missing so pages can fall back to mocks during local dev without Supabase. */
export function createPublicSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return null

  return createClient(url, anon)
}
