import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

const globalKey = "__euromitiSupabaseBrowser" as const

type GlobalWithSupabase = typeof globalThis & {
  [globalKey]?: SupabaseClient
}

/** Single browser Supabase client (avoids duplicate GoTrueClient warnings). */
export function createSupabaseBrowserClient(): SupabaseClient {
  const g = globalThis as GlobalWithSupabase
  if (g[globalKey]) return g[globalKey]

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.")
  }

  const client = createBrowserClient(url, anonKey)
  g[globalKey] = client
  return client
}
