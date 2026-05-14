import type { ReactNode } from "react"

import { cnDs } from "./cn-ds"

export type AdminRecordCardField = {
  label: string
  value: ReactNode
}

export type AdminRecordCard = {
  id: string
  /** Primary line (e.g. name or title). */
  title: string
  fields: AdminRecordCardField[]
  footer?: ReactNode
}

export type AdminRecordCardListProps = {
  records: AdminRecordCard[]
  /** Visually hidden list label for assistive tech. */
  ariaLabel?: string
  className?: string
}

/**
 * Stacked record cards for **small viewports** — pair with `hidden md:block` + `AdminTable`
 * for the same data so tables stay readable on phones without horizontal scrolling.
 */
export function AdminRecordCardList({ records, ariaLabel, className }: AdminRecordCardListProps) {
  return (
    <ul
      role="list"
      aria-label={ariaLabel}
      className={cnDs("flex min-w-0 flex-col gap-3 md:hidden", className)}
    >
      {records.map((r) => (
        <li
          key={r.id}
          className="min-w-0 rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow-card)]"
        >
          <p className="min-w-0 break-words font-semibold text-[var(--admin-text)]">{r.title}</p>
          <dl className="mt-3 space-y-2.5 text-sm">
            {r.fields.map((f) => (
              <div key={f.label} className="min-w-0">
                <dt className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[var(--admin-text-muted)]">
                  {f.label}
                </dt>
                <dd className="mt-0.5 min-w-0 break-words text-[var(--admin-text)]">{f.value}</dd>
              </div>
            ))}
          </dl>
          {r.footer ? <div className="mt-4 flex min-w-0 flex-wrap gap-2">{r.footer}</div> : null}
        </li>
      ))}
    </ul>
  )
}
