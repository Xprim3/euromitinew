"use client"

import Link from "next/link"

import { DeleteJobApplicationForm } from "@/components/admin/DeleteJobApplicationForm"
import { AdminSectionCard, cnDs, dsBtnGhost, dsBtnPrimary, dsBtnTertiary } from "@/components/admin/design-system"
import { formatNewsDate } from "@/lib/format-news-date"
import type { JobApplicationWithJob } from "@/lib/data/job-applications-admin"
import { jobLocationAdminLabel } from "@/lib/validations/careers-admin"

function formatFileSize(n: number) {
  if (!Number.isFinite(n) || n < 0) return "—"
  if (n < 1024) return `${Math.round(n)} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

type CareerApplicantDetailPanelProps = {
  applicant: JobApplicationWithJob
  onClose: () => void
}

export function CareerApplicantDetailPanel({ applicant, onClose }: CareerApplicantDetailPanelProps) {
  const submitted = applicant.created_at ? formatNewsDate(applicant.created_at) : "—"
  const cvHref = `/admin/careers/applications/${applicant.id}/cv`

  return (
    <div className="space-y-4 border-border/60 border-t pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--admin-text)]">Applicant details</p>
        <button type="button" onClick={onClose} className={cnDs(dsBtnGhost, "min-h-9 px-3 text-xs")}>
          Close
        </button>
      </div>

      <AdminSectionCard
        title={applicant.full_name}
        description={`Submitted ${submitted}`}
        headerActions={
          <>
            <Link
              href={cvHref}
              className={cnDs(dsBtnPrimary, "min-h-10 min-w-0 max-w-full px-4 text-xs")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download CV
            </Link>
            <a
              href={`mailto:${applicant.email}`}
              className={cnDs(dsBtnTertiary, "min-h-10 min-w-0 max-w-full px-4 text-xs")}
            >
              Email applicant
            </a>
            <DeleteJobApplicationForm
              id={applicant.id}
              label={`${applicant.full_name} · ${applicant.email}`}
              triggerLabel="Remove"
              onSuccess={onClose}
            />
          </>
        }
      >
        <dl className="grid min-w-0 gap-4 text-sm sm:grid-cols-2">
          <div className="min-w-0">
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
              Full name
            </dt>
            <dd className="mt-1 min-w-0 break-words font-medium text-[var(--admin-text)]">{applicant.full_name}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">Email</dt>
            <dd className="mt-1 min-w-0">
              <a className="break-all font-medium text-primary hover:underline" href={`mailto:${applicant.email}`}>
                {applicant.email}
              </a>
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">Phone</dt>
            <dd className="mt-1 min-w-0 break-words text-[var(--admin-text)]">
              {applicant.phone.trim() ? applicant.phone : "—"}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
              Location
            </dt>
            <dd className="mt-1 min-w-0 break-words font-medium text-[var(--admin-text)]">
              {applicant.job_location_city ? jobLocationAdminLabel(applicant.job_location_city) : "—"}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
              Position applied for
            </dt>
            <dd className="mt-1 min-w-0 break-words text-[var(--admin-text)]">
              <span className="font-medium">{applicant.job_title}</span>
            </dd>
          </div>
          <div className="min-w-0 sm:col-span-2">
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">CV file</dt>
            <dd className="mt-1 min-w-0 break-all text-[var(--admin-text)] sm:break-words">
              {applicant.cv_original_filename ?? "cv.pdf"}
              <span className="text-[var(--admin-text-muted)]"> · </span>
              <span className="whitespace-nowrap">{formatFileSize(applicant.cv_byte_size)}</span>
            </dd>
          </div>
        </dl>
      </AdminSectionCard>

      <AdminSectionCard title="Cover letter" description="Optional message from the applicant.">
        {applicant.cover_letter.trim() ? (
          <p className="min-w-0 break-words whitespace-pre-wrap text-sm leading-relaxed text-[var(--admin-text)]">
            {applicant.cover_letter}
          </p>
        ) : (
          <p className="text-sm text-[var(--admin-text-muted)]">No cover letter provided.</p>
        )}
      </AdminSectionCard>
    </div>
  )
}
