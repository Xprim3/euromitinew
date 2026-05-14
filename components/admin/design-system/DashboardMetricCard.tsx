import type { ReactNode } from "react"

import { cnDs } from "./cn-ds"

export type DashboardMetricCardProps = {
  label: string
  value: ReactNode
  hint?: string
  /** Optional icon in top-right */
  icon?: ReactNode
  className?: string
}

/**
 * Compact stat tile for dashboard grids — label, large value, optional hint.
 */
export function DashboardMetricCard({ label, value, hint, icon, className }: DashboardMetricCardProps) {
  return (
    <div
      className={cnDs(
        "relative rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow-card)] sm:p-5",
        className
      )}
    >
      {icon ? <div className="absolute top-4 right-4 text-[var(--admin-text-muted)]">{icon}</div> : null}
      <p className="text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-montserrat)] text-xl font-bold tracking-tight text-[var(--admin-text)] sm:text-2xl md:text-3xl">
        {value}
      </p>
      {hint ? <p className="mt-1.5 text-xs leading-snug text-[var(--admin-text-muted)] sm:mt-2 sm:text-sm">{hint}</p> : null}
    </div>
  )
}
