"use client"

import { useActionState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"

import { saveHomepageContent, type HomepageSaveState } from "@/app/admin/(panel)/homepage/actions"
import type { HomepageContentRow } from "@/types/supabase-cms"

import { adminInputClass, adminLabelClass } from "./cn-admin"
import { HomepageContentSubmitButton } from "./HomepageContentSubmitButton"

export type HomepageMediaPreviews = {
  hero: string | null
  servicesIntro: string | null
  restaurantMain: string | null
  restaurantFloat1: string | null
  restaurantFloat2: string | null
  carwash: string | null
  miniMarket: string | null
}

type HomepageContentFormProps = {
  initial: HomepageContentRow
  mediaPreviews: HomepageMediaPreviews
}

function PreviewThumb({ url }: { url: string | null }) {
  if (!url) {
    return <p className="text-sm text-zinc-500">No image in the database for this slot.</p>
  }
  return (
    <div className="relative max-h-44 max-w-full overflow-hidden rounded-lg border border-zinc-700 sm:max-w-lg">
      {/* eslint-disable-next-line @next/next/no-img-element -- admin preview arbitrary URLs */}
      <img src={url} alt="" className="max-h-44 w-full object-cover" />
    </div>
  )
}

const initialActionState: HomepageSaveState = { ok: null }

export function HomepageContentForm({ initial, mediaPreviews }: HomepageContentFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(saveHomepageContent, initialActionState)

  const fieldErrors = state.ok === false && "fieldErrors" in state ? state.fieldErrors : undefined
  const hasFieldErrors = Boolean(fieldErrors && Object.values(fieldErrors).some((v) => v?.length))

  useEffect(() => {
    if (state.ok === true) router.refresh()
  }, [router, state.ok])

  const defaultSecondaryHref = useMemo(
    () => (initial.hero_cta_secondary_label.trim() ? initial.hero_cta_secondary_href : "/locations"),
    [initial.hero_cta_secondary_href, initial.hero_cta_secondary_label]
  )

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
        <h2 className="font-heading font-semibold text-lg text-white">Hero</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={adminLabelClass} htmlFor="hero_headline_line1">
              Headline · line 1
            </label>
            <input
              id="hero_headline_line1"
              name="hero_headline_line1"
              defaultValue={initial.hero_headline_line1}
              className={adminInputClass}
              maxLength={240}
            />
            {fieldErrors?.hero_headline_line1 ? (
              <p className="mt-1 text-red-400 text-xs">{fieldErrors.hero_headline_line1[0]}</p>
            ) : null}
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="hero_headline_line2">
              Headline · line 2
            </label>
            <input
              id="hero_headline_line2"
              name="hero_headline_line2"
              defaultValue={initial.hero_headline_line2}
              className={adminInputClass}
              maxLength={240}
            />
          </div>
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="hero_subtitle">
            Subtitle
          </label>
          <textarea
            id="hero_subtitle"
            name="hero_subtitle"
            rows={3}
            defaultValue={initial.hero_subtitle}
            className={`min-h-18 resize-y ${adminInputClass}`}
          />
          {fieldErrors?.hero_subtitle ? (
            <p className="mt-1 text-red-400 text-xs">{fieldErrors.hero_subtitle[0]}</p>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={adminLabelClass} htmlFor="hero_cta_primary_label">
              Primary button text
            </label>
            <input
              id="hero_cta_primary_label"
              name="hero_cta_primary_label"
              defaultValue={initial.hero_cta_primary_label}
              className={adminInputClass}
            />
            {fieldErrors?.hero_cta_primary_label ? (
              <p className="mt-1 text-red-400 text-xs">{fieldErrors.hero_cta_primary_label[0]}</p>
            ) : null}
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="hero_cta_primary_href">
              Primary button link
            </label>
            <input
              id="hero_cta_primary_href"
              name="hero_cta_primary_href"
              defaultValue={initial.hero_cta_primary_href}
              className={`font-mono text-xs ${adminInputClass}`}
              placeholder="/services"
            />
            {fieldErrors?.hero_cta_primary_href ? (
              <p className="mt-1 text-red-400 text-xs">{fieldErrors.hero_cta_primary_href[0]}</p>
            ) : null}
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="hero_cta_secondary_label">
              Secondary button text (optional — leave blank to hide)
            </label>
            <input
              id="hero_cta_secondary_label"
              name="hero_cta_secondary_label"
              defaultValue={initial.hero_cta_secondary_label}
              className={adminInputClass}
            />
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="hero_cta_secondary_href">
              Secondary button link
            </label>
            <input
              id="hero_cta_secondary_href"
              name="hero_cta_secondary_href"
              defaultValue={defaultSecondaryHref}
              className={`font-mono text-xs ${adminInputClass}`}
              placeholder="/locations"
            />
            {fieldErrors?.hero_cta_secondary_href ? (
              <p className="mt-1 text-red-400 text-xs">{fieldErrors.hero_cta_secondary_href[0]}</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Locations band (homepage)</h2>
        <p className="text-xs text-zinc-500">Copy above the three location cards — cards pull from active `locations` rows.</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={adminLabelClass} htmlFor="locations_band_kicker">
              Eyebrow
            </label>
            <input
              id="locations_band_kicker"
              name="locations_band_kicker"
              defaultValue={initial.locations_band_kicker}
              className={adminInputClass}
            />
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="locations_band_heading">
              Heading
            </label>
            <input
              id="locations_band_heading"
              name="locations_band_heading"
              defaultValue={initial.locations_band_heading}
              className={adminInputClass}
            />
          </div>
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="locations_band_subtitle">
            Subtitle
          </label>
          <textarea
            id="locations_band_subtitle"
            name="locations_band_subtitle"
            rows={2}
            defaultValue={initial.locations_band_subtitle}
            className={`resize-y ${adminInputClass}`}
          />
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Services intro (dark band)</h2>
        <div>
          <label className={adminLabelClass} htmlFor="services_intro_title">
            Heading
          </label>
          <input
            id="services_intro_title"
            name="services_intro_title"
            defaultValue={initial.services_intro_title}
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="services_intro_body">
            Intro text
          </label>
          <textarea
            id="services_intro_body"
            name="services_intro_body"
            rows={4}
            defaultValue={initial.services_intro_body}
            className={`resize-y ${adminInputClass}`}
          />
        </div>
        <PreviewThumb url={mediaPreviews.servicesIntro} />
        <div>
          <label className={adminLabelClass} htmlFor="services_intro_image">
            Hero image — services intro column
          </label>
          <input id="services_intro_image" name="services_intro_image" type="file" accept="image/*" className={fileClassName} />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="services_intro_image_alt">
            Alt text (new upload)
          </label>
          <input id="services_intro_image_alt" name="services_intro_image_alt" className={adminInputClass} />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="clear_services_intro_image" className="size-4 rounded border-zinc-600" />
          Remove stored services-intro image reference
        </label>
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Card row — Restaurant / playground / Mini market copy</h2>
        <div>
          <label className={adminLabelClass} htmlFor="about_preview_text">
            About preview (future sections)
          </label>
          <textarea
            id="about_preview_text"
            name="about_preview_text"
            rows={3}
            defaultValue={initial.about_preview_text}
            className={`resize-y ${adminInputClass}`}
          />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="carwash_intro_text">
            Carwash card body
          </label>
          <textarea
            id="carwash_intro_text"
            name="carwash_intro_text"
            rows={3}
            defaultValue={initial.carwash_intro_text}
            className={`resize-y ${adminInputClass}`}
          />
        </div>
        <PreviewThumb url={mediaPreviews.carwash} />
        <div>
          <label className={adminLabelClass} htmlFor="carwash_image">
            Carwash card image
          </label>
          <input id="carwash_image" name="carwash_image" type="file" accept="image/*" className={fileClassName} />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="carwash_image_alt">
            Alt (new upload)
          </label>
          <input id="carwash_image_alt" name="carwash_image_alt" className={adminInputClass} />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="clear_carwash_image" className="size-4 rounded border-zinc-600" />
          Remove carwash image reference
        </label>

        <div className="border-zinc-800 border-t pt-5">
          <p className="text-xs text-zinc-500">
            Playground card still follows static mock visuals; only mini market rows below edit the third card body/image.
          </p>
          <label className={`${adminLabelClass} mt-4`} htmlFor="mini_market_intro_text">
            Mini market card body
          </label>
          <textarea
            id="mini_market_intro_text"
            name="mini_market_intro_text"
            rows={3}
            defaultValue={initial.mini_market_intro_text}
            className={`resize-y ${adminInputClass}`}
          />
          <PreviewThumb url={mediaPreviews.miniMarket} />
          <div>
            <label className={`${adminLabelClass} mt-3`} htmlFor="mini_market_image">
              Mini market card image
            </label>
            <input id="mini_market_image" name="mini_market_image" type="file" accept="image/*" className={fileClassName} />
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="mini_market_image_alt">
              Alt (new upload)
            </label>
            <input id="mini_market_image_alt" name="mini_market_image_alt" className={adminInputClass} />
          </div>
          <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" name="clear_mini_market_image" className="size-4 rounded border-zinc-600" />
            Remove mini market image reference
          </label>
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Restaurant luxury band</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={adminLabelClass} htmlFor="restaurant_home_headline_primary">
              Headline · primary line
            </label>
            <input
              id="restaurant_home_headline_primary"
              name="restaurant_home_headline_primary"
              defaultValue={initial.restaurant_home_headline_primary}
              className={adminInputClass}
            />
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="restaurant_home_headline_accent">
              Headline · accent line (colored span)
            </label>
            <input
              id="restaurant_home_headline_accent"
              name="restaurant_home_headline_accent"
              defaultValue={initial.restaurant_home_headline_accent}
              className={adminInputClass}
            />
          </div>
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="restaurant_highlight_text">
            Body
          </label>
          <textarea
            id="restaurant_highlight_text"
            name="restaurant_highlight_text"
            rows={4}
            defaultValue={initial.restaurant_highlight_text}
            className={`resize-y ${adminInputClass}`}
          />
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Main image</p>
          <PreviewThumb url={mediaPreviews.restaurantMain} />
          <input id="restaurant_main_image" name="restaurant_main_image" type="file" accept="image/*" className={fileClassName} />
          <input id="restaurant_main_alt" name="restaurant_main_alt" className={adminInputClass} placeholder="Alt (new upload)" />
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" name="clear_restaurant_main_image" className="size-4 rounded border-zinc-600" />
            Remove main image reference
          </label>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Float 1</p>
            <PreviewThumb url={mediaPreviews.restaurantFloat1} />
            <input
              id="restaurant_float_1_image"
              name="restaurant_float_1_image"
              type="file"
              accept="image/*"
              className={fileClassName}
            />
            <input id="restaurant_float_1_alt" name="restaurant_float_1_alt" className={adminInputClass} placeholder="Alt" />
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" name="clear_restaurant_float_1_image" className="size-4 rounded border-zinc-600" />
              Clear
            </label>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Float 2</p>
            <PreviewThumb url={mediaPreviews.restaurantFloat2} />
            <input
              id="restaurant_float_2_image"
              name="restaurant_float_2_image"
              type="file"
              accept="image/*"
              className={fileClassName}
            />
            <input id="restaurant_float_2_alt" name="restaurant_float_2_alt" className={adminInputClass} placeholder="Alt" />
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" name="clear_restaurant_float_2_image" className="size-4 rounded border-zinc-600" />
              Clear
            </label>
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Hero image</h2>
        <PreviewThumb url={mediaPreviews.hero} />
        <div>
          <label className={adminLabelClass} htmlFor="hero_image">
            Replace image (JPEG / PNG / WebP / GIF, ≤ 5&nbsp;MB)
          </label>
          <input
            id="hero_image"
            name="hero_image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className={fileClassName}
          />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="hero_image_alt">
            Alt text (new uploads)
          </label>
          <input id="hero_image_alt" name="hero_image_alt" className={adminInputClass} placeholder="Describe the photograph" />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="clear_hero_image" className="size-4 rounded border-zinc-600" />
          Remove hero image from homepage record (does not delete the storage file yet)
        </label>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <HomepageContentSubmitButton />
      </div>
    </form>
  )
}
