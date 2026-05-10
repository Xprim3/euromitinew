"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
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
  brandTitle = "Euromiti",
  brandSubtitle = "Admin",
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
              "relative flex items-center gap-3 rounded-lg py-2.5 pr-3 pl-4 text-sm font-medium transition-colors",
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
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        id="admin-ds-sidebar"
        className={cnDs(
          "fixed inset-y-0 left-0 z-50 flex w-[var(--admin-sidebar-width)] -translate-x-full flex-col border-[var(--admin-border)] border-r bg-[var(--admin-sidebar)] shadow-xl transition-transform duration-200 lg:static lg:z-0 lg:translate-x-0 lg:shadow-none",
          mobileOpen && "translate-x-0",
          className
        )}
      >
        <div className="border-white/10 border-b px-5 py-5">
          <Link
            href={brandHref}
            className="block font-[family-name:var(--font-montserrat)] text-lg font-extrabold tracking-tight text-[var(--admin-sidebar-foreground)]"
          >
            {brandTitle}{" "}
            <span className="font-semibold text-[var(--admin-sidebar-muted)]">{brandSubtitle}</span>
          </Link>
        </div>
        {nav}
        {footer ? <div className="mt-auto border-white/10 border-t p-3">{footer}</div> : null}
      </aside>
    </>
  )
}
