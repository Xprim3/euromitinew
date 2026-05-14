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
            <Link href={cvHref} className={cnDs(dsBtnPrimary, "min-h-10 min-w-0 max-w-full px-4 text-xs")} target="_blank" rel="noopener noreferrer">
              Download document
            </Link>
            <Link href="/admin/careers/applications" className={cnDs(dsBtnTertiary, "min-h-10 min-w-0 max-w-full px-4 text-xs")}>
              All applications
            </Link>
            <Link href="/admin/careers" className={cnDs(dsBtnTertiary, "min-h-10 min-w-0 max-w-full px-4 text-xs")}>
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
        <dl className="grid min-w-0 gap-4 text-sm sm:grid-cols-2">
          <div className="min-w-0">
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">Full name</dt>
            <dd className="mt-1 min-w-0 break-words font-medium text-[var(--admin-text)]">{row.full_name}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">Email</dt>
            <dd className="mt-1 min-w-0">
              <a className="break-all font-medium text-primary hover:underline" href={`mailto:${row.email}`}>
                {row.email}
              </a>
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">Phone</dt>
            <dd className="mt-1 min-w-0 break-words text-[var(--admin-text)]">{row.phone.trim() ? row.phone : "—"}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">Job</dt>
            <dd className="mt-1 min-w-0 break-words text-[var(--admin-text)]">
              <span className="font-medium">{row.job_title}</span>
              {row.job_slug ? (
                <>
                  {" "}
                  <span className="text-[var(--admin-text-muted)]">·</span>{" "}
                  <Link
                    className="inline-block max-w-full break-all text-primary hover:underline"
                    href={`/careers/${row.job_slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Public posting
                  </Link>
                </>
              ) : null}
            </dd>
          </div>
          <div className="min-w-0 sm:col-span-2">
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">CV file</dt>
            <dd className="mt-1 min-w-0 break-all text-[var(--admin-text)] sm:break-words">
              {row.cv_original_filename ?? "cv.pdf"}
              <span className="text-[var(--admin-text-muted)]"> · </span>
              <span className="whitespace-nowrap">{formatFileSize(row.cv_byte_size)}</span>
            </dd>
          </div>
        </dl>
      </AdminSectionCard>

      <AdminSectionCard title="Cover letter" description="Optional message from the applicant.">
        {row.cover_letter.trim() ? (
          <p className="min-w-0 break-words whitespace-pre-wrap text-sm leading-relaxed text-[var(--admin-text)]">
            {row.cover_letter}
          </p>
        ) : (
          <p className="text-sm text-[var(--admin-text-muted)]">No cover letter provided.</p>
        )}
      </AdminSectionCard>
    </div>
  )
}
