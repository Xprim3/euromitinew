import type { Metadata } from "next"
import Image from "next/image"
import { Container } from "@/components/layout/Container"
import { PageImageHero } from "@/components/layout/PageImageHero"
import { SectionReveal } from "@/components/motion/SectionReveal"
import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { contactPageMock } from "@/data/mock/contact"
import { homeHeroDesign } from "@/data/mock/homepage-visual"
import { getLocationsPublicCached } from "@/lib/data/locations-public"
import { resolveRestaurantReservationStations } from "@/lib/data/restaurant-reservation-stations-public"
import { getContactDetailsPublic, type SocialLinkItem } from "@/lib/data/site-contact-public"
import { telHrefFromDisplayPhone } from "@/lib/utils"

import { metadataForStaticPage } from "@/lib/seo/pages"

export const metadata: Metadata = metadataForStaticPage("contact")

export const dynamic = "force-dynamic"

export const revalidate = 120

function socialLinkClass() {
  return "text-sm font-semibold text-foreground underline-offset-4 hover:text-brand-red-vivid hover:underline"
}

function SocialRow({ links }: { links: readonly SocialLinkItem[] }) {
  if (!links.length) return null
  return (
    <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-border/60 border-t pt-8">
      <p className="w-full text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">Rrjetet sociale</p>
      {links.map((s) => (
        <a key={`${s.platform}-${s.url}`} href={s.url} className={socialLinkClass()} target="_blank" rel="noopener noreferrer">
          {s.platform}
        </a>
      ))}
    </div>
  )
}

export default async function ContactPage() {
  const [c, locationsResult] = await Promise.all([getContactDetailsPublic(), getLocationsPublicCached()])
  const stationPhones = resolveRestaurantReservationStations(locationsResult.ok ? locationsResult.rows : [])
  const ferizajStation = stationPhones.find(
    (s) => s.slug.toLowerCase() === "ferizaj" || s.city.toLowerCase() === "ferizaj"
  )
  const hqPhone = ferizajStation?.phone.trim() || c.phone.trim()
  const hqPhoneHref = telHrefFromDisplayPhone(hqPhone)
  const m = contactPageMock
  const mailHref = `mailto:${c.email}`

  return (
    <>
      <PageImageHero
        imageSrc={homeHeroDesign.imageSrc}
        imageAlt="Euromiti — mikpritje dhe operacione"
        trail={[{ label: "Ballina", href: "/" }, { label: "Kontakt" }]}
        title="Kontakt"
        visualPreset="flat-heavy"
        priority
      />

      {/* 1 · Headquarters */}
      <section className="bg-background py-16 md:py-20 lg:py-24">
        <Container>
          <SectionReveal once variant="fade-up">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Image collage — reference layout */}
              <div className="order-2 lg:order-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="relative h-52 overflow-hidden rounded-xl shadow-lg sm:h-56 md:h-64">
                      <Image
                        src={m.hqImages.lounge}
                        alt={m.hqImages.loungeAlt}
                        fill
                        sizes="(max-width: 1024px) 42vw, 22vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-36 overflow-hidden rounded-xl shadow-lg sm:h-44 md:h-48">
                      <Image
                        src={m.hqImages.amenities}
                        alt={m.hqImages.amenitiesAlt}
                        fill
                        sizes="(max-width: 1024px) 42vw, 22vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="pt-8 md:pt-12">
                    <div className="relative h-[min(24rem,calc(100vw-8rem))] overflow-hidden rounded-xl shadow-lg lg:h-96">
                      <Image
                        src={m.hqImages.reception}
                        alt={m.hqImages.receptionAlt}
                        fill
                        sizes="(max-width: 1024px) 42vw, 22vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.34em] text-brand-red-vivid">{c.hqEyebrow}</p>
                <h2 className="mt-3 font-heading text-[clamp(1.75rem,3.8vw,2.5rem)] font-bold tracking-tight text-foreground lg:mt-4">
                  {c.hqHeading}
                </h2>
                <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground md:text-base md:leading-relaxed">
                  {c.hqDescription}
                </p>
                <SectionAccentRule className="mt-8 max-w-24" />

                <dl className="mt-8 space-y-5">
                  <div className="flex gap-3">
                    <MaterialSymbol name="location_on" className="mt-0.5 shrink-0 text-xl! text-muted-foreground" aria-hidden />
                    <div>
                      <dt className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">Adresa</dt>
                      <dd className="mt-1 max-w-sm text-muted-foreground text-[0.8125rem] leading-snug">
                        {c.mapLink.trim() ? (
                          <a
                            href={c.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-foreground underline-offset-4 hover:text-brand-red-vivid hover:underline"
                          >
                            {c.hqAddress}
                          </a>
                        ) : (
                          c.hqAddress
                        )}
                      </dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MaterialSymbol name="call" className="mt-0.5 shrink-0 text-xl! text-muted-foreground" aria-hidden />
                    <div className="min-w-0">
                      <dt className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">Telefoni</dt>
                      <dd className="mt-1">
                        {hqPhone ? (
                          hqPhoneHref ? (
                            <a
                              href={hqPhoneHref}
                              className="inline-block font-semibold text-foreground text-lg transition-colors hover:text-brand-red-vivid"
                            >
                              {hqPhone}
                            </a>
                          ) : (
                            <span className="font-semibold text-foreground text-lg">{hqPhone}</span>
                          )
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MaterialSymbol name="mail" className="mt-0.5 shrink-0 text-xl! text-muted-foreground" aria-hidden />
                    <div>
                      <dt className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">Email</dt>
                      <dd className="mt-1">
                        <a className="break-all font-semibold text-foreground text-lg hover:text-brand-red-vivid" href={mailHref}>
                          {c.email}
                        </a>
                      </dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MaterialSymbol name="schedule" className="mt-0.5 shrink-0 text-xl! text-muted-foreground" aria-hidden />
                    <div>
                      <dt className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">Java e punës</dt>
                      <dd className="mt-1 text-foreground">{c.weekdayHours}</dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MaterialSymbol name="today" className="mt-0.5 shrink-0 text-xl! text-muted-foreground" aria-hidden />
                    <div>
                      <dt className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">Fundjava</dt>
                      <dd className="mt-1 text-foreground">{c.weekendHours}</dd>
                    </div>
                  </div>
                </dl>

                <SocialRow links={c.socialLinks} />
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>
    </>
  )
}
