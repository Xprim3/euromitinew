import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/Container"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { miniMarketIntroMock } from "@/data/mock/home"
import { cn } from "@/lib/utils"

export type MiniMarketIntroSectionProps = {
  label?: string
  title?: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
  imageSrc?: string
  imageAlt?: string
  className?: string
}

export function MiniMarketIntroSection({
  label = miniMarketIntroMock.label,
  title = miniMarketIntroMock.title,
  description = miniMarketIntroMock.description,
  ctaLabel = miniMarketIntroMock.ctaLabel,
  ctaHref = miniMarketIntroMock.ctaHref,
  imageSrc = "https://images.unsplash.com/photo-1556911220-e13c079b7137?auto=format&fit=crop&w=1200&q=80",
  imageAlt = "Coffee and croissant on a cafe table",
  className,
}: MiniMarketIntroSectionProps) {
  return (
    <section
      id="mini-market-intro"
      className={cn("euromiti-section bg-background", className)}
      aria-labelledby="mini-market-heading"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              label={label}
              headingId="mini-market-heading"
              title={title}
              description={description}
            />
            <Button variant="accent" size="lg" className="mt-8" render={<Link href={ctaHref} />}>
              {ctaLabel}
            </Button>
          </div>
          <div className="relative aspect-4/3 overflow-hidden rounded-[var(--rounded-lg)] border border-border/80 bg-muted shadow-(--shadow-euromiti-soft)">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
