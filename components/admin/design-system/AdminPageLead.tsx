import type { ReactNode } from "react"

import { cnDs } from "./cn-ds"

export type AdminPageLeadProps = {
  title: string
  description?: ReactNode
  /** Right column (buttons, links). Stacks below title on narrow viewports. */
  actions?: ReactNode
  className?: string
}

/**
 * Mobile-first page title row: primary heading + optional description, with actions
 * that wrap cleanly on small screens (`flex-col` → `sm:flex-row`).
 */
export function AdminPageLead({ title, description, actions, className }: AdminPageLeadProps) {
  return (
    <div className={cnDs("flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        <h1 className="font-[family-name:var(--font-montserrat)] text-xl font-bold tracking-tight text-[var(--admin-text)] sm:text-2xl">
          {title}
        </h1>
        {description ? (
          <div className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--admin-text-muted)]">{description}</div>
        ) : null}
      </div>
      {actions ? (
        <div className="flex min-w-0 shrink-0 flex-wrap items-stretch gap-2 self-stretch sm:self-auto">{actions}</div>
      ) : null}
    </div>
  )
}
