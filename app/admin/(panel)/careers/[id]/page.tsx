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
        title="Edit job"
        description={row.is_active ? "This job is active." : "This job is inactive and hidden from public reads."}
        headerActions={
          <>
            <DeleteJobForm id={row.id} label={row.title} redirectOnSuccess />
            <Link href="/admin/careers" className={cnDs(dsBtnTertiary, "min-h-10 px-4 text-xs")}>
              Back to jobs
            </Link>
          </>
        }
      >
        <p className="text-sm text-[var(--admin-text-muted)]">Update the fields below and save the job.</p>
      </AdminSectionCard>
      <CareerJobForm mode="edit" submitAction={updateJobAction} initial={row} />
    </div>
  )
}
