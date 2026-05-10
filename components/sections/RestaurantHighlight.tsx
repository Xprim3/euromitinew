import Image from "next/image"
import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/Container"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { restaurantHighlightMock } from "@/data/mock/home"
import { cn } from "@/lib/utils"

export type RestaurantHighlightProps = {
  label?: string
  title?: string
  description?: string
  bullets?: readonly string[]
  ctaLabel?: string
  ctaHref?: string
  secondaryCta?: { label: string; href: string }
  imageSrc?: string
  imageAlt?: string
  className?: string
}

export function RestaurantHighlight({
  label = restaurantHighlightMock.label,
  title = restaurantHighlightMock.title,
  description = restaurantHighlightMock.description,
  bullets = restaurantHighlightMock.bullets,
  ctaLabel = restaurantHighlightMock.ctaLabel,
  ctaHref = restaurantHighlightMock.ctaHref,
  secondaryCta = restaurantHighlightMock.secondaryCta,
  imageSrc = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  imageAlt = restaurantHighlightMock.imageAlt,
  className,
}: RestaurantHighlightProps) {
  return (
    <section
      id="restaurant-highlight"
      className={cn("euromiti-section bg-background", className)}
      aria-labelledby="restaurant-highlight-heading"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              label={label}
              headingId="restaurant-highlight-heading"
              title={title}
              description={description}
            />
            <ul className="mt-8 space-y-4">
              {bullets.map((item) => (
                <li key={item} className="flex gap-3 text-base text-muted-foreground">
                  <Check
                    className="mt-0.5 size-5 shrink-0 text-secondary"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button variant="default" size="lg" render={<Link href={ctaHref} />}>
                {ctaLabel}
              </Button>
              {secondaryCta ? (
                <Button
                  variant="outlinePrimary"
                  size="lg"
                  render={<Link href={secondaryCta.href} />}
                >
                  {secondaryCta.label}
                </Button>
              ) : null}
            </div>
          </div>
          <div className="relative aspect-4/3 overflow-hidden rounded-[var(--rounded-lg)] border border-border/80 bg-muted shadow-(--shadow-euromiti-soft)">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
