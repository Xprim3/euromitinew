"use client"

import { AdminDialog, AdminDialogActions } from "./AdminDialog"
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
 * Destructive confirmation preset built on {@link AdminDialog}.
 * For non-destructive or editable flows, use `AdminDialog` directly with your own footer.
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
  return (
    <AdminDialog
      open={open}
      onClose={onCancel}
      title={title}
      description={description}
      size="sm"
      footer={({ close }) => (
        <AdminDialogActions>
          <button type="button" className={cnDs(dsBtnTertiary)} onClick={close}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={cnDs(dsBtnDanger)}
            onClick={() => {
              onConfirm()
              close()
            }}
          >
            {confirmLabel}
          </button>
        </AdminDialogActions>
      )}
    />
  )
}
