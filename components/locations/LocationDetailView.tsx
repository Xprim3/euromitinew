import Link from "next/link"

import { Container } from "@/components/layout/Container"
import { PageImageHero } from "@/components/layout/PageImageHero"
import { JsonLd } from "@/components/seo/JsonLd"
import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { SectionAccentRule } from "@/components/ui/SectionAccentRule"
import { LOCATION_PAGE_SERVICE_LABELS, type ResolvedPublicLocation } from "@/lib/data/locations-public"
import { buildBreadcrumbSchema, buildLocationSchema } from "@/lib/seo/json-ld"
import { telHrefFromDisplayPhone } from "@/lib/utils"

const SERVICE_LABELS_SQ: Record<keyof typeof LOCATION_PAGE_SERVICE_LABELS, string> = {
  petrol: "Karburant",
  restaurant: "Restaurant",
  carwash: "Autolarje",
  mini_market: "Mini market",
  ev: "EV",
}

type LocationDetailViewProps = {
  location: ResolvedPublicLocation
}

export function LocationDetailView({ location }: LocationDetailViewProps) {
  const phoneHref = telHrefFromDisplayPhone(location.phone)
  const emailHref =
    location.contactEmail && location.contactEmail.includes("@")
      ? `mailto:${location.contactEmail}`
      : undefined

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Ballina", path: "/" },
    { name: "Pikat e Shitjes", path: "/locations" },
    { name: location.city, path: `/locations/${location.slug}` },
  ])

  return (
    <>
      <JsonLd data={[buildLocationSchema(location), breadcrumbs]} />
      <PageImageHero
        imageSrc={location.mainImageSrc}
        imageAlt={location.mainImageAlt}
        trail={[
          { label: "Ballina", href: "/" },
          { label: "Pikat e Shitjes", href: "/locations" },
          { label: location.city },
        ]}
        title={location.pageHeading}
        priority
      />

      <section className="bg-background">
        <Container className="py-10 sm:py-12 md:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl space-y-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Stacion Euromiti · {location.city}
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{location.pageSummary}</p>
              <SectionAccentRule className="mt-6" />
            </div>

            <div>
              <h2 className="font-heading text-xl font-bold text-foreground md:text-2xl">Shërbimet</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {location.services.map((service) => (
                  <li
                    key={service}
                    className="rounded-full border border-border/70 bg-muted/40 px-3 py-1.5 text-sm font-medium text-foreground"
                  >
                    {SERVICE_LABELS_SQ[service] ?? LOCATION_PAGE_SERVICE_LABELS[service]}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 border-t border-border/60 pt-8 text-sm md:text-base">
              <h2 className="font-heading text-xl font-bold text-foreground">Kontakt dhe orari</h2>
              <ul className="space-y-4 text-foreground">
                {location.address.trim() ? (
                  <li className="flex gap-3">
                    <MaterialSymbol name="location_on" className="mt-0.5 shrink-0 text-secondary" />
                    {location.googleMapsUrl.trim() ? (
                      <a
                        href={location.googleMapsUrl.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary hover:underline"
                      >
                        {location.address}
                      </a>
                    ) : (
                      <span>{location.address}</span>
                    )}
                  </li>
                ) : null}
                {phoneHref ? (
                  <li className="flex gap-3">
                    <MaterialSymbol name="call" className="mt-0.5 shrink-0 text-secondary" />
                    <a href={phoneHref} className="hover:text-primary hover:underline">
                      {location.phone}
                    </a>
                  </li>
                ) : null}
                {emailHref ? (
                  <li className="flex gap-3">
                    <MaterialSymbol name="mail" className="mt-0.5 shrink-0 text-secondary" />
                    <a href={emailHref} className="hover:text-primary hover:underline">
                      {location.contactEmail}
                    </a>
                  </li>
                ) : null}
                {location.openingHours.trim() ? (
                  <li className="flex gap-3">
                    <MaterialSymbol name="schedule" className="mt-0.5 shrink-0 text-secondary" />
                    <span>{location.openingHours}</span>
                  </li>
                ) : null}
              </ul>
            </div>

            <p className="border-t border-border/60 pt-8">
              <Link href="/locations" className="font-semibold text-primary hover:underline">
                ← Të gjitha pikat e shitjes
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}
