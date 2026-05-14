"use client"

import Link from "next/link"
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react"
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
  const pathnameRef = useRef(pathname)
  useLayoutEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])
  const panelId = useId()
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    if (!open) return undefined
    const scrollY = window.scrollY
    const pathWhenOpened = pathnameRef.current
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
      if (pathnameRef.current === pathWhenOpened) {
        window.scrollTo(0, scrollY)
      }
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
                className="euromiti-mobile-menu-overlay fixed inset-0 z-[100] bg-brand-shell-deep/76 backdrop-blur-sm"
                onClick={() => setOpen(false)}
              />
              <aside
                id={panelId}
                aria-modal="true"
                role="dialog"
                aria-label="Mobile navigation"
                className="euromiti-mobile-menu-panel fixed top-0 right-0 z-[101] flex h-dvh w-[min(100vw,21rem)] max-w-full flex-col overflow-hidden border-white/10 border-l bg-brand-shell-deep text-white shadow-[0_24px_70px_rgba(0,0,0,0.36)]"
              >
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,180,171,0.12),transparent_36%),linear-gradient(180deg,var(--brand-shell)_0%,var(--brand-shell-deep)_100%)]"
                  aria-hidden
                />
                <div className="relative flex items-center justify-between gap-4 border-white/10 border-b px-6 py-5">
                  <div className="min-w-0">
                    <p className="font-(family-name:--font-montserrat) text-lg font-black tracking-[0.12em] text-white uppercase">
                      Euromiti
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                      Petrol & Restaurant
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Close navigation"
                    className="flex size-10 shrink-0 items-center justify-center rounded-[var(--rounded-DEFAULT)] border border-white/14 bg-white/8 text-white transition hover:border-brand-accent-soft/45 hover:bg-white/12 focus-visible:border-brand-accent-soft focus-visible:ring-2 focus-visible:ring-brand-accent-soft/30 focus-visible:outline-none"
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
                          "group flex min-h-12 items-center gap-3 rounded-[var(--rounded-DEFAULT)] border border-transparent px-3 py-2.5 text-sm font-bold tracking-wide transition focus-visible:border-brand-accent-soft focus-visible:ring-2 focus-visible:ring-brand-accent-soft/30 focus-visible:outline-none",
                          active
                            ? "border-brand-accent-soft/30 bg-white/10 text-brand-accent-soft"
                            : "text-white/68 hover:border-white/10 hover:bg-white/7 hover:text-white"
                        )}
                        onClick={() => setOpen(false)}
                      >
                        <span
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-[var(--rounded-sm)] transition",
                            active
                              ? "bg-brand-accent-soft text-brand-shell-deep"
                              : "text-white/42 group-hover:text-white"
                          )}
                        >
                          <MaterialSymbol name={navIcons[href] ?? "arrow_forward"} className="text-[1.15rem]" />
                        </span>
                        <span className="min-w-0 flex-1">{label}</span>
                        <MaterialSymbol
                          name="chevron_right"
                          className={cn(
                            "text-base transition group-hover:translate-x-0.5",
                            active ? "text-brand-accent-soft/70" : "text-white/30 group-hover:text-white/70"
                          )}
                        />
                      </Link>
                    )
                  })}
                </nav>

                <div className="relative border-white/10 border-t px-6 py-5">
                  <p className="text-center text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/38">
                    Design By{" "}
                    <a
                      href="https://www.denisjanuzi.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/62 transition hover:text-brand-accent-soft"
                    >
                      Denis Januzi
                    </a>
                  </p>
                </div>
              </aside>
            </>,
            document.body
          )
        : null}
    </div>
  )
}
