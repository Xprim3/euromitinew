import type { ReactNode } from "react"

import { cnDs } from "./cn-ds"

export type SuccessMessageProps = {
  children: ReactNode
  title?: string
  className?: string
}

/** Inline success feedback after saves (role="status"). */
export function SuccessMessage({ children, title, className }: SuccessMessageProps) {
  return (
    <div
      role="status"
      className={cnDs(
        "rounded-[var(--admin-radius-card)] border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-950 text-sm",
        className
      )}
    >
      {title ? <p className="font-semibold text-emerald-900">{title}</p> : null}
      <div className={title ? "mt-1 text-emerald-900/90" : ""}>{children}</div>
    </div>
  )
}
