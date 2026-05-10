import type { Metadata } from "next"
import { Suspense } from "react"

import { LocationsPageContent } from "./LocationsPageContent"
import { LocationsPageSkeleton } from "./LocationsPageSkeleton"

export const revalidate = 120

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Euromiti stations in Prishtina, Ferizaj, and Gjilan — addresses, hours, services, and Google Maps.",
}

export default function LocationsPage() {
  return (
    <Suspense fallback={<LocationsPageSkeleton />}>
      <LocationsPageContent />
    </Suspense>
  )
}
