import { getHomepageFuelPrices, type HomepageFuelCard } from "@/lib/data/get-homepage-fuel-prices"

function formatHeroUpdatedAgo(isoDate: string) {
  const ms = Date.now() - new Date(isoDate).getTime()
  if (!Number.isFinite(ms) || ms < 0) return "Updated: now"
  const minutes = Math.floor(ms / 60000)
  if (minutes < 1) return "Updated: now"
  if (minutes < 60) return `Updated: ${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Updated: ${hours}h ago`
  const days = Math.floor(hours / 24)
  return `Updated: ${days}d ago`
}

function FuelPriceBarContent({ items }: { items: HomepageFuelCard[] }) {
  if (!items.length) {
    return (
      <div className="rounded-(--rounded-DEFAULT) border border-white/12 bg-black/88 px-5 py-4 text-sm font-semibold text-white/72 shadow-[0_22px_55px_rgba(0,0,0,0.28)] backdrop-blur-md">
        Çmimet e karburanteve do të shfaqen së shpejti.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-white/12 bg-black/90 shadow-[0_22px_55px_rgba(0,0,0,0.3)] backdrop-blur-md">
      <div className="grid grid-cols-1 divide-y divide-white/12 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {items.slice(0, 3).map((p) => (
          <div
            key={p.productKey}
            className="flex items-center justify-between gap-4 bg-white/3 px-4 py-4 sm:block sm:px-5 sm:py-5 sm:text-center"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-extrabold uppercase tracking-widest text-white sm:text-[0.82rem]">
                {p.headlineLabel}
              </p>
              <p className="mt-1 truncate text-[0.6rem] font-medium text-white/46 sm:text-xs">
                {formatHeroUpdatedAgo(p.updatedAtIso)}
              </p>
            </div>
            <div className="flex shrink-0 items-baseline gap-1 sm:mt-2 sm:justify-center">
              <span className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                {p.price.toFixed(p.currencyCode === "EUR" ? 2 : 3)}
              </span>
              <span className="text-xs font-extrabold text-[#ffb4ab] sm:text-sm">
                {p.currencyCode === "EUR" ? "€/L" : `${p.currencyCode}/L`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HomeHeroFuelPriceBarSkeleton() {
  return (
    <section
      className="relative z-20 bg-black px-4 py-6 sm:px-6 sm:py-8 lg:px-12"
      aria-busy
      aria-label="Loading fuel prices"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="grid overflow-hidden rounded-lg border border-white/12 bg-black/90 shadow-[0_22px_55px_rgba(0,0,0,0.3)] sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="space-y-2 border-white/12 border-b px-4 py-4 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
            >
              <div className="h-3 w-28 animate-pulse rounded bg-white/16" />
              <div className="h-8 w-20 animate-pulse rounded bg-white/16" />
              <div className="h-2 w-24 animate-pulse rounded bg-white/16" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export async function HomeHeroFuelPriceBar() {
  const result = await getHomepageFuelPrices()

  return (
    <section className="relative z-20 bg-black px-4 py-6 sm:px-6 sm:py-8 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        <FuelPriceBarContent items={result.items} />
      </div>
    </section>
  )
}
