"use client"

import Link from "next/link"
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { usePathname } from "next/navigation"

import { TOPBAR_NAV_LINKS } from "@/lib/navigation"
import { cn } from "@/lib/utils"

type MobileMenuProps = {
  className?: string
}

type MenuPhase = "closed" | "open" | "closing"

export function MobileMenu({ className }: MobileMenuProps) {
  const [phase, setPhase] = useState<MenuPhase>("closed")
  const pathname = usePathname()
  const pathnameRef = useRef(pathname)
  useLayoutEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])
  const panelId = useId()

  const mounted = phase !== "closed"
  const exiting = phase === "closing"

  const openMenu = useCallback(() => {
    setPhase((p) => (p === "closed" ? "open" : p))
  }, [])

  const closeMenu = useCallback(() => {
    setPhase((p) => (p === "open" ? "closing" : p))
  }, [])

  const onPanelAnimationEnd = useCallback((e: React.AnimationEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return
    if (!e.animationName.includes("euromiti-mobile-menu-panel-exit")) return
    setPhase("closed")
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeMenu()
    }
    if (!mounted) return undefined
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
    return () => {
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
  }, [mounted, closeMenu])

  return (
    <div className={cn(className)}>
      <button
        type="button"
        aria-expanded={mounted}
        aria-controls={panelId}
        aria-haspopup="dialog"
        aria-label={mounted ? "Close menu" : "Open menu"}
        className="group flex size-11 items-center justify-center rounded-[var(--rounded-sm)] border border-transparent text-white outline-none transition-colors [-webkit-tap-highlight-color:transparent] hover:text-brand-accent-soft focus-visible:outline-none focus-visible:ring-0"
        onClick={openMenu}
      >
        <span className="flex w-5 flex-col justify-center gap-[5px]" aria-hidden>
          <span className="h-0.5 w-full rounded-full bg-current transition-colors" />
          <span className="h-0.5 w-full rounded-full bg-current transition-colors" />
          <span className="h-0.5 w-full rounded-full bg-current transition-colors" />
        </span>
      </button>

      {mounted
        ? createPortal(
            <>
              <div
                aria-hidden="true"
                className={cn(
                  "euromiti-mobile-menu-overlay fixed inset-0 z-[100] bg-brand-shell-deep/76 backdrop-blur-sm",
                  exiting ? "euromiti-mobile-menu-overlay--exit" : "euromiti-mobile-menu-overlay--enter"
                )}
                onClick={closeMenu}
              />
              <aside
                id={panelId}
                aria-modal="true"
                role="dialog"
                aria-label="Mobile navigation"
                onAnimationEnd={onPanelAnimationEnd}
                className={cn(
                  "euromiti-mobile-menu-panel fixed top-0 right-0 z-[101] flex h-dvh w-[min(100vw,18rem)] max-w-full flex-col overflow-hidden border-white/10 border-l bg-brand-shell-deep text-white shadow-[0_24px_70px_rgba(0,0,0,0.36)]",
                  exiting ? "euromiti-mobile-menu-panel--exit" : "euromiti-mobile-menu-panel--enter"
                )}
              >
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,180,171,0.12),transparent_36%),linear-gradient(180deg,var(--brand-shell)_0%,var(--brand-shell-deep)_100%)]"
                  aria-hidden
                />
                <div className="relative flex items-center justify-start border-white/10 border-b px-3 py-3 sm:px-4 sm:py-4">
                  <button
                    type="button"
                    aria-label="Close navigation"
                    className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-transparent text-white/88 outline-none transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-transparent hover:text-brand-accent-soft active:bg-transparent focus-visible:outline-none focus-visible:ring-0"
                    onClick={closeMenu}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="size-[1.375rem] shrink-0"
                      fill="none"
                      aria-hidden
                    >
                      {/* Double chevron right — dismiss / slide panel toward the right edge */}
                      <path
                        d="M7 7l5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-55"
                      />
                      <path
                        d="M12 7l5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <nav
                  aria-label="Mobile main"
                  className="relative flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4"
                >
                  {TOPBAR_NAV_LINKS.map(({ href, label }) => {
                    const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={cn(
                          "flex min-h-12 items-center justify-between gap-3 rounded-sm py-2.5 pr-1 pl-3 text-sm font-bold tracking-wide text-white/68 outline-none [-webkit-tap-highlight-color:transparent] focus-visible:outline-none focus-visible:ring-0 focus-visible:underline focus-visible:decoration-brand-accent-soft/55 focus-visible:underline-offset-[6px]",
                          active && "text-brand-accent-soft"
                        )}
                        onClick={closeMenu}
                      >
                        <span className="min-w-0">{label}</span>
                        <svg
                          viewBox="0 0 24 24"
                          className="pointer-events-none size-4 shrink-0 text-current opacity-50"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M9 6l6 6-6 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
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
