import { useId, type ReactNode } from "react"

import { cnDs } from "./cn-ds"

export type FormSectionProps = {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

/**
 * Groups related controls with a heading — use inside long editor pages instead of raw `<fieldset>`.
 * For card chrome + actions in header, prefer `AdminSectionCard`.
 */
export function FormSection({ title, description, children, className }: FormSectionProps) {
  const headingId = useId()
  return (
    <section
      role="group"
      aria-labelledby={headingId}
      className={cnDs(
        "rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-[var(--admin-shadow-card)] sm:p-6",
        className
      )}
    >
      <div className="mb-4 border-[var(--admin-border)] border-b pb-4">
        <h2 id={headingId} className="font-[family-name:var(--font-montserrat)] text-base font-semibold text-[var(--admin-text)]">
          {title}
        </h2>
        {description ? <p className="mt-1 text-sm text-[var(--admin-text-muted)]">{description}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}
