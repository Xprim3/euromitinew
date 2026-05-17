import type { ReactNode } from "react"

import { cnDs } from "./cn-ds"

export type AdminCollapsibleSectionProps = {
  title: string
  description?: string
  children: ReactNode
  /** When true, section starts expanded. Defaults to collapsed. */
  defaultOpen?: boolean
  className?: string
}

/**
 * Collapsible admin card — native `<details>` so fields stay in the DOM when collapsed (form submit safe).
 */
export function AdminCollapsibleSection({
  title,
  description,
  children,
  defaultOpen = false,
  className,
}: AdminCollapsibleSectionProps) {
  return (
    <details
      className={cnDs(
        "group rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow-card)]",
        className
      )}
      {...(defaultOpen ? { open: true } : {})}
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 marker:hidden sm:px-6 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          <span className="block font-[family-name:var(--font-montserrat)] text-base font-semibold tracking-tight text-[var(--admin-text)] sm:text-lg">
            {title}
          </span>
          {description ? (
            <span className="mt-1 block text-sm text-[var(--admin-text-muted)]">{description}</span>
          ) : null}
        </span>
        <span
          className="mt-1 shrink-0 rounded-full border border-[var(--admin-border)] px-2 py-0.5 text-xs font-semibold text-[var(--admin-text-muted)] group-open:hidden"
          aria-hidden
        >
          Hap
        </span>
        <span
          className="mt-1 hidden shrink-0 rounded-full border border-[var(--admin-border)] px-2 py-0.5 text-xs font-semibold text-[var(--admin-text-muted)] group-open:inline-flex"
          aria-hidden
        >
          Mbyll
        </span>
      </summary>
      <div className="border-[var(--admin-border)] border-t px-5 py-5 sm:px-6">{children}</div>
    </details>
  )
}
