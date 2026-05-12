/** Placeholder while `HomeFuelPricesGlass` loads Supabase fuel prices. */
export function FuelPricesSkeletonSection() {
  return (
    <section
      className="relative z-10 bg-brand-surface-tinted pt-6 pb-10 md:pt-8 md:pb-12"
      aria-busy
      aria-label="Loading fuel prices"
    >
      <div className="mx-auto w-full max-w-[1280px] space-y-5 px-4 sm:px-6 md:space-y-7 lg:px-12">
        <div>
          <div className="h-3 w-24 animate-pulse rounded bg-black/10" />
          <div className="mt-3 h-8 w-64 max-w-full animate-pulse rounded-md bg-black/10 md:h-9" />
          <div className="mt-4 h-px w-28 animate-pulse rounded-full bg-black/10 md:mt-5" />
        </div>
        <div className="grid w-full gap-4 md:grid-cols-3 md:gap-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-[1.25rem] border border-brand-border-muted bg-white/80 p-5 shadow-sm md:p-6"
            >
              <div className="mb-4 flex justify-between">
                <div className="h-3 w-28 animate-pulse rounded bg-black/10" />
                <div className="h-6 w-14 animate-pulse rounded-full bg-black/10" />
              </div>
              <div className="mb-3 flex gap-2">
                <div className="h-10 w-24 animate-pulse rounded bg-black/10" />
                <div className="h-6 w-12 animate-pulse rounded bg-black/10" />
              </div>
              <div className="mb-4 h-1 w-full rounded-full bg-black/8">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-black/10" />
              </div>
              <div className="h-3 w-32 animate-pulse rounded bg-black/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
