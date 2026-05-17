import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import { Briefcase, Fuel, ImageIcon, Inbox, MapPin, Newspaper } from "lucide-react"

import {
  AdminContentGrid,
  AdminPageLead,
  AdminRecordCardList,
  AdminSectionCard,
  AdminTable,
  AdminTableBody,
  AdminTableHead,
  AdminTableRow,
  AdminTableTd,
  AdminTableTh,
  DashboardMetricCard,
  EmptyState,
  QuickActionCard,
  cnDs,
  dsBtnGhost,
  dsBtnTertiary,
  type AdminRecordCard,
} from "@/components/admin/design-system"
import { formatAdminStamp } from "@/lib/format-admin-datetime"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Dashboard",
}

type DashboardMetric = {
  label: string
  value: string
  hint: string
  icon: ReactNode
}

type RecentApplicationRow = {
  id: string
  full_name: string
  email: string
  job_title: string
  created_at: string
}

type DashboardData = {
  metrics: DashboardMetric[]
  recentApplications: RecentApplicationRow[]
}

function applicationRowsToCards(rows: RecentApplicationRow[]): AdminRecordCard[] {
  return rows.map((row) => ({
    id: row.id,
    title: row.full_name,
    fields: [
      { label: "Submitted", value: row.created_at ? formatAdminStamp(row.created_at) : "—" },
      {
        label: "Email",
        value: (
          <a className="break-all text-primary underline" href={`mailto:${row.email}`}>
            {row.email}
          </a>
        ),
      },
      { label: "Role", value: <span className="break-words">{row.job_title}</span> },
    ],
    footer: (
      <Link href={`/admin/careers?applicant=${encodeURIComponent(row.id)}#candidates`} className={cnDs(dsBtnGhost, "min-h-9 px-3 text-xs")}>
        Open
      </Link>
    ),
  }))
}

