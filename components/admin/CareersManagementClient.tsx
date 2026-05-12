"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

import { DeleteJobForm } from "@/components/admin/DeleteJobForm"
import {
  AdminContentGrid,
  AdminSectionCard,
  AdminTable,
  AdminTableBody,
  AdminTableHead,
  AdminTableRow,
  AdminTableTd,
  AdminTableTh,
  SelectInput,
  StatusBadge,
  TableActions,
  TextInput,
  cnDs,
  dsBtnGhost,
  dsBtnPrimary,
} from "@/components/admin/design-system"
import { formatNewsDate } from "@/lib/format-news-date"
import type { JobRow } from "@/types/supabase-cms"

type CareersManagementClientProps = {
  rows: JobRow[]
}

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const

export function CareersManagementClient({ rows }: CareersManagementClientProps) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((job) => {
      const matchesStatus =
        status === "all" || (status === "active" && job.is_active) || (status === "inactive" && !job.is_active)
      const haystack = `${job.title} ${job.location_city ?? ""} ${job.apply_email ?? ""}`.toLowerCase()
      return matchesStatus && (!q || haystack.includes(q))
    })
  }, [query, rows, status])

  return (
    <AdminSectionCard
      title="Careers / jobs management"
      description="Create, edit, filter, activate, and remove open positions."
      headerActions={
        <Link href="/admin/careers/new" className={cnDs(dsBtnPrimary, "min-h-10 px-4 text-xs")}>
          Add job
        </Link>
      }
    >
      <div className="space-y-5">
        <AdminContentGrid columns={2}>
          <TextInput
            label="Search jobs"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, location, or contact"
          />
          <SelectInput
            label="Filter by status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            options={statusOptions}
          />
        </AdminContentGrid>

        <AdminTable>
          <AdminTableHead>
            <AdminTableRow>
              <AdminTableTh>Job title</AdminTableTh>
              <AdminTableTh>Status</AdminTableTh>
              <AdminTableTh>Location</AdminTableTh>
              <AdminTableTh>Posted</AdminTableTh>
              <AdminTableTh className="text-right">Actions</AdminTableTh>
            </AdminTableRow>
          </AdminTableHead>
          <AdminTableBody>
            {filtered.length === 0 ? (
              <AdminTableRow>
                <AdminTableTd colSpan={5} className="py-10 text-center text-[var(--admin-text-muted)]">
                  No jobs match this filter.
                </AdminTableTd>
              </AdminTableRow>
            ) : (
              filtered.map((job) => (
                <AdminTableRow key={job.id}>
                  <AdminTableTd>
                    <div className="font-medium">{job.title}</div>
                    <div className="mt-1 font-mono text-xs text-[var(--admin-text-muted)]">{job.slug}</div>
                  </AdminTableTd>
                  <AdminTableTd>
                    <StatusBadge tone={job.is_active ? "success" : "neutral"}>
                      {job.is_active ? "active" : "inactive"}
                    </StatusBadge>
                  </AdminTableTd>
                  <AdminTableTd>{job.location_city ?? "—"}</AdminTableTd>
                  <AdminTableTd>{job.posted_at ? formatNewsDate(job.posted_at) : "—"}</AdminTableTd>
                  <AdminTableTd className="text-right">
                    <TableActions>
                      <Link href={`/admin/careers/${job.id}`} className={cnDs(dsBtnGhost, "min-h-9 px-3 text-xs")}>
                        Edit
                      </Link>
                      <DeleteJobForm id={job.id} label={job.title} />
                    </TableActions>
                  </AdminTableTd>
                </AdminTableRow>
              ))
            )}
          </AdminTableBody>
        </AdminTable>
      </div>
    </AdminSectionCard>
  )
}
