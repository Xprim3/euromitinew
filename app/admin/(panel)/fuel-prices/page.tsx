import type { Metadata } from "next"

import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { MockPersistHint } from "@/components/admin/MockPersistHint"
import { adminInputClass } from "@/components/admin/cn-admin"
import { Button } from "@/components/ui/button"
import { mockFuelPrices } from "@/data/mock"
import { formatNewsDate } from "@/lib/format-news-date"

export const metadata: Metadata = {
  title: "Fuel prices",
}

export default function AdminFuelPricesPage() {
  return (
    <>
      <AdminPageHeader
        title="Fuel prices"
        description="Retail pump prices surfaced on the marketing homepage (“Today’s Fuel Rates”)."
        actions={
          <Button type="button" size="sm" variant="secondary" disabled>
            Publish snapshot
          </Button>
        }
      />
      <div className="flex-1 space-y-6 px-6 py-8 md:px-8 lg:px-10">
        <MockPersistHint />

        <form className="space-y-4" aria-label="Fuel price editor (mock)">
          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/45">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="border-zinc-800 border-b bg-zinc-900/70 text-xs text-zinc-400 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Price (€/L)</th>
                  <th className="hidden px-4 py-3 font-semibold md:table-cell">Status</th>
                  <th className="hidden px-4 py-3 font-semibold lg:table-cell">Last updated</th>
                </tr>
              </thead>
              <tbody>
                {mockFuelPrices.map((row) => (
                  <tr key={row.id} className="border-zinc-800/80 border-b last:border-none">
                    <td className="px-4 py-3">
                      <label className="sr-only" htmlFor={`fuel-${row.id}`}>
                        {row.fuelType}
                      </label>
                      <div className="font-medium text-zinc-200">{row.fuelType}</div>
                      <div className="font-mono text-xs text-zinc-500">{row.id}</div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        id={`fuel-${row.id}`}
                        name={`price_${row.id}`}
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={row.price}
                        className={`max-w-[8rem] ${adminInputClass}`}
                      />
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <span
                        className={
                          row.labelStatus === "active"
                            ? "inline-flex rounded-full bg-emerald-500/15 px-2 py-1 font-semibold text-emerald-400 text-[0.7rem]"
                            : "inline-flex rounded-full bg-zinc-500/15 px-2 py-1 font-semibold text-zinc-300 text-[0.7rem]"
                        }
                      >
                        {row.labelStatus}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-zinc-500 lg:table-cell whitespace-nowrap">
                      {formatNewsDate(row.lastUpdated)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" disabled variant="outline" className="border-zinc-600 text-zinc-300">
              Save draft (mock)
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
