import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react"

import { cnDs } from "./cn-ds"

export type AdminTableProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

/** Scrollable white card wrapping a semantic `<table>`. */
export function AdminTable({ children, className, ...rest }: AdminTableProps) {
  return (
    <div
      className={cnDs(
        "overflow-hidden rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow-card)]",
        className
      )}
      {...rest}
    >
      <div className="overflow-x-auto overscroll-x-contain touch-pan-x">
        <table className="w-full min-w-[32rem] border-collapse text-left text-sm">{children}</table>
      </div>
    </div>
  )
}

export function AdminTableHead({ children, className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cnDs("border-[var(--admin-border)] border-b bg-slate-50", className)} {...rest}>
      {children}
    </thead>
  )
}

export function AdminTableBody({ children, className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cnDs("divide-y divide-[var(--admin-border)]", className)} {...rest}>
      {children}
    </tbody>
  )
}

export function AdminTableRow({ children, className, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cnDs(
        "transition-colors hover:bg-slate-50/80 [&>td]:align-middle",
        className
      )}
      {...rest}
    >
      {children}
    </tr>
  )
}

export function AdminTableTh({ children, className, ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cnDs(
        "px-3 py-3 text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase whitespace-normal sm:whitespace-nowrap sm:px-4 sm:py-3.5",
        className
      )}
      {...rest}
    >
      {children}
    </th>
  )
}

export function AdminTableTd({ children, className, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cnDs("px-3 py-3 text-[var(--admin-text)] sm:px-4 sm:py-3.5", className)} {...rest}>
      {children}
    </td>
  )
}
