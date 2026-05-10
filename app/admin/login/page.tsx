import type { Metadata } from "next"
import Link from "next/link"

import { AdminLoginForm } from "@/components/admin/AdminLoginForm"

export const metadata: Metadata = {
  title: "Admin sign-in",
}

type AdminLoginPageProps = {
  searchParams?: Promise<{ next?: string }>
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const sp = (await searchParams) ?? {}
  const next = sp.next

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--brand-red-vivid)_0%,transparent_55%)] opacity-25" aria-hidden />
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-xl backdrop-blur-md">
        <p className="text-[0.65rem] font-bold text-zinc-500 uppercase tracking-[0.26em]">Euromiti</p>
        <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight text-white">Administrator sign-in</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Internal console for content, fuels, locations, and media.
        </p>
        <div className="mt-8">
          <AdminLoginForm next={next} />
        </div>
        <div className="mt-8 border-zinc-800 border-t pt-6 text-center text-xs text-zinc-500">
          <Link href="/" className="text-zinc-300 underline-offset-2 hover:underline">
            ← Euromiti public website
          </Link>
        </div>
      </div>
    </div>
  )
}
