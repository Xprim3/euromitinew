import Image from "next/image"

import { Container } from "@/components/layout/Container"
import { ImageHoverZoom, Reveal, Stagger } from "@/components/motion"
import { cn } from "@/lib/utils"

import type { RestaurantSeasonalFoodGalleryMock } from "@/data/mock/restaurant-page"

type RestaurantSeasonalFoodGalleryProps = {
  data: RestaurantSeasonalFoodGalleryMock
  className?: string
}

/**
 * Editorial food gallery — banded surface, dual headline row, staggered 3-column mosaic (even columns dropped on md+).
 */
export function RestaurantSeasonalFoodGallery({ data, className }: RestaurantSeasonalFoodGalleryProps) {
  const { sectionId, headingId, eyebrow, title, lead, items } = data

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className={cn(
        "border-y border-border/40 bg-muted py-[clamp(3rem,6.8vw,5.85rem)]",
        className
      )}
    >
      <Container size="wide">
        <Reveal variant="fade-up" once>
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
            <div className="max-w-xl">
              <span className="mb-4 block font-heading text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-secondary">
                {eyebrow}
              </span>
              <h2
                id={headingId}
                className="font-playfair text-[clamp(1.95rem,3.6vw,2.85rem)] font-normal leading-[1.12] tracking-tight text-primary"
              >
                {title}
              </h2>
            </div>
            <p className="max-w-sm font-sans text-base font-light leading-relaxed text-muted-foreground md:text-[1.05rem]">
              {lead}
            </p>
          </div>
        </Reveal>

        <Stagger
          once
          className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3 lg:gap-y-20"
        >
          {items.map((item, index) => (
            <article
              key={`${index}-${item.title}`}
              className={cn(
                "flex flex-col",
                index % 2 === 1 && "motion-safe:md:translate-y-7 motion-safe:lg:translate-y-8"
              )}
            >
              <div className="relative mb-6 aspect-3/4 overflow-hidden bg-background">
                <ImageHoverZoom className="absolute inset-0 h-full w-full">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </ImageHoverZoom>
              </div>
              <div className="px-0.5">
                <h3 className="font-playfair mb-3 text-[1.35rem] font-normal italic tracking-tight text-primary md:text-[1.5rem]">
                  {item.title}
                </h3>
                <p className="font-sans text-sm font-light leading-relaxed text-muted-foreground md:text-[0.9375rem]">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}
