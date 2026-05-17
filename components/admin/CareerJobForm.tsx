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
import {
  JOB_LOCATION_OPTIONS,
  jobLocationAdminLabel,
  type JobLocationOption,
} from "@/lib/validations/careers-admin"
import type { JobRow } from "@/types/supabase-cms"

const initialState: JobSaveState = { ok: null }

const locationOptions = JOB_LOCATION_OPTIONS.map((location) => ({
  value: location,
  label: jobLocationAdminLabel(location),
}))

function resolveDefaultLocation(initial: JobRow | null, defaultLocation?: string): JobLocationOption {
  if (initial?.location_city && JOB_LOCATION_OPTIONS.includes(initial.location_city as JobLocationOption)) {
    return initial.location_city as JobLocationOption
  }
  if (defaultLocation && JOB_LOCATION_OPTIONS.includes(defaultLocation as JobLocationOption)) {
    return defaultLocation as JobLocationOption
  }
  return JOB_LOCATION_OPTIONS[0]
}

type CareerJobFormProps = {
  mode: "create" | "edit"
  submitAction: (prev: JobSaveState, formData: FormData) => Promise<JobSaveState>
  initial: JobRow | null
  defaultLocation?: string
}

export function CareerJobForm({ mode, submitAction, initial, defaultLocation }: CareerJobFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(submitAction, initialState)

  const fieldErrors = state.ok === false && "fieldErrors" in state ? state.fieldErrors : undefined
  const hasFieldErrors = Boolean(fieldErrors && Object.values(fieldErrors).some((v) => v?.length))
  const locationDefault = resolveDefaultLocation(initial, defaultLocation)

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
        description="Add the same role separately for each city (e.g. Kamarier in Ferizaj and Kamarier in Prishtinë are two entries)."
      >
        <div className="space-y-5">
          <SelectInput
            label="Location"
            name="location_city"
            required
            options={locationOptions}
            defaultValue={locationDefault}
            error={fieldErrors?.location_city?.[0]}
            helperText="Pick the station city — applicants will choose this location first on the public form."
          />
          <TextInput
            label="Position title"
            name="title"
            required
            defaultValue={initial?.title ?? ""}
            error={fieldErrors?.title?.[0]}
            helperText="Example: Kamarier / Kamarierë"
          />
          <AdminContentGrid columns={1}>
            <ToggleInput
              label="Accept applications"
              name="is_active"
              defaultChecked={mode === "create" ? true : Boolean(initial?.is_active)}
              checkedLabel="Open"
              uncheckedLabel="Paused"
              helperText="When paused, this position is hidden from the public dropdown for that city."
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
