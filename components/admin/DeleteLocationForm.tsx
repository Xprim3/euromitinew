"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"

import { deleteLocationAction, type LocationDeleteState } from "@/app/admin/(panel)/locations/actions"
import { Button } from "@/components/ui/button"

const initial: LocationDeleteState = { ok: null }

function DeleteSubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" variant="destructive" size="sm" disabled={pending}>
      {pending ? "Deleting…" : "Delete"}
    </Button>
  )
}

export function DeleteLocationForm({ id, label }: { id: string; label: string }) {
  const router = useRouter()
  const [state, formAction] = useActionState(deleteLocationAction, initial)

  useEffect(() => {
    if (state.ok === true) router.refresh()
  }, [router, state.ok])

  return (
    <form
      action={formAction}
      className="inline"
      onSubmit={(e) => {
        if (!confirm(`Delete “${label}” permanently? This cannot be undone.`)) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <DeleteSubmitButton />
      {state.ok === false ? <p className="mt-1 text-red-400 text-xs">{state.message}</p> : null}
    </form>
  )
}
