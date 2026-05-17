import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { updateJobAction } from "@/app/admin/(panel)/careers/actions"
import { CareerJobForm } from "@/components/admin/CareerJobForm"
import { DeleteJobForm } from "@/components/admin/DeleteJobForm"
import { AdminSectionCard, cnDs, dsBtnTertiary } from "@/components/admin/design-system"
import { getJobByIdAdmin } from "@/lib/data/careers-admin"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const row = await getJobByIdAdmin(id)
  if (!row) return { title: "Job" }
  return { title: `Edit · ${row.title}` }
}

export default async function AdminEditJobPage({ params }: Props) {
  const { id } = await params
  const row = await getJobByIdAdmin(id)
  if (!row) notFound()

  return (
    <div className="space-y-6">
      <AdminSectionCard
        title="Edit position"
        description={
          row.is_active
            ? "Applications are open — this role appears in the public apply-form dropdown."
            : "Applications are paused — hidden from the public dropdown."
        }
        headerActions={
          <>
            <DeleteJobForm id={row.id} label={row.title} redirectOnSuccess />
            <Link href="/admin/careers" className={cnDs(dsBtnTertiary, "min-h-10 px-4 text-xs")}>
              Back to careers
            </Link>
          </>
        }
      >
        <p className="text-sm text-[var(--admin-text-muted)]">Update the title, location label, or application toggle.</p>
      </AdminSectionCard>
      <CareerJobForm mode="edit" submitAction={updateJobAction} initial={row} />
    </div>
  )
}
