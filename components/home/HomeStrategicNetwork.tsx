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
      <div className="mx-auto max-w-[1280px] px-4 py-14 animate-pulse sm:px-6 md:py-18 lg:px-12 lg:py-22">
        <div className="mb-7 space-y-3 md:mb-9">
          <div className="h-3 w-24 rounded bg-brand-shell-deep/10" />
          <div className="h-8 w-72 max-w-full rounded-md bg-brand-shell-deep/12" />
          <div className="h-4 w-full max-w-xl rounded bg-brand-shell-deep/8" />
          <div className="mt-4 h-px w-28 rounded-full bg-brand-shell-deep/10 md:mt-5" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-64 rounded-[1.25rem] bg-brand-shell-deep/10 sm:h-72" />
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
    <section className="relative overflow-hidden bg-brand-surface-tinted" aria-labelledby="strategic-network-heading">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(198,198,205,0.36),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f9f9ff_58%,#eef2ff_100%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-brand-border-accent" aria-hidden />
      <div className="relative mx-auto max-w-[1280px] px-4 py-14 sm:px-6 md:py-18 lg:px-12 lg:py-22">
        <div className="mb-9 md:mb-11">
          <div className="max-w-3xl space-y-4">
            <h2
              id="strategic-network-heading"
              className="font-(family-name:--font-montserrat) text-[clamp(2rem,7vw,2.8rem)] font-extrabold leading-[1.04] tracking-tighter text-brand-primary sm:text-[clamp(2.35rem,4.4vw,3.55rem)]"
            >
              {copy.heading}
            </h2>
            <p className="max-w-2xl text-[1rem] leading-8 text-brand-body-soft md:text-[1.06rem]">{copy.subtitle}</p>
            <SectionAccentRule className="mt-4 md:mt-5" />
          </div>
        </div>

        {locationsResult.status === "empty" ? (
          <div className="rounded-[1.25rem] border border-brand-border-muted bg-white px-5 py-8 text-sm text-brand-body-soft shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
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
                  className="group overflow-hidden rounded-[1.15rem] border border-brand-shell-deep/8 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.1)] transition duration-300 hover:border-brand-shell-deep/16"
                >
                  <div className="relative h-68 overflow-hidden sm:h-76 md:h-84">
                    <Image
                      src={station.imageSrc}
                      alt={station.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-shell-deep/92 via-brand-shell/40 to-brand-shell-deep/10"
                      aria-hidden
                    />
                    <div className="absolute right-0 bottom-0 left-0 p-5">
                      <h3 className="font-(family-name:--font-montserrat) text-xl font-extrabold tracking-[-0.04em] text-white md:text-2xl">
                        {station.title}
                      </h3>
                      <p className="mt-2 text-[0.94rem] leading-7 text-white/78">{station.blurb}</p>
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
