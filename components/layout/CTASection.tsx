import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { Container } from "./Container"
import { SectionHeading } from "./SectionHeading"

type CTASectionVariant = "muted" | "primary" | "accent"

const variants: Record<CTASectionVariant, string> = {
  muted:
    "border-y border-border/70 bg-muted/80 shadow-(--shadow-euromiti-soft)",
  primary:
    "border-y border-primary/15 bg-primary text-primary-foreground shadow-(--shadow-euromiti-primary)",
  accent:
    "border-y border-accent/35 bg-accent/10 shadow-(--shadow-euromiti-soft)",
}

type CTASectionProps = {
  /** Stable slug for section + heading id (`cta-{slug}-title`). */
  slug: string
  title: string
  description?: string
  label?: string
  variant?: CTASectionVariant
  children?: ReactNode
  className?: string
}

/**
 * Conversion band — contact, newsletter, or similar (home + interior pages).
 */
export function CTASection({
  slug,
  title,
  description,
  label,
  variant = "muted",
  children,
  className,
}: CTASectionProps) {
  const headingId = `cta-${slug}-title`
  const isPrimary = variant === "primary"

  return (
    <section className={cn(variants[variant], className)} aria-labelledby={headingId}>
      <Container>
        <div className="flex flex-col gap-6 py-[var(--section-cta-y)] md:flex-row md:items-center md:justify-between md:gap-10">
          <SectionHeading
            headingId={headingId}
            label={label}
            title={title}
            description={description}
            align="left"
            invert={isPrimary}
          />
          {children ? (
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {children}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
