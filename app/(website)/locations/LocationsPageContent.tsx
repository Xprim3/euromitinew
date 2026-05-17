import { Container } from "@/components/layout/Container"
import { PageImageHero } from "@/components/layout/PageImageHero"
import { LocationsPageView } from "@/components/locations/LocationsPageView"
import { getLocationsPublicCached } from "@/lib/data/locations-public"
import { getInteriorPageHeroPublic } from "@/lib/data/page-hero-public"

function LocationsPageErrorBanner({
  message,
  heroImageSrc,
  heroImageAlt,
}: {
  message: string
  heroImageSrc: string
  heroImageAlt: string
}) {
  return (
    <>
      <PageImageHero
        imageSrc={heroImageSrc}
        imageAlt={heroImageAlt}
        trail={[{ label: "Home", href: "/" }, { label: "Locations" }]}
        title="Locations"
        priority
      />
      <section className="bg-muted">
        <Container className="euromiti-section">
          <div
            role="alert"
            className="rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-red-950 text-sm dark:bg-red-950/30 dark:text-red-100"
          >
            <p className="font-semibold">We could not load stations right now.</p>
            <p className="mt-2 text-foreground/85 dark:text-red-100/90">{message}</p>
          </div>
        </Container>
      </section>
    </>
  )
}

function LocationsEmptyState({ heroImageSrc, heroImageAlt }: { heroImageSrc: string; heroImageAlt: string }) {
  return (
    <>
      <PageImageHero
        imageSrc={heroImageSrc}
        imageAlt={heroImageAlt}
        trail={[{ label: "Home", href: "/" }, { label: "Locations" }]}
        title="Locations"
        priority
      />
      <section className="bg-muted">
        <Container className="euromiti-section">
          <div className="mx-auto max-w-xl rounded-xl border border-border/70 bg-card px-6 py-10 text-center shadow-(--shadow-euromiti-soft)">
            <h2 className="font-heading text-xl font-bold text-foreground">No active locations yet</h2>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              Our team is updating this list. Please check back shortly, or reach out through the contact page.
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}

export async function LocationsPageContent() {
  const [data, pageHero] = await Promise.all([
    getLocationsPublicCached(),
    getInteriorPageHeroPublic("locations", "Pikat e shitjes Euromiti në Prishtinë, Ferizaj dhe Gjilan"),
  ])

  if (!data.ok) {
    return (
      <LocationsPageErrorBanner
        message={data.message}
        heroImageSrc={pageHero.imageSrc}
        heroImageAlt={pageHero.imageAlt}
      />
    )
  }

  if (data.rows.length === 0) {
    return <LocationsEmptyState heroImageSrc={pageHero.imageSrc} heroImageAlt={pageHero.imageAlt} />
  }

  return (
    <LocationsPageView
      locations={data.rows}
      heroImageSrc={pageHero.imageSrc}
      heroImageAlt={pageHero.imageAlt}
    />
  )
}
