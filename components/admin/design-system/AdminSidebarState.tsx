"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

type AdminSidebarStateValue = {
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
  toggleMobile: () => void
}

const AdminSidebarStateContext = createContext<AdminSidebarStateValue | null>(null)

export function AdminSidebarStateProvider({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), [])

  const value = useMemo(
    () => ({
      mobileOpen,
      setMobileOpen,
      toggleMobile,
    }),
    [mobileOpen, toggleMobile]
  )

  return <AdminSidebarStateContext.Provider value={value}>{children}</AdminSidebarStateContext.Provider>
}

/** No-op when used outside `AdminSidebarStateProvider` (e.g. Storybook). */
export function useAdminSidebarState(): AdminSidebarStateValue {
  const ctx = useContext(AdminSidebarStateContext)
  if (!ctx) {
    return {
      mobileOpen: false,
      setMobileOpen: () => {},
      toggleMobile: () => {},
    }
  }
  return ctx
}
