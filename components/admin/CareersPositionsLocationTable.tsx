"use client"

import Link from "next/link"

import { DeleteJobForm } from "@/components/admin/DeleteJobForm"
import { ToggleJobApplicationsForm } from "@/components/admin/ToggleJobApplicationsForm"
import {
  AdminTable,
  AdminTableBody,
  AdminTableHead,
  AdminTableRow,
  AdminTableTd,
  AdminTableTh,
  StatusBadge,
  TableActions,
  cnDs,
  dsBtnGhost,
} from "@/components/admin/design-system"
import type { JobPositionWithStats } from "@/lib/data/careers-admin-overview"
import { jobLocationAdminLabel } from "@/lib/validations/careers-admin"

type CareersPositionsLocationTableProps = {
  jobs: JobPositionWithStats[]
  showLocationColumn?: boolean
}

export function CareersPositionsLocationTable({ jobs, showLocationColumn = false }: CareersPositionsLocationTableProps) {
  const colSpan = showLocationColumn ? 6 : 5

  return (
    <AdminTable>
      <AdminTableHead>
        <AdminTableRow>
          {showLocationColumn ? <AdminTableTh>Location</AdminTableTh> : null}
          <AdminTableTh>Position</AdminTableTh>
          <AdminTableTh>Candidates</AdminTableTh>
          <AdminTableTh>Status</AdminTableTh>
          <AdminTableTh className="text-right">Applications</AdminTableTh>
          <AdminTableTh className="text-right">Actions</AdminTableTh>
        </AdminTableRow>
      </AdminTableHead>
      <AdminTableBody>
        {jobs.length === 0 ? (
          <AdminTableRow>
            <AdminTableTd colSpan={colSpan} className="py-8 text-center text-[var(--admin-text-muted)]">
              No positions in this group.
            </AdminTableTd>
          </AdminTableRow>
        ) : (
          jobs.map((job) => (
            <AdminTableRow key={job.id}>
              {showLocationColumn ? (
                <AdminTableTd className="whitespace-nowrap text-sm font-semibold">
                  {job.location_city ? jobLocationAdminLabel(job.location_city) : "—"}
                </AdminTableTd>
              ) : null}
              <AdminTableTd>
                <div className="font-medium">{job.title}</div>
                <div className="mt-1 font-mono text-xs text-[var(--admin-text-muted)]">{job.slug}</div>
              </AdminTableTd>
              <AdminTableTd className="tabular-nums font-semibold">{job.application_count}</AdminTableTd>
              <AdminTableTd>
                <StatusBadge tone={job.is_active ? "success" : "neutral"}>
                  {job.is_active ? "Accepting" : "Paused"}
                </StatusBadge>
              </AdminTableTd>
              <AdminTableTd className="text-right">
                <ToggleJobApplicationsForm id={job.id} isActive={job.is_active} title={job.title} />
              </AdminTableTd>
              <AdminTableTd className="text-right">
                <TableActions>
                  <Link href={`/admin/careers/${job.id}`} className={cnDs(dsBtnGhost, "min-h-9 px-3 text-xs")}>
                    Edit
                  </Link>
                  <DeleteJobForm id={job.id} label={`${job.title} · ${job.location_city ?? ""}`} />
                </TableActions>
              </AdminTableTd>
            </AdminTableRow>
          ))
        )}
      </AdminTableBody>
    </AdminTable>
  )
}
