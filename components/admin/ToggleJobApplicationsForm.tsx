"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { setJobApplicationsOpenAction, type JobToggleState } from "@/app/admin/(panel)/careers/actions"
import { cnDs } from "@/components/admin/design-system"

const initialState: JobToggleState = { ok: null }

type ToggleJobApplicationsFormProps = {
  id: string
  isActive: boolean
  title: string
}

export function ToggleJobApplicationsForm({ id, isActive, title }: ToggleJobApplicationsFormProps) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(setJobApplicationsOpenAction, initialState)

  useEffect(() => {
    if (state.ok === true) router.refresh()
  }, [router, state.ok])

  return (
    <form action={formAction} className="inline-flex flex-col items-end gap-1">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="is_active" value={isActive ? "false" : "true"} />
      <button
        type="submit"
        disabled={pending}
        aria-pressed={isActive}
        title={isActive ? `Pause applications for ${title}` : `Enable applications for ${title}`}
        className={cnDs(
          "min-h-9 rounded-md border px-3 text-xs font-semibold transition disabled:opacity-60",
          isActive
            ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
        )}
      >
        {pending ? "…" : isActive ? "Applications on" : "Applications off"}
      </button>
      {state.ok === false && "message" in state ? (
        <span className="max-w-[10rem] text-right text-[0.65rem] leading-snug text-red-700" role="alert">
          {state.message}
        </span>
      ) : null}
    </form>
  )
}
