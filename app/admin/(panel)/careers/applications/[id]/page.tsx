import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { DeleteJobApplicationForm } from "@/components/admin/DeleteJobApplicationForm"
import { AdminSectionCard, cnDs, dsBtnPrimary, dsBtnTertiary } from "@/components/admin/design-system"
import { formatNewsDate } from "@/lib/format-news-date"
import { getJobApplicationByIdAdmin } from "@/lib/data/job-applications-admin"

type Props = { params: Promise<{ id: string }> }

function formatFileSize(n: number) {
  if (!Number.isFinite(n) || n < 0) return "—"
  if (n < 1024) return `${Math.round(n)} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const row = await getJobApplicationByIdAdmin(id)
  if (!row) return { title: "Applicant" }
  return { title: `${row.full_name} · Application` }
}

export default async function AdminJobApplicationDetailPage({ params }: Props) {
  const { id } = await params
  const row = await getJobApplicationByIdAdmin(id)
  if (!row) notFound()

  const submitted = row.created_at ? formatNewsDate(row.created_at) : "—"
  const cvHref = `/admin/careers/applications/${row.id}/cv`

  return (
    <div className="space-y-6">
      <AdminSectionCard
        title="Applicant"
        description={`Submitted ${submitted}`}
        headerActions={
          <>
            <Link href={cvHref} className={cnDs(dsBtnPrimary, "min-h-10 px-4 text-xs")} target="_blank" rel="noopener noreferrer">
              Download CV (PDF)
            </Link>
            <Link href="/admin/careers/applications" className={cnDs(dsBtnTertiary, "min-h-10 px-4 text-xs")}>
              All applications
            </Link>
            <Link href="/admin/careers" className={cnDs(dsBtnTertiary, "min-h-10 px-4 text-xs")}>
              Jobs
            </Link>
            <DeleteJobApplicationForm
              id={row.id}
              label={`${row.full_name} · ${row.email}`}
              triggerLabel="Remove applicant"
              redirectOnSuccess
            />
          </>
        }
      >
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">Full name</dt>
            <dd className="mt-1 font-medium text-[var(--admin-text)]">{row.full_name}</dd>
          </div>
          <div>
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">Email</dt>
            <dd className="mt-1">
              <a className="font-medium text-primary hover:underline" href={`mailto:${row.email}`}>
                {row.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">Phone</dt>
            <dd className="mt-1 text-[var(--admin-text)]">{row.phone.trim() ? row.phone : "—"}</dd>
          </div>
          <div>
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">Job</dt>
            <dd className="mt-1 text-[var(--admin-text)]">
              <span className="font-medium">{row.job_title}</span>
              {row.job_slug ? (
                <>
                  {" "}
                  <span className="text-[var(--admin-text-muted)]">·</span>{" "}
                  <Link className="text-primary hover:underline" href={`/careers/${row.job_slug}`} target="_blank" rel="noopener noreferrer">
                    Public posting
                  </Link>
                </>
              ) : null}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">CV file</dt>
            <dd className="mt-1 text-[var(--admin-text)]">
              {row.cv_original_filename ?? "cv.pdf"} · {formatFileSize(row.cv_byte_size)}
            </dd>
          </div>
        </dl>
      </AdminSectionCard>

      <AdminSectionCard title="Cover letter" description="Optional message from the applicant.">
        {row.cover_letter.trim() ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--admin-text)]">{row.cover_letter}</p>
        ) : (
          <p className="text-sm text-[var(--admin-text-muted)]">No cover letter provided.</p>
        )}
      </AdminSectionCard>
    </div>
  )
}
