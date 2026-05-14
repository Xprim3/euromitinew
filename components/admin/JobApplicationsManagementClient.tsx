"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

import {
  AdminContentGrid,
  AdminSectionCard,
  AdminTable,
  AdminTableBody,
  AdminTableHead,
  AdminTableRow,
  AdminTableTd,
  AdminTableTh,
  TableActions,
  TextInput,
  cnDs,
  dsBtnGhost,
} from "@/components/admin/design-system"
import { DeleteJobApplicationForm } from "@/components/admin/DeleteJobApplicationForm"
import { formatNewsDate } from "@/lib/format-news-date"
import type { JobApplicationWithJob } from "@/lib/data/job-applications-admin"

type JobApplicationsManagementClientProps = {
  rows: JobApplicationWithJob[]
}

export function JobApplicationsManagementClient({ rows }: JobApplicationsManagementClientProps) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => {
      const hay = `${r.full_name} ${r.email} ${r.phone} ${r.job_title} ${r.job_slug}`.toLowerCase()
      return hay.includes(q)
    })
  }, [query, rows])

  return (
    <AdminSectionCard
      title="Job applications"
      description="Submissions from the public careers form (name, contact, cover letter, CV)."
      headerActions={
        <Link href="/admin/careers" className={cnDs(dsBtnGhost, "min-h-10 px-4 text-xs")}>
          Back to jobs
        </Link>
      }
    >
      <div className="space-y-5">
        <AdminContentGrid columns={1}>
          <TextInput
            label="Search applicants"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, email, phone, or job"
          />
        </AdminContentGrid>

        <AdminTable>
          <AdminTableHead>
            <AdminTableRow>
              <AdminTableTh>Submitted</AdminTableTh>
              <AdminTableTh>Applicant</AdminTableTh>
              <AdminTableTh>Email</AdminTableTh>
              <AdminTableTh>Job</AdminTableTh>
              <AdminTableTh className="text-right">Actions</AdminTableTh>
            </AdminTableRow>
          </AdminTableHead>
          <AdminTableBody>
            {filtered.length === 0 ? (
              <AdminTableRow>
                <AdminTableTd colSpan={5} className="py-10 text-center text-[var(--admin-text-muted)]">
                  {rows.length === 0 ? "No applications yet." : "No applications match this search."}
                </AdminTableTd>
              </AdminTableRow>
            ) : (
              filtered.map((r) => (
                <AdminTableRow key={r.id}>
                  <AdminTableTd className="whitespace-nowrap text-sm">
                    {r.created_at ? formatNewsDate(r.created_at) : "—"}
                  </AdminTableTd>
                  <AdminTableTd className="min-w-0 max-w-[11rem] sm:max-w-none">
                    <div className="break-words font-medium">{r.full_name}</div>
                    {r.phone ? (
                      <div className="mt-1 break-all text-xs text-[var(--admin-text-muted)]">{r.phone}</div>
                    ) : null}
                  </AdminTableTd>
                  <AdminTableTd className="min-w-0 max-w-[14rem] sm:max-w-[18rem]">
                    <a className="break-all text-primary hover:underline" href={`mailto:${r.email}`}>
                      {r.email}
                    </a>
                  </AdminTableTd>
                  <AdminTableTd className="min-w-0 max-w-[12rem] sm:max-w-none">
                    <div className="break-words">{r.job_title}</div>
                    {r.job_slug ? (
                      <div className="mt-1 break-all font-mono text-xs text-[var(--admin-text-muted)]">{r.job_slug}</div>
                    ) : null}
                  </AdminTableTd>
                  <AdminTableTd className="text-right">
                    <TableActions>
                      <Link href={`/admin/careers/applications/${r.id}`} className={cnDs(dsBtnGhost, "min-h-9 px-3 text-xs")}>
                        Open
                      </Link>
                      <DeleteJobApplicationForm
                        id={r.id}
                        label={`${r.full_name} · ${r.email}`}
                        triggerLabel="Remove"
                      />
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
