"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"

import type { LocationSaveState } from "@/app/admin/(panel)/locations/actions"
import { adminInputClass, adminLabelClass } from "@/components/admin/cn-admin"
import { amenityLabels } from "@/components/cards/amenity-icons"
import type { GallerySlotDraft } from "@/lib/data/locations-admin-shared"
import { ADMIN_LOCATION_GALLERY_SLOTS, LOCATION_AMENITY_KEYS } from "@/lib/validations/location-admin"
import type { LocationRow } from "@/types/supabase-cms"
import type { LocationAmenity } from "@/types/public"

import { ServicesSaveSubmitButton } from "./ServicesSaveSubmitButton"

const initialState: LocationSaveState = { ok: null }

type LocationEditorFormProps = {
  mode: "create" | "edit"
  submitAction: (prev: LocationSaveState, formData: FormData) => Promise<LocationSaveState>
  initial: LocationRow | null
  gallerySlots: GallerySlotDraft[]
}

export function LocationEditorForm({ mode, submitAction, initial, gallerySlots }: LocationEditorFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(submitAction, initialState)

  const fieldErrors = state.ok === false && "fieldErrors" in state ? state.fieldErrors : undefined
  const hasFieldErrors = Boolean(fieldErrors && Object.values(fieldErrors).some((v) => v?.length))

  useEffect(() => {
    if (mode === "edit" && state.ok === true) router.refresh()
  }, [mode, router, state.ok])

  const fileClassName =
    "block w-full max-w-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-2 file:text-sm file:text-white"

  const amenityKeys = LOCATION_AMENITY_KEYS as readonly string[]
  const svcSet = new Set(
    initial?.services?.filter((s): s is LocationAmenity => amenityKeys.includes(s)) ?? []
  )

  const saveLabel =
    mode === "create"
      ? "Create location"
      : "Save location"

  return (
    <form action={formAction} className="max-w-4xl space-y-10 pb-24">
      {mode === "edit" && initial ? <input type="hidden" name="id" value={initial.id} /> : null}

      {state.ok === true ? (
        <p
          role="status"
          className="rounded-lg border border-emerald-500/35 bg-emerald-500/15 px-4 py-3 text-emerald-100 text-sm"
        >
          {state.message}
        </p>
      ) : null}
      {state.ok === false && "message" in state ? (
        <p
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-100 text-sm"
        >
          {state.message}
        </p>
      ) : null}
      {hasFieldErrors ? (
        <p className="rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-400">
          Fix the highlighted fields and try again.
        </p>
      ) : null}

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Basics</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={adminLabelClass} htmlFor="slug">
              URL slug
            </label>
            <input
              id="slug"
              name="slug"
              required
              defaultValue={initial?.slug ?? ""}
              placeholder="prishtina-flagship"
              className={adminInputClass}
            />
            {fieldErrors?.slug?.[0] ? <p className="mt-1 text-red-400 text-xs">{fieldErrors.slug[0]}</p> : null}
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="city">
              City (label)
            </label>
            <input id="city" name="city" required defaultValue={initial?.city ?? ""} className={adminInputClass} />
            {fieldErrors?.city?.[0] ? <p className="mt-1 text-red-400 text-xs">{fieldErrors.city[0]}</p> : null}
          </div>
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="sort_order">
            Sort order (lower first)
          </label>
          <input
            id="sort_order"
            name="sort_order"
            type="number"
            min={0}
            defaultValue={initial?.sort_order ?? 0}
            className={adminInputClass}
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={mode === "create" ? true : Boolean(initial?.is_active)}
            className="size-4 rounded border-zinc-600"
          />
          Active (visible on public `/locations`)
        </label>
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Locations page copy</h2>
        <div>
          <label className={adminLabelClass} htmlFor="page_heading">
            Section heading (H2)
          </label>
          <input
            id="page_heading"
            name="page_heading"
            defaultValue={initial?.page_heading ?? ""}
            placeholder="e.g. Prishtina flagship location"
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="page_summary">
            Lead paragraph
          </label>
          <textarea
            id="page_summary"
            name="page_summary"
            rows={4}
            defaultValue={initial?.page_summary ?? ""}
            className={`resize-y ${adminInputClass}`}
          />
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Contact &amp; hours</h2>
        <div>
          <label className={adminLabelClass} htmlFor="address">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            required
            defaultValue={initial?.address ?? ""}
            className={`resize-y ${adminInputClass}`}
          />
          {fieldErrors?.address?.[0] ? <p className="mt-1 text-red-400 text-xs">{fieldErrors.address[0]}</p> : null}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={adminLabelClass} htmlFor="phone">
              Phone
            </label>
            <input id="phone" name="phone" required defaultValue={initial?.phone ?? ""} className={adminInputClass} />
            {fieldErrors?.phone?.[0] ? <p className="mt-1 text-red-400 text-xs">{fieldErrors.phone[0]}</p> : null}
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="contact_email">
              Email
            </label>
            <input
              id="contact_email"
              name="contact_email"
              type="email"
              defaultValue={initial?.contact_email ?? ""}
              className={adminInputClass}
            />
            {fieldErrors?.contact_email?.[0] ? (
              <p className="mt-1 text-red-400 text-xs">{fieldErrors.contact_email[0]}</p>
            ) : null}
          </div>
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="opening_hours">
            Opening hours
          </label>
          <textarea
            id="opening_hours"
            name="opening_hours"
            rows={4}
            required
            defaultValue={initial?.opening_hours ?? ""}
            className={`resize-y ${adminInputClass}`}
          />
          {fieldErrors?.opening_hours?.[0] ? (
            <p className="mt-1 text-red-400 text-xs">{fieldErrors.opening_hours[0]}</p>
          ) : null}
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="google_maps_url">
            Google Maps link
          </label>
          <input
            id="google_maps_url"
            name="google_maps_url"
            required
            defaultValue={initial?.google_maps_url ?? ""}
            className={adminInputClass}
          />
          {fieldErrors?.google_maps_url?.[0] ? (
            <p className="mt-1 text-red-400 text-xs">{fieldErrors.google_maps_url[0]}</p>
          ) : null}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Services offered</h2>
        <ul className="flex flex-wrap gap-2">
          {LOCATION_AMENITY_KEYS.map((k) => (
            <li key={k}>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950/50 px-2.5 py-1.5 text-xs text-zinc-300">
                <input
                  type="checkbox"
                  name={`svc_${k}`}
                  defaultChecked={svcSet.has(k)}
                  className="rounded border-zinc-600"
                />
                {amenityLabels[k]}
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Main image</h2>
        {mode === "edit" && initial?.main_media_id ? (
          <p className="text-xs text-zinc-500">Current image is linked. Upload a new file to replace it.</p>
        ) : null}
        <div>
          <label className={adminLabelClass} htmlFor="main_media">
            Image file
          </label>
          <input id="main_media" name="main_media" type="file" accept="image/*" className={fileClassName} />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="main_image_alt">
            Alt text (new upload)
          </label>
          <input id="main_image_alt" name="main_image_alt" className={adminInputClass} />
        </div>
        {mode === "edit" ? (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" name="clear_main_media" className="size-4 rounded border-zinc-600" />
            Remove main image (public page falls back to design stock)
          </label>
        ) : null}
      </section>

      <section className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div>
          <h2 className="font-heading font-semibold text-lg text-white">Gallery ({ADMIN_LOCATION_GALLERY_SLOTS} slots)</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Slots are ordered left-to-right, top row first. Check “Remove slot” to drop an image; upload a file to add
            or replace. Uncheck remove before saving if you keep the current image.
          </p>
        </div>
        {Array.from({ length: ADMIN_LOCATION_GALLERY_SLOTS }, (_, i) => {
          const slot = gallerySlots[i] ?? { mediaId: "", publicUrl: "", alt: "" }
          return (
            <div key={i} className="space-y-3 border-zinc-800 border-t pt-4 first:border-t-0 first:pt-0">
              <p className="font-medium text-sm text-zinc-400">Slot {i + 1}</p>
              {slot.publicUrl ? (
                <div className="relative max-h-40 max-w-lg overflow-hidden rounded-lg border border-zinc-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={slot.publicUrl} alt="" className="max-h-40 w-full object-cover" />
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No image in this slot.</p>
              )}
              <input type="hidden" name={`gallery_media_id_${i}`} value={slot.mediaId} />
              <div>
                <label className={adminLabelClass} htmlFor={`gallery_file_${i}`}>
                  Upload / replace
                </label>
                <input id={`gallery_file_${i}`} name={`gallery_file_${i}`} type="file" accept="image/*" className={fileClassName} />
              </div>
              <div>
                <label className={adminLabelClass} htmlFor={`gallery_image_alt_${i}`}>
                  Alt text (new upload)
                </label>
                <input id={`gallery_image_alt_${i}`} name={`gallery_image_alt_${i}`} className={adminInputClass} />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                <input type="checkbox" name={`gallery_clear_${i}`} className="size-4 rounded border-zinc-600" />
                Remove this slot on save
              </label>
            </div>
          )
        })}
      </section>

      <ServicesSaveSubmitButton
        label={saveLabel}
        pendingLabel={mode === "create" ? "Creating…" : "Saving…"}
      />
    </form>
  )
}
