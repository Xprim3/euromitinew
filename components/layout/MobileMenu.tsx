"use client"

import Link from "next/link"
import { useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { usePathname } from "next/navigation"

import { TOPBAR_NAV_LINKS } from "@/lib/navigation"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { cn } from "@/lib/utils"

type MobileMenuProps = {
  className?: string
}

const navIcons: Record<string, string> = {
  "/": "home",
  "/about": "info",
  "/services": "local_gas_station",
  "/locations": "pin_drop",
  "/restaurant": "restaurant",
  "/news": "newspaper",
  "/contact": "call",
}

export function MobileMenu({ className }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const panelId = useId()
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    if (!open) return undefined
    const scrollY = window.scrollY
    const previousBodyStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    }
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = "0"
    document.body.style.right = "0"
    document.body.style.width = "100%"
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    const t = requestAnimationFrame(() => firstLinkRef.current?.focus({ preventScroll: true }))
    return () => {
      cancelAnimationFrame(t)
      document.body.style.position = previousBodyStyles.position
      document.body.style.top = previousBodyStyles.top
      document.body.style.left = previousBodyStyles.left
      document.body.style.right = previousBodyStyles.right
      document.body.style.width = previousBodyStyles.width
      document.body.style.overflow = previousBodyStyles.overflow
      window.scrollTo(0, scrollY)
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

      {open
        ? createPortal(
            <>
              <div
                aria-hidden="true"
                className="fixed inset-0 z-[100] bg-[#131b2e]/72 backdrop-blur-sm"
                onClick={() => setOpen(false)}
              />

              <aside
                id={panelId}
                aria-modal="true"
                role="dialog"
                aria-label="Mobile navigation"
                className="fixed top-0 right-0 z-[101] flex h-dvh w-[min(100vw,21rem)] max-w-full flex-col overflow-hidden border-slate-200 border-l bg-white text-[#141b2b] shadow-[0_24px_70px_rgba(15,23,42,0.22)]"
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#b6191a]"
                  aria-hidden
                />
                <div className="relative flex items-center justify-between gap-4 border-slate-200 border-b px-6 py-5">
                  <div>
                    <p className="font-[family-name:var(--font-montserrat)] text-lg font-bold tracking-[-0.02em] text-[#141b2b]">
                      Euromiti
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[#45464d]">Navigimi kryesor</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Close navigation"
                    className="flex size-10 shrink-0 items-center justify-center rounded-[var(--rounded-DEFAULT)] border border-slate-200 text-[#141b2b] transition hover:bg-slate-50 focus-visible:border-[#131b2e] focus-visible:ring-2 focus-visible:ring-[#131b2e]/20 focus-visible:outline-none"
                    onClick={() => setOpen(false)}
                  >
                    <MaterialSymbol name="close" className="text-xl!" />
                  </button>
                </div>

                <nav aria-label="Mobile main" className="relative flex flex-1 flex-col overflow-y-auto px-3 py-4">
                  {TOPBAR_NAV_LINKS.map(({ href, label }, i) => {
                    const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
                    return (
                      <Link
                        key={href}
                        ref={i === 0 ? firstLinkRef : undefined}
                        href={href}
                        className={cn(
                          "group flex min-h-12 items-center gap-3 rounded-[var(--rounded-DEFAULT)] border border-transparent px-3 py-2.5 font-semibold text-sm tracking-wide transition focus-visible:border-[#131b2e] focus-visible:ring-2 focus-visible:ring-[#131b2e]/20 focus-visible:outline-none",
                          active
                            ? "border-slate-200 bg-[#f1f3ff] text-[#131b2e]"
                            : "text-[#45464d] hover:bg-[#f9f9ff] hover:text-[#141b2b]"
                        )}
                        onClick={() => setOpen(false)}
                      >
                        <span
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-[var(--rounded-sm)] transition",
                            active
                              ? "bg-[#b6191a] text-white"
                              : "text-[#76777d] group-hover:text-[#141b2b]"
                          )}
                        >
                          <MaterialSymbol name={navIcons[href] ?? "arrow_forward"} className="text-[1.15rem]" />
                        </span>
                        <span className="min-w-0 flex-1">{label}</span>
                        <MaterialSymbol
                          name="chevron_right"
                          className={cn(
                            "text-base transition group-hover:translate-x-0.5",
                            active ? "text-[#131b2e]/45" : "text-[#76777d] group-hover:text-[#141b2b]"
                          )}
                        />
                      </Link>
                    )
                  })}
                </nav>

                <div className="relative border-slate-200 border-t px-6 py-5">
                  <Link
                    href="/contact"
                    className="flex min-h-12 items-center justify-center gap-2 rounded-[var(--rounded-DEFAULT)] bg-[#b6191a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d9352f]"
                    onClick={() => setOpen(false)}
                  >
                    Kontakti
                    <MaterialSymbol name="arrow_forward" className="text-base" />
                  </Link>
                </div>
              </aside>
            </>,
            document.body
          )
        : null}
    </div>
  )
}
