import Image from "next/image"
import Link from "next/link"

import { ImageHoverZoom, Stagger } from "@/components/motion"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import {
  getPublicHomepageSingleton,
  secondaryHomeServiceCardsFromCMS,
  servicesIntroEliteFromCMS,
} from "@/lib/data/homepage-singleton-public"

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
                <div className="aspect-16/11 bg-brand-shell-deep/10" />
                <div className="space-y-2 p-4">
                  <div className="h-5 w-28 rounded bg-brand-shell-deep/15" />
                  <div className="h-12 w-full rounded bg-brand-shell-deep/10" />
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
    <>
      <section className="relative overflow-hidden bg-brand-surface-tinted px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-12" aria-labelledby="services-intro-heading">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 overflow-hidden rounded-[1.2rem] bg-brand-shell-deep shadow-[0_26px_75px_rgba(15,23,42,0.16)] lg:grid-cols-12">
            <div className="relative min-h-72 overflow-hidden lg:col-span-5 lg:min-h-112">
              <ImageHoverZoom className="absolute inset-0 h-full w-full">
                <Image
                  src={elite.imageSrc}
                  alt={elite.imageAlt}
                  fill
                  sizes="(max-width: 1023px) 100vw, 42vw"
                  className="object-cover"
                />
              </ImageHoverZoom>
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-shell-deep/58 via-brand-shell-deep/10 to-transparent lg:bg-linear-to-r lg:from-transparent lg:via-brand-shell-deep/12 lg:to-brand-shell-deep/74" />
            </div>

            <div className="relative flex flex-col justify-center px-5 py-8 sm:px-7 sm:py-10 lg:col-span-7 lg:px-10 xl:px-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(255,180,171,0.12),transparent_34%)]" aria-hidden />
              <div className="relative max-w-2xl">
                <p className="mb-4 text-[0.62rem] font-black uppercase tracking-[0.3em] text-brand-accent-soft">
                  Cilësi & standard
                </p>
                <h2
                  id="services-intro-heading"
                  className="font-(family-name:--font-montserrat) text-[clamp(1.9rem,8vw,2.55rem)] font-extrabold leading-[1.05] tracking-[-0.045em] text-white sm:text-[clamp(2.35rem,4.4vw,3.7rem)]"
                >
                  {elite.title}
                </h2>
                <p className="mt-5 max-w-xl text-[0.98rem] leading-8 text-white/74 md:text-[1.04rem]">{elite.body}</p>

                {elite.chips.length > 0 ? (
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label="Service highlights">
                    {elite.chips.map((chip) => (
                      <li
                        key={chip.label}
                        className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3.5 py-1.5 text-[0.64rem] font-black uppercase tracking-[0.14em] text-white/78"
                      >
                        <MaterialSymbol name={chip.icon} className="text-base! text-brand-accent-soft" />
                        {chip.label}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <SectionAccentRule className="mt-6" />
                <Link
                  href="/services"
                  className="group mt-7 inline-flex w-full max-w-none items-center justify-between gap-4 rounded-[0.85rem] border border-white/16 bg-white/8 px-4 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)] backdrop-blur-md transition-colors duration-300 hover:border-brand-accent-soft/45 hover:bg-white/10 sm:w-auto sm:min-w-64 sm:px-5"
                >
                  <span>Detajet e shërbimeve</span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-accent-soft text-brand-shell-deep transition-transform duration-300 group-hover:translate-x-1">
                    <MaterialSymbol name="arrow_forward" className="text-base" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="relative overflow-hidden bg-brand-surface-tinted" aria-label="Services and amenities">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-[#eef2ff] to-transparent" aria-hidden />
        <div className="relative px-4 pb-16 pt-5 sm:px-6 md:pb-20 lg:px-12">
          <div className="mx-auto max-w-[1180px]">
            <Stagger once className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
              {rows.map((rowItem) => (
                <article
                  key={rowItem.key}
                  className="overflow-hidden rounded-[1rem] border border-brand-shell-deep/8 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)]"
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
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-shell-deep/58 via-brand-shell/12 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="font-(family-name:--font-montserrat) text-lg font-extrabold tracking-[-0.03em] text-white md:text-xl">
                        {rowItem.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className="mt-5 text-[0.98rem] leading-8 text-brand-body-soft">{rowItem.card.body}</p>
                  </div>
                </article>
              ))}
            </Stagger>
          </div>
        </div>
      </section>
    </>
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
