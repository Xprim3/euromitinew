import Image from "next/image"

import { Container } from "@/components/layout/Container"
import { ImageHoverZoom, Reveal } from "@/components/motion"
import { cn } from "@/lib/utils"

import type { RestaurantAtmosphereGalleryMock } from "@/data/mock/restaurant-page"

type RestaurantAtmosphereGalleryProps = {
  data: RestaurantAtmosphereGalleryMock
  className?: string
}

function AtmosphereTile({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "group relative min-h-0 overflow-hidden bg-primary-foreground/6",
        className
      )}
    >
      <ImageHoverZoom className="absolute inset-0 h-full w-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 60vw"
          className="object-cover grayscale-30 transition-[filter] duration-1000 ease-out motion-safe:group-hover:grayscale-0"
        />
      </ImageHoverZoom>
    </div>
  )
}

/**
 * Dark editorial gallery — Playfair title, rule + label, asymmetric 12-column mosaic.
 */
export function RestaurantAtmosphereGallery({ data, className }: RestaurantAtmosphereGalleryProps) {
  const { headingId, title, label, slots } = data
  const [hero, stackTop, stackBottom, bottomLead, bottomWide] = slots

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "overflow-hidden bg-primary py-[clamp(3rem,6.8vw,5.85rem)] text-primary-foreground",
        className
      )}
    >
      <Container size="wide">
        <Reveal variant="fade-up" once>
          <header className="mb-10 flex flex-col gap-5 md:mb-16 md:flex-row md:items-center md:justify-between md:gap-5">
            <h2
              id={headingId}
              className="font-playfair text-[clamp(2.05rem,3.9vw,2.95rem)] font-normal italic leading-tight tracking-tight"
            >
              {title}
            </h2>
            <div className="mx-0 hidden h-px flex-1 bg-primary-foreground/20 md:mx-10 md:block" aria-hidden />
            <p className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-primary-foreground/58 md:shrink-0 md:text-xs">
              {label}
            </p>
          </header>

          <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 md:col-span-7">
            <AtmosphereTile
              src={hero.src}
              alt={hero.alt}
              className="aspect-4/5 min-h-[260px] md:aspect-auto md:h-[min(78vh,600px)] lg:h-[600px]"
            />
          </div>
          <div className="col-span-12 flex min-h-[340px] flex-col gap-3 md:col-span-5 md:h-[520px] md:min-h-0 md:gap-5">
            <AtmosphereTile src={stackTop.src} alt={stackTop.alt} className="min-h-[160px] flex-1" />
            <AtmosphereTile src={stackBottom.src} alt={stackBottom.alt} className="min-h-[160px] flex-1" />
          </div>
          <div className="col-span-12 md:col-span-4">
            <AtmosphereTile
              src={bottomLead.src}
              alt={bottomLead.alt}
              className="aspect-4/3 min-h-[200px] md:aspect-auto md:h-[340px]"
            />
          </div>
          <div className="col-span-12 md:col-span-8">
            <AtmosphereTile
              src={bottomWide.src}
              alt={bottomWide.alt}
              className="aspect-video min-h-[200px] md:aspect-auto md:h-[340px]"
            />
          </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
