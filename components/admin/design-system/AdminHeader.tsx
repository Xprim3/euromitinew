"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import type { ReactNode } from "react"

import { useAdminSidebarState } from "./AdminSidebarState"
import { cnDs } from "./cn-ds"

export type AdminHeaderBreadcrumb = {
  label: string
  href?: string
}

export type AdminHeaderProps = {
  title: string
  subtitle?: string
  breadcrumbs?: readonly AdminHeaderBreadcrumb[]
  actions?: ReactNode
  /** Shows menu button on small screens (opens design-system sidebar drawer). */
  showMobileNavTrigger?: boolean
  className?: string
}

/**
 * Sticky white header for the main column: optional breadcrumbs, title, and right-side actions.
 */
export function AdminHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  showMobileNavTrigger = true,
  className,
}: AdminHeaderProps) {
  const { toggleMobile } = useAdminSidebarState()

  return (
    <header
      className={cnDs(
        "sticky top-0 z-30 border-[var(--admin-border)] border-b bg-[var(--admin-surface)]/95 shadow-sm backdrop-blur-sm",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-[var(--admin-content-max)] flex-wrap items-start gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {showMobileNavTrigger ? (
            <button
              type="button"
              className="mt-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-[var(--admin-radius-input)] border border-[var(--admin-border)] bg-white text-[var(--admin-text)] shadow-sm outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)] focus-visible:ring-offset-2 lg:hidden"
              aria-controls="admin-ds-sidebar"
              aria-label="Open navigation menu"
              onClick={toggleMobile}
            >
              <Menu className="size-5" aria-hidden />
            </button>
          ) : null}
          <div className="min-w-0">
            {breadcrumbs?.length ? (
              <nav aria-label="Breadcrumb" className="mb-1 flex flex-wrap items-center gap-1.5 text-xs text-[var(--admin-text-muted)]">
                {breadcrumbs.map((crumb, i) => (
                  <span key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
                    {i > 0 ? <span aria-hidden>/</span> : null}
                    {crumb.href ? (
                      <Link href={crumb.href} className="hover:text-[var(--admin-text)]">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-[var(--admin-text-muted)]">{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            ) : null}
            <h1 className="font-[family-name:var(--font-montserrat)] text-xl font-bold tracking-tight text-[var(--admin-text)] sm:text-2xl">
              {title}
            </h1>
            {subtitle ? <p className="mt-1 max-w-2xl text-sm text-[var(--admin-text-muted)]">{subtitle}</p> : null}
          </div>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  )
}
