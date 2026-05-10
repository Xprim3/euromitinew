import Link from "next/link"
import type { ReactNode } from "react"

import { cnDs } from "./cn-ds"

export type QuickActionCardProps = {
  title: string
  description?: string
  /** If set, the whole card is a link (preferred for quick navigation). */
  href?: string
  onClick?: () => void
  icon?: ReactNode
  className?: string
}

const baseClass =
  "flex w-full items-start gap-4 rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 text-left shadow-[var(--admin-shadow-card)] transition-shadow outline-none hover:shadow-[var(--admin-shadow-hover)] focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)] focus-visible:ring-offset-2"

/**
 * Tappable row/card for dashboard shortcuts (link or button).
 */
export function QuickActionCard({ title, description, href, onClick, icon, className }: QuickActionCardProps) {
  const inner = (
    <>
      {icon ? <div className="mt-0.5 shrink-0 text-[var(--admin-accent-active)]">{icon}</div> : null}
      <div className="min-w-0">
        <p className="font-semibold text-[var(--admin-text)]">{title}</p>
        {description ? <p className="mt-1 text-sm text-[var(--admin-text-muted)]">{description}</p> : null}
      </div>
    </>
  )

  if (href) {
    return (
      <Link href={href} className={cnDs(baseClass, className)}>
        {inner}
      </Link>
    )
  }

  return (
    <button type="button" className={cnDs(baseClass, className)} onClick={onClick}>
      {inner}
    </button>
  )
}
