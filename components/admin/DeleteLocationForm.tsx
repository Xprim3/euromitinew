"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"

import { deleteLocationAction, type LocationDeleteState } from "@/app/admin/(panel)/locations/actions"
import { ConfirmDeleteModal } from "@/components/admin/design-system"
import { dsBtnDanger } from "@/components/admin/design-system/ds-button-classes"

const initial: LocationDeleteState = { ok: null }

function DeleteSubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className={dsBtnDanger} disabled={pending}>
      {pending ? "Deleting…" : "Delete"}
    </button>
  )
}

export function DeleteLocationForm({ id, label }: { id: string; label: string }) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [state, formAction] = useActionState(deleteLocationAction, initial)

  useEffect(() => {
    if (state.ok === true) router.refresh()
  }, [router, state.ok])

  return (
    <form ref={formRef} action={formAction} className="inline">
      <input type="hidden" name="id" value={id} />
      <button type="button" className={dsBtnDanger} onClick={() => setConfirmOpen(true)}>
        Delete
      </button>
      <ConfirmDeleteModal
        open={confirmOpen}
        title={`Delete ${label}?`}
        description="This permanently removes the location from the admin and public locations page. This cannot be undone."
        confirmLabel="Delete location"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          formRef.current?.requestSubmit()
        }}
      />
      <div className="hidden">
        <DeleteSubmitButton />
      </div>
      {state.ok === false ? <p className="mt-1 text-red-700 text-xs">{state.message}</p> : null}
    </form>
  )
}
