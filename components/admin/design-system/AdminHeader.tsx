"use client"

import { Menu } from "lucide-react"
import type { ReactNode } from "react"

import { useAdminSidebarState } from "./AdminSidebarState"
import { cnDs } from "./cn-ds"

export type AdminHeaderProps = {
  title: string
  actions?: ReactNode
  /** Shows menu button on small screens (opens design-system sidebar drawer). */
  showMobileNavTrigger?: boolean
  className?: string
}

/**
 * Sticky header for the main column: page title + optional right-side actions.
 */
export function AdminHeader({ title, actions, showMobileNavTrigger = true, className }: AdminHeaderProps) {
  const { mobileOpen, toggleMobile } = useAdminSidebarState()

  return (
    <header
      className={cnDs(
        "sticky top-0 z-30 shrink-0 border-[var(--admin-border)] border-b bg-[var(--admin-surface)]/95 pt-[env(safe-area-inset-top,0px)] shadow-sm backdrop-blur-sm lg:pt-0",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-[var(--admin-content-max)] flex-col gap-3 py-3 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          {showMobileNavTrigger ? (
            <button
              type="button"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-[var(--admin-radius-input)] border border-[var(--admin-border)] bg-white text-[var(--admin-text)] shadow-sm outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)] focus-visible:ring-offset-2 lg:hidden"
              aria-controls="admin-ds-sidebar"
              aria-expanded={mobileOpen}
              aria-label="Open navigation menu"
              onClick={toggleMobile}
            >
              <Menu className="size-5" aria-hidden />
            </button>
          ) : null}
          <h1 className="min-w-0 flex-1 break-words font-[family-name:var(--font-montserrat)] text-lg font-bold leading-snug tracking-tight text-[var(--admin-text)] sm:text-xl md:text-2xl">
            {title}
          </h1>
        </div>
        {actions ? (
          <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">{actions}</div>
        ) : null}
      </div>
    </header>
  )
}
