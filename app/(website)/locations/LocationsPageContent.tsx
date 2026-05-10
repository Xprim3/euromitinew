import { Container } from "@/components/layout/Container"
import { PageImageHero } from "@/components/layout/PageImageHero"
import { LocationsPageView } from "@/components/locations/LocationsPageView"
import { homeHeroDesign } from "@/data/mock/homepage-visual"
import { getLocationsPublicCached } from "@/lib/data/locations-public"

function LocationsPageErrorBanner({ message }: { message: string }) {
  return (
    <>
      <PageImageHero
        imageSrc={homeHeroDesign.imageSrc}
        imageAlt="Euromiti locations in Kosovo"
        trail={[{ label: "Home", href: "/" }, { label: "Locations" }]}
        title="Locations"
        description="Three flagship Euromiti forecourts across Kosovo — each with full address, contact, opening hours, and on-site services."
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

function LocationsEmptyState() {
  return (
    <>
      <PageImageHero
        imageSrc={homeHeroDesign.imageSrc}
        imageAlt="Euromiti locations in Kosovo"
        trail={[{ label: "Home", href: "/" }, { label: "Locations" }]}
        title="Locations"
        description="Three flagship Euromiti forecourts across Kosovo — each with full address, contact, opening hours, and on-site services."
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
  const data = await getLocationsPublicCached()

  if (!data.ok) {
    return <LocationsPageErrorBanner message={data.message} />
  }

  if (data.rows.length === 0) {
    return <LocationsEmptyState />
  }

  return <LocationsPageView locations={data.rows} />
}
