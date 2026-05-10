"use client"

import { useEffect, useRef } from "react"

import { cnDs } from "./cn-ds"
import { dsBtnDanger, dsBtnTertiary } from "./ds-button-classes"

export type ConfirmDeleteModalProps = {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  /** Called when the dialog is dismissed (Cancel, Escape, backdrop) — not fired from the Confirm button path before `onConfirm`. */
  onCancel: () => void
}

/**
 * Native `<dialog>` modal. `close` event → `onCancel` for backdrop/Escape/Cancel.
 * Confirm runs `onConfirm()` then closes the dialog (still triggers `onCancel` for cleanup — keep parent handlers idempotent).
 */
export function ConfirmDeleteModal({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open) {
      if (!el.open) el.showModal()
    } else if (el.open) {
      el.close()
    }
  }, [open])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onDialogClose = () => {
      onCancel()
    }
    el.addEventListener("close", onDialogClose)
    return () => el.removeEventListener("close", onDialogClose)
  }, [onCancel])

  return (
    <dialog
      ref={ref}
      className={cnDs(
        "w-[min(100%-2rem,28rem)] rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 text-[var(--admin-text)] shadow-xl backdrop:bg-black/40"
      )}
      onCancel={(e) => {
        e.preventDefault()
        ref.current?.close()
      }}
    >
      <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-semibold text-[var(--admin-text)]">{title}</h2>
      {description ? <p className="mt-2 text-sm text-[var(--admin-text-muted)]">{description}</p> : null}
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <button type="button" className={cnDs(dsBtnTertiary)} onClick={() => ref.current?.close()}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={cnDs(dsBtnDanger)}
          onClick={() => {
            onConfirm()
            ref.current?.close()
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
