import type { ReactNode } from "react"

import { cnDs } from "./cn-ds"

export type AdminSectionCardProps = {
  title?: string
  description?: string
  /** Right side of header (e.g. small button). */
  headerActions?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * White card with optional titled header — use to group related fields or content blocks.
 */
export function AdminSectionCard({ title, description, headerActions, children, className }: AdminSectionCardProps) {
  const hasHeader = Boolean(title || description || headerActions)

  return (
    <section
      className={cnDs(
        "rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow-card)]",
        className
      )}
    >
      {hasHeader ? (
        <div className="flex flex-wrap items-start justify-between gap-3 border-[var(--admin-border)] border-b px-5 py-4 sm:px-6">
          <div className="min-w-0">
            {title ? (
              <h2 className="font-[family-name:var(--font-montserrat)] text-base font-semibold tracking-tight text-[var(--admin-text)] sm:text-lg">
                {title}
              </h2>
            ) : null}
            {description ? <p className="mt-1 text-sm text-[var(--admin-text-muted)]">{description}</p> : null}
          </div>
          {headerActions ? <div className="flex shrink-0 flex-wrap gap-2">{headerActions}</div> : null}
        </div>
      ) : null}
      <div className="px-5 py-5 sm:px-6">{children}</div>
    </section>
  )
}
