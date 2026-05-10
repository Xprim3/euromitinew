"use client"

import Link from "next/link"
import { useEffect, useId, useRef, useState } from "react"

import { TOPBAR_NAV_LINKS } from "@/lib/navigation"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { cn } from "@/lib/utils"

type MobileMenuProps = {
  className?: string
}

export function MobileMenu({ className }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    if (!open) return undefined
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    const t = requestAnimationFrame(() => firstLinkRef.current?.focus())
    return () => {
      cancelAnimationFrame(t)
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div className={cn(className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex size-11 items-center justify-center rounded-[var(--rounded-sm)] border border-transparent text-white transition-colors hover:bg-white/12 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/55 focus-visible:outline-none"
        onClick={() => setOpen(true)}
      >
        <MaterialSymbol name="menu" className="text-2xl!" />
      </button>

      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-[100] bg-black/55 transition-opacity",
          open ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        )}
        onClick={() => setOpen(false)}
      />

      <aside
        id={panelId}
        aria-modal="true"
        role="dialog"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        className={cn(
          "fixed top-0 right-0 z-[101] flex h-full w-[min(100%,22rem)] flex-col border-white/15 border-l bg-black shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        )}
      >
        <div className="flex items-center justify-between gap-4 border-white/15 border-b p-5">
          <span className="font-[family-name:var(--font-montserrat)] font-bold tracking-tight text-lg text-white">
            Menu
          </span>
          <button
            type="button"
            aria-label="Close navigation"
            className="flex size-10 items-center justify-center rounded-[var(--rounded-sm)] border border-transparent text-white transition-colors hover:bg-white/12 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/55 focus-visible:outline-none"
            onClick={() => setOpen(false)}
          >
            <MaterialSymbol name="close" className="text-2xl!" />
          </button>
        </div>

        <nav aria-label="Mobile main" className="flex flex-1 flex-col gap-2 overflow-y-auto px-5 py-6">
          {TOPBAR_NAV_LINKS.map(({ href, label }, i) => (
            <Link
              key={href}
              ref={i === 0 ? firstLinkRef : undefined}
              href={href}
              className={cn(
                "rounded-xl px-4 py-3 font-semibold text-base text-white/92 uppercase tracking-wide transition-colors hover:bg-white/10 hover:text-white"
              )}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  )
}
