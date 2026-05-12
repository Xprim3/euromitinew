"use client"

import { useFormStatus } from "react-dom"
import type { ReactNode } from "react"
import Link from "next/link"
import { AlertCircle, CheckCircle2 } from "lucide-react"

import { cnDs } from "./cn-ds"
import { dsBtnGhost, dsBtnPrimary } from "./ds-button-classes"

function SaveBarSubmitButton({ label, pendingLabel }: { label: string; pendingLabel?: string }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className={cnDs(dsBtnPrimary)} disabled={pending}>
      {pending ? (pendingLabel ?? "Saving…") : label}
    </button>
  )
}

export type SaveBarProps = {
  /** Left side: unsaved hint, last saved text, etc. */
  leading?: ReactNode
  /** Extra buttons before Cancel (e.g. “Preview”). */
  middle?: ReactNode
  onCancel?: () => void
  cancelHref?: string
  cancelLabel?: string
  hasUnsavedChanges?: boolean
  unsavedLabel?: string
  savedLabel?: string
  /** When inside `<form action={serverAction}>`, omit and use default submit. */
  submitLabel?: string
  submitPendingLabel?: string
  /** If false, do not render default submit (you provide custom submit in `middle`). */
  showSubmit?: boolean
  className?: string
}

/**
 * Sticky bottom action bar for long forms — primary Save + optional Cancel (tertiary/ghost).
 * Default submit uses `useFormStatus` for pending label when used inside a form.
 */
export function SaveBar({
  leading,
  middle,
  onCancel,
  cancelHref,
  cancelLabel = "Cancel",
  hasUnsavedChanges = false,
  unsavedLabel = "Unsaved changes",
  savedLabel = "No unsaved changes",
  submitLabel = "Save changes",
  submitPendingLabel,
  showSubmit = true,
  className,
}: SaveBarProps) {
  const status = leading ?? (
    <span
      className={cnDs(
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold",
        hasUnsavedChanges
          ? "bg-amber-100 text-amber-800"
          : "bg-emerald-100 text-emerald-800"
      )}
    >
      {hasUnsavedChanges ? <AlertCircle className="size-3.5" aria-hidden /> : <CheckCircle2 className="size-3.5" aria-hidden />}
      {hasUnsavedChanges ? unsavedLabel : savedLabel}
    </span>
  )

  return (
    <div
      className={cnDs(
        "sticky bottom-0 z-20 border-[var(--admin-border)] border-t bg-[var(--admin-surface)]/95 px-4 py-3 shadow-[0_-4px_12px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:px-6",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-[var(--admin-content-max)] flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1 text-sm text-[var(--admin-text-muted)]">{status}</div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {middle}
          {cancelHref ? (
            <Link href={cancelHref} className={cnDs(dsBtnGhost)}>
              {cancelLabel}
            </Link>
          ) : onCancel ? (
            <button type="button" className={cnDs(dsBtnGhost)} onClick={onCancel}>
              {cancelLabel}
            </button>
          ) : null}
          {showSubmit ? <SaveBarSubmitButton label={submitLabel} pendingLabel={submitPendingLabel} /> : null}
        </div>
      </div>
    </div>
  )
}
