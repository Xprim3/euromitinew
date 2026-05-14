"use client"

import { useEffect, useId, useLayoutEffect, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"

import { cnDs } from "./cn-ds"

const sizeClass = {
  sm: "w-[min(100%-2rem,28rem)]",
  md: "w-[min(100%-2rem,36rem)]",
  lg: "w-[min(100%-2rem,48rem)]",
} as const

export type AdminDialogSize = keyof typeof sizeClass

export type AdminDialogCloseHelpers = {
  /** Dismiss the modal (same path as Cancel, backdrop, or Escape). Parent should set `open` to false. */
  close: () => void
}

export type AdminDialogProps = {
  open: boolean
  /** Called when the modal should close (backdrop, Escape, Cancel, or `close()`). Keep idempotent. */
  onClose: () => void
  title: string
  description?: ReactNode
  /** Scrollable body — forms, lists, editors. */
  children?: ReactNode
  /**
   * Sticky footer — typically `AdminDialogActions` with buttons.
   * Pass a function to receive `close` for confirm flows without lifting state up.
   */
  footer?: ReactNode | ((helpers: AdminDialogCloseHelpers) => ReactNode)
  size?: AdminDialogSize
}

/**
 * Centered admin modal (div-based, not `<dialog>`) portaled to `document.body`.
 * Avoids native dialog sizing quirks; full-viewport backdrop + centered panel.
 */
export function AdminDialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: AdminDialogProps) {
  const titleId = useId()
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  const close = () => {
    onClose()
  }

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  useLayoutEffect(() => {
    if (!open) return
    const doc = document.documentElement
    const body = document.body
    const prevDocOverflow = doc.style.overflow
    const prevDocPaddingRight = doc.style.paddingRight
    const prevBodyOverflow = body.style.overflow

    const scrollbarWidth = window.innerWidth - doc.clientWidth
    doc.style.overflow = "hidden"
    body.style.overflow = "hidden"
    if (scrollbarWidth > 0) {
      doc.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      doc.style.overflow = prevDocOverflow
      doc.style.paddingRight = prevDocPaddingRight
      body.style.overflow = prevBodyOverflow
    }
  }, [open])

  const footerNode = typeof footer === "function" ? footer({ close }) : footer
  const hasBody = Boolean(children)

  if (!mounted || !open) return null

  return createPortal(
    <div
      className={cnDs(
        "euromiti-admin-portal-root fixed inset-0 z-[500] flex min-h-dvh w-full items-center justify-center overflow-x-hidden overflow-y-auto p-4"
      )}
      role="presentation"
    >
      <button
        type="button"
        tabIndex={-1}
        className="absolute inset-0 block min-h-full min-w-full cursor-default border-0 bg-black/40 p-0"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        className={cnDs(
          "euromiti-admin-ds euromiti-admin-dialog-surface pointer-events-auto relative z-10 mx-auto max-w-full",
          sizeClass[size],
          "flex max-h-[min(100dvh-2rem,85dvh)] flex-col rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 text-[var(--admin-text)] shadow-xl"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="shrink-0">
          <h2
            id={titleId}
            className="font-[family-name:var(--font-montserrat)] text-lg font-semibold text-[var(--admin-text)]"
          >
            {title}
          </h2>
          {description ? <div className="mt-2 text-sm text-[var(--admin-text-muted)]">{description}</div> : null}
        </header>

        {hasBody ? <div className="mt-4 min-h-0 flex-1 overflow-y-auto">{children}</div> : null}

        {footerNode ? (
          <div
            className={cnDs(
              "shrink-0",
              hasBody ? "mt-4 border-t border-[var(--admin-border)] pt-4" : "mt-6"
            )}
          >
            {footerNode}
          </div>
        ) : null}
      </div>
    </div>,
    document.body
  )
}

/** Right-aligned button row for `AdminDialog` footers. */
export function AdminDialogActions({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cnDs("flex flex-wrap justify-end gap-2", className)}>{children}</div>
}
