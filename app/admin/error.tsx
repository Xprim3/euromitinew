"use client"

import Link from "next/link"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"

export default function AdminErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[admin:error]", error)
  }, [error])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-zinc-950 px-4 py-12 text-center">
      <p className="font-semibold text-red-400 text-xs uppercase tracking-[0.2em]">Admin error</p>
      <h1 className="mt-3 max-w-md font-heading text-white text-xl font-bold tracking-tight">
        This admin view failed to load
      </h1>
      <p className="mt-2 max-w-md text-sm text-zinc-400">
        {error.message || "Check the browser console and try again."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={() => reset()}>
          Retry
        </Button>
        <Button variant="outline" className="border-zinc-600 text-zinc-200" render={<Link href="/admin/dashboard" />}>
          Dashboard
        </Button>
        <Button variant="ghost" className="text-zinc-400" render={<Link href="/admin/login" />}>
          Sign in
        </Button>
      </div>
    </div>
  )
}
