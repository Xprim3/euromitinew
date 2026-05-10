import type { ReactNode } from "react"

import { cnDs } from "./cn-ds"

export type EmptyStateProps = {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

/**
 * Centered empty placeholder inside cards or full-width table areas.
 */
export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cnDs(
        "flex flex-col items-center justify-center rounded-[var(--admin-radius-card)] border border-dashed border-[var(--admin-border-strong)] bg-slate-50/60 px-6 py-14 text-center",
        className
      )}
    >
      {icon ? <div className="mb-4 text-[var(--admin-text-muted)]">{icon}</div> : null}
      <p className="font-[family-name:var(--font-montserrat)] text-base font-semibold text-[var(--admin-text)]">{title}</p>
      {description ? <p className="mt-2 max-w-md text-sm text-[var(--admin-text-muted)]">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
