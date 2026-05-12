import Image from "next/image"
import Link from "next/link"

import { EuromitiMotionClasses, ImageHoverZoom, Reveal, Stagger } from "@/components/motion"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import {
  getPublicHomepageSingleton,
  secondaryHomeServiceCardsFromCMS,
  servicesIntroEliteFromCMS,
} from "@/lib/data/homepage-singleton-public"
import { cn } from "@/lib/utils"

/** Pulse placeholder matching two-column services band + triple cards rhythm. */
export function HomeServicesIntroSkeleton() {
  return (
    <div id="services" className="overflow-hidden" aria-busy aria-label="Loading services section">
      <section className="overflow-hidden">
        <div className="relative overflow-hidden bg-brand-shell-deep px-4 py-14 sm:px-6 sm:py-16 md:py-20 lg:px-12">
          <div className="relative mx-auto max-w-[1280px]">
            <div className="grid grid-cols-1 animate-pulse items-center gap-8 md:grid-cols-2 md:gap-9 xl:gap-12">
              <div className="space-y-6">
                <div className="h-3 w-20 rounded bg-white/15" />
                <div className="h-10 w-[90%] max-w-md rounded bg-white/10" />
                <div className="h-24 w-full max-w-xl rounded-lg bg-white/10" />
                <div className="h-10 w-36 rounded-full bg-white/10" />
              </div>
              <div className="relative aspect-video max-h-[26rem] w-full rounded-3xl bg-white/10" />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white">
        <div className="px-4 pb-14 pt-10 sm:px-6 lg:px-12">
          <div className="mx-auto grid max-w-[1280px] animate-pulse gap-4 md:grid-cols-3 md:gap-5">
            {[0, 1, 2].map((k) => (
              <div key={k} className="rounded-2xl border border-brand-border-accent bg-brand-surface-tinted">
                <div className="aspect-16/11 bg-black/10" />
                <div className="space-y-2 p-4">
                  <div className="h-5 w-28 rounded bg-black/15" />
                  <div className="h-12 w-full rounded bg-black/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

type CardKey = "detailing" | "family" | "market"

export function HomeServicesIntroView(props: {
  elite: ReturnType<typeof servicesIntroEliteFromCMS>
  carwashKey: Extract<CardKey, "detailing">
  playgroundKey: Extract<CardKey, "family">
  marketKey: Extract<CardKey, "market">
  carwash: { imageSrc: string; imageAlt: string; body: string }
  playground: { imageSrc: string; imageAlt: string; body: string }
  market: { imageSrc: string; imageAlt: string; body: string }
}) {
  const { elite, carwash, playground, market } = props

  const rows: { key: CardKey; title: string; card: typeof carwash }[] = [
    { key: props.carwashKey, title: "Autolarje", card: carwash },
    { key: props.playgroundKey, title: "Këndi i lojërave", card: playground },
    { key: props.marketKey, title: "Mini Market", card: market },
  ]

  return (
    <div id="services" className="overflow-hidden">
      <section className="overflow-hidden" aria-labelledby="services-intro-heading">
        <div className="relative overflow-hidden bg-brand-shell-deep px-4 py-14 sm:px-6 sm:py-16 md:py-20 lg:px-12">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(217,53,47,0.22),transparent_42%),radial-gradient(circle_at_88%_78%,rgba(255,180,171,0.14),transparent_46%)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-[1280px]">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-9 xl:gap-12">
              <div className="space-y-6">
                <h2
                  id="services-intro-heading"
                  className="font-playfair text-[1.85rem] font-bold leading-[1.06] tracking-tight text-white sm:text-[2.05rem] md:text-4xl lg:text-[2.65rem]"
                >
                  {elite.title}
                </h2>
                <p className="max-w-xl text-[0.9375rem] leading-relaxed text-white/82 md:text-base">{elite.body}</p>

                {elite.chips.length > 0 ? (
                  <ul className="flex flex-wrap gap-2 pt-1" aria-label="Service highlights">
                    {elite.chips.map((chip) => (
                      <li
                        key={chip.label}
                        className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/6 px-3.5 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/92"
                      >
                        <MaterialSymbol name={chip.icon} className="text-base! text-brand-accent-soft" />
                        {chip.label}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <SectionAccentRule />
                <Link
                  href="/services"
                  className={cn(
                    "group inline-flex items-center gap-2.5 rounded-full bg-linear-to-r from-brand-red-vivid to-secondary px-7 py-3.5 text-sm font-bold tracking-[0.06em] text-white shadow-(--shadow-euromiti-secondary-sm) transition duration-300 hover:brightness-110",
                    EuromitiMotionClasses.buttonHover
                  )}
                >
                  Detajet e shërbimeve
                  <MaterialSymbol name="arrow_forward" className="text-base transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <Reveal variant="fade-up" once className="w-full">
                <div className="relative aspect-16/11 max-h-[26rem] w-full overflow-hidden rounded-3xl shadow-xl md:aspect-auto md:min-h-[18rem] md:max-h-none lg:min-h-[21rem]">
                  <ImageHoverZoom className="absolute inset-0 h-full w-full">
                    <Image
                      src={elite.imageSrc}
                      alt={elite.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </ImageHoverZoom>
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-black/15 via-transparent to-brand-red-vivid/10" />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white" aria-label="Services and amenities">
        <div className="px-4 pb-14 pt-10 sm:px-6 sm:pt-12 md:pb-16 md:pt-14 lg:px-12">
          <div className="mx-auto max-w-[1280px]">
            <Stagger once className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
              {rows.map((rowItem) => (
                <article
                  key={rowItem.key}
                  className="overflow-hidden rounded-2xl border border-brand-border-accent bg-brand-surface-tinted shadow-[0_14px_36px_-26px_rgba(20,27,43,0.35)]"
                >
                  <div className="relative aspect-16/11 overflow-hidden">
                    <Image
                      src={rowItem.card.imageSrc}
                      alt={rowItem.card.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading={rowItem.key === props.carwashKey ? "eager" : "lazy"}
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-40" />
                  </div>
                  <div className="space-y-1.5 p-3.5 md:p-4">
                    <h3 className="text-base font-bold text-black md:text-lg">{rowItem.title}</h3>
                    <p className="text-[0.895rem] leading-relaxed text-brand-body-soft md:text-[0.92rem]">{rowItem.card.body}</p>
                  </div>
                </article>
              ))}
            </Stagger>
          </div>
        </div>
      </section>
    </div>
  )
}

export async function HomeServicesIntro() {
  const { row, media } = await getPublicHomepageSingleton()
  const elite = servicesIntroEliteFromCMS(row, media)
  const { carwash, playground, market } = secondaryHomeServiceCardsFromCMS(row, media)

  return (
    <HomeServicesIntroView
      elite={elite}
      carwashKey="detailing"
      playgroundKey="family"
      marketKey="market"
      carwash={carwash}
      playground={playground}
      market={market}
    />
  )
}
