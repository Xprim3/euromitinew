import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import { getHomepageFuelPrices } from "@/lib/data/get-homepage-fuel-prices"

import { FuelPricesHomeGrid } from "./FuelPricesHomeGrid"

/** Homepage fuel cards — Phase 7 step 1: reads Supabase `fuel_prices` when env vars are set, else mocked data. */
export async function HomeFuelPricesGlass() {
  const items = await getHomepageFuelPrices()

  return (
    <section
      id="fuel-prices"
      className="relative z-10 bg-brand-surface-tinted pt-6 pb-10 md:pt-8 md:pb-12"
      aria-labelledby="home-fuel-prices-heading"
    >
      <div className="mx-auto w-full max-w-[1280px] space-y-5 px-4 sm:px-6 md:space-y-7 lg:px-12">
        <div>
          <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-secondary">Live prices</p>
          <h2
            id="home-fuel-prices-heading"
            className="mt-2 font-[family-name:var(--font-montserrat)] text-2xl font-extrabold tracking-tight text-black md:text-3xl"
          >
            Today&apos;s Fuel Rates
          </h2>
          <SectionAccentRule className="mt-4 md:mt-5" />
        </div>
        <FuelPricesHomeGrid items={items} />
      </div>
    </section>
  )
}
