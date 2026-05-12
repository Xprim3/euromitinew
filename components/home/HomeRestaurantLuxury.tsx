import Link from "next/link"

import { Reveal } from "@/components/motion"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import { getPublicHomepageSingleton, restaurantLuxuryFromCMS } from "@/lib/data/homepage-singleton-public"

import { HomeRestaurantImageSwitcher } from "./HomeRestaurantImageSwitcher"

export function HomeRestaurantLuxurySkeleton() {
  return (
    <section
      className="relative overflow-hidden bg-brand-shell-deep py-14 sm:py-16 md:py-20 lg:py-24"
      aria-busy
      aria-label="Loading restaurant highlight"
    >
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 animate-pulse sm:px-6 lg:px-10 xl:px-14">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          <div className="space-y-5 lg:col-span-5">
            <div className="h-3 w-28 rounded bg-white/15" />
            <div className="h-28 w-full rounded-lg bg-white/10" />
            <div className="h-24 w-full max-w-xl rounded bg-white/10" />
            <div className="h-10 w-48 rounded-full bg-white/10" />
          </div>
          <div className="grid w-full grid-cols-2 gap-2.5 sm:col-span-7 sm:gap-4 lg:col-span-7">
            <div className="col-span-2 aspect-4/3 min-h-47 rounded-2xl bg-white/10 sm:min-h-65" />
            <div className="aspect-5/6 min-h-28 rounded-xl bg-white/10 sm:min-h-43" />
            <div className="aspect-5/6 min-h-28 rounded-xl bg-white/10 sm:min-h-43" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function HomeRestaurantLuxuryView(r: ReturnType<typeof restaurantLuxuryFromCMS>) {
  return (
    <section
      className="relative overflow-hidden bg-brand-shell-deep py-14 sm:py-16 md:py-20 lg:py-24"
      aria-labelledby="restaurant-luxury-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,180,171,0.1),transparent_34%),linear-gradient(135deg,var(--brand-shell-deep)_0%,var(--brand-shell)_48%,var(--brand-primary-hover)_100%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/18" aria-hidden />
      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="max-w-2xl space-y-6 lg:col-span-5">
            <h2
              id="restaurant-luxury-heading"
              className="font-(family-name:--font-montserrat) text-[clamp(2.05rem,8vw,3rem)] font-extrabold leading-[1.02] tracking-tighter text-white sm:text-[clamp(2.45rem,4.8vw,4.25rem)]"
            >
              {r.headlineParts.main}
              {r.headlineParts.accent ? (
                <>
                  {" "}
                  <span className="text-brand-accent-soft">{r.headlineParts.accent}</span>
                </>
              ) : null}
            </h2>
            <p className="max-w-xl text-[1rem] leading-8 text-white/72 md:text-[1.08rem]">
              {r.body}
            </p>

            <SectionAccentRule />
            <Link
              href={r.ctaHref}
              className="group inline-flex w-full max-w-none items-center justify-between gap-4 rounded-[0.85rem] border border-white/16 bg-white/7 px-4 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_18px_45px_rgba(15,23,42,0.24)] backdrop-blur-md transition-colors duration-300 hover:border-brand-accent-soft/45 hover:bg-white/10 sm:w-auto sm:min-w-64 sm:px-5"
            >
              <span>Shiko Restaurantin</span>
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-accent-soft text-brand-shell-deep transition-transform duration-300 group-hover:translate-x-1">
                <MaterialSymbol name="arrow_forward" className="text-base" />
              </span>
            </Link>
          </div>

          <Reveal
            variant="fade-up"
            once
            className="relative w-full lg:col-span-7"
          >
            <HomeRestaurantImageSwitcher
              images={[
                { src: r.mainImage, alt: r.mainImageAlt },
                { src: r.float1, alt: r.float1Alt },
                { src: r.float2, alt: r.float2Alt },
              ]}
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export async function HomeRestaurantLuxury() {
  const { row, media } = await getPublicHomepageSingleton()
  const r = restaurantLuxuryFromCMS(row, media)
  return <HomeRestaurantLuxuryView {...r} />
}
