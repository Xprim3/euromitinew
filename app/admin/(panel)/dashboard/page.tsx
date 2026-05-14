import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import { Briefcase, Fuel, ImageIcon, Inbox, MapPin, Newspaper } from "lucide-react"

import {
  AdminContentGrid,
  AdminSectionCard,
  AdminTable,
  AdminTableBody,
  AdminTableHead,
  AdminTableRow,
  AdminTableTd,
  AdminTableTh,
  DashboardMetricCard,
  QuickActionCard,
  cnDs,
  dsBtnGhost,
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
          label: "Active job posts",
          value: String(activeJobs.count ?? 0),
          hint: "Open listings on the public careers page.",
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
        { label: "Active job posts", value: "—", hint: "Connect Supabase to load counts.", icon: <Briefcase className="size-5" aria-hidden /> },
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

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-[family-name:var(--font-montserrat)] text-xl font-bold tracking-tight text-[var(--admin-text)] sm:text-2xl">
            Overview
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--admin-text-muted)]">
            Live counts from Supabase. Review new job applications below when candidates apply.
          </p>
        </div>
        {hasNewApplications ? (
          <Link
            href="/admin/careers/applications"
            className={cnDs(dsBtnGhost, "shrink-0 self-start text-xs sm:self-auto")}
          >
            All applications
          </Link>
        ) : null}
      </div>

      <AdminContentGrid columns={3}>
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
          <Link href="/admin/careers/applications" className={cnDs(dsBtnGhost, "min-h-9 px-3 text-xs")}>
            Open inbox
          </Link>
        }
      >
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
              {data.recentApplications.length === 0 ? (
                <AdminTableRow>
                  <AdminTableTd colSpan={5} className="py-10 text-center text-[var(--admin-text-muted)]">
                    No applications yet. When someone applies from{" "}
                    <Link className="text-primary underline" href="/careers">
                      Careers
                    </Link>
                    , they will appear here.
                  </AdminTableTd>
                </AdminTableRow>
              ) : (
                data.recentApplications.map((row) => (
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
                    <AdminTableTd className="max-w-[12rem] truncate text-sm">{row.job_title}</AdminTableTd>
                    <AdminTableTd className="text-right">
                      <Link
                        href={`/admin/careers/applications/${row.id}`}
                        className={cnDs(dsBtnGhost, "inline-flex min-h-9 px-3 text-xs")}
                      >
                        Open
                      </Link>
                    </AdminTableTd>
                  </AdminTableRow>
                ))
              )}
            </AdminTableBody>
          </AdminTable>
      </AdminSectionCard>

      <AdminSectionCard title="Shortcuts" description="Common admin destinations.">
        <AdminContentGrid columns={2}>
          <QuickActionCard
            href="/admin/careers/applications"
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
