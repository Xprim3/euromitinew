import Image from "next/image"
import Link from "next/link"

import { EuromitiMotionClasses, Reveal } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { getPublicHomepageSingleton, heroFromHomepageCMS, type HomeHeroResolved } from "@/lib/data/homepage-singleton-public"
import { cn } from "@/lib/utils"

/** Static shell behind image while Next/Image loads (Supabase or remote). */
export function HomeHeroSkeleton() {
  return (
    <section
      className="relative flex min-h-[clamp(20rem,68svh,36rem)] animate-pulse items-center overflow-hidden bg-zinc-900 md:min-h-[clamp(22rem,62svh,40rem)]"
      aria-busy
      aria-label="Loading hero"
    >
      <div className="absolute inset-0 bg-linear-to-r from-zinc-800 to-zinc-700" />
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-12">
        <div className="max-w-3xl space-y-5">
          <div className="h-12 w-4/5 max-w-md rounded-md bg-white/10" />
          <div className="h-4 w-full max-w-sm rounded bg-white/10" />
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="h-10 w-36 rounded-full bg-white/10" />
            <div className="h-10 w-32 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  )
}

function HomeHeroView({ h }: { h: HomeHeroResolved }) {
  const showSecondary = h.secondaryCta.label.trim().length > 0

  return (
    <section className="relative flex min-h-[clamp(20rem,68svh,36rem)] items-center overflow-hidden bg-black md:min-h-[clamp(22rem,62svh,40rem)]">
      <Image
        src={h.imageSrc}
        alt={h.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover euromiti-home-hero-media"
      />
      <div
        className="absolute inset-0 bg-linear-to-r from-black via-black/60 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-12">
        <div className="max-w-3xl space-y-5 md:space-y-6">
          <Reveal variant="fade-up" once threshold={0} rootMargin="0px 0px 0px 0px">
            <div className="euromiti-home-hero-intro-copy">
              <h1 className="font-[family-name:var(--font-montserrat)] text-[clamp(2rem,4.6vw,3.35rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-white">
                {h.titleLine1}
                <br />
                {h.titleLine2}
              </h1>

              <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-white/80 md:mt-6 md:text-base">{h.subtitle}</p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" once delayMs={100} threshold={0} rootMargin="0px 0px 0px 0px">
            <div className="euromiti-home-hero-intro-actions flex flex-wrap gap-3 pt-2 md:gap-4 md:pt-3">
              <Button
                render={<Link href={h.primaryCta.href} />}
                variant="secondary"
                size="default"
                className={cn(
                  "rounded-full px-7 tracking-[0.04em] shadow-(--shadow-euromiti-secondary-sm) hover:brightness-110 md:px-8",
                  EuromitiMotionClasses.buttonHover
                )}
              >
                {h.primaryCta.label}
              </Button>
              {showSecondary ? (
                <Button
                  render={<Link href={h.secondaryCta.href} />}
                  variant="outlineAccent"
                  size="default"
                  className={cn(
                    "rounded-full border-white/35 bg-black/25 px-7 font-semibold tracking-[0.04em] text-white backdrop-blur-md hover:border-white/55 hover:bg-white/10 md:px-8",
                    EuromitiMotionClasses.buttonHover
                  )}
                >
                  {h.secondaryCta.label}
                </Button>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export async function HomeHero() {
  const { row, media } = await getPublicHomepageSingleton()
  const h = heroFromHomepageCMS(row, media)
  return <HomeHeroView h={h} />
}
