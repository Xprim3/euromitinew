"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import {
  Briefcase,
  Flame,
  Fuel,
  Globe,
  Home,
  ImageIcon,
  LayoutDashboard,
  MapPin,
  Newspaper,
  Settings,
  UtensilsCrossed,
} from "lucide-react"

import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton"

import { adminRouteHeaderMeta } from "./admin-panel-routes"
import { AdminHeader } from "./AdminHeader"
import { AdminLayout } from "./AdminLayout"
import { AdminPageShell } from "./AdminPageShell"
import { AdminSidebar, type AdminSidebarNavItem } from "./AdminSidebar"

const NAV_ITEMS: readonly AdminSidebarNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/fuel-prices", label: "Fuel prices", icon: Flame },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/services", label: "Services", icon: Fuel },
  { href: "/admin/restaurant", label: "Restaurant", icon: UtensilsCrossed },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/careers", label: "Careers", icon: Briefcase },
  { href: "/admin/site", label: "Contact info", icon: Globe },
  { href: "/admin/media", label: "Media library", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const

function AdminHeaderAuto() {
  const pathname = usePathname()
  const meta = adminRouteHeaderMeta(pathname)

  return (
    <AdminHeader
      title={meta.title}
      subtitle={meta.subtitle}
      breadcrumbs={meta.breadcrumbs}
      showMobileNavTrigger
    />
  )
}

export function AdminPanelChrome({ children }: { children: ReactNode }) {
  return (
    <AdminLayout
      sidebar={
        <AdminSidebar
          items={NAV_ITEMS}
          activeAccent="red"
          footer={
            <>
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--admin-sidebar-muted)] transition-colors hover:bg-[var(--admin-sidebar-hover)] hover:text-white"
              >
                <Home className="size-[1.125rem] shrink-0 opacity-90" aria-hidden />
                View website
              </Link>
              <AdminSignOutButton variant="sidebar" />
            </>
          }
        />
      }
    >
      <AdminHeaderAuto />
      <AdminPageShell>{children}</AdminPageShell>
    </AdminLayout>
  )
}
