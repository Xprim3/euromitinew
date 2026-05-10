import "@/app/admin/admin-ds.css"

import { AdminPanelChrome } from "@/components/admin/design-system/AdminPanelChrome"

export default function AdminPanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div data-admin-design-system className="euromiti-admin-ds min-h-svh">
      <AdminPanelChrome>{children}</AdminPanelChrome>
    </div>
  )
}
