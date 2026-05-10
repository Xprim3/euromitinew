"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"

export default function GlobalNotFound() {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  if (isAdmin) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-zinc-950 px-4 py-16 text-center">
        <p className="font-semibold text-zinc-500 text-xs uppercase tracking-[0.22em]">404</p>
        <h1 className="mt-3 font-heading text-white text-xl font-bold tracking-tight">Admin page not found</h1>
        <p className="mt-2 max-w-md text-sm text-zinc-400">
          This route doesn&apos;t exist in the Euromiti admin console yet.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button render={<Link href="/admin/dashboard" />}>Dashboard</Button>
          <Button variant="outline" className="border-zinc-600 text-zinc-200" render={<Link href="/admin/login" />}>
            Sign in
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main
        id="main-content"
        className="flex flex-1 flex-col items-center justify-center bg-muted/40 px-4 py-20 text-center"
      >
        <p className="font-[family-name:var(--font-montserrat)] text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          404
        </p>
        <h1 className="mt-4 max-w-md font-heading text-foreground text-[clamp(1.5rem,4vw,2.25rem)] font-bold tracking-tight">
          This page isn&apos;t on the map
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground text-sm leading-relaxed">
          The link may be broken or the page may have moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button render={<Link href="/" />}>Home</Button>
          <Button variant="outline" render={<Link href="/contact" />}>
            Contact
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
