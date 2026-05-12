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
              <div className="relative aspect-video max-h-104 w-full rounded-3xl bg-white/10" />
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
        <div className="relative overflow-hidden bg-[#f9f9ff] px-4 py-16 sm:px-6 sm:py-18 md:py-24 lg:px-12">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(198,198,205,0.42),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f9f9ff_62%,#eef2ff_100%)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-[1280px]">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[0.88fr_1.12fr] md:gap-10 xl:gap-14">
              <div className="space-y-6">
                <h2
                  id="services-intro-heading"
                  className="font-(family-name:--font-montserrat) text-[clamp(2rem,8vw,2.8rem)] font-extrabold leading-[1.04] tracking-[-0.045em] text-[#141b2b] sm:text-[clamp(2.35rem,4.6vw,3.7rem)]"
                >
                  {elite.title}
                </h2>
                <p className="max-w-xl text-[0.98rem] leading-7 text-[#45464d] md:text-[1.05rem] md:leading-8">{elite.body}</p>

                {elite.chips.length > 0 ? (
                  <ul className="flex flex-wrap gap-2 pt-1" aria-label="Service highlights">
                    {elite.chips.map((chip) => (
                      <li
                        key={chip.label}
                        className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3.5 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#141b2b] shadow-sm"
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
                    "group inline-flex items-center gap-2.5 rounded-full bg-black px-7 py-3.5 text-sm font-bold tracking-[0.06em] text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition duration-300 hover:bg-[#141b2b]",
                    EuromitiMotionClasses.buttonHover
                  )}
                >
                  Detajet e shërbimeve
                  <MaterialSymbol name="arrow_forward" className="text-base transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <Reveal variant="fade-up" once className="w-full">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-[1.5rem] bg-[#141b2b]/8 blur-2xl" aria-hidden />
                  <div className="relative aspect-16/11 max-h-112 w-full overflow-hidden rounded-[1.25rem] border border-white bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.14)] md:aspect-auto md:min-h-80 md:max-h-none lg:min-h-100">
                    <ImageHoverZoom className="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] overflow-hidden rounded-[0.85rem]">
                      <Image
                        src={elite.imageSrc}
                        alt={elite.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </ImageHoverZoom>
                    <div className="pointer-events-none absolute inset-2 rounded-[0.85rem] bg-linear-to-t from-black/36 via-transparent to-transparent" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f9f9ff]" aria-label="Services and amenities">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-[#eef2ff] to-transparent" aria-hidden />
        <div className="relative px-4 pb-16 pt-5 sm:px-6 md:pb-20 lg:px-12">
          <div className="mx-auto max-w-[1180px]">
            <Stagger once className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
              {rows.map((rowItem, index) => (
                <article
                  key={rowItem.key}
                  className="overflow-hidden rounded-[1rem] border border-black/8 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)]"
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
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/56 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <span className="mb-3 inline-flex size-9 items-center justify-center rounded-full border border-white/18 bg-white/12 text-sm font-black text-white backdrop-blur-md">
                        0{index + 1}
                      </span>
                      <h3 className="font-(family-name:--font-montserrat) text-lg font-extrabold tracking-[-0.03em] text-white md:text-xl">
                        {rowItem.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className="mt-5 text-[0.98rem] leading-8 text-[#45464d]">{rowItem.card.body}</p>
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
