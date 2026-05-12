"use client"

import { Stagger } from "@/components/motion"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import type { HomepageFuelCard } from "@/lib/data/get-homepage-fuel-prices"
import { formatUpdatedAgo } from "@/lib/relative-updated"
import { cn } from "@/lib/utils"

const barWidth: Record<string, string> = {
  diesel: "w-3/4",
  euro95: "w-4/5",
  lpg: "w-1/2",
}

type FuelPricesHomeGridProps = {
  items: HomepageFuelCard[]
}

export function FuelPricesHomeGrid({ items }: FuelPricesHomeGridProps) {
  return (
    <Stagger once className="grid w-full gap-4 md:grid-cols-3 md:gap-5">
      {items.map((p) => {
        const pk = p.productKey
        const isActive = p.labelStatus === "active"
        return (
          <div
            key={pk}
            className={cn(
              "rounded-[1.25rem] border border-brand-border-muted bg-white p-5 shadow-[0_20px_45px_-28px_rgba(20,27,43,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_50px_-26px_rgba(20,27,43,0.4)] md:p-6",
              "group"
            )}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-brand-body-soft">
                {p.headlineLabel}
              </span>
              <div
                className={
                  isActive
                    ? "flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-[0.625rem] font-extrabold text-green-600"
                    : "flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[0.625rem] font-extrabold text-amber-700"
                }
              >
                <span className={`size-2 rounded-full ${isActive ? "bg-green-500" : "bg-amber-500"}`} />
                {isActive ? "LIVE" : "PËRDITËSIM I FUNDIT"}
              </div>
            </div>
            <div className="mb-3 flex items-baseline gap-2">
              <span className="inline-block text-3xl font-black text-black transition-colors group-hover:text-secondary md:text-4xl">
                {p.price.toFixed(p.currencyCode === "EUR" ? 2 : 3)}
              </span>
              <span className="text-lg font-bold text-brand-body-soft md:text-xl">
                {p.currencyCode === "EUR" ? "€/L" : `${p.currencyCode}/L`}
              </span>
            </div>
            <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-brand-border-accent">
              <div
                className={cn(
                  "h-full rounded-full",
                  isActive ? "bg-green-500" : "bg-amber-500",
                  barWidth[pk] ?? "w-2/3"
                )}
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-brand-neutrals-mid">
              <MaterialSymbol name="schedule" className="text-sm!" />
              {formatUpdatedAgo(p.updatedAtIso)}
            </div>
          </div>
        )
      })}
    </Stagger>
  )
}
