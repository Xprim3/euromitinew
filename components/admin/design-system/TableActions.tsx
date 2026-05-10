import type { ReactNode } from "react"

import { cnDs } from "./cn-ds"

export type TableActionsProps = {
  children: ReactNode
  className?: string
}

/**
 * Right-aligned compact action cluster for table rows (icon buttons, text links).
 * Place inside the last `AdminTableTd` with `text-right`.
 */
export function TableActions({ children, className }: TableActionsProps) {
  return <div className={cnDs("flex flex-wrap items-center justify-end gap-1", className)}>{children}</div>
}
