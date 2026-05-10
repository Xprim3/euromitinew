"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { saveAboutContent, type AboutSaveState } from "@/app/admin/(panel)/about/actions"
import { storyParagraphsFromDb } from "@/lib/data/about-content-public"
import type { AboutContentRow, AboutValueCard } from "@/types/supabase-cms"

import { adminInputClass, adminLabelClass } from "./cn-admin"
import { AboutSaveSubmitButton } from "./AboutSaveSubmitButton"

export type AboutMediaPreviews = {
  hero: string | null
  story: string | null
  galleryStrip: string | null
  galleryWhy: string | null
  galleryPartner: string | null
}

type AboutContentFormProps = {
  initial: AboutContentRow
  previews: AboutMediaPreviews
  /** Eight slots for editable value cards (extras in DB capped in admin UI). */
  valueSlots: AboutValueCard[]
}

function PreviewThumb({ url }: { url: string | null }) {
  if (!url) return <p className="text-sm text-zinc-500">No image assigned.</p>
  return (
    <div className="relative max-h-44 max-w-lg overflow-hidden rounded-lg border border-zinc-700">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" className="max-h-44 w-full object-cover" />
    </div>
  )
}

const initialActionState: AboutSaveState = { ok: null }

export function AboutContentForm({ initial, previews, valueSlots }: AboutContentFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(saveAboutContent, initialActionState)

  const fieldErrors = state.ok === false && "fieldErrors" in state ? state.fieldErrors : undefined
  const hasFieldErrors = Boolean(fieldErrors && Object.values(fieldErrors).some((v) => v?.length))

  useEffect(() => {
    if (state.ok === true) router.refresh()
  }, [router, state.ok])

  const storyText = storyParagraphsFromDb(initial.company_story).join("\n\n")
  const fileClassName =
    "block w-full max-w-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-2 file:text-sm file:text-white"

  return (
    <form action={formAction} className="max-w-4xl space-y-10" encType="multipart/form-data">
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
        <div>
          <label className={adminLabelClass} htmlFor="hero_title">
            Title
          </label>
          <input id="hero_title" name="hero_title" defaultValue={initial.hero_title} className={adminInputClass} />
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
            className={`resize-y ${adminInputClass}`}
          />
        </div>
        <PreviewThumb url={previews.hero} />
        <div>
          <label className={adminLabelClass} htmlFor="hero_media">
            Replace hero image
          </label>
          <input id="hero_media" name="hero_media" type="file" accept="image/*" className={fileClassName} />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="hero_image_alt">
            Alt text (new upload)
          </label>
          <input id="hero_image_alt" name="hero_image_alt" className={adminInputClass} />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="clear_hero_media" className="size-4 rounded border-zinc-600" />
          Remove hero image reference
        </label>
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Company story (“Who We Are”)</h2>
        <p className="text-xs text-zinc-500">Separate paragraphs with a blank line (double line break).</p>
        <div>
          <label className={adminLabelClass} htmlFor="company_story_paragraphs">
            Paragraphs
          </label>
          <textarea
            id="company_story_paragraphs"
            name="company_story_paragraphs"
            rows={10}
            defaultValue={storyText}
            className={`resize-y font-sans ${adminInputClass}`}
          />
        </div>
        <PreviewThumb url={previews.story} />
        <div>
          <label className={adminLabelClass} htmlFor="story_media">
            Story column image
          </label>
          <input id="story_media" name="story_media" type="file" accept="image/*" className={fileClassName} />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="story_image_alt">
            Alt (new upload)
          </label>
          <input id="story_image_alt" name="story_image_alt" className={adminInputClass} />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="clear_story_media" className="size-4 rounded border-zinc-600" />
          Remove story image reference
        </label>
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Mission &amp; Vision</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={adminLabelClass} htmlFor="mission_title">
              Mission label
            </label>
            <input id="mission_title" name="mission_title" defaultValue={initial.mission_title} className={adminInputClass} />
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="vision_title">
              Vision label
            </label>
            <input id="vision_title" name="vision_title" defaultValue={initial.vision_title} className={adminInputClass} />
          </div>
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="mission_body">
            Mission body
          </label>
          <textarea
            id="mission_body"
            name="mission_body"
            rows={4}
            defaultValue={initial.mission_body}
            className={`resize-y ${adminInputClass}`}
          />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="vision_body">
            Vision body
          </label>
          <textarea
            id="vision_body"
            name="vision_body"
            rows={4}
            defaultValue={initial.vision_body}
            className={`resize-y ${adminInputClass}`}
          />
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Section images</h2>
        <p className="text-xs text-zinc-500">
          Strip = wide image under Mission/Vision cards; Why Us = right column beside reasons; Partnerships =
          contact teaser image.
        </p>

        <div className="space-y-3 rounded-lg border border-zinc-700/80 p-4">
          <p className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">Mission footer strip</p>
          <PreviewThumb url={previews.galleryStrip} />
          <input type="file" name="gallery_strip_image" accept="image/*" className={fileClassName} />
          <input name="gallery_strip_alt" className={adminInputClass} placeholder="Alt (new upload)" />
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" name="clear_gallery_strip" className="size-4 rounded border-zinc-600" />
            Clear
          </label>
        </div>

        <div className="space-y-3 rounded-lg border border-zinc-700/80 p-4">
          <p className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">Why Choose Us sidebar</p>
          <PreviewThumb url={previews.galleryWhy} />
          <input type="file" name="gallery_why_image" accept="image/*" className={fileClassName} />
          <input name="gallery_why_alt" className={adminInputClass} placeholder="Alt (new upload)" />
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" name="clear_gallery_why" className="size-4 rounded border-zinc-600" />
            Clear
          </label>
        </div>

        <div className="space-y-3 rounded-lg border border-zinc-700/80 p-4">
          <p className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">Partnerships / contact block</p>
          <PreviewThumb url={previews.galleryPartner} />
          <input type="file" name="gallery_partner_image" accept="image/*" className={fileClassName} />
          <input name="gallery_partner_alt" className={adminInputClass} placeholder="Alt (new upload)" />
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" name="clear_gallery_partner" className="size-4 rounded border-zinc-600" />
            Clear
          </label>
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="font-heading font-semibold text-lg text-white">Core values</h2>
        <p className="text-xs text-zinc-500">
          Icons use Material Symbols names (e.g. verified, favorite, trending_up). Leave title/body blank to skip a slot
          — up to eight cards here (at least one required).
        </p>
        <div className="space-y-6">
          {valueSlots.map((slot, i) => (
            <div key={i} className="rounded-lg border border-zinc-700/70 p-4">
              <p className="mb-3 text-xs text-zinc-500">Card {i + 1}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-1">
                  <label className={adminLabelClass} htmlFor={`value_${i}_icon`}>
                    Icon
                  </label>
                  <input
                    id={`value_${i}_icon`}
                    name={`value_${i}_icon`}
                    defaultValue={slot.icon_material}
                    className={`font-mono text-xs ${adminInputClass}`}
                    placeholder="verified"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={adminLabelClass} htmlFor={`value_${i}_title`}>
                    Title
                  </label>
                  <input
                    id={`value_${i}_title`}
                    name={`value_${i}_title`}
                    defaultValue={slot.title}
                    className={adminInputClass}
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className={adminLabelClass} htmlFor={`value_${i}_body`}>
                  Body
                </label>
                <textarea
                  id={`value_${i}_body`}
                  name={`value_${i}_body`}
                  rows={3}
                  defaultValue={slot.body}
                  className={`resize-y ${adminInputClass}`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <AboutSaveSubmitButton />
    </form>
  )
}
