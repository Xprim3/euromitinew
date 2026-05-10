import Image from "next/image"

import { Container } from "@/components/layout/Container"
import { ImageHoverZoom, Reveal } from "@/components/motion"
import { cn } from "@/lib/utils"

import type { RestaurantEditorialIntroMock } from "@/data/mock/restaurant-page"

type RestaurantEditorialIntroSectionProps = {
  data: RestaurantEditorialIntroMock
  className?: string
}

/**
 * Restaurant story block — headline + prose paired with one image.
 * Keeps markup flat (no overlapping frames) so layout stays stable everywhere.
 */
export function RestaurantEditorialIntroSection({ data, className }: RestaurantEditorialIntroSectionProps) {
  const { headingId, eyebrow, headlineLine1, headlineLine2, paragraphs, imageSrc, imageAlt } = data

  return (
    <section
      aria-labelledby={headingId}
      className={cn("border-t border-border/60 bg-muted/25", className)}
    >
      <Container size="wide" className="py-12 md:py-16 lg:py-18">
        <Reveal variant="fade-up" once>
        <div className="flex flex-col gap-11 lg:flex-row lg:items-start lg:justify-between lg:gap-x-14 xl:gap-x-20">
          <header className="min-w-0 max-w-xl lg:flex-1">
            <p className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-secondary">
              {eyebrow}
            </p>
            <h2
              id={headingId}
              className="font-playfair mt-5 text-[clamp(1.875rem,3.65vw,2.875rem)] font-normal leading-[1.14] tracking-tight text-primary"
            >
              {headlineLine1}{" "}
              <span className="italic text-primary">{headlineLine2}</span>
            </h2>
            <div className="mt-7 h-px w-12 bg-secondary/45" aria-hidden />
            <div className="mt-7 flex flex-col gap-6 md:gap-7">
              {paragraphs.map((p, index) => (
                <p
                  key={p}
                  className={cn(
                    "font-sans font-light leading-[1.8]",
                    index === 0 ? "text-base text-foreground/88 md:text-[1.0625rem]" : "text-[0.9375rem] text-muted-foreground md:text-[0.965rem]"
                  )}
                >
                  {p}
                </p>
              ))}
            </div>
          </header>

          <div className="min-w-0 shrink-0 lg:w-[42%] lg:max-w-lg xl:max-w-xl">
            <div className="overflow-hidden rounded-lg border border-border/80 bg-background shadow-(--shadow-euromiti-soft)">
              <div className="relative aspect-video w-full">
                <ImageHoverZoom className="absolute inset-0 h-full w-full">
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 1024px) 92vw, 480px"
                    className="object-cover"
                    priority={false}
                  />
                </ImageHoverZoom>
              </div>
            </div>
          </div>
        </div>
        </Reveal>
      </Container>
    </section>
  )
}
