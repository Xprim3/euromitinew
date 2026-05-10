import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { Container } from "./Container"

type PageHeaderProps = {
  title: string
  description?: string
  breadcrumbs?: ReactNode
  actions?: ReactNode
  className?: string
}

/**
 * Interior page masthead — DISPLAY / HEADLINE scale from DESIGN.md.
 */
export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "border-b border-border/60 bg-muted/50 backdrop-blur-sm",
        className
      )}
    >
      <Container>
        <div className="flex flex-col gap-5 py-[var(--section-header-y)] md:flex-row md:items-start md:justify-between md:gap-10">
          <div className="max-w-3xl space-y-2.5 md:space-y-3.5">
            {breadcrumbs ? (
              <div className="text-sm font-medium text-muted-foreground">
                {breadcrumbs}
              </div>
            ) : null}
            <h1 className="euromiti-type-display font-heading font-bold text-foreground">
              {title}
            </h1>
            {description ? (
              <p className="max-w-prose text-[0.9375rem] leading-relaxed text-muted-foreground md:text-base">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
