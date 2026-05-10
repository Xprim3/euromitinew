"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

import { adminInputClass, adminLabelClass } from "./cn-admin"

function safeAdminNext(raw: string | null | undefined) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/admin/dashboard"
  if (!raw.startsWith("/admin")) return "/admin/dashboard"
  if (raw.includes("://")) return "/admin/dashboard"
  return raw
}

type AdminLoginFormProps = {
  next?: string | null
}

export function AdminLoginForm({ next }: AdminLoginFormProps) {
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "submitting">("idle")
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    setStatus("submitting")
    const form = e.currentTarget
    const fd = new FormData(form)
    const email = String(fd.get("email") ?? "").trim()
    const password = String(fd.get("password") ?? "")

    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage(error.message)
        setStatus("idle")
        return
      }
      router.push(safeAdminNext(next))
      router.refresh()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign-in failed"
      setMessage(msg.includes("Missing NEXT_PUBLIC") ? "Supabase URL and anon key are not configured in the client." : msg)
      setStatus("idle")
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-5">
      {message ? (
        <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-100 text-sm">
          {message}
        </p>
      ) : null}
      <div>
        <label htmlFor="admin-email" className={adminLabelClass}>
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={adminInputClass}
        />
      </div>
      <div>
        <label htmlFor="admin-password" className={adminLabelClass}>
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={adminInputClass}
        />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-center text-xs text-zinc-500">
        Use a Supabase user that exists in the <code className="text-zinc-400">admins</code> table.{" "}
        <Link href="/" className="text-zinc-300 underline-offset-2 hover:underline">
          Back to site
        </Link>
      </p>
    </form>
  )
}
