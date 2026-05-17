import type { Metadata } from "next"
import Link from "next/link"

import { createJobAction } from "@/app/admin/(panel)/careers/actions"
import { CareerJobForm } from "@/components/admin/CareerJobForm"
import { AdminSectionCard, cnDs, dsBtnTertiary } from "@/components/admin/design-system"

export const metadata: Metadata = {
  title: "New job",
}

export default function AdminNewJobPage() {
  return (
    <div className="space-y-6">
      <AdminSectionCard
        title="Add position"
        description="Creates a new option in the public apply-form dropdown."
        headerActions={
          <Link href="/admin/careers" className={cnDs(dsBtnTertiary, "min-h-10 px-4 text-xs")}>
            Back to careers
          </Link>
        }
      >
        <p className="text-sm text-[var(--admin-text-muted)]">Set the title and whether applications are open for this role.</p>
      </AdminSectionCard>
      <CareerJobForm mode="create" submitAction={createJobAction} initial={null} />
    </div>
  )
}
