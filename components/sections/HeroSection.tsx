import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/Container"
import { cn } from "@/lib/utils"

export type HeroSectionProps = {
  title: string
  subtitle?: string
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  imageSrc?: string
  imageAlt?: string
  className?: string
}

export function HeroSection({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt = "",
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative isolate flex min-h-[min(80vh,44rem)] items-end overflow-hidden bg-primary text-primary-foreground md:items-center",
        className
      )}
    >
      {imageSrc ? (
        <>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background:
                "linear-gradient(to top, color-mix(in oklab, var(--primary) 93%, transparent) 45%, transparent)",
            }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0 bg-muted"
          style={{
            background:
              "linear-gradient(145deg, var(--primary) 0%, color-mix(in oklab, var(--primary) 80%, black) 100%)",
          }}
          aria-hidden
        />
      )}

      <Container className="relative z-10 py-16 md:py-24">
        <div className="max-w-3xl space-y-6">
          <h1 className="font-heading text-[2.5rem] font-bold leading-[1.12] tracking-tight sm:text-[3rem] md:text-[3.5rem]">
            {title}
          </h1>
          {subtitle ? (
            <p className="max-w-2xl text-lg leading-relaxed text-primary-foreground/85 md:text-xl">
              {subtitle}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-4">
            <Button variant="secondary" size="lg" render={<Link href={primaryCta.href} />}>
              {primaryCta.label}
            </Button>
            {secondaryCta ? (
              <Button
                variant="outlinePrimary"
                size="lg"
                className="border-white/45 bg-transparent text-primary-foreground hover:bg-white/12 hover:text-primary-foreground"
                render={<Link href={secondaryCta.href} />}
              >
                {secondaryCta.label}
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}
