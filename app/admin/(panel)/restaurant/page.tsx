import type { Metadata } from "next"

import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { MockPersistHint } from "@/components/admin/MockPersistHint"
import { adminInputClass } from "@/components/admin/cn-admin"
import { Button } from "@/components/ui/button"
import { mockAdminRestaurantBlocks } from "@/data/mock/admin"
import { formatNewsDate } from "@/lib/format-news-date"

export const metadata: Metadata = {
  title: "Restaurant",
}

export default function AdminRestaurantPage() {
  return (
    <>
      <AdminPageHeader
        title="Restaurant content"
        description="Editorial sections for `/restaurant` — hero, galleries, reservation band, and partner modules."
        actions={
          <Button type="button" size="sm" variant="secondary" disabled>
            Publish restaurant (mock)
          </Button>
        }
      />
      <div className="flex-1 space-y-6 px-6 py-8 md:px-8 lg:px-10">
        <MockPersistHint />

        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/45">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="border-zinc-800 border-b bg-zinc-900/70 text-xs text-zinc-400 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-semibold">Component</th>
                <th className="px-4 py-3 font-semibold">Field</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Updated</th>
                <th className="px-4 py-3 font-semibold">Value</th>
              </tr>
            </thead>
            <tbody>
              {mockAdminRestaurantBlocks.map((row) => (
                <tr key={row.id} className="border-zinc-800/80 border-b align-top last:border-none">
                  <td className="px-4 py-3 font-medium text-zinc-200 whitespace-nowrap">{row.component}</td>
                  <td className="px-4 py-3 text-zinc-400">{row.field}</td>
                  <td className="hidden px-4 py-3 text-zinc-500 whitespace-nowrap md:table-cell">
                    {formatNewsDate(row.lastSaved)}
                  </td>
                  <td className="px-4 py-3">
                    <label className="sr-only" htmlFor={`rst-${row.id}`}>
                      {row.field}
                    </label>
                    <textarea
                      id={`rst-${row.id}`}
                      rows={3}
                      defaultValue={row.value}
                      className={`min-h-0 w-full min-w-[12rem] resize-y lg:min-w-[20rem] ${adminInputClass}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" disabled variant="outline" className="border-zinc-600 text-zinc-300">
            Save staging copy (mock)
          </Button>
        </div>
      </div>
    </>
  )
}
