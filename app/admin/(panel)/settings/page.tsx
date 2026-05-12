import type { Metadata } from "next"

import { AdminSettingsClient } from "@/components/admin/AdminSettingsClient"
import { ErrorMessage } from "@/components/admin/design-system"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Settings",
}

async function loadSettings() {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser()

    if (authErr || !user) return { ok: false as const, message: "You must be signed in as an admin." }

    const { data: adminRow } = await supabase
      .from("admins")
      .select("display_name, updated_at")
      .eq("user_id", user.id)
      .maybeSingle()

    return {
      ok: true as const,
      userEmail: user.email ?? "",
      userId: user.id,
      displayName: typeof adminRow?.display_name === "string" ? adminRow.display_name : "",
      lastUpdated: typeof adminRow?.updated_at === "string" ? adminRow.updated_at : null,
    }
  } catch (e) {
    return { ok: false as const, message: e instanceof Error ? e.message : "Unexpected error loading settings." }
  }
}

export default async function AdminSettingsPage() {
  const result = await loadSettings()

  if (!result.ok) {
    return <ErrorMessage title="Settings could not load">{result.message}</ErrorMessage>
  }

  return (
    <AdminSettingsClient
      userEmail={result.userEmail}
      userId={result.userId}
      displayName={result.displayName}
      lastUpdated={result.lastUpdated}
    />
  )
}
