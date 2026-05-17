import type { Metadata } from "next"
import Link from "next/link"

import { createJobAction } from "@/app/admin/(panel)/careers/actions"
import { CareerJobForm } from "@/components/admin/CareerJobForm"
import { AdminSectionCard, cnDs, dsBtnTertiary } from "@/components/admin/design-system"

export const metadata: Metadata = {
  title: "New position",
}

export default async function AdminNewJobPage() {
  return (
    <div className="space-y-6">
      <AdminSectionCard
        title="Add position"
        description="One entry per city and role — the same job title can be added separately for Prishtinë, Ferizaj, and Gjilan."
        headerActions={
          <Link href="/admin/careers" className={cnDs(dsBtnTertiary, "min-h-10 px-4 text-xs")}>
            Back to careers
          </Link>
        }
      >
        <p className="text-sm text-[var(--admin-text-muted)]">
          Use the form below: pick a location, then enter the position title.
        </p>
      </AdminSectionCard>
      <CareerJobForm mode="create" submitAction={createJobAction} initial={null} />
    </div>
  )
}
