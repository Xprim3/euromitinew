import "@/app/admin/admin-ds.css"

import { AdminPanelChrome } from "@/components/admin/design-system/AdminPanelChrome"

export default function AdminPanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-admin-design-system
      className="euromiti-admin-ds relative isolate h-dvh max-h-dvh min-h-0 w-full max-w-[100vw] overflow-x-hidden overflow-y-hidden"
    >
      <AdminPanelChrome>{children}</AdminPanelChrome>
    </div>
  )
}
