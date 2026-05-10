import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/Container"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { carwashIntroMock } from "@/data/mock/home"
import { cn } from "@/lib/utils"

export type CarwashIntroSectionProps = {
  label?: string
  title?: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
  imageSrc?: string
  imageAlt?: string
  className?: string
}

export function CarwashIntroSection({
  label = carwashIntroMock.label,
  title = carwashIntroMock.title,
  description = carwashIntroMock.description,
  ctaLabel = carwashIntroMock.ctaLabel,
  ctaHref = carwashIntroMock.ctaHref,
  imageSrc = "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80",
  imageAlt = "Car wash bay with water spray",
  className,
}: CarwashIntroSectionProps) {
  return (
    <section
      id="carwash-intro"
      className={cn("euromiti-section bg-muted/40", className)}
      aria-labelledby="carwash-intro-heading"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-last aspect-4/3 overflow-hidden rounded-[var(--rounded-lg)] border border-border/80 shadow-(--shadow-euromiti-soft) lg:order-first">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              label={label}
              headingId="carwash-intro-heading"
              title={title}
              description={description}
            />
            <Button
              variant="outlinePrimary"
              size="lg"
              className="mt-8"
              render={<Link href={ctaHref} />}
            >
              {ctaLabel}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