async function loadDashboardData(): Promise<DashboardData> {
  try {
    const supabase = await createSupabaseServerClient()

    const [
      applicationsRes,
      publishedNews,
      activeLocations,
      activeFuel,
      mediaAssets,
      activeJobs,
    ] = await Promise.all([
      supabase.from("job_applications").select("*", { count: "exact", head: true }),
      supabase.from("news_posts").select("*", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("locations").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("fuel_prices").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("media_uploads").select("*", { count: "exact", head: true }),
      supabase.from("jobs").select("*", { count: "exact", head: true }).eq("is_active", true),
    ])

    const { data: appRows, error: appErr } = await supabase
      .from("job_applications")
      .select("id, job_id, full_name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(8)

    let recentApplications: RecentApplicationRow[] = []
    if (!appErr && appRows?.length) {
      const jobIds = [...new Set(appRows.map((r) => r.job_id).filter(Boolean))]
      const titleByJob = new Map<string, string>()
      if (jobIds.length) {
        const { data: jobs } = await supabase.from("jobs").select("id, title").in("id", jobIds)
        for (const j of jobs ?? []) {
          const o = j as { id?: string; title?: string }
          const id = String(o.id ?? "")
          if (id) titleByJob.set(id, typeof o.title === "string" ? o.title.trim() || "—" : "—")
        }
      }
      recentApplications = appRows.map((r) => ({
        id: String(r.id ?? ""),
        full_name: typeof r.full_name === "string" ? r.full_name : "—",
        email: typeof r.email === "string" ? r.email : "—",
        job_title: titleByJob.get(String(r.job_id ?? "")) ?? "—",
        created_at: typeof r.created_at === "string" ? r.created_at : "",
      }))
    }

    const appCount = applicationsRes.count ?? 0

    return {
      metrics: [
        {
          label: "Job applications",
          value: String(appCount),
          hint: "Total submissions from the public careers form.",
          icon: <Inbox className="size-5" aria-hidden />,
        },
        {
          label: "Positions accepting applications",
          value: String(activeJobs.count ?? 0),
          hint: "Roles shown in the public apply-form dropdown.",
          icon: <Briefcase className="size-5" aria-hidden />,
        },
        {
          label: "Published news",
          value: String(publishedNews.count ?? 0),
          hint: "Posts visible on the public News page.",
          icon: <Newspaper className="size-5" aria-hidden />,
        },
        {
          label: "Active locations",
          value: String(activeLocations.count ?? 0),
          hint: "Stations shown on Locations and related blocks.",
          icon: <MapPin className="size-5" aria-hidden />,
        },
        {
          label: "Active fuel SKUs",
          value: String(activeFuel.count ?? 0),
          hint: "Prices used in fuel widgets sitewide.",
          icon: <Fuel className="size-5" aria-hidden />,
        },
        {
          label: "Media library",
          value: String(mediaAssets.count ?? 0),
          hint: "Uploads available for pages and galleries.",
          icon: <ImageIcon className="size-5" aria-hidden />,
        },
      ],
      recentApplications,
    }
  } catch {
    return {
      metrics: [
        { label: "Job applications", value: "—", hint: "Connect Supabase to load counts.", icon: <Inbox className="size-5" aria-hidden /> },
        { label: "Positions accepting applications", value: "—", hint: "Connect Supabase to load counts.", icon: <Briefcase className="size-5" aria-hidden /> },
        { label: "Published news", value: "—", hint: "Connect Supabase to load counts.", icon: <Newspaper className="size-5" aria-hidden /> },
        { label: "Active locations", value: "—", hint: "Connect Supabase to load counts.", icon: <MapPin className="size-5" aria-hidden /> },
        { label: "Active fuel SKUs", value: "—", hint: "Connect Supabase to load counts.", icon: <Fuel className="size-5" aria-hidden /> },
        { label: "Media library", value: "—", hint: "Connect Supabase to load counts.", icon: <ImageIcon className="size-5" aria-hidden /> },
      ],
      recentApplications: [],
    }
  }
}

export default async function AdminDashboardPage() {
  const data = await loadDashboardData()
  const appTotal = Number.parseInt(data.metrics[0]?.value ?? "0", 10)
  const hasNewApplications = Number.isFinite(appTotal) && appTotal > 0
  const applicationCards = applicationRowsToCards(data.recentApplications)

  return (
    <div className="min-w-0 space-y-6">
      <AdminPageLead
        title="Overview"
        description="Live counts from Supabase. Review new job applications below when candidates apply."
        actions={
          hasNewApplications ? (
            <Link href="/admin/careers#candidates" className={cnDs(dsBtnGhost, "inline-flex min-h-9 items-center justify-center px-4 text-xs")}>
              All candidates
            </Link>
          ) : undefined
        }
      />

      <AdminContentGrid columns="dashboard-metrics">
        {data.metrics.map((metric) => (
          <DashboardMetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            hint={metric.hint}
            icon={metric.icon}
            className={metric.label === "Job applications" && hasNewApplications ? "ring-2 ring-[var(--admin-accent-active)]/25" : undefined}
          />
        ))}
      </AdminContentGrid>

      <AdminSectionCard
        title="Recent job applications"
        description="Latest candidates from the public careers form. Opens the full record in admin."
        headerActions={
          <Link href="/admin/careers#candidates" className={cnDs(dsBtnGhost, "min-h-9 px-3 text-xs")}>
            Open inbox
          </Link>
        }
      >
        {data.recentApplications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description={
              <>
                When someone applies from the public{" "}
                <Link href="/careers" className="text-primary underline">
                  Careers
                </Link>{" "}
                page, rows will show here.
              </>
            }
            icon={<Inbox className="size-10 opacity-80" aria-hidden />}
            action={
              <Link href="/admin/careers#candidates" className={cnDs(dsBtnTertiary, "inline-flex min-h-10 items-center px-4 text-xs")}>
                Applications inbox
              </Link>
            }
          />
        ) : (
          <>
            <AdminRecordCardList ariaLabel="Recent job applications" records={applicationCards} />
            <div className="hidden min-w-0 md:block">
              <AdminTable>
                <AdminTableHead>
                  <AdminTableRow>
                    <AdminTableTh>Submitted</AdminTableTh>
                    <AdminTableTh>Applicant</AdminTableTh>
                    <AdminTableTh>Email</AdminTableTh>
                    <AdminTableTh>Role</AdminTableTh>
                    <AdminTableTh className="text-right"> </AdminTableTh>
                  </AdminTableRow>
                </AdminTableHead>
                <AdminTableBody>
                  {data.recentApplications.map((row) => (
                    <AdminTableRow key={row.id}>
                      <AdminTableTd className="whitespace-nowrap text-sm">
                        {row.created_at ? formatAdminStamp(row.created_at) : "—"}
                      </AdminTableTd>
                      <AdminTableTd className="font-medium">{row.full_name}</AdminTableTd>
                      <AdminTableTd>
                        <a className="text-primary hover:underline" href={`mailto:${row.email}`}>
                          {row.email}
                        </a>
                      </AdminTableTd>
                      <AdminTableTd className="max-w-48 truncate text-sm">{row.job_title}</AdminTableTd>
                      <AdminTableTd className="text-right">
                        <Link href={`/admin/careers?applicant=${encodeURIComponent(row.id)}#candidates`} className={cnDs(dsBtnGhost, "inline-flex min-h-9 px-3 text-xs")}>
                          Open
                        </Link>
                      </AdminTableTd>
                    </AdminTableRow>
                  ))}
                </AdminTableBody>
              </AdminTable>
            </div>
          </>
        )}
      </AdminSectionCard>

      <AdminSectionCard title="Shortcuts" description="Common admin destinations.">
        <AdminContentGrid columns={2}>
          <QuickActionCard
            href="/admin/careers#candidates"
            title="Job applications"
            description="Inbox, CVs, and applicant details."
            icon={<Inbox className="size-5" aria-hidden />}
          />
          <QuickActionCard
            href="/admin/careers"
            title="Careers & jobs"
            description="Edit listings and apply channels."
            icon={<Briefcase className="size-5" aria-hidden />}
          />
          <QuickActionCard
            href="/admin/news"
            title="News"
            description="Publish and manage posts."
            icon={<Newspaper className="size-5" aria-hidden />}
          />
          <QuickActionCard
            href="/admin/media"
            title="Media library"
            description="Uploads and reusable images."
            icon={<ImageIcon className="size-5" aria-hidden />}
          />
        </AdminContentGrid>
      </AdminSectionCard>
    </div>
  )
}
