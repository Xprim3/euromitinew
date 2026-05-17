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
  TextInput,
  ToggleInput,
} from "@/components/admin/design-system"
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

  const saveLabel = mode === "create" ? "Add position" : "Save position"

  return (
    <form ref={formRef} action={formAction} className="space-y-6 pb-24">
      {mode === "edit" && initial ? <input type="hidden" name="id" value={initial.id} /> : null}

      {state.ok === true ? <SuccessMessage title="Position saved">{state.message}</SuccessMessage> : null}
      {state.ok === false && "message" in state ? (
        <ErrorMessage title="Could not save position">{state.message}</ErrorMessage>
      ) : null}
      {hasFieldErrors ? <ErrorMessage title="Check the highlighted fields">Fix the highlighted fields and try again.</ErrorMessage> : null}

      <AdminSectionCard
        title={mode === "create" ? "New position" : "Edit position"}
        description="Titles appear in the public apply-form dropdown. Use the toggle to allow or pause applications for this role."
      >
        <div className="space-y-5">
          <TextInput
            label="Position title"
            name="title"
            required
            defaultValue={initial?.title ?? ""}
            error={fieldErrors?.title?.[0]}
            helperText="Example: Kamarier / Kamarierë"
          />
          <AdminContentGrid columns={2}>
            <SelectInput
              label="Location label"
              name="location_city"
              required
              options={locationOptions}
              defaultValue={initial?.location_city ?? JOB_LOCATION_OPTIONS[0]}
              error={fieldErrors?.location_city?.[0]}
            />
            <ToggleInput
              label="Accept applications"
              name="is_active"
              defaultChecked={mode === "create" ? true : Boolean(initial?.is_active)}
              checkedLabel="Open"
              uncheckedLabel="Paused"
              helperText="When paused, this position is hidden from the public dropdown and cannot receive new applications."
            />
          </AdminContentGrid>
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
