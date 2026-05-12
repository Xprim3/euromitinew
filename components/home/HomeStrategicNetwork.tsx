import Image from "next/image"
import Link from "next/link"

import { Stagger } from "@/components/motion"
import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import { getPublicHomepageSingleton } from "@/lib/data/homepage-singleton-public"
import {
  type HomeLocationPreviewResult,
  getHomeLocationPreviewsPublic,
  locationsBandCopyFromCMS,
} from "@/lib/data/home-locations-preview"

export function HomeStrategicNetworkSkeleton() {
  return (
    <section className="bg-brand-surface-tinted" aria-busy aria-label="Loading locations">
      <div className="mx-auto max-w-[1280px] px-4 py-11 animate-pulse sm:px-6 md:py-14 lg:px-12 lg:py-16">
        <div className="mb-7 space-y-3 md:mb-9">
          <div className="h-3 w-24 rounded bg-black/15" />
          <div className="h-8 w-72 max-w-full rounded-md bg-black/15" />
          <div className="h-4 w-full max-w-xl rounded bg-black/10" />
          <div className="mt-4 h-px w-28 rounded-full bg-black/10 md:mt-5" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-44 rounded-[1.5rem] bg-black/15 sm:h-48 md:h-[13.25rem]" />
          ))}
        </div>
      </div>
    </section>
  )
}

export function HomeStrategicNetworkView(props: {
  copy: ReturnType<typeof locationsBandCopyFromCMS>
  locationsResult: HomeLocationPreviewResult
}) {
  const { copy, locationsResult } = props
  const { cards } = locationsResult

  return (
    <section className="bg-brand-surface-tinted" aria-labelledby="strategic-network-heading">
      <div className="mx-auto max-w-[1280px] px-4 py-11 sm:px-6 md:py-14 lg:px-12 lg:py-16">
        <div className="mb-7 flex flex-col items-start justify-between gap-4 md:mb-9 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-3">
            <h2
              id="strategic-network-heading"
              className="font-[family-name:var(--font-montserrat)] text-[1.35rem] font-extrabold tracking-tight text-black md:text-[1.75rem]"
            >
              {copy.heading}
            </h2>
            <p className="text-base leading-relaxed text-brand-body-soft">{copy.subtitle}</p>
            <SectionAccentRule className="mt-4 md:mt-5" />
          </div>
        </div>

        {locationsResult.status === "empty" ? (
          <div className="rounded-[1.5rem] border border-brand-border-muted bg-white px-5 py-8 text-sm text-brand-body-soft">
            No active locations are configured yet.
          </div>
        ) : (
          <>
            {locationsResult.source === "fallback" ? (
              <p className="mb-4 rounded-[1.25rem] border border-amber-500/25 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {locationsResult.message}
              </p>
            ) : null}
            <Stagger once className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
              {cards.map((station) => (
                <Link
                  key={station.id}
                  href="/locations"
                  className="group overflow-hidden rounded-[1.5rem] border border-brand-border-muted bg-white shadow-[0_14px_40px_-28px_rgba(20,27,43,0.3)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-26px_rgba(20,27,43,0.38)]"
                >
                  <div className="relative h-44 overflow-hidden sm:h-48 md:h-[13.25rem]">
                    <Image
                      src={station.imageSrc}
                      alt={station.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/15"
                      aria-hidden
                    />
                    <div className="absolute right-0 bottom-0 left-0 space-y-1.5 p-4">
                      <h3 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-white md:text-lg">
                        {station.title}
                      </h3>
                      <p className="text-[0.92rem] leading-relaxed text-white/85">{station.blurb}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </Stagger>
          </>
        )}
      </div>
    </section>
  )
}

export async function HomeStrategicNetwork() {
  const [{ row }, locationsResult] = await Promise.all([getPublicHomepageSingleton(), getHomeLocationPreviewsPublic()])
  const copy = locationsBandCopyFromCMS(row)
  return <HomeStrategicNetworkView copy={copy} locationsResult={locationsResult} />
}
