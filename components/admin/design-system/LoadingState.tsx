import { cnDs } from "./cn-ds"

export type LoadingStateProps = {
  label?: string
  className?: string
}

/** Centered spinner for panels, tables, or full-page admin loading. */
export function LoadingState({ label = "Loading…", className }: LoadingStateProps) {
  return (
    <div className={cnDs("flex flex-col items-center justify-center gap-4 py-16", className)}>
      <div
        className="size-10 animate-spin rounded-full border-2 border-[var(--admin-border-strong)] border-t-[var(--admin-accent-active)]"
        aria-hidden
      />
      <p className="text-sm text-[var(--admin-text-muted)]">{label}</p>
    </div>
  )
}
