import Image from "next/image"

import { Container } from "@/components/layout/Container"
import { PageImageHero } from "@/components/layout/PageImageHero"
import { Reveal, Stagger } from "@/components/motion"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { homeHeroDesign } from "@/data/mock/homepage-visual"
import { LOCATION_PAGE_SERVICE_LABELS, type ResolvedPublicLocation } from "@/lib/data/locations-public"
import { cn } from "@/lib/utils"
import type { LocationAmenity } from "@/types/public"

export type LocationsPageViewProps = {
  locations: ResolvedPublicLocation[]
}

function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "")
  return digits ? `tel:${digits}` : undefined
}

function mailHref(display: string) {
  const t = display.trim()
  if (t.length < 5 || t.includes("—")) return undefined
  if (!t.includes("@")) return undefined
  return `mailto:${t}`
}

type LocationInfoPanelProps = {
  entry: ResolvedPublicLocation
  index: number
  phoneHref: string | undefined
  emailHref: string | undefined
  variant: "light" | "dark"
}

function LocationInfoPanel({ entry, index, phoneHref, emailHref, variant }: LocationInfoPanelProps) {
  const dark = variant === "dark"
  const label = dark ? "text-brand-accent-gold/90" : "text-secondary"
  const bodyMuted = dark ? "text-white/70" : "text-muted-foreground"
  const heading = dark ? "text-white" : "text-foreground"
  const line = dark ? "border-white/15" : "border-border/60"
  const icon = dark ? "text-brand-accent-gold" : "text-secondary"
  const chip = dark
    ? "border-white/20 bg-white/[0.06] text-white/85"
    : "border-brand-shell-deep/12 bg-white/80 text-foreground/80"

  return (
    <div
      className={cn(
        "relative flex flex-col justify-center px-6 py-14 sm:px-10 lg:px-14 lg:py-20 xl:px-20",
        dark ? "bg-brand-shell-deep" : "bg-[#faf8f5]"
      )}
    >
      <span
        className={cn(
          "pointer-events-none select-none font-playfair text-[clamp(4.5rem,14vw,9rem)] font-light leading-none tracking-tight",
          dark ? "absolute right-6 top-10 text-white/6 lg:right-10 lg:top-14" : "absolute right-6 top-8 text-brand-shell-deep/6 lg:right-12 lg:top-12"
        )}
        aria-hidden
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative max-w-xl">
        <p className={cn("text-[0.65rem] font-semibold uppercase tracking-[0.32em]", label)}>Euromiti forecourt</p>
        <h2 className={cn("mt-4 font-heading text-[clamp(1.75rem,3.2vw,2.35rem)] font-semibold leading-[1.12] tracking-tight", heading)}>
          {entry.pageHeading}
        </h2>
        <p className={cn("mt-5 text-base leading-relaxed md:text-[1.05rem]", bodyMuted)}>{entry.pageSummary}</p>

        <div
          className={cn(
            "my-10 h-px w-16 bg-linear-to-r from-brand-accent-gold/80 to-transparent",
            dark && "from-brand-accent-gold to-white/10"
          )}
          aria-hidden
        />

        <ul className={cn("space-y-4 border-t pt-8 text-sm leading-snug md:text-[0.95rem]", line, heading)}>
          <li className="flex gap-3.5">
            <MaterialSymbol name="location_on" className={cn("mt-0.5 shrink-0 text-[1.25rem]", icon)} />
            {entry.googleMapsUrl.trim() ? (
              <a
                href={entry.googleMapsUrl.trim()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open directions for ${entry.address}`}
                className={cn(
                  "font-medium leading-snug underline-offset-4 transition-colors hover:underline",
                  dark ? "text-white/90 hover:text-brand-accent-gold" : "text-foreground hover:text-secondary"
                )}
              >
                {entry.address}
              </a>
            ) : (
              <span className={dark ? "text-white/90" : undefined}>{entry.address}</span>
            )}
          </li>
          <li className="flex gap-3.5">
            <MaterialSymbol name="call" className={cn("mt-0.5 shrink-0 text-[1.25rem]", icon)} />
            {phoneHref ? (
              <a
                href={phoneHref}
                className={cn(
                  "font-medium underline-offset-4 hover:underline",
                  dark ? "text-white hover:text-brand-accent-gold" : "text-foreground hover:text-secondary"
                )}
              >
                {entry.phone}
              </a>
            ) : (
              <span className={dark ? "text-white/90" : undefined}>{entry.phone}</span>
            )}
          </li>
          <li className="flex gap-3.5">
            <MaterialSymbol name="mail" className={cn("mt-0.5 shrink-0 text-[1.25rem]", icon)} />
            {emailHref ? (
              <a
                href={emailHref}
                className={cn(
                  "break-all font-medium underline-offset-4 hover:underline",
                  dark ? "text-white hover:text-brand-accent-gold" : "text-foreground hover:text-secondary"
                )}
              >
                {entry.contactEmailDisplay}
              </a>
            ) : (
              <span className={cn("break-all", dark ? "text-white/90" : undefined)}>{entry.contactEmailDisplay}</span>
            )}
          </li>
          <li className="flex gap-3.5">
            <MaterialSymbol name="schedule" className={cn("mt-0.5 shrink-0 text-[1.25rem]", icon)} />
            <span className={dark ? "text-white/90" : undefined}>{entry.openingHours}</span>
          </li>
        </ul>

        <div className="mt-8 flex flex-wrap gap-2">
          {entry.services.map((service: LocationAmenity) => (
            <span
              key={service}
              className={cn(
                "border px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em]",
                chip
              )}
            >
              {LOCATION_PAGE_SERVICE_LABELS[service]}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

type LocationImagePanelProps = {
  visual: { src: string; alt: string }
  priority?: boolean
  tone?: "light" | "dark"
}

function LocationImagePanel({ visual, priority, tone = "light" }: LocationImagePanelProps) {
  const dark = tone === "dark"
  return (
    <div
      className={cn(
        "relative min-h-[min(52vw,22rem)] w-full overflow-hidden sm:min-h-96 lg:min-h-[min(40rem,78svh)]",
        dark ? "bg-brand-shell-deep" : "bg-neutral-900"
      )}
    >
      <Image
        src={visual.src}
        alt={visual.alt}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover transition duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]"
        priority={priority}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-tr from-black/50 via-black/10 to-transparent mix-blend-multiply"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/20" aria-hidden />
    </div>
  )
}

export function LocationsPageView({ locations }: LocationsPageViewProps) {
  return (
    <>
      <PageImageHero
        imageSrc={homeHeroDesign.imageSrc}
        imageAlt="Euromiti locations in Kosovo"
        trail={[{ label: "Home", href: "/" }, { label: "Locations" }]}
        title="Locations"
        priority
      />

      <section className="border-t border-brand-shell-deep/10 bg-white">
        <Container className="euromiti-section-loose">
          <Reveal variant="fade-up" once>
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-playfair text-lg text-brand-accent-gold md:text-xl">Rrjeti Euromiti</p>
              <div className="mx-auto mt-5 h-px w-12 bg-linear-to-r from-transparent via-brand-accent-gold/80 to-transparent" aria-hidden />
              <h2 className="mt-6 font-heading text-[clamp(1.6rem,2.6vw,2.1rem)] font-semibold tracking-tight text-foreground">
                Një rrjet shërbimesh i ndërtuar mbi cilësi dhe besim.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                Në Prishtinë, Ferizaj dhe Gjilan, Euromiti ofron më shumë se një ndalesë karburanti një hapësirë të
                kompletuar për furnizim, ushqim, kujdes për veturën dhe komoditet gjatë rrugës.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <Stagger once className="flex flex-col">
        {locations.map((entry, index) => {
          const imageLeft = index % 2 === 0
          const phoneHref = telHref(entry.phone)
          const emailHref = mailHref(entry.contactEmailDisplay)
          const visual = { src: entry.mainImageSrc, alt: entry.mainImageAlt }
          const editorialDark = index % 2 === 1
          const infoVariant = editorialDark ? "dark" : "light"

          const imageEl = (
            <LocationImagePanel
              visual={visual}
              priority={index === 0}
              tone={editorialDark ? "dark" : "light"}
            />
          )
          const infoEl = (
            <LocationInfoPanel
              entry={entry}
              index={index}
              phoneHref={phoneHref}
              emailHref={emailHref}
              variant={infoVariant}
            />
          )

          return (
            <section
              key={entry.id}
              className={cn(
                "border-t border-black/6",
                editorialDark ? "bg-brand-shell-deep" : "bg-[#ebe6df]"
              )}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {imageLeft ? (
                  <>
                    <div className="min-h-0 max-lg:row-start-1">{imageEl}</div>
                    <div className="min-h-0 max-lg:row-start-2">{infoEl}</div>
                  </>
                ) : (
                  <>
                    {/* DOM: copy then image for desktop (text left). Mobile: image above copy via row-start. */}
                    <div className="min-h-0 max-lg:col-start-1 max-lg:row-start-2">{infoEl}</div>
                    <div className="min-h-0 max-lg:col-start-1 max-lg:row-start-1">{imageEl}</div>
                  </>
                )}
              </div>
            </section>
          )
        })}
      </Stagger>
    </>
  )
}
