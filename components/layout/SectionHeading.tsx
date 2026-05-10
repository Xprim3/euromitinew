import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  label?: string
  title: ReactNode
  headingId?: string
  description?: string
  align?: "left" | "center"
  className?: string
  actions?: ReactNode
  invert?: boolean
  /** Fill the horizontal space of the parent container (skip max-w-2xl / max-w-prose on the body). */
  fullWidth?: boolean
}

/**
 * DESIGN.md headline scale — Montserrat, bold display / headline tiers.
 */
export function SectionHeading({
  label,
  title,
  headingId,
  description,
  align = "left",
  className,
  actions,
  invert = false,
  fullWidth = false,
}: SectionHeadingProps) {
  const isCenter = align === "center"

  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        isCenter && "md:flex-col md:items-center md:text-center",
        fullWidth && "md:items-stretch",
        className
      )}
    >
      <div
        className={cn(
          "min-w-0 space-y-3 md:space-y-4",
          fullWidth ? cn("w-full max-w-none", actions && "flex-1") : "max-w-2xl",
          isCenter && !fullWidth && "mx-auto max-w-3xl"
        )}
      >
        {label ? (
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-[0.18em]",
              invert ? "text-primary-foreground/70" : "text-muted-foreground",
              isCenter && "md:text-center"
            )}
          >
            {label}
          </p>
        ) : null}
        <h2
          id={headingId}
          className={cn(
            "font-heading text-[1.65rem] font-bold leading-[1.3] tracking-tight sm:text-[1.875rem] md:text-[1.95rem] lg:text-[2.1rem]",
            invert ? "text-primary-foreground" : "text-foreground",
            isCenter && "md:text-center"
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "text-[0.9375rem] leading-relaxed sm:text-base",
              fullWidth ? "max-w-none" : "max-w-prose",
              invert
                ? "text-primary-foreground/85"
                : "text-muted-foreground",
              isCenter && !fullWidth && "md:mx-auto md:text-center",
              isCenter && fullWidth && "md:text-center"
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div
          className={cn(
            "shrink-0",
            isCenter && "md:mt-2 md:flex md:justify-center"
          )}
        >
          {actions}
        </div>
      ) : null}
    </div>
  )
}
