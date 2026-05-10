"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"

import { deleteNewsPostAction, type NewsPostDeleteState } from "@/app/admin/(panel)/news/actions"
import { Button } from "@/components/ui/button"

const initial: NewsPostDeleteState = { ok: null }

function DeleteSubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" variant="destructive" size="sm" disabled={pending}>
      {pending ? "Deleting…" : "Delete post"}
    </Button>
  )
}

export function DeleteNewsPostForm({ id, slug, label }: { id: string; slug: string; label: string }) {
  const router = useRouter()
  const [state, formAction] = useActionState(deleteNewsPostAction, initial)

  useEffect(() => {
    if (state.ok === true) router.replace("/admin/news")
  }, [router, state.ok])

  return (
    <form
      action={formAction}
      className="inline-block"
      onSubmit={(e) => {
        if (!confirm(`Delete “${label}” permanently? This cannot be undone.`)) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="slug" value={slug} />
      <DeleteSubmitButton />
      {state.ok === false ? <p className="mt-2 text-red-400 text-xs">{state.message}</p> : null}
    </form>
  )
}
