import { Suspense } from "react"

import { LocationsPageContent } from "./LocationsPageContent"
import { LocationsPageSkeleton } from "./LocationsPageSkeleton"
import { metadataForStaticPage } from "@/lib/seo/pages"

export const dynamic = "force-dynamic"
export const revalidate = 120
export const metadata = metadataForStaticPage("locations")

export default function LocationsPage() {
  return (
    <Suspense fallback={<LocationsPageSkeleton />}>
      <LocationsPageContent />
    </Suspense>
  )
}
