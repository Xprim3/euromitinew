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
        title="Create job"
        description="Add a careers opening and decide whether it is active."
        headerActions={
          <Link href="/admin/careers" className={cnDs(dsBtnTertiary, "min-h-10 px-4 text-xs")}>
            Back to jobs
          </Link>
        }
      >
        <p className="text-sm text-[var(--admin-text-muted)]">Complete the editor below, then save the job.</p>
      </AdminSectionCard>
      <CareerJobForm mode="create" submitAction={createJobAction} initial={null} />
    </div>
  )
}
