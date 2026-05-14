"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { X } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { useAdminSidebarState } from "./AdminSidebarState"
import { cnDs } from "./cn-ds"

export type AdminSidebarNavItem = {
  href: string
  label: string
  icon?: LucideIcon
}

export type AdminSidebarProps = {
  brandTitle?: string
  brandSubtitle?: string
  brandHref?: string
  items: readonly AdminSidebarNavItem[]
  footer?: React.ReactNode
  activeAccent?: "red" | "gold"
  className?: string
}

/**
 * Navy sidebar (280px). On viewports `< lg`, it becomes a fixed drawer; open it with
 * `AdminHeader` `showMobileNavTrigger` or call `useAdminSidebarState().setMobileOpen(true)`.
 */
export function AdminSidebar({
  brandTitle = "Admin Panel",
  brandSubtitle,
  brandHref = "/admin/dashboard",
  items,
  footer,
  activeAccent = "red",
  className,
}: AdminSidebarProps) {
  const pathname = usePathname()
  const { mobileOpen, setMobileOpen } = useAdminSidebarState()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname, setMobileOpen])

  useEffect(() => {
    if (!mobileOpen) return undefined

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [mobileOpen, setMobileOpen])

  const bar =
    activeAccent === "gold"
      ? "bg-[var(--admin-accent-gold)]"
      : "bg-[var(--admin-accent-active)]"

  const nav = (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3" aria-label="Admin">
      {items.map(({ href, label, icon: Icon }) => {
        const active =
          pathname === href || (href !== "/admin/dashboard" && href !== "/admin" && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            className={cnDs(
              "relative flex min-h-11 items-center gap-3 rounded-lg py-2.5 pr-3 pl-4 text-sm font-medium transition-colors",
              active
                ? "bg-[var(--admin-sidebar-active-bg)] text-white"
                : "text-[var(--admin-sidebar-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white"
            )}
          >
            {active ? <span className={cnDs("absolute top-2 bottom-2 left-0 w-1 rounded-full", bar)} aria-hidden /> : null}
            {Icon ? <Icon className="size-[1.125rem] shrink-0 opacity-90" aria-hidden /> : null}
            {label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm transition-opacity lg:hidden"
          aria-label="Close admin navigation"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        id="admin-ds-sidebar"
        aria-label="Admin navigation"
        aria-modal={mobileOpen ? "true" : undefined}
        role={mobileOpen ? "dialog" : undefined}
        className={cnDs(
          "fixed left-0 top-0 z-50 flex h-dvh max-h-dvh min-h-0 w-[min(100vw,280px)] max-w-[100vw] -translate-x-full flex-col border-[var(--admin-border)] border-r bg-[var(--admin-sidebar)] pt-[env(safe-area-inset-top,0px)] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:static lg:z-0 lg:h-full lg:max-h-none lg:w-[var(--admin-sidebar-width)] lg:max-w-none lg:translate-x-0 lg:pt-0 lg:shadow-none",
          mobileOpen && "translate-x-0",
          className
        )}
      >
        <div className="flex items-center justify-between gap-3 border-white/10 border-b px-4 py-4 sm:px-5 sm:py-5">
          <Link
            href={brandHref}
            className="block font-[family-name:var(--font-montserrat)] text-lg font-extrabold tracking-tight text-[var(--admin-sidebar-foreground)]"
          >
            {brandTitle}
            {brandSubtitle?.trim() ? (
              <>
                {" "}
                <span className="font-semibold text-[var(--admin-sidebar-muted)]">{brandSubtitle}</span>
              </>
            ) : null}
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-[var(--admin-radius-input)] text-[var(--admin-sidebar-muted)] transition-colors hover:bg-[var(--admin-sidebar-hover)] hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none lg:hidden"
            aria-label="Close admin navigation"
            onClick={() => setMobileOpen(false)}
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        {nav}
        {footer ? (
          <div className="mt-auto border-white/10 border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
            {footer}
          </div>
        ) : null}
      </aside>
    </>
  )
}
