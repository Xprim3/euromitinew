import { Suspense } from "react"

import { ServicesPageBody } from "./ServicesPageBody"
import { ServicesPageSkeleton } from "./ServicesPageSkeleton"
import { metadataForStaticPage } from "@/lib/seo/pages"

export const dynamic = "force-dynamic"
export const revalidate = 120
export const metadata = metadataForStaticPage("services")

export default function ServicesPage() {
  return (
    <Suspense fallback={<ServicesPageSkeleton />}>
      <ServicesPageBody />
    </Suspense>
  )
}
