import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, Flame, MapPin } from "lucide-react"

import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { Button } from "@/components/ui/button"
import {
  mockAdminActivity,
  mockAdminDashboardMetrics,
} from "@/data/mock/admin"
import { formatAdminStamp } from "@/lib/format-admin-datetime"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default function AdminDashboardPage() {
  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="High-level overview — all data below is mocked for Phase 5 UI."
      />
      <div className="flex-1 space-y-10 px-6 py-8 md:px-8 lg:px-10">
        <section>
          <h2 className="sr-only">Key metrics</h2>
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {mockAdminDashboardMetrics.map((m) => (
              <li
                key={m.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/55 p-5 shadow-sm"
              >
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">{m.label}</p>
                <p className="mt-2 font-heading text-3xl font-bold text-white">{m.value}</p>
                <p className="mt-2 text-sm leading-snug text-zinc-400">{m.hint}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-8 lg:grid-cols-3 lg:gap-10">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="font-heading font-semibold text-lg text-white">Recent activity</h2>
              <span className="text-xs text-zinc-500">Mock audit log</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="border-zinc-800 border-b bg-zinc-900/70 text-xs text-zinc-400 uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Action</th>
                    <th className="px-4 py-3 font-semibold">Context</th>
                    <th className="px-4 py-3 font-semibold">Who</th>
                    <th className="hidden px-4 py-3 font-semibold sm:table-cell">When</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAdminActivity.map((row) => (
                    <tr key={row.id} className="border-zinc-800/80 border-b last:border-none">
                      <td className="px-4 py-3 font-medium whitespace-nowrap text-zinc-200">{row.action}</td>
                      <td className="max-w-[12rem] px-4 py-3 text-zinc-400 truncate sm:max-w-none">{row.context}</td>
                      <td className="px-4 py-3 text-zinc-500">{row.actor}</td>
                      <td className="hidden px-4 py-3 text-zinc-500 whitespace-nowrap sm:table-cell">
                        {formatAdminStamp(row.at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-heading font-semibold text-lg text-white">Quick links</h2>
            <ul className="space-y-2">
              <li>
                <Button
                  variant="outline"
                  className={cn(
                    "h-auto w-full justify-between border-zinc-700 bg-zinc-900/45 py-3 text-zinc-200",
                    "hover:bg-zinc-800 hover:text-white"
                  )}
                  render={<Link href="/admin/fuel-prices" />}
                >
                  <span className="flex items-center gap-2">
                    <Flame className="size-4 text-secondary" aria-hidden />
                    Manage fuel prices
                  </span>
                  <ArrowUpRight className="size-4 opacity-70" aria-hidden />
                </Button>
              </li>
              <li>
                <Button
                  variant="outline"
                  className={cn(
                    "h-auto w-full justify-between border-zinc-700 bg-zinc-900/45 py-3 text-zinc-200",
                    "hover:bg-zinc-800 hover:text-white"
                  )}
                  render={<Link href="/admin/news" />}
                >
                  <span>Edit news archive</span>
                  <ArrowUpRight className="size-4 opacity-70" aria-hidden />
                </Button>
              </li>
              <li>
                <Button
                  variant="outline"
                  className={cn(
                    "h-auto w-full justify-between border-zinc-700 bg-zinc-900/45 py-3 text-zinc-200",
                    "hover:bg-zinc-800 hover:text-white"
                  )}
                  render={<Link href="/admin/locations" />}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="size-4 text-secondary" aria-hidden />
                    Stations & addresses
                  </span>
                  <ArrowUpRight className="size-4 opacity-70" aria-hidden />
                </Button>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  )
}
