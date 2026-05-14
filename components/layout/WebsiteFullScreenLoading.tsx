import type { ReactNode } from "react"

type WebsiteFullScreenLoadingProps = {
  /** When set, replaces the default spinner (e.g. route skeleton inside the overlay). */
  children?: ReactNode
}

/**
 * Full-viewport loading shell for the public site: covers header + main + footer visually,
 * while an in-flow spacer keeps `main` tall so the footer does not jump before content streams.
 */
export function WebsiteFullScreenLoading({ children }: WebsiteFullScreenLoadingProps) {
  return (
    <>
      <div
        className="min-h-[calc(100dvh-5rem)] w-full flex-1 shrink-0"
        aria-hidden
      />

      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-brand-shell-deep text-white"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        {children ?? (
          <>
            <div
              className="size-10 animate-spin rounded-full border-2 border-white/20 border-t-brand-accent-soft"
              aria-hidden
            />
            <p className="text-sm text-white/70">Loading…</p>
          </>
        )}
      </div>
    </>
  )
}
