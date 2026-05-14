"use client"

import { useActionState, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import type { LocationSaveState } from "@/app/admin/(panel)/locations/actions"
import {
  AdminContentGrid,
  AdminSectionCard,
  ErrorMessage,
  FileUploadInput,
  MultiSelectInput,
  SaveBar,
  SelectInput,
  SuccessMessage,
  TextareaInput,
  TextInput,
  ToggleInput,
} from "@/components/admin/design-system"
import type { LocationRow } from "@/types/supabase-cms"

const initialState: LocationSaveState = { ok: null }

const cityOptions = [
  { value: "Prishtina", label: "Prishtina" },
  { value: "Ferizaj", label: "Ferizaj" },
  { value: "Gjilan", label: "Gjilan" },
] as const

const locationServiceOptions = [
  { value: "petrol", label: "Petrol" },
  { value: "restaurant", label: "Restaurant" },
  { value: "carwash", label: "Carwash" },
  { value: "mini_market", label: "Mini Market" },
] as const

type LocationEditorFormProps = {
  mode: "create" | "edit"
  submitAction: (prev: LocationSaveState, formData: FormData) => Promise<LocationSaveState>
  initial: LocationRow | null
  mainPreviewUrl?: string | null
  mainImageAlt?: string
}

export function LocationEditorForm({
  mode,
  submitAction,
  initial,
  mainPreviewUrl = null,
  mainImageAlt = "",
}: LocationEditorFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(submitAction, initialState)
  const initialSelectedServices = useMemo(
    () =>
      (initial?.services ?? []).filter((service) =>
        locationServiceOptions.some((option) => option.value === service)
      ),
    [initial?.services]
  )
  const [selectedServices, setSelectedServices] = useState<string[]>(initialSelectedServices)

  const fieldErrors = state.ok === false && "fieldErrors" in state ? state.fieldErrors : undefined
  const hasFieldErrors = Boolean(fieldErrors && Object.values(fieldErrors).some((v) => v?.length))

  useEffect(() => {
    if (mode === "edit" && state.ok === true) router.refresh()
  }, [mode, router, state.ok])

  const saveLabel =
    mode === "create"
      ? "Create location"
      : "Save location"

  return (
    <form ref={formRef} action={formAction} className="space-y-6 pb-24">
      {mode === "edit" && initial ? <input type="hidden" name="id" value={initial.id} /> : null}
      {selectedServices.map((service) => (
        <input key={service} type="hidden" name={`svc_${service}`} value="true" />
      ))}

      {state.ok === true ? (
        <SuccessMessage title="Location saved">
          {state.message}
        </SuccessMessage>
      ) : null}
      {state.ok === false && "message" in state ? (
        <ErrorMessage title="Could not save location">
          {state.message}
        </ErrorMessage>
      ) : null}
      {hasFieldErrors ? (
        <ErrorMessage title="Check the highlighted fields">
          Fix the highlighted fields and try again.
        </ErrorMessage>
      ) : null}

      <AdminSectionCard
        title={mode === "create" ? "Create location" : `Edit ${initial?.city || "location"}`}
        description="Manage public location content, services, map link, visibility, and main image."
      >
        <div className="space-y-8">
          <AdminContentGrid columns={2}>
            <SelectInput
              label="City / name"
              name="city"
              options={cityOptions}
              defaultValue={initial?.city || "Prishtina"}
              required
              error={fieldErrors?.city?.[0]}
            />
            <TextInput
              label="URL slug"
              name="slug"
              required
              defaultValue={initial?.slug ?? ""}
              placeholder="prishtina"
              helperText="Use lowercase letters, numbers, and hyphens."
              error={fieldErrors?.slug?.[0]}
            />
            <TextInput
              label="Display heading"
              name="page_heading"
              defaultValue={initial?.page_heading ?? ""}
              placeholder="Prishtina flagship location"
              helperText="Optional headline for the public locations page."
              error={fieldErrors?.page_heading?.[0]}
              className="sm:col-span-2"
            />
            <TextareaInput
              label="Description"
              name="page_summary"
              rows={4}
              defaultValue={initial?.page_summary ?? ""}
              maxLength={2400}
              showCharacterCount
              error={fieldErrors?.page_summary?.[0]}
              className="sm:col-span-2"
            />
            <TextInput
              label="Sort order"
              name="sort_order"
              type="number"
              min={0}
              defaultValue={initial?.sort_order ?? 0}
              helperText="Lower numbers appear first."
              error={fieldErrors?.sort_order?.[0]}
            />
            <ToggleInput
              label="Active on public site"
              name="is_active"
              description="Inactive locations stay in admin but are hidden from the public locations page."
              checkedLabel="Active"
              uncheckedLabel="Inactive"
              defaultChecked={mode === "create" ? true : Boolean(initial?.is_active)}
            />
          </AdminContentGrid>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Contact & hours" description="Details shown on the public locations page.">
        <div className="space-y-5">
          <TextareaInput
            label="Address"
            name="address"
            rows={3}
            required
            defaultValue={initial?.address ?? ""}
            error={fieldErrors?.address?.[0]}
          />
          <AdminContentGrid columns={2}>
            <TextInput
              label="Phone"
              name="phone"
              required
              defaultValue={initial?.phone ?? ""}
              placeholder="+383 ..."
              error={fieldErrors?.phone?.[0]}
            />
            <TextInput
              label="Email"
              name="contact_email"
              type="email"
              defaultValue={initial?.contact_email ?? ""}
              placeholder="location@euromiti.com"
              error={fieldErrors?.contact_email?.[0]}
            />
          </AdminContentGrid>
          <TextareaInput
            label="Opening hours"
            name="opening_hours"
            rows={4}
            required
            defaultValue={initial?.opening_hours ?? ""}
            placeholder="Mon–Sun: 06:00–23:00"
            error={fieldErrors?.opening_hours?.[0]}
          />
          <TextInput
            label="Google Maps link"
            name="google_maps_url"
            required
            defaultValue={initial?.google_maps_url ?? ""}
            placeholder="https://maps.google.com/..."
            error={fieldErrors?.google_maps_url?.[0]}
          />
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Available services" description="Select the services offered at this location.">
        <MultiSelectInput
          label="Services offered"
          name="services"
          options={locationServiceOptions}
          value={selectedServices}
          onChange={setSelectedServices}
          required
          helperText="These chips appear on the public location cards."
          error={!selectedServices.length ? "Select at least one service before saving." : undefined}
        />
      </AdminSectionCard>

      <AdminSectionCard
        title="Main image"
        description="Single image for this location — used on `/locations` and the homepage location previews."
      >
        <div className="space-y-4">
          <FileUploadInput
            label="Main image upload"
            name="main_media"
            previewUrl={mainPreviewUrl}
            previewAlt={`${initial?.city || "Location"} main image`}
            removeInputName={mode === "edit" ? "clear_main_media" : undefined}
            helperText="Upload a new image to replace the current location photo."
          />
          <TextInput
            label="Main image alt text"
            name="main_image_alt"
            placeholder="Describe the location image"
            defaultValue={mainImageAlt}
          />
        </div>
      </AdminSectionCard>

      <SaveBar
        hasUnsavedChanges
        unsavedLabel={mode === "create" ? "New location draft" : "Review location changes"}
        cancelLabel="Reset changes"
        onCancel={() => {
          formRef.current?.reset()
          setSelectedServices(initialSelectedServices)
        }}
        submitLabel={saveLabel}
        submitPendingLabel={mode === "create" ? "Creating…" : "Saving…"}
      />
    </form>
  )
}
