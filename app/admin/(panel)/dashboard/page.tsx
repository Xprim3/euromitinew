import type { Metadata } from "next"
import type { ReactNode } from "react"
import {
  Activity,
  Briefcase,
  Flame,
  Fuel,
  Home,
  ImageIcon,
  MapPin,
  Newspaper,
  Settings,
  UtensilsCrossed,
} from "lucide-react"

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
  StatusBadge,
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

type RecentContentRow = {
  id: string
  area: string
  title: string
  status: "published" | "draft" | "active" | "inactive" | "updated"
  updatedAt: string
}

type DashboardData = {
  metrics: DashboardMetric[]
  recent: RecentContentRow[]
}

async function loadDashboardData(): Promise<DashboardData> {
  try {
    const supabase = await createSupabaseServerClient()

    const [publishedNews, activeLocations, activeFuel, mediaAssets, activeJobs] = await Promise.all([
      supabase.from("news_posts").select("*", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("locations").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("fuel_prices").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("media_uploads").select("*", { count: "exact", head: true }),
      supabase.from("jobs").select("*", { count: "exact", head: true }).eq("is_active", true),
    ])

    const { data: newsRows } = await supabase
      .from("news_posts")
      .select("id, title, status, updated_at")
      .order("updated_at", { ascending: false })
      .limit(4)

    const { data: locationRows } = await supabase
      .from("locations")
      .select("id, city, is_active, updated_at")
      .order("updated_at", { ascending: false })
      .limit(3)

    const recent: RecentContentRow[] = [
      ...(newsRows ?? []).map((row: { id: string; title: string; status: string; updated_at: string }) => ({
        id: `news-${row.id}`,
        area: "News",
        title: row.title,
        status: row.status === "published" ? ("published" as const) : ("draft" as const),
        updatedAt: row.updated_at,
      })),
      ...(locationRows ?? []).map((row: { id: string; city: string; is_active: boolean; updated_at: string }) => ({
        id: `location-${row.id}`,
        area: "Locations",
        title: row.city,
        status: row.is_active ? ("active" as const) : ("inactive" as const),
        updatedAt: row.updated_at,
      })),
    ]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 6)

    return {
      metrics: [
        {
          label: "Published News",
          value: String(publishedNews.count ?? 0),
          hint: "Visible on the public News page.",
          icon: <Newspaper className="size-5" aria-hidden />,
        },
        {
          label: "Active Locations",
          value: String(activeLocations.count ?? 0),
          hint: "Public forecourt records.",
          icon: <MapPin className="size-5" aria-hidden />,
        },
        {
          label: "Active Fuel SKUs",
          value: String(activeFuel.count ?? 0),
          hint: "Shown in fuel price widgets.",
          icon: <Fuel className="size-5" aria-hidden />,
        },
        {
          label: "Media Assets",
          value: String(mediaAssets.count ?? 0),
          hint: "Images available in the media library.",
          icon: <ImageIcon className="size-5" aria-hidden />,
        },
        {
          label: "Active Jobs",
          value: String(activeJobs.count ?? 0),
          hint: "Open positions in Careers admin.",
          icon: <Briefcase className="size-5" aria-hidden />,
        },
      ],
      recent,
    }
  } catch {
    return {
      metrics: [
        { label: "Published News", value: "—", hint: "Connect Supabase to load counts.", icon: <Newspaper className="size-5" aria-hidden /> },
        { label: "Active Locations", value: "—", hint: "Connect Supabase to load counts.", icon: <MapPin className="size-5" aria-hidden /> },
        { label: "Active Fuel SKUs", value: "—", hint: "Connect Supabase to load counts.", icon: <Fuel className="size-5" aria-hidden /> },
        { label: "Media Assets", value: "—", hint: "Connect Supabase to load counts.", icon: <ImageIcon className="size-5" aria-hidden /> },
        { label: "Active Jobs", value: "—", hint: "Connect Supabase to load counts.", icon: <Briefcase className="size-5" aria-hidden /> },
      ],
      recent: [],
    }
  }
}

