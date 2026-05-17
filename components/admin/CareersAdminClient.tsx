"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Inbox, UserCheck, Users } from "lucide-react"

import { CareerApplicantDetailPanel } from "@/components/admin/CareerApplicantDetailPanel"
import { DeleteJobApplicationForm } from "@/components/admin/DeleteJobApplicationForm"
import { CareersPositionsLocationTable } from "@/components/admin/CareersPositionsLocationTable"
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
  TableActions,
  TextInput,
  cnDs,
  dsBtnGhost,
  dsBtnPrimary,
} from "@/components/admin/design-system"
import { formatNewsDate } from "@/lib/format-news-date"
import type { JobPositionWithStats } from "@/lib/data/careers-admin-overview"
import type { CareersAdminOverview } from "@/lib/data/careers-admin-overview"
import { JOB_LOCATION_OPTIONS, jobLocationAdminLabel } from "@/lib/validations/careers-admin"
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

  const positionQueryNorm = positionQuery.trim().toLowerCase()

  const matchesPositionSearch = useCallback(
    (p: JobPositionWithStats) => {
      if (!positionQueryNorm) return true
      const hay = `${p.title} ${p.slug} ${p.location_city ?? ""} ${jobLocationAdminLabel(p.location_city ?? "")}`.toLowerCase()
      return hay.includes(positionQueryNorm)
    },
    [positionQueryNorm]
  )

  const positionsByLocation = useMemo(() => {
    return JOB_LOCATION_OPTIONS.map((loc) => ({
      location: loc,
      label: jobLocationAdminLabel(loc),
      jobs: positions.filter((p) => p.location_city === loc && matchesPositionSearch(p)),
    }))
  }, [matchesPositionSearch, positions])

  const legacyPositions = useMemo(() => {
    return positions.filter(
      (p) => (!p.location_city || !JOB_LOCATION_OPTIONS.includes(p.location_city as (typeof JOB_LOCATION_OPTIONS)[number])) && matchesPositionSearch(p)
    )
  }, [matchesPositionSearch, positions])

  const filteredApplications = useMemo(() => {
    const q = applicantQuery.trim().toLowerCase()
    if (!q) return applications
    return applications.filter((r) => {
      const hay = `${r.full_name} ${r.email} ${r.phone} ${r.job_title} ${r.job_slug} ${r.job_location_city} ${jobLocationAdminLabel(r.job_location_city)}`.toLowerCase()
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
        title="Positions by location"
        description="Add the same role once per city (Prishtinë, Ferizaj, Gjilan). Each row appears on the public form under that location."
        headerActions={
          <Link href="/admin/careers/new" className={cnDs(dsBtnPrimary, "min-h-10 px-4 text-xs")}>
            Add position
          </Link>
        }
      >
        <div className="space-y-8">
          <TextInput
            label="Search positions"
            value={positionQuery}
            onChange={(e) => setPositionQuery(e.target.value)}
            placeholder="Title, slug, or city"
          />

          {positionsByLocation.map(({ location, label, jobs }) => (
            <div key={location} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-border/60 border-b pb-2">
                <h3 className="font-heading text-base font-bold text-[var(--admin-text)]">{label}</h3>
                <span className="text-xs text-[var(--admin-text-muted)]">
                  {jobs.length} position{jobs.length === 1 ? "" : "s"}
                </span>
              </div>
              {jobs.length === 0 ? (
                <p className="text-sm text-[var(--admin-text-muted)]">
                  No positions for {label} yet.{" "}
                  <Link href="/admin/careers/new" className="font-semibold text-primary hover:underline">
                    Add position
                  </Link>
                  .
                </p>
              ) : (
                <CareersPositionsLocationTable jobs={jobs} />
              )}
            </div>
          ))}

          {legacyPositions.length > 0 ? (
            <div className="space-y-3 border-amber-200/80 border-t pt-6">
              <h3 className="font-heading text-base font-bold text-amber-900">Needs location update</h3>
              <p className="text-sm text-[var(--admin-text-muted)]">
                These rows have a missing or old location. Edit each and set Prishtinë, Ferizaj, or Gjilan.
              </p>
              <CareersPositionsLocationTable jobs={legacyPositions} showLocationColumn />
            </div>
          ) : null}
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
            placeholder="Name, email, phone, location, or position"
          />
          <AdminTable>
            <AdminTableHead>
              <AdminTableRow>
                <AdminTableTh>Submitted</AdminTableTh>
                <AdminTableTh>Applicant</AdminTableTh>
                <AdminTableTh>Email</AdminTableTh>
                <AdminTableTh>Location</AdminTableTh>
                <AdminTableTh>Position</AdminTableTh>
                <AdminTableTh className="text-right">Actions</AdminTableTh>
              </AdminTableRow>
            </AdminTableHead>
            <AdminTableBody>
              {filteredApplications.length === 0 ? (
                <AdminTableRow>
                  <AdminTableTd colSpan={6} className="py-10 text-center text-[var(--admin-text-muted)]">
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
                      <AdminTableTd className="whitespace-nowrap text-sm">
                        {r.job_location_city ? jobLocationAdminLabel(r.job_location_city) : "—"}
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

