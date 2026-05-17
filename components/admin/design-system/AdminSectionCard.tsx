import type { ReactNode } from "react"

import { cnDs } from "./cn-ds"

export type AdminSectionCardProps = {
  title?: string
  description?: string
  /** Right side of header (e.g. small button). */
  headerActions?: ReactNode
  children?: ReactNode
  className?: string
  /** Optional anchor for in-page links / deep links from docs. */
  id?: string
}

/**
 * White card with optional titled header — use to group related fields or content blocks.
 */
export function AdminSectionCard({ title, description, headerActions, children, className, id }: AdminSectionCardProps) {
  const hasHeader = Boolean(title || description || headerActions)
  const hasBody = children != null

  return (
    <section
      id={id}
      className={cnDs(
        "rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow-card)]",
        className
      )}
    >
      {hasHeader ? (
        <div
          className={cnDs(
            "flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3 sm:px-6 sm:py-4",
            hasBody && "border-[var(--admin-border)] border-b"
          )}
        >
          <div className="min-w-0 flex-1">
            {title ? (
              <h2 className="font-[family-name:var(--font-montserrat)] text-base font-semibold tracking-tight text-[var(--admin-text)] sm:text-lg">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-1 min-w-0 break-words text-sm text-[var(--admin-text-muted)]">{description}</p>
            ) : null}
          </div>
          {headerActions ? (
            <div className="flex min-w-0 w-full max-w-full shrink-0 flex-wrap gap-2 sm:w-auto sm:justify-end [&_a]:max-w-full [&_a]:break-words [&_button]:max-w-full">
              {headerActions}
            </div>
          ) : null}
        </div>
      ) : null}
      {hasBody ? <div className="min-w-0 px-4 py-5 sm:px-6">{children}</div> : null}
    </section>
  )
}
