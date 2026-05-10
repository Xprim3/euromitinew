import type { Metadata } from "next"

import { EmptyState } from "@/components/admin/design-system"

export const metadata: Metadata = {
  title: "Careers",
}

export default function AdminCareersPlaceholderPage() {
  return (
    <div className="space-y-6">
      <EmptyState
        title="Careers admin is coming soon"
        description="Job openings will be managed here. No database wiring in this phase."
      />
    </div>
  )
}
