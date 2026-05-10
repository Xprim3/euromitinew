"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"

import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

export function AdminSignOutButton() {
  const [pending, setPending] = useState(false)

  async function handleSignOut() {
    setPending(true)
    try {
      const supabase = createSupabaseBrowserClient()
      await supabase.auth.signOut({ scope: "local" })
    } catch {
      /* env missing etc. — still send user to login */
    }
    window.location.href = "/admin/login"
  }

  return (
    <button
      type="button"
      onClick={() => void handleSignOut()}
      disabled={pending}
      className="mt-1 flex w-full cursor-pointer items-center gap-3 rounded-lg border-0 bg-transparent px-3 py-2.5 text-left text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-200 disabled:opacity-60"
    >
      <LogOut className="size-[1.125rem]" aria-hidden />
      {pending ? "Signing out…" : "Sign out"}
    </button>
  )
}
