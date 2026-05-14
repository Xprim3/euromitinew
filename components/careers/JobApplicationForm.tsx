"use client"

import { useActionState, useEffect, useRef } from "react"
import { useFormStatus } from "react-dom"
import Link from "next/link"

import { submitJobApplicationAction, type JobApplicationSaveState } from "@/app/(website)/careers/actions"
import { Button } from "@/components/ui/button"

const initialState: JobApplicationSaveState = { ok: null }

function SubmitRow() {
  const { pending } = useFormStatus()
  return (
    <div className="flex flex-wrap items-center gap-3 pt-1">
      <Button type="submit" variant="default" disabled={pending} className="min-w-40">
        {pending ? "Duke dërguar…" : "Dërgo aplikimin"}
      </Button>
      <p className="text-muted-foreground text-xs">PDF deri në 5 MB.</p>
    </div>
  )
}

type JobApplicationFormProps = {
  jobSlug: string
}

export function JobApplicationForm({ jobSlug }: JobApplicationFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(submitJobApplicationAction, initialState)

  const fieldErrors = state.ok === false && "fieldErrors" in state ? state.fieldErrors : undefined

  useEffect(() => {
    if (state.ok === true) formRef.current?.reset()
  }, [state.ok])

  if (state.ok === true) {
    return (
      <div
        className="rounded-lg border border-success/35 bg-success/8 px-5 py-6 text-foreground shadow-(--shadow-euromiti-soft) md:px-6"
        role="status"
      >
        <p className="font-heading text-lg font-bold text-foreground">Aplikimi u pranua</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{state.message}</p>
        <Button className="mt-5" variant="outlinePrimary" render={<Link href="/careers" />}>
          Shiko pozicionet e tjera
        </Button>
      </div>
    )
  }

  return (
    <form ref={formRef} action={formAction} encType="multipart/form-data" className="space-y-5">
      <input type="hidden" name="job_slug" value={jobSlug} />

      {state.ok === false && "message" in state ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-destructive text-sm" role="alert">
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="ja-full_name" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Emri i plotë <span className="text-brand-red-vivid">*</span>
          </label>
          <input
            id="ja-full_name"
            name="full_name"
            required
            autoComplete="name"
            aria-invalid={Boolean(fieldErrors?.full_name?.length)}
            className="w-full rounded-md border border-border/80 bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-ring/40 transition focus-visible:ring-2"
          />
          {fieldErrors?.full_name?.[0] ? (
            <p className="text-destructive text-xs">{fieldErrors.full_name[0]}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="ja-email" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Email <span className="text-brand-red-vivid">*</span>
          </label>
          <input
            id="ja-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={Boolean(fieldErrors?.email?.length)}
            className="w-full rounded-md border border-border/80 bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-ring/40 transition focus-visible:ring-2"
          />
          {fieldErrors?.email?.[0] ? <p className="text-destructive text-xs">{fieldErrors.email[0]}</p> : null}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="ja-phone" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Telefoni
          </label>
          <input
            id="ja-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={Boolean(fieldErrors?.phone?.length)}
            className="w-full rounded-md border border-border/80 bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-ring/40 transition focus-visible:ring-2"
          />
          {fieldErrors?.phone?.[0] ? <p className="text-destructive text-xs">{fieldErrors.phone[0]}</p> : null}
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="ja-cover_letter" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Letër motivimi (opsionale)
          </label>
          <textarea
            id="ja-cover_letter"
            name="cover_letter"
            rows={4}
            aria-invalid={Boolean(fieldErrors?.cover_letter?.length)}
            className="w-full resize-y rounded-md border border-border/80 bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-ring/40 transition focus-visible:ring-2"
          />
          {fieldErrors?.cover_letter?.[0] ? (
            <p className="text-destructive text-xs">{fieldErrors.cover_letter[0]}</p>
          ) : null}
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="ja-cv" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            CV (PDF) <span className="text-brand-red-vivid">*</span>
          </label>
          <input
            id="ja-cv"
            name="cv"
            type="file"
            accept="application/pdf,.pdf"
            required
            aria-invalid={Boolean(fieldErrors?.cv?.length)}
            className="block w-full max-w-md text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:font-semibold file:text-primary-foreground"
          />
          {fieldErrors?.cv?.[0] ? <p className="text-destructive text-xs">{fieldErrors.cv[0]}</p> : null}
        </div>
      </div>

      <SubmitRow />
    </form>
  )
}
