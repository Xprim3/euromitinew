"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Inbox, UserCheck, Users } from "lucide-react"

import { CareerApplicantDetailPanel } from "@/components/admin/CareerApplicantDetailPanel"
import { DeleteJobForm } from "@/components/admin/DeleteJobForm"
import { DeleteJobApplicationForm } from "@/components/admin/DeleteJobApplicationForm"
import { ToggleJobApplicationsForm } from "@/components/admin/ToggleJobApplicationsForm"
import {
  AdminContentGrid,
  AdminPageLead,
  AdminSectionCard,
  AdminTable,
  AdminTableBody,
  AdminTableHead,
  AdminTableRow,
  AdminTableTd,
  AdminTableTh,
  DashboardMetricCard,
  StatusBadge,
  TableActions,
  TextInput,
  cnDs,
  dsBtnGhost,
  dsBtnPrimary,
} from "@/components/admin/design-system"
import { formatNewsDate } from "@/lib/format-news-date"
import type { CareersAdminOverview } from "@/lib/data/careers-admin-overview"
import { cn } from "@/lib/utils"

type CareersAdminClientProps = CareersAdminOverview & {
  initialApplicantId?: string
}

export function CareersAdminClient({ stats, positions, applications, initialApplicantId }: CareersAdminClientProps) {
  const router = useRouter()
  const detailRef = useRef<HTMLDivElement>(null)
  const [positionQuery, setPositionQuery] = useState("")
  const [applicantQuery, setApplicantQuery] = useState("")
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(initialApplicantId ?? null)

  const filteredPositions = useMemo(() => {
    const q = positionQuery.trim().toLowerCase()
    if (!q) return positions
    return positions.filter((p) => `${p.title} ${p.slug} ${p.location_city ?? ""}`.toLowerCase().includes(q))
  }, [positionQuery, positions])

  const filteredApplications = useMemo(() => {
    const q = applicantQuery.trim().toLowerCase()
    if (!q) return applications
    return applications.filter((r) => {
      const hay = `${r.full_name} ${r.email} ${r.phone} ${r.job_title} ${r.job_slug}`.toLowerCase()
      return hay.includes(q)
    })
  }, [applicantQuery, applications])

  const selectedApplicant = useMemo(
    () => applications.find((a) => a.id === selectedApplicantId) ?? null,
    [applications, selectedApplicantId]
  )

  const selectApplicant = useCallback(
    (id: string | null) => {
      const valid = id && applications.some((a) => a.id === id) ? id : null
      setSelectedApplicantId(valid)
      const url = valid ? `/admin/careers?applicant=${encodeURIComponent(valid)}#candidates` : "/admin/careers#candidates"
      router.replace(url, { scroll: false })
    },
    [applications, router]
  )

  useEffect(() => {
    if (!initialApplicantId) return
    if (applications.some((a) => a.id === initialApplicantId)) {
      setSelectedApplicantId(initialApplicantId)
    }
  }, [applications, initialApplicantId])

  useEffect(() => {
    if (!selectedApplicantId || !detailRef.current) return
    detailRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [selectedApplicantId])

  return (
    <div className="space-y-8">
      <AdminPageLead
        title="Careers"
        description="Manage apply-form positions and review candidates on this page — no separate applications screen."
      />

      <div className="flex flex-wrap gap-2 text-xs font-semibold">
        <a href="#positions" className={cnDs(dsBtnGhost, "min-h-9 px-3")}>
          Positions
        </a>
        <a href="#candidates" className={cnDs(dsBtnGhost, "min-h-9 px-3")}>
          Candidates ({stats.totalApplications})
        </a>
      </div>

      <AdminContentGrid columns={4}>
        <DashboardMetricCard
          label="Total candidates"
          value={stats.totalApplications}
          hint="All applications received"
          icon={<Users className="size-5" aria-hidden />}
        />
        <DashboardMetricCard
          label="Last 7 days"
          value={stats.applicationsLast7Days}
          hint="New applications this week"
          icon={<Inbox className="size-5" aria-hidden />}
        />
        <DashboardMetricCard
          label="Accepting applications"
          value={stats.openPositions}
          hint={`Of ${stats.totalPositions} positions in admin`}
          icon={<UserCheck className="size-5" aria-hidden />}
        />
        <DashboardMetricCard
          label="Positions"
          value={stats.totalPositions}
          hint="Titles in the public dropdown"
        />
      </AdminContentGrid>

      <AdminSectionCard
        id="positions"
        title="Apply-form positions"
        description="Each row is a role in the public dropdown. Turn applications on to show it on /careers; turn off to pause new submissions."
        headerActions={
          <Link href="/admin/careers/new" className={cnDs(dsBtnPrimary, "min-h-10 px-4 text-xs")}>
            Add position
          </Link>
        }
      >
        <div className="space-y-5">
          <TextInput
            label="Search positions"
            value={positionQuery}
            onChange={(e) => setPositionQuery(e.target.value)}
            placeholder="Title or slug"
          />
          <AdminTable>
            <AdminTableHead>
              <AdminTableRow>
                <AdminTableTh>Position</AdminTableTh>
                <AdminTableTh>Candidates</AdminTableTh>
                <AdminTableTh>Status</AdminTableTh>
                <AdminTableTh className="text-right">Applications</AdminTableTh>
                <AdminTableTh className="text-right">Actions</AdminTableTh>
              </AdminTableRow>
            </AdminTableHead>
            <AdminTableBody>
              {filteredPositions.length === 0 ? (
                <AdminTableRow>
                  <AdminTableTd colSpan={5} className="py-10 text-center text-[var(--admin-text-muted)]">
                    {positions.length === 0
                      ? "No positions yet. Add one to populate the public apply form."
                      : "No positions match this search."}
                  </AdminTableTd>
                </AdminTableRow>
              ) : (
                filteredPositions.map((job) => (
                  <AdminTableRow key={job.id}>
                    <AdminTableTd>
                      <div className="font-medium">{job.title}</div>
                      <div className="mt-1 font-mono text-xs text-[var(--admin-text-muted)]">{job.slug}</div>
                      {job.location_city ? (
                        <div className="mt-1 text-xs text-[var(--admin-text-muted)]">{job.location_city}</div>
                      ) : null}
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

      <AdminSectionCard
        id="candidates"
        title="Candidates"
        description="Select a row to view details, download CV, or remove an applicant — everything stays on this page."
      >
        <div className="space-y-5">
          <TextInput
            label="Search candidates"
            value={applicantQuery}
            onChange={(e) => setApplicantQuery(e.target.value)}
            placeholder="Name, email, phone, or position"
          />
          <AdminTable>
            <AdminTableHead>
              <AdminTableRow>
                <AdminTableTh>Submitted</AdminTableTh>
                <AdminTableTh>Applicant</AdminTableTh>
                <AdminTableTh>Email</AdminTableTh>
                <AdminTableTh>Position</AdminTableTh>
                <AdminTableTh className="text-right">Actions</AdminTableTh>
              </AdminTableRow>
            </AdminTableHead>
            <AdminTableBody>
              {filteredApplications.length === 0 ? (
                <AdminTableRow>
                  <AdminTableTd colSpan={5} className="py-10 text-center text-[var(--admin-text-muted)]">
                    {applications.length === 0 ? "No applications yet." : "No candidates match this search."}
                  </AdminTableTd>
                </AdminTableRow>
              ) : (
                filteredApplications.map((r) => {
                  const isSelected = r.id === selectedApplicantId
                  return (
                    <AdminTableRow
                      key={r.id}
                      className={cn(isSelected && "bg-[var(--admin-surface-muted)]/80")}
                    >
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
                      </AdminTableTd>
                      <AdminTableTd className="text-right">
                        <TableActions>
                          <button
                            type="button"
                            onClick={() => selectApplicant(isSelected ? null : r.id)}
                            className={cnDs(dsBtnGhost, "min-h-9 px-3 text-xs")}
                            aria-pressed={isSelected}
                          >
                            {isSelected ? "Hide" : "View"}
                          </button>
                          <DeleteJobApplicationForm
                            id={r.id}
                            label={`${r.full_name} · ${r.email}`}
                            triggerLabel="Remove"
                            onSuccess={() => {
                              if (selectedApplicantId === r.id) selectApplicant(null)
                            }}
                          />
                        </TableActions>
                      </AdminTableTd>
                    </AdminTableRow>
                  )
                })
              )}
            </AdminTableBody>
          </AdminTable>

          {selectedApplicant ? (
            <div ref={detailRef}>
              <CareerApplicantDetailPanel applicant={selectedApplicant} onClose={() => selectApplicant(null)} />
            </div>
          ) : null}
        </div>
      </AdminSectionCard>
    </div>
  )
}

