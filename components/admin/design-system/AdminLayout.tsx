import type { ReactNode } from "react"

import { AdminSidebarStateProvider } from "./AdminSidebarState"
import { cnDs } from "./cn-ds"

export type AdminLayoutProps = {
  /** Typically `<AdminSidebar />` from this design system. */
  sidebar: ReactNode
  /** Main column: `<AdminHeader />`, `<AdminPageShell />`, etc. */
  children: ReactNode
  className?: string
}

/**
 * Root flex shell: navy sidebar + light main column.
 * Includes `AdminSidebarStateProvider` so `AdminSidebar` + `AdminHeader` can coordinate the mobile drawer.
 */
export function AdminLayout({ sidebar, children, className }: AdminLayoutProps) {
  return (
    <AdminSidebarStateProvider>
      <div className={cnDs("euromiti-admin-ds flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden lg:flex-row", className)}>
        {sidebar}
        <div className="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-hidden bg-[var(--admin-canvas)]">
          {children}
        </div>
      </div>
    </AdminSidebarStateProvider>
  )
}
