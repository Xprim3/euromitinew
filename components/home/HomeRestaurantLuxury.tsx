import Image from "next/image"
import Link from "next/link"

import { EuromitiMotionClasses, ImageHoverZoom, Reveal } from "@/components/motion"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import { getPublicHomepageSingleton, restaurantLuxuryFromCMS } from "@/lib/data/homepage-singleton-public"
import { cn } from "@/lib/utils"

export function HomeRestaurantLuxurySkeleton() {
  return (
    <section
      className="relative overflow-hidden bg-brand-shell-deep py-10 sm:py-14 md:py-16 lg:py-18 xl:py-20"
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
      className="relative overflow-hidden bg-brand-shell-deep py-10 sm:py-14 md:py-16 lg:py-18 xl:py-20"
      aria-labelledby="restaurant-luxury-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_14%,rgba(217,53,47,0.26),transparent_40%),radial-gradient(circle_at_92%_82%,rgba(255,180,171,0.16),transparent_42%)]"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-12">
          <div className="space-y-4 max-sm:space-y-3 sm:space-y-5 xl:space-y-6 lg:col-span-5 lg:max-w-none">
            <h2
              id="restaurant-luxury-heading"
              className="text-balance font-playfair text-[clamp(1.5rem,5.4vw,2rem)] font-bold leading-[1.06] tracking-tight text-white sm:text-[clamp(1.75rem,3.8vw,2.15rem)] md:text-[clamp(2rem,3.6vw,2.75rem)] lg:text-[clamp(2.1rem,2.6vw,2.85rem)]"
            >
              {r.headlineParts.main}
              {r.headlineParts.accent ? (
                <>
                  {" "}
                  <span className="text-brand-accent-soft">{r.headlineParts.accent}</span>
                </>
              ) : null}
            </h2>
            <p className="max-w-xl text-[0.9rem] leading-relaxed text-white/82 sm:text-[0.9375rem] md:text-base">
              {r.body}
            </p>

            <SectionAccentRule />
            <Link
              href={r.ctaHref}
              className={cn(
                "group flex w-full max-w-none items-center justify-center gap-2.5 rounded-full bg-linear-to-r from-brand-red-vivid to-secondary px-6 py-3.5 text-sm font-bold tracking-[0.06em] text-white shadow-(--shadow-euromiti-secondary-sm) transition duration-300 hover:brightness-110 sm:inline-flex sm:w-auto sm:justify-start sm:px-7 md:py-3.5",
                EuromitiMotionClasses.buttonHover
              )}
            >
              Shiko Restaurantin
              <MaterialSymbol name="arrow_forward" className="text-base transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <Reveal
            variant="fade-up"
            once
            className="grid w-full grid-cols-2 gap-2.5 gap-y-3 sm:grid-cols-6 sm:gap-4 lg:col-span-7"
          >
            <div className="relative col-span-2 aspect-4/3 min-h-47 overflow-hidden rounded-xl sm:col-span-4 sm:row-span-2 sm:aspect-auto sm:min-h-65 sm:rounded-2xl md:min-h-74 lg:min-h-80 xl:min-h-88">
              <ImageHoverZoom className="absolute inset-0 h-full w-full">
                <Image
                  src={r.mainImage}
                  alt={r.mainImageAlt}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 70vw, 45vw"
                  className="object-cover"
                />
              </ImageHoverZoom>
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />
            </div>
            <div className="relative col-span-1 aspect-5/6 min-h-28 overflow-hidden rounded-xl sm:col-span-2 sm:aspect-auto sm:min-h-43 sm:rounded-2xl md:min-h-45">
              <ImageHoverZoom className="absolute inset-0 h-full w-full">
                <Image
                  src={r.float1}
                  alt={r.float1Alt}
                  fill
                  sizes="(max-width: 639px) 45vw, (max-width: 1023px) 32vw, 18vw"
                  className="object-cover"
                />
              </ImageHoverZoom>
            </div>
            <div className="relative col-span-1 aspect-5/6 min-h-28 overflow-hidden rounded-xl sm:col-span-2 sm:aspect-auto sm:min-h-43 sm:rounded-2xl md:min-h-45">
              <ImageHoverZoom className="absolute inset-0 h-full w-full">
                <Image
                  src={r.float2}
                  alt={r.float2Alt}
                  fill
                  sizes="(max-width: 639px) 45vw, (max-width: 1023px) 32vw, 18vw"
                  className="object-cover"
                />
              </ImageHoverZoom>
            </div>
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
