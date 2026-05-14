import type { ReactNode } from "react"

import { cnDs } from "./cn-ds"

export type AdminPageShellProps = {
  children: ReactNode
  /** Remove horizontal padding for full-bleed tables (use sparingly). */
  flush?: boolean
  className?: string
}

/**
 * Constrains content width (max 1440px) and applies standard page padding.
 * Place below `AdminHeader` inside the main column.
 */
export function AdminPageShell({ children, flush = false, className }: AdminPageShellProps) {
  return (
    <div
      className={cnDs(
        "mx-auto min-h-0 min-w-0 w-full max-w-[var(--admin-content-max)] flex-1 overflow-y-auto overscroll-contain admin-scroll-touch",
        flush
          ? "px-[max(0.75rem,env(safe-area-inset-left,0px))] py-6 pr-[max(0.75rem,env(safe-area-inset-right,0px))] sm:px-6 lg:px-8"
          : "px-[max(0.75rem,env(safe-area-inset-left,0px))] py-5 pr-[max(0.75rem,env(safe-area-inset-right,0px))] sm:px-6 lg:px-8 lg:py-8",
        className
      )}
    >
      {children}
    </div>
  )
}
