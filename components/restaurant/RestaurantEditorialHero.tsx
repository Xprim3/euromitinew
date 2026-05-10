import Image from "next/image"

import { Container } from "@/components/layout/Container"
import { Reveal } from "@/components/motion"
import { cn } from "@/lib/utils"

import type { RestaurantEditorialHeroMock } from "@/data/mock/restaurant-page"

type RestaurantEditorialHeroProps = {
  data: RestaurantEditorialHeroMock
  className?: string
}

/**
 * Editorial luxury hero — Playfair display, restrained label typography, asymmetric media,
 * optional floating quote slab (desktop). Inspired by Euromiti warm editorial layouts.
 */
export function RestaurantEditorialHero({ data, className }: RestaurantEditorialHeroProps) {
  const { eyebrow, titleLine1, titleLine2, description, quote, imageSrc, imageAlt } = data

  return (
    <section
      className={cn(
        "relative flex items-center bg-background py-11 pb-[clamp(3rem,7vw,4.75rem)] text-foreground selection:bg-secondary selection:text-secondary-foreground sm:py-12 md:py-14 md:pb-20 lg:items-center",
        className
      )}
    >
      <Container size="wide" className="w-full">
        <Reveal variant="fade-up" once>
        <div className="grid w-full grid-cols-1 items-center gap-9 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0">
          <div className="relative z-20 lg:col-span-5 lg:pr-4 xl:pr-10">
            <span className="mb-5 block font-heading text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-secondary">
              {eyebrow}
            </span>
            <h1 className="font-playfair mb-6 text-[clamp(2.35rem,5.2vw,4.35rem)] font-normal leading-[1.08] tracking-tight italic text-primary md:mb-7">
              {titleLine1}
              <br />
              <span>{titleLine2}</span>
            </h1>
            <p className="max-w-md font-sans text-base font-light leading-[1.7] text-muted-foreground md:text-[1.0625rem]">
              {description}
            </p>
          </div>

          <div className="relative lg:col-span-7">
            <div className="group relative aspect-4/5 overflow-hidden grayscale-22 transition-[filter] duration-1000 ease-out hover:grayscale-0 md:aspect-16/11 md:max-h-[min(68vh,36rem)]">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-2000 ease-out motion-safe:scale-110 motion-safe:group-hover:scale-100"
              />
            </div>
            <div
              className="absolute z-10 hidden max-w-[min(21rem,calc(100%-3rem))] border border-border/60 bg-card p-8 shadow-[20px_20px_56px_-12px_rgb(15_23_42/0.08)] lg:-bottom-10 lg:-left-6 lg:block lg:p-9"
              aria-label="Featured review quote"
            >
              <p className="font-playfair mb-3 text-xl italic leading-snug text-primary md:text-2xl">
                {quote.line}
              </p>
              <p className="font-heading text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {quote.attribution}
              </p>
            </div>
          </div>
        </div>
        </Reveal>
      </Container>
    </section>
  )
}
