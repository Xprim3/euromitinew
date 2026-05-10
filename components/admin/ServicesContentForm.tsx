"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { saveServicesContent, type ServicesSaveState } from "@/app/admin/(panel)/services/actions"
import { petrolHighlightsTextFromDb } from "@/lib/data/services-content-public"
import type { ServicesContentRow } from "@/types/supabase-cms"

import { adminInputClass, adminLabelClass } from "./cn-admin"
import { ServicesSaveSubmitButton } from "./ServicesSaveSubmitButton"

export type ServicesMediaPreviews = {
  petrol: string | null
  restaurant: string | null
  carwash: string | null
  miniMarket: string | null
}

type ServicesContentFormProps = {
  initial: ServicesContentRow
  previews: ServicesMediaPreviews
}

function PreviewThumb({ url }: { url: string | null }) {
  if (!url) return <p className="text-sm text-zinc-500">No image assigned (public page uses design default).</p>
  return (
    <div className="relative max-h-44 max-w-lg overflow-hidden rounded-lg border border-zinc-700">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" className="max-h-44 w-full object-cover" />
    </div>
  )
}

const initialActionState: ServicesSaveState = { ok: null }

export function ServicesContentForm({ initial, previews }: ServicesContentFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(saveServicesContent, initialActionState)

  const fieldErrors = state.ok === false && "fieldErrors" in state ? state.fieldErrors : undefined
  const hasFieldErrors = Boolean(fieldErrors && Object.values(fieldErrors).some((x) => x?.length))

  useEffect(() => {
    if (state.ok === true) router.refresh()
  }, [router, state.ok])

  const bulletsDefault = petrolHighlightsTextFromDb(initial.petrol_highlights_json)
  const fileClassName =
    "block w-full max-w-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-2 file:text-sm file:text-white"

  return (
    <form action={formAction} className="max-w-4xl space-y-10">
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
        <h2 className="font-heading font-semibold text-lg text-white">Page hero (text)</h2>
        <p className="text-xs text-zinc-500">
          The large hero image on `/services` stays the default marketing visual; only the title and subtitle are
          editable here.
        </p>
        <div>
          <label className={adminLabelClass} htmlFor="hero_page_title">
            Title
          </label>
          <input
            id="hero_page_title"
            name="hero_page_title"
            defaultValue={initial.hero_page_title}
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="hero_page_subtitle">
            Subtitle
          </label>
          <textarea
            id="hero_page_subtitle"
            name="hero_page_subtitle"
            rows={3}
            defaultValue={initial.hero_page_subtitle}
            className={`resize-y ${adminInputClass}`}
          />
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Petrol station</h2>
        <div>
          <label className={adminLabelClass} htmlFor="petrol_section_title">
            Title
          </label>
          <input
            id="petrol_section_title"
            name="petrol_section_title"
            defaultValue={initial.petrol_section_title}
            className={adminInputClass}
          />
          {fieldErrors?.petrol_section_title?.length ? (
            <p className="mt-1 text-red-400 text-xs">{fieldErrors.petrol_section_title[0]}</p>
          ) : null}
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="petrol_description">
            Description
          </label>
          <textarea
            id="petrol_description"
            name="petrol_description"
            rows={5}
            defaultValue={initial.petrol_description}
            className={`resize-y ${adminInputClass}`}
          />
          {fieldErrors?.petrol_description?.length ? (
            <p className="mt-1 text-red-400 text-xs">{fieldErrors.petrol_description[0]}</p>
          ) : null}
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="petrol_highlights">
            Bullet points
          </label>
          <p className="mb-2 text-xs text-zinc-500">One bullet per line (max 24 lines, 300 chars each).</p>
          <textarea
            id="petrol_highlights"
            name="petrol_highlights"
            rows={6}
            defaultValue={bulletsDefault}
            className={`resize-y ${adminInputClass}`}
          />
          {fieldErrors?.petrol_highlights?.length ? (
            <p className="mt-1 text-red-400 text-xs">{fieldErrors.petrol_highlights[0]}</p>
          ) : null}
        </div>
        <PreviewThumb url={previews.petrol} />
        <div>
          <label className={adminLabelClass} htmlFor="petrol_image">
            Replace image
          </label>
          <input id="petrol_image" name="petrol_image" type="file" accept="image/*" className={fileClassName} />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="petrol_image_alt">
            Alt text (new upload)
          </label>
          <input id="petrol_image_alt" name="petrol_image_alt" className={adminInputClass} />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="clear_petrol_image" className="size-4 rounded border-zinc-600" />
          Remove image reference (falls back on site)
        </label>
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Restaurant</h2>
        <div>
          <label className={adminLabelClass} htmlFor="restaurant_section_title">
            Title
          </label>
          <input
            id="restaurant_section_title"
            name="restaurant_section_title"
            defaultValue={initial.restaurant_section_title}
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="restaurant_description">
            Description
          </label>
          <textarea
            id="restaurant_description"
            name="restaurant_description"
            rows={5}
            defaultValue={initial.restaurant_description}
            className={`resize-y ${adminInputClass}`}
          />
        </div>
        <PreviewThumb url={previews.restaurant} />
        <div>
          <label className={adminLabelClass} htmlFor="restaurant_image">
            Replace image
          </label>
          <input id="restaurant_image" name="restaurant_image" type="file" accept="image/*" className={fileClassName} />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="restaurant_image_alt">
            Alt text (new upload)
          </label>
          <input id="restaurant_image_alt" name="restaurant_image_alt" className={adminInputClass} />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="clear_restaurant_image" className="size-4 rounded border-zinc-600" />
          Remove image reference (falls back on site)
        </label>
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Carwash</h2>
        <div>
          <label className={adminLabelClass} htmlFor="carwash_section_title">
            Title
          </label>
          <input
            id="carwash_section_title"
            name="carwash_section_title"
            defaultValue={initial.carwash_section_title}
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="carwash_description">
            Description
          </label>
          <textarea
            id="carwash_description"
            name="carwash_description"
            rows={5}
            defaultValue={initial.carwash_description}
            className={`resize-y ${adminInputClass}`}
          />
        </div>
        <PreviewThumb url={previews.carwash} />
        <div>
          <label className={adminLabelClass} htmlFor="carwash_image">
            Replace image
          </label>
          <input id="carwash_image" name="carwash_image" type="file" accept="image/*" className={fileClassName} />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="carwash_image_alt">
            Alt text (new upload)
          </label>
          <input id="carwash_image_alt" name="carwash_image_alt" className={adminInputClass} />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="clear_carwash_image" className="size-4 rounded border-zinc-600" />
          Remove image reference (falls back on site)
        </label>
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Mini market</h2>
        <div>
          <label className={adminLabelClass} htmlFor="mini_market_section_title">
            Title
          </label>
          <input
            id="mini_market_section_title"
            name="mini_market_section_title"
            defaultValue={initial.mini_market_section_title}
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="mini_market_description">
            Description
          </label>
          <textarea
            id="mini_market_description"
            name="mini_market_description"
            rows={5}
            defaultValue={initial.mini_market_description}
            className={`resize-y ${adminInputClass}`}
          />
        </div>
        <PreviewThumb url={previews.miniMarket} />
        <div>
          <label className={adminLabelClass} htmlFor="mini_market_image">
            Replace image
          </label>
          <input
            id="mini_market_image"
            name="mini_market_image"
            type="file"
            accept="image/*"
            className={fileClassName}
          />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="mini_market_image_alt">
            Alt text (new upload)
          </label>
          <input id="mini_market_image_alt" name="mini_market_image_alt" className={adminInputClass} />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="clear_mini_market_image" className="size-4 rounded border-zinc-600" />
          Remove image reference (falls back on site)
        </label>
      </section>

      <ServicesSaveSubmitButton />
    </form>
  )
}
