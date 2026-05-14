import Image from "next/image"
import Link from "next/link"

import { Container } from "@/components/layout/Container"
import { EuromitiMotionClasses, ImageHoverZoom, Reveal } from "@/components/motion"
import { Button } from "@/components/ui/button"
import type { ResolvedRestaurantSkanomSection } from "@/lib/data/restaurant-content-public"
import { cn } from "@/lib/utils"

type RestaurantSkanomSectionProps = {
  data: ResolvedRestaurantSkanomSection
  className?: string
}

/** Digital menu (Skanom) — CMS-backed image, copy, and CTA; partner callout stays from design defaults. */
export function RestaurantSkanomSection({ data, className }: RestaurantSkanomSectionProps) {
  const { sectionId, headingId, eyebrow, title, description, imageSrc, imageAlt, ctaLabel, ctaHref, partner } = data

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className={cn("border-y border-border/45 bg-muted/35 py-[clamp(3rem,6.8vw,5.65rem)]", className)}
    >
      <Container size="wide">
        <div className="grid grid-cols-1 items-center gap-9 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          <Reveal variant="fade-up" once className="relative lg:col-span-5">
            <div className="relative aspect-4/5 min-h-[16rem] overflow-hidden bg-background shadow-(--shadow-euromiti-sm) sm:min-h-[18rem] lg:min-h-0">
              <ImageHoverZoom className="absolute inset-0 h-full w-full">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </ImageHoverZoom>
            </div>
          </Reveal>

          <Reveal variant="fade-up" once className="flex flex-col lg:col-span-7 lg:py-4">
            <p className="mb-5 font-heading text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-secondary">
              {eyebrow}
            </p>
            <h2
              id={headingId}
              className="font-playfair text-[clamp(2.05rem,3.9vw,3.35rem)] font-normal italic leading-[1.12] tracking-tight text-primary"
            >
              {title}
            </h2>
            <p className="mt-8 max-w-xl font-sans text-[1rem] font-light leading-[1.85] text-muted-foreground md:text-[1.06rem]">
              {description}
            </p>

            <Button
              variant="default"
              className={cn(
                "mt-10 w-fit min-h-12 rounded-full px-10 text-[0.65rem] font-semibold uppercase tracking-[0.26em]",
                EuromitiMotionClasses.buttonHover
              )}
              render={<a href={ctaHref} target="_blank" rel="noopener noreferrer" />}
            >
              {ctaLabel}
            </Button>

            <aside
              aria-label={`${partner.headline}: partner`}
              className="mt-12 border border-primary/15 bg-linear-to-br from-background to-muted/65 px-6 py-6 shadow-(--shadow-euromiti-soft) sm:px-8 sm:py-7"
            >
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-heading text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  Advertisement
                </span>
              </div>
              <Link
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-playfair mt-3 inline-block text-2xl font-normal tracking-tight text-primary transition-colors hover:text-secondary md:text-[1.65rem]"
              >
                {partner.headline}
              </Link>
              <p className="mt-3 max-w-xl font-sans text-[0.9rem] font-light leading-relaxed text-muted-foreground md:text-[0.9375rem]">
                {partner.body}
              </p>
              <Link
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-heading mt-5 inline-flex text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-secondary underline-offset-[0.35em] transition-colors hover:text-primary hover:underline"
              >
                {partner.hint}
              </Link>
            </aside>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
