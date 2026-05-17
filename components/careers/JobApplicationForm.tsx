"use client"

import { useActionState, useEffect, useMemo, useRef, useState } from "react"
import { useFormStatus } from "react-dom"

import { submitJobApplicationAction, type JobApplicationSaveState } from "@/app/(website)/careers/actions"
import { CareerCvUploadField } from "@/components/careers/CareerCvUploadField"
import { Button } from "@/components/ui/button"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import type { JobApplicationOption } from "@/lib/data/careers-public"
import { jobApplicationLocationLabel } from "@/lib/data/careers-public"
import { JOB_LOCATION_OPTIONS } from "@/lib/validations/careers-admin"

const initialState: JobApplicationSaveState = { ok: null }

function SubmitRow() {
  const { pending } = useFormStatus()
  return (
    <div className="border-border/60 border-t pt-6">
      <Button type="submit" variant="default" size="lg" disabled={pending} className="w-full gap-2.5 shadow-(--shadow-euromiti-primary-sm)">
        <MaterialSymbol name={pending ? "hourglass_top" : "send"} className="text-[1.25rem]!" />
        {pending ? "Duke dërguar aplikimin…" : "Dërgo aplikimin"}
      </Button>
    </div>
  )
}

type JobApplicationFormProps = {
  positions: JobApplicationOption[]
  defaultSlug?: string
}

export function JobApplicationForm({ positions, defaultSlug }: JobApplicationFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(submitJobApplicationAction, initialState)
  const [locationCity, setLocationCity] = useState("")
  const [jobSlug, setJobSlug] = useState("")
  const [formResetKey, setFormResetKey] = useState(0)

  const fieldErrors = state.ok === false && "fieldErrors" in state ? state.fieldErrors : undefined

  const locationsAvailable = useMemo(() => {
    const inData = new Set(positions.map((p) => p.location_city))
    return JOB_LOCATION_OPTIONS.filter((loc) => inData.has(loc))
  }, [positions])

  const positionsForLocation = useMemo(
    () => positions.filter((p) => p.location_city === locationCity),
    [positions, locationCity]
  )

  useEffect(() => {
    if (!defaultSlug) return
    const match = positions.find((p) => p.slug === defaultSlug)
    if (match) {
      setLocationCity(match.location_city)
      setJobSlug(match.slug)
    }
  }, [defaultSlug, positions])

  useEffect(() => {
    if (state.ok === true) {
      formRef.current?.reset()
      setLocationCity("")
      setJobSlug("")
      setFormResetKey((k) => k + 1)
    }
  }, [state.ok])

  if (positions.length === 0) {
    return (
      <p className="rounded-lg border border-border/70 bg-muted/40 px-5 py-6 text-sm leading-relaxed text-muted-foreground">
        Aktualisht nuk pranojmë aplikime online për asnjë pozicion. Provoni përsëri më vonë ose na kontaktoni përmes faqes
        së kontaktit.
      </p>
    )
  }

  if (state.ok === true) {
    return (
      <div
        className="rounded-lg border border-success/35 bg-success/8 px-5 py-6 text-foreground shadow-(--shadow-euromiti-soft) md:px-6"
        role="status"
      >
        <p className="font-heading text-lg font-bold text-foreground">Aplikimi u pranua</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{state.message}</p>
      </div>
    )
  }

  const inputClass =
    "w-full rounded-md border border-border/80 bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-ring/40 transition focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60"

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {state.ok === false && "message" in state ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-destructive text-sm" role="alert">
          {state.message}
        </p>
      ) : null}

      <div className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="ja-location_city" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Lokacioni <span className="text-brand-red-vivid">*</span>
          </label>
          <select
            id="ja-location_city"
            name="location_city"
            required
            value={locationCity}
            onChange={(e) => {
              const next = e.target.value
              setLocationCity(next)
              setJobSlug((prev) => (positions.some((p) => p.slug === prev && p.location_city === next) ? prev : ""))
            }}
            aria-invalid={Boolean(fieldErrors?.location_city?.length)}
            className={inputClass}
          >
            <option value="" disabled>
              Zgjidhni lokacionin
            </option>
            {locationsAvailable.map((loc) => (
              <option key={loc} value={loc}>
                {jobApplicationLocationLabel(loc)}
              </option>
            ))}
          </select>
          {fieldErrors?.location_city?.[0] ? (
            <p className="text-destructive text-xs">{fieldErrors.location_city[0]}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="ja-job_slug" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Pozicioni <span className="text-brand-red-vivid">*</span>
          </label>
          <select
            id="ja-job_slug"
            name="job_slug"
            required
            value={jobSlug}
            disabled={!locationCity}
            onChange={(e) => setJobSlug(e.target.value)}
            aria-invalid={Boolean(fieldErrors?.job_slug?.length)}
            className={inputClass}
          >
            <option value="" disabled>
              {locationCity ? "Zgjidhni pozicionin" : "Së pari zgjidhni lokacionin"}
            </option>
            {positionsForLocation.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
          {fieldErrors?.job_slug?.[0] ? <p className="text-destructive text-xs">{fieldErrors.job_slug[0]}</p> : null}
        </div>
      </div>

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
            className={inputClass}
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
            className={inputClass}
          />
          {fieldErrors?.email?.[0] ? <p className="text-destructive text-xs">{fieldErrors.email[0]}</p> : null}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="ja-phone" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Telefoni <span className="text-brand-red-vivid">*</span>
          </label>
          <input
            id="ja-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            aria-invalid={Boolean(fieldErrors?.phone?.length)}
            className={inputClass}
          />
          {fieldErrors?.phone?.[0] ? <p className="text-destructive text-xs">{fieldErrors.phone[0]}</p> : null}
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="ja-cover_letter" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Mesazh (opsionale)
          </label>
          <textarea
            id="ja-cover_letter"
            name="cover_letter"
            rows={4}
            aria-invalid={Boolean(fieldErrors?.cover_letter?.length)}
            className={`${inputClass} resize-y`}
          />
          {fieldErrors?.cover_letter?.[0] ? (
            <p className="text-destructive text-xs">{fieldErrors.cover_letter[0]}</p>
          ) : null}
        </div>
        <div className="sm:col-span-2">
          <CareerCvUploadField key={formResetKey} error={fieldErrors?.cv?.[0]} />
        </div>
      </div>

      <SubmitRow />
    </form>
  )
}
