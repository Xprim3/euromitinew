import Link from "next/link"
import Image from "next/image"

import { ImageHoverZoom } from "@/components/motion"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import { getPublicHomepageSingleton } from "@/lib/data/homepage-singleton-public"

const defaultImageSrc =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBsNa_ar016Z5HDibQivrNY67SzYbUZKe0WG7DpwaQHOKOeVj-l6ZjPd9UkJT1LCPzEazL1wiBZ_RJs9BpODXlhQ15zQeb6u4Nx9Nw-TjdxnGqubvhDM82tXM8JsA2oTjSFJ4y1qXyW3SUrLKH_wekefXvyL7ptLyD22du9apP7qiRMyUQ3K6MmfOBWGJHfTIGApzf9cLuk4qB-e21yQ_5cIDKKx-sHZi2k9Zg-Bh_v3gfG2DeskV7uxZU4VgQlaoepKSRqoRtu7kaI"
const defaultImageAlt = "Euromiti premium station architecture"
const defaultHeadline = "Të ndërtuar në Kosovë. Të besuar në çdo rrugë."
const defaultTeaser =
  "Euromiti është kompani vendore në Kosovë — karburante cilësore dhe shërbime praktike në Prishtinë, Ferizaj dhe Gjilan."
const defaultButtonLabel = "Lexo më shumë për ne"
const defaultButtonHref = "/about"

const ABOUT_HOME_TEASER_MAX = 200

/** Short homepage blurb — full copy lives on /about. */
function aboutHomeTeaser(text: string, maxLen = ABOUT_HOME_TEASER_MAX) {
  const trimmed = text.trim().replace(/\s+/g, " ")
  if (!trimmed) return ""
  if (trimmed.length <= maxLen) return trimmed
  const slice = trimmed.slice(0, maxLen)
  const lastSpace = slice.lastIndexOf(" ")
  const cut = lastSpace > maxLen * 0.55 ? slice.slice(0, lastSpace) : slice
  return `${cut}…`
}

function headlineParts(headline: string) {
  const parts = headline
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean)
  if (parts.length < 2) return { main: headline, accent: "" }
  return {
    main: `${parts.slice(0, -1).join(". ")}.`,
    accent: `${parts.at(-1)}.`,
  }
}

export async function HomeAboutIntro() {
  const { row, media } = await getPublicHomepageSingleton()
  const image = row?.about_preview_image_media_id ? media[row.about_preview_image_media_id] : undefined
  const headline = row?.about_preview_headline?.trim() || defaultHeadline
  const headlineCopy = headlineParts(headline)
  const teaserRaw = row?.about_preview_text?.trim() || defaultTeaser
  const teaser = aboutHomeTeaser(teaserRaw)
  const buttonLabel = row?.about_preview_button_label?.trim() || defaultButtonLabel
  const buttonHref = row?.about_preview_button_href?.trim() || defaultButtonHref

  return (
    <section
      className="relative overflow-hidden bg-brand-surface-tinted px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-12"
      aria-labelledby="about-intro-heading"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 overflow-hidden rounded-[1.2rem] bg-brand-shell-deep shadow-[0_26px_75px_rgba(15,23,42,0.16)] lg:grid-cols-12">
          <div className="relative flex flex-col justify-center px-5 py-8 sm:px-7 sm:py-10 lg:col-span-7 lg:px-10 xl:px-12">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,180,171,0.12),transparent_34%)]"
              aria-hidden
            />
            <div className="relative max-w-2xl">
              <h2
                id="about-intro-heading"
                className="font-(family-name:--font-montserrat) text-[clamp(1.9rem,8vw,2.55rem)] font-extrabold leading-[1.05] tracking-[-0.045em] text-white sm:text-[clamp(2.35rem,4.4vw,3.7rem)]"
              >
                {headlineCopy.main}
                {headlineCopy.accent ? (
                  <>
                    {" "}
                    <span className="text-brand-accent-soft">{headlineCopy.accent}</span>
                  </>
                ) : null}
              </h2>

              <p className="mt-5 max-w-xl text-[0.98rem] leading-8 text-white/74 md:text-[1.04rem]">{teaser}</p>

              <SectionAccentRule className="mt-6" />
              <Link
                href={buttonHref}
                className="group mt-7 inline-flex w-full max-w-none items-center justify-between gap-4 rounded-[0.85rem] border border-white/16 bg-white/8 px-4 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)] backdrop-blur-md transition-colors duration-300 hover:border-brand-accent-soft/45 hover:bg-white/10 sm:w-auto sm:min-w-64 sm:px-5 lg:mt-8"
              >
                <span>{buttonLabel}</span>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-accent-soft text-brand-shell-deep transition-transform duration-300 group-hover:translate-x-1">
                  <MaterialSymbol name="arrow_forward" className="text-base" />
                </span>
              </Link>
            </div>
          </div>

          <div className="relative min-h-72 overflow-hidden lg:col-span-5 lg:min-h-112">
            <ImageHoverZoom className="absolute inset-0 h-full w-full">
              <Image
                src={image?.public_url?.trim() || defaultImageSrc}
                alt={image?.alt_text?.trim() || defaultImageAlt}
                fill
                sizes="(max-width: 1023px) 100vw, 42vw"
                className="object-cover"
              />
            </ImageHoverZoom>
            <div
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-shell-deep/58 via-brand-shell-deep/10 to-transparent lg:bg-linear-to-l lg:from-brand-shell-deep/74 lg:via-brand-shell-deep/12 lg:to-transparent"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  )
}
