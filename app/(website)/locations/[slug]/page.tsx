import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LocationDetailView } from "@/components/locations/LocationDetailView"
import { getLocationBySlugPublic } from "@/lib/data/locations-public"
import { metadataForLocation } from "@/lib/seo/pages"

type Props = { params: Promise<{ slug: string }> }

export const dynamic = "force-dynamic"
export const revalidate = 120

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const location = await getLocationBySlugPublic(slug)
  if (!location) {
    return { title: "Pikat e Shitjes" }
  }
  return metadataForLocation(location.city, location.slug, location.pageSummary)
}

export default async function LocationDetailPage({ params }: Props) {
  const { slug } = await params
  const location = await getLocationBySlugPublic(slug)
  if (!location) notFound()
  return <LocationDetailView location={location} />
}
