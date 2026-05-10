import type { Metadata } from "next"

import { EmptyState } from "@/components/admin/design-system"

export const metadata: Metadata = {
  title: "Settings",
}

export default function AdminSettingsPlaceholderPage() {
  return (
    <div className="space-y-6">
      <EmptyState
        title="Settings are coming soon"
        description="Global console preferences will live here. No database wiring in this phase."
      />
    </div>
  )
}
