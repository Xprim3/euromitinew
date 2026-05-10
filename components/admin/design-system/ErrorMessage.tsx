import type { ReactNode } from "react"

import { cnDs } from "./cn-ds"

export type ErrorMessageProps = {
  children: ReactNode
  title?: string
  className?: string
}

/** Form-level or page-level error (role="alert"). */
export function ErrorMessage({ children, title, className }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={cnDs(
        "rounded-[var(--admin-radius-card)] border border-red-200 bg-red-50 px-4 py-3 text-red-950 text-sm",
        className
      )}
    >
      {title ? <p className="font-semibold text-red-900">{title}</p> : null}
      <div className={title ? "mt-1 text-red-900/90" : ""}>{children}</div>
    </div>
  )
}