function statusTone(status: RecentContentRow["status"]): "success" | "warning" | "neutral" | "info" {
  if (status === "published" || status === "active") return "success"
  if (status === "draft") return "warning"
  if (status === "updated") return "info"
  return "neutral"
}

export default async function AdminDashboardPage() {
  const data = await loadDashboardData()

  return (
    <div className="space-y-6">
      <AdminContentGrid columns={4}>
        {data.metrics.map((metric) => (
          <DashboardMetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            hint={metric.hint}
            icon={metric.icon}
          />
        ))}
      </AdminContentGrid>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <AdminSectionCard
          title="Recent content changes"
          description="Latest updated records from the editable content tables."
          headerActions={<StatusBadge tone="info">Live CMS</StatusBadge>}
        >
          <AdminTable>
            <AdminTableHead>
              <AdminTableRow>
                <AdminTableTh>Area</AdminTableTh>
                <AdminTableTh>Content</AdminTableTh>
                <AdminTableTh>Status</AdminTableTh>
                <AdminTableTh>Updated</AdminTableTh>
              </AdminTableRow>
            </AdminTableHead>
            <AdminTableBody>
              {data.recent.length === 0 ? (
                <AdminTableRow>
                  <AdminTableTd colSpan={4} className="py-10 text-center text-[var(--admin-text-muted)]">
                    No recent records found yet.
                  </AdminTableTd>
                </AdminTableRow>
              ) : (
                data.recent.map((row) => (
                  <AdminTableRow key={row.id}>
                    <AdminTableTd className="font-medium">{row.area}</AdminTableTd>
                    <AdminTableTd>{row.title}</AdminTableTd>
                    <AdminTableTd>
                      <StatusBadge tone={statusTone(row.status)}>{row.status}</StatusBadge>
                    </AdminTableTd>
                    <AdminTableTd className="whitespace-nowrap">
                      {row.updatedAt ? formatAdminStamp(row.updatedAt) : "—"}
                    </AdminTableTd>
                  </AdminTableRow>
                ))
              )}
            </AdminTableBody>
          </AdminTable>
        </AdminSectionCard>

        <AdminSectionCard title="Quick actions" description="Jump into the most common admin tasks.">
          <div className="space-y-3">
            <QuickActionCard
              href="/admin/homepage"
              title="Edit homepage"
              description="Hero, sections, and homepage media."
              icon={<Home className="size-5" aria-hidden />}
            />
            <QuickActionCard
              href="/admin/fuel-prices"
              title="Manage fuel prices"
              description="Diesel, petrol, and LPG pricing."
              icon={<Flame className="size-5" aria-hidden />}
            />
            <QuickActionCard
              href="/admin/locations"
              title="Stations & addresses"
              description="Locations, services, maps, and galleries."
              icon={<MapPin className="size-5" aria-hidden />}
            />
            <QuickActionCard
              href="/admin/news"
              title="Edit news archive"
              description="Publish, draft, and manage posts."
              icon={<Newspaper className="size-5" aria-hidden />}
            />
            <QuickActionCard
              href="/admin/restaurant"
              title="Restaurant content"
              description="Hero, menu cards, gallery, and contact."
              icon={<UtensilsCrossed className="size-5" aria-hidden />}
            />
            <QuickActionCard
              href="/admin/settings"
              title="Account settings"
              description="Profile, password, and logout."
              icon={<Settings className="size-5" aria-hidden />}
            />
          </div>
        </AdminSectionCard>
      </div>

      <AdminSectionCard
        title="Admin status"
        description="The dashboard now uses the shared admin design-system components and live CMS counts where Supabase is available."
        headerActions={<Activity className="size-5 text-[var(--admin-text-muted)]" aria-hidden />}
      >
        <p className="text-sm leading-6 text-[var(--admin-text-muted)]">
          Use the sidebar or quick actions to manage content. Public pages revalidate from their individual admin save actions.
        </p>
      </AdminSectionCard>
    </div>
  )
}
