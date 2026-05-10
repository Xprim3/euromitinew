import type { ReactNode } from "react"

import { cnDs } from "./cn-ds"

export type AdminContentGridProps = {
  children: ReactNode
  /** Default: responsive 1 → 2 → 3 columns. */
  columns?: 1 | 2 | 3 | 4 | "12"
  className?: string
}

const colClass: Record<NonNullable<AdminContentGridProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
  "12": "grid-cols-1 gap-4 md:grid-cols-12 md:gap-6",
}

/**
 * Responsive grid for dashboard cards, form columns, or 12-col layouts (`columns="12"`).
 * With `columns="12"`, use `className="md:col-span-6"` etc. on children.
 */
export function AdminContentGrid({ children, columns = 3, className }: AdminContentGridProps) {
  return (
    <div
      className={cnDs(
        "grid gap-4 md:gap-6",
        columns === "12" ? colClass["12"] : colClass[columns ?? 3],
        className
      )}
    >
      {children}
    </div>
  )
}
