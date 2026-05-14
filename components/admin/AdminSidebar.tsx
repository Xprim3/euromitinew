"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Flame,
  Fuel,
  Globe,
  Home,
  ImageIcon,
  LayoutDashboard,
  MapPin,
  Newspaper,
  UtensilsCrossed,
} from "lucide-react"

import { cn } from "@/lib/utils"

import { AdminSignOutButton } from "./AdminSignOutButton"

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/about", label: "About", icon: BookOpen },
  { href: "/admin/services", label: "Services", icon: Fuel },
  { href: "/admin/fuel-prices", label: "Fuel prices", icon: Flame },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/restaurant", label: "Restaurant", icon: UtensilsCrossed },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/site", label: "Site & contact", icon: Globe },
] as const

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-[17rem] shrink-0 flex-col border-zinc-800 border-r bg-zinc-950">
      <div className="border-zinc-800 border-b px-5 py-5">
        <Link href="/admin/dashboard" className="font-[family-name:var(--font-montserrat)] text-lg font-extrabold tracking-tight text-white">
          Admin Panel
        </Link>
        <p className="mt-1 text-xs text-zinc-500">Supabase CMS · homepage wired</p>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-zinc-800/90 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              )}
            >
              <Icon className="size-[1.125rem] shrink-0 opacity-90" aria-hidden />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="border-zinc-800 border-t p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-200"
        >
          <Home className="size-[1.125rem]" aria-hidden />
          View website
        </Link>
        <AdminSignOutButton />
      </div>
    </aside>
  )
}
