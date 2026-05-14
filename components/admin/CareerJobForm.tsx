"use client"

import { useActionState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import type { JobSaveState } from "@/app/admin/(panel)/careers/actions"
import {
  AdminContentGrid,
  AdminSectionCard,
  ErrorMessage,
  SaveBar,
  SelectInput,
  SuccessMessage,
  TextareaInput,
  TextInput,
  ToggleInput,
} from "@/components/admin/design-system"
import { adminTextFromJsonArray } from "@/lib/data/careers-format"
import { JOB_LOCATION_OPTIONS } from "@/lib/validations/careers-admin"
import type { JobRow } from "@/types/supabase-cms"

const initialState: JobSaveState = { ok: null }

type CareerJobFormProps = {
  mode: "create" | "edit"
  submitAction: (prev: JobSaveState, formData: FormData) => Promise<JobSaveState>
  initial: JobRow | null
}

const locationOptions = JOB_LOCATION_OPTIONS.map((location) => ({ value: location, label: location }))

export function CareerJobForm({ mode, submitAction, initial }: CareerJobFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(submitAction, initialState)

  const fieldErrors = state.ok === false && "fieldErrors" in state ? state.fieldErrors : undefined
  const hasFieldErrors = Boolean(fieldErrors && Object.values(fieldErrors).some((v) => v?.length))

  useEffect(() => {
    if (mode === "edit" && state.ok === true) router.refresh()
  }, [mode, router, state.ok])

  const descriptionDefault = adminTextFromJsonArray(initial?.description)
  const requirementsDefault = adminTextFromJsonArray(initial?.requirements, "\n")
  const saveLabel = mode === "create" ? "Create job" : "Save job"

  return (
    <form ref={formRef} action={formAction} className="space-y-6 pb-24">
      {mode === "edit" && initial ? <input type="hidden" name="id" value={initial.id} /> : null}

      {state.ok === true ? <SuccessMessage title="Job saved">{state.message}</SuccessMessage> : null}
      {state.ok === false && "message" in state ? (
        <ErrorMessage title="Could not save job">{state.message}</ErrorMessage>
      ) : null}
      {hasFieldErrors ? <ErrorMessage title="Check the highlighted fields">Fix the highlighted fields and try again.</ErrorMessage> : null}

      <AdminSectionCard title="Job details" description="Create the role card and its content for Careers management.">
        <div className="space-y-5">
          <TextInput
            label="Job title"
            name="title"
            required
            defaultValue={initial?.title ?? ""}
            error={fieldErrors?.title?.[0]}
          />
          <AdminContentGrid columns={2}>
            <SelectInput
              label="Location"
              name="location_city"
              required
              options={locationOptions}
              defaultValue={initial?.location_city ?? JOB_LOCATION_OPTIONS[0]}
              error={fieldErrors?.location_city?.[0]}
            />
            <ToggleInput
              label="Job status"
              name="is_active"
              defaultChecked={mode === "create" ? true : Boolean(initial?.is_active)}
              checkedLabel="Active"
              uncheckedLabel="Inactive"
              helperText="Inactive jobs are hidden from /careers and cannot receive new applications. Turn on to list the opening on the public site."
            />
          </AdminContentGrid>
          <TextareaInput
            label="Short summary"
            name="summary"
            rows={3}
            defaultValue={initial?.summary ?? ""}
            maxLength={1000}
            showCharacterCount
            helperText="Optional short overview for admin lists or future public cards."
          />
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Description & requirements" description="Keep description paragraphs readable and requirements scannable.">
        <div className="space-y-5">
          <TextareaInput
            label="Description"
            name="description"
            required
            rows={10}
            defaultValue={descriptionDefault}
            placeholder="Describe the role, responsibilities, and expectations..."
            helperText="Separate paragraphs with a blank line."
            error={fieldErrors?.description?.[0]}
          />
          <TextareaInput
            label="Requirements"
            name="requirements"
            required
            rows={8}
            defaultValue={requirementsDefault}
            placeholder="One requirement per line"
            helperText="One requirement per line."
            error={fieldErrors?.requirements?.[0]}
          />
        </div>
      </AdminSectionCard>

      <SaveBar
        cancelLabel="Reset changes"
        onCancel={() => formRef.current?.reset()}
        submitLabel={saveLabel}
        submitPendingLabel="Saving…"
      />
    </form>
  )
}
