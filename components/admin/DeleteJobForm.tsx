"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"

import { deleteJobAction, type JobDeleteState } from "@/app/admin/(panel)/careers/actions"
import { ConfirmDeleteModal, ErrorMessage, cnDs, dsBtnDanger } from "@/components/admin/design-system"

const initial: JobDeleteState = { ok: null }

function DeleteTriggerButton({ onClick }: { onClick: () => void }) {
  const { pending } = useFormStatus()
  return (
    <button type="button" className={cnDs(dsBtnDanger, "min-h-9 px-3 text-xs")} disabled={pending} onClick={onClick}>
      {pending ? "Deleting…" : "Delete job"}
    </button>
  )
}

export function DeleteJobForm({
  id,
  label,
  redirectOnSuccess = false,
}: {
  id: string
  label: string
  redirectOnSuccess?: boolean
}) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [open, setOpen] = useState(false)
  const [state, formAction] = useActionState(deleteJobAction, initial)

  useEffect(() => {
    if (state.ok !== true) return
    if (redirectOnSuccess) router.replace("/admin/careers")
    else router.refresh()
  }, [redirectOnSuccess, router, state.ok])

  return (
    <>
      <form ref={formRef} action={formAction} className="inline-block">
        <input type="hidden" name="id" value={id} />
        <DeleteTriggerButton onClick={() => setOpen(true)} />
        {state.ok === false ? (
          <ErrorMessage title="Delete failed" className="mt-2">
            {state.message}
          </ErrorMessage>
        ) : null}
      </form>
      <ConfirmDeleteModal
        open={open}
        title="Delete job?"
        description={`Delete "${label}" permanently? This cannot be undone.`}
        confirmLabel="Delete job"
        onCancel={() => setOpen(false)}
        onConfirm={() => formRef.current?.requestSubmit()}
      />
    </>
  )
}
