import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import { getHomepageFuelPrices } from "@/lib/data/get-homepage-fuel-prices"

import { FuelPricesHomeGrid } from "./FuelPricesHomeGrid"

/** Homepage fuel cards — Supabase `fuel_prices` is the source of truth. */
export async function HomeFuelPricesGlass() {
  const result = await getHomepageFuelPrices()

  return (
    <section
      id="fuel-prices"
      className="relative z-10 bg-brand-surface-tinted pt-6 pb-10 md:pt-8 md:pb-12"
      aria-labelledby="home-fuel-prices-heading"
    >
      <div className="mx-auto w-full max-w-[1280px] space-y-5 px-4 sm:px-6 md:space-y-7 lg:px-12">
        <div>
          <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-secondary">Çmimet live</p>
          <h2
            id="home-fuel-prices-heading"
            className="mt-2 font-[family-name:var(--font-montserrat)] text-2xl font-extrabold tracking-tight text-black md:text-3xl"
          >
            Çmimet e karburanteve sot
          </h2>
          <SectionAccentRule className="mt-4 md:mt-5" />
        </div>
        {result.status === "empty" ? (
          <div className="rounded-[1.25rem] border border-brand-border-muted bg-white px-5 py-8 text-sm text-brand-body-soft">
            No active fuel prices are configured yet.
          </div>
        ) : (
          <>
            {result.source === "fallback" ? (
              <p className="rounded-[1.25rem] border border-amber-500/25 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {result.message}
              </p>
            ) : null}
            <FuelPricesHomeGrid items={result.items} />
          </>
        )}
      </div>
    </section>
  )
}
