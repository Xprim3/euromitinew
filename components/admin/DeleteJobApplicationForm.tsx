"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"

import { deleteJobApplicationAction, type JobDeleteState } from "@/app/admin/(panel)/careers/actions"
import { ConfirmDeleteModal, ErrorMessage, cnDs, dsBtnDanger } from "@/components/admin/design-system"

const initial: JobDeleteState = { ok: null }

function RemoveTriggerButton({ label, onClick }: { label: string; onClick: () => void }) {
  const { pending } = useFormStatus()
  return (
    <button type="button" className={cnDs(dsBtnDanger, "min-h-9 px-3 text-xs")} disabled={pending} onClick={onClick}>
      {pending ? "Removing…" : label}
    </button>
  )
}

export function DeleteJobApplicationForm({
  id,
  label,
  triggerLabel = "Remove",
  redirectOnSuccess = false,
  onSuccess,
}: {
  id: string
  /** Shown in the confirmation dialog (e.g. name and email). */
  label: string
  /** Compact label on the trigger button (table rows often use "Remove"). */
  triggerLabel?: string
  redirectOnSuccess?: boolean
  onSuccess?: () => void
}) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [open, setOpen] = useState(false)
  const [state, formAction] = useActionState(deleteJobApplicationAction, initial)

  useEffect(() => {
    if (state.ok !== true) return
    onSuccess?.()
    if (redirectOnSuccess) router.replace("/admin/careers#candidates")
    else router.refresh()
  }, [onSuccess, redirectOnSuccess, router, state.ok])

  return (
    <>
      <form ref={formRef} action={formAction} className="inline-block">
        <input type="hidden" name="id" value={id} />
        <RemoveTriggerButton label={triggerLabel} onClick={() => setOpen(true)} />
        {state.ok === false ? (
          <ErrorMessage title="Remove failed" className="mt-2">
            {state.message}
          </ErrorMessage>
        ) : null}
      </form>
      <ConfirmDeleteModal
        open={open}
        title="Remove applicant?"
        description={`Remove "${label}" and delete their CV from storage? This cannot be undone.`}
        confirmLabel="Remove applicant"
        onCancel={() => setOpen(false)}
        onConfirm={() => formRef.current?.requestSubmit()}
      />
    </>
  )
}
