"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"

import type { RestaurantSaveState } from "@/app/admin/(panel)/restaurant/actions"
import { adminInputClass, adminLabelClass } from "@/components/admin/cn-admin"
import { ServicesSaveSubmitButton } from "@/components/admin/ServicesSaveSubmitButton"
import type { MenuSlotDraft, GallerySlotDraft } from "@/lib/data/restaurant-admin-slots"
import {
  ADMIN_RESTAURANT_GALLERY_SLOTS,
  ADMIN_RESTAURANT_MENU_SLOTS,
} from "@/lib/validations/restaurant-content"
import type { RestaurantContentRow } from "@/types/supabase-cms"

type RestaurantContentFormProps = {
  submitAction: (prev: RestaurantSaveState, fd: FormData) => Promise<RestaurantSaveState>
  initial: RestaurantContentRow
  heroPreviewUrl: string | null
  menuDrafts: MenuSlotDraft[]
  galleryDrafts: GallerySlotDraft[]
}

const initialState: RestaurantSaveState = { ok: null }

export function RestaurantContentForm({
  submitAction,
  initial,
  heroPreviewUrl,
  menuDrafts,
  galleryDrafts,
}: RestaurantContentFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(submitAction, initialState)

  const fieldErrors = state.ok === false && "fieldErrors" in state ? state.fieldErrors : undefined
  const hasFieldErrors = Boolean(fieldErrors && Object.values(fieldErrors).some((v) => v?.length))

  useEffect(() => {
    if (state.ok === true) router.refresh()
  }, [router, state.ok])

  const fileClassName =
    "block w-full max-w-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-2 file:text-sm file:text-white"

  return (
    <form action={formAction} className="max-w-4xl space-y-10 pb-24">
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
        <h2 className="font-heading font-semibold text-lg text-white">Page hero</h2>
        <div>
          <label className={adminLabelClass} htmlFor="hero_title">
            Title
          </label>
          <input id="hero_title" name="hero_title" defaultValue={initial.hero_title} className={adminInputClass} />
          {fieldErrors?.hero_title?.[0] ? (
            <p className="mt-1 text-red-400 text-xs">{fieldErrors.hero_title[0]}</p>
          ) : null}
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="hero_subtitle">
            Subtitle
          </label>
          <textarea
            id="hero_subtitle"
            name="hero_subtitle"
            rows={4}
            defaultValue={initial.hero_subtitle}
            className={`resize-y ${adminInputClass}`}
          />
          {fieldErrors?.hero_subtitle?.[0] ? (
            <p className="mt-1 text-red-400 text-xs">{fieldErrors.hero_subtitle[0]}</p>
          ) : null}
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="hero_description">
            Restaurant description (body under “Freshness · Redefined” + intro copy)
          </label>
          <p className="mb-2 text-xs text-zinc-500">
            Separate paragraphs with a blank line; shown in the editorial intro section before Skanom and pillars.
          </p>
          <textarea
            id="hero_description"
            name="hero_description"
            rows={10}
            defaultValue={initial.hero_description}
            className={`resize-y ${adminInputClass}`}
          />
          {fieldErrors?.hero_description?.[0] ? (
            <p className="mt-1 text-red-400 text-xs">{fieldErrors.hero_description[0]}</p>
          ) : null}
        </div>
        <div>
          {heroPreviewUrl ? (
            <div className="relative mb-4 max-h-52 max-w-lg overflow-hidden rounded-lg border border-zinc-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroPreviewUrl} alt="" className="max-h-52 w-full object-cover" />
            </div>
          ) : (
            <p className="mb-4 text-sm text-zinc-500">No hero image in CMS — site uses homepage default visual.</p>
          )}
          <label className={adminLabelClass} htmlFor="hero_image">
            Replace hero image
          </label>
          <input id="hero_image" name="hero_image" type="file" accept="image/*" className={fileClassName} />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="hero_image_alt">
            Alt text (new upload)
          </label>
          <input id="hero_image_alt" name="hero_image_alt" className={adminInputClass} />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="clear_hero_image" className="size-4 rounded border-zinc-600" />
          Remove hero image (falls back on site)
        </label>
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Menu highlights</h2>
        <p className="text-xs text-zinc-500">
          Up to {ADMIN_RESTAURANT_MENU_SLOTS} cards. Rows with empty title <em>and</em> body are skipped. Images are
          optional (design fallbacks fill missing art).
        </p>
        {menuDrafts.map((slot, i) => (
          <div key={i} className="space-y-3 border-zinc-800 border-t pt-5 first:border-t-0 first:pt-0">
            <p className="font-medium text-sm text-zinc-400">Item {i + 1}</p>
            <div>
              <label className={adminLabelClass} htmlFor={`menu_title_${i}`}>
                Title
              </label>
              <input id={`menu_title_${i}`} name={`menu_title_${i}`} defaultValue={slot.title} className={adminInputClass} />
            </div>
            <div>
              <label className={adminLabelClass} htmlFor={`menu_body_${i}`}>
                Description
              </label>
              <textarea
                id={`menu_body_${i}`}
                name={`menu_body_${i}`}
                rows={3}
                defaultValue={slot.body}
                className={`resize-y ${adminInputClass}`}
              />
            </div>
            <input type="hidden" name={`menu_media_id_${i}`} value={slot.mediaId} />
            {slot.previewUrl ? (
              <div className="relative max-h-40 max-w-sm overflow-hidden rounded-lg border border-zinc-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slot.previewUrl} alt="" className="max-h-40 w-full object-cover" />
              </div>
            ) : null}
            <div>
              <label className={adminLabelClass} htmlFor={`menu_image_${i}`}>
                Image
              </label>
              <input id={`menu_image_${i}`} name={`menu_image_${i}`} type="file" accept="image/*" className={fileClassName} />
            </div>
            <div>
              <label className={adminLabelClass} htmlFor={`menu_image_alt_${i}`}>
                Alt (new upload)
              </label>
              <input id={`menu_image_alt_${i}`} name={`menu_image_alt_${i}`} className={adminInputClass} />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" name={`menu_clear_image_${i}`} className="size-4 rounded border-zinc-600" />
              Remove image reference for this row
            </label>
          </div>
        ))}
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Gallery (Atmosphere mosaic)</h2>
        <p className="text-xs text-zinc-500">
          Exactly {ADMIN_RESTAURANT_GALLERY_SLOTS} ordered tiles mapped to the dark “Atmosphere” band. Clearing a slot
          leaves fewer images saved; the public site pads with defaults.
        </p>
        {galleryDrafts.map((slot, i) => (
          <div key={i} className="space-y-3 border-zinc-800 border-t pt-5 first:border-t-0 first:pt-0">
            <p className="font-medium text-sm text-zinc-400">Tile {i + 1}</p>
            <input type="hidden" name={`gallery_media_id_${i}`} value={slot.mediaId} />
            {slot.previewUrl ? (
              <div className="relative max-h-44 max-w-lg overflow-hidden rounded-lg border border-zinc-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slot.previewUrl} alt="" className="max-h-44 w-full object-cover" />
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No image — public page uses mosaic default for this tile.</p>
            )}
            <div>
              <label className={adminLabelClass} htmlFor={`gallery_image_${i}`}>
                Replace image
              </label>
              <input
                id={`gallery_image_${i}`}
                name={`gallery_image_${i}`}
                type="file"
                accept="image/*"
                className={fileClassName}
              />
            </div>
            <div>
              <label className={adminLabelClass} htmlFor={`gallery_image_alt_${i}`}>
                Alt (new upload)
              </label>
              <input id={`gallery_image_alt_${i}`} name={`gallery_image_alt_${i}`} className={adminInputClass} />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" name={`gallery_clear_${i}`} className="size-4 rounded border-zinc-600" />
              Remove this tile on save
            </label>
          </div>
        ))}
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Opening hours &amp; contact</h2>
        <div>
          <label className={adminLabelClass} htmlFor="opening_hours">
            Opening hours
          </label>
          <textarea
            id="opening_hours"
            name="opening_hours"
            rows={4}
            defaultValue={initial.opening_hours}
            className={`resize-y ${adminInputClass}`}
          />
          {fieldErrors?.opening_hours?.[0] ? (
            <p className="mt-1 text-red-400 text-xs">{fieldErrors.opening_hours[0]}</p>
          ) : null}
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="contact_phone">
            Phone
          </label>
          <input id="contact_phone" name="contact_phone" defaultValue={initial.contact_phone ?? ""} className={adminInputClass} />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="contact_email">
            Email
          </label>
          <input
            id="contact_email"
            name="contact_email"
            type="email"
            defaultValue={initial.contact_email ?? ""}
            className={adminInputClass}
          />
          {fieldErrors?.contact_email?.[0] ? (
            <p className="mt-1 text-red-400 text-xs">{fieldErrors.contact_email[0]}</p>
          ) : null}
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="contact_notes">
            Notes (optional)
          </label>
          <textarea
            id="contact_notes"
            name="contact_notes"
            rows={3}
            defaultValue={initial.contact_notes ?? ""}
            className={`resize-y ${adminInputClass}`}
          />
        </div>
      </section>

      <ServicesSaveSubmitButton label="Save restaurant page" pendingLabel="Saving…" />
    </form>
  )
}
