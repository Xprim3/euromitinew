import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

import { Container } from "@/components/layout/Container"

export type PageImageHeroCrumbItem = {
  label: string
  href?: string
}

export type PageImageHeroVisualPreset = "elevated" | "flat-heavy" | "restaurant"

const PRESET_CLASSES: Record<
  PageImageHeroVisualPreset,
  { tint: string; bottomGradientHeight: string | null; bottomGradientRgbEnd: number }
> = {
  elevated: {
    tint: "bg-black/48",
    bottomGradientHeight: "h-[48%]",
    bottomGradientRgbEnd: 0.76,
  },
  "flat-heavy": {
    tint: "bg-black/52",
    bottomGradientHeight: null,
    bottomGradientRgbEnd: 0.76,
  },
  restaurant: {
    tint: "bg-black/50",
    bottomGradientHeight: "h-[45%]",
    bottomGradientRgbEnd: 0.75,
  },
}

function PageImageHeroCrumbTrail({ items }: { items: readonly PageImageHeroCrumbItem[] }) {
  return (
    <div className="text-sm font-medium text-white/75">
      {items.map((item, index) => {
        const node = item.href ? (
          <Link href={item.href} className="hover:text-white transition-colors">
            {item.label}
          </Link>
        ) : (
          <span className="text-white">{item.label}</span>
        )
        return (
          <span key={`${item.label}-${index}`}>
            {index > 0 ? <span className="px-2 text-white/60">/</span> : null}
            {node}
          </span>
        )
      })}
    </div>
  )
}

type PageImageHeroProps = {
  imageSrc: string
  imageAlt: string
  title: string
  description?: ReactNode
  /** Use when breadcrumbs are not Home / trailing label */
  breadcrumbs?: ReactNode
  trail?: readonly PageImageHeroCrumbItem[]
  priority?: boolean
  visualPreset?: PageImageHeroVisualPreset
  className?: string
  innerClassName?: string
}

export function PageImageHero({
  imageSrc,
  imageAlt,
  title,
  description,
  breadcrumbs,
  trail,
  priority,
  visualPreset = "elevated",
  className,
  innerClassName,
}: PageImageHeroProps) {
  const preset = PRESET_CLASSES[visualPreset]

  let crumbContent: ReactNode = null
  if (breadcrumbs !== undefined) {
    crumbContent = breadcrumbs
  } else if (trail !== undefined && trail.length > 0) {
    crumbContent = <PageImageHeroCrumbTrail items={trail} />
  }

  return (
    <section
      className={cn(
        "relative isolate min-h-[clamp(15.5rem,44svh,26rem)] overflow-hidden bg-black text-white md:min-h-[clamp(17rem,38svh,28rem)]",
        className
      )}
    >
      <Image src={imageSrc} alt={imageAlt} fill priority={priority} sizes="100vw" className="object-cover" />
      <div className={cn("absolute inset-0", preset.tint)} aria-hidden />
      {preset.bottomGradientHeight ? (
        <div
          className={cn("absolute inset-x-0 bottom-0", preset.bottomGradientHeight)}
          aria-hidden
          style={{
            background: `linear-gradient(to top, rgba(0,0,0,${preset.bottomGradientRgbEnd}), rgba(0,0,0,0))`,
          }}
        />
      ) : null}
      <Container className="relative z-10 py-[var(--section-header-y)]">
        <div className={cn("max-w-4xl space-y-5 md:space-y-6", innerClassName)}>
          {crumbContent}
          <h1 className="euromiti-type-display font-heading font-bold text-white">{title}</h1>
          {description !== undefined ? (
            typeof description === "string" ? (
              <p className="max-w-prose text-[0.9375rem] leading-relaxed text-white/85 md:text-base">{description}</p>
            ) : (
              <div className="max-w-prose text-[0.9375rem] leading-relaxed text-white/85 md:text-base">{description}</div>
            )
          ) : null}
        </div>
      </Container>
    </section>
  )
}
