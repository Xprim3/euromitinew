import { Suspense } from "react"

import { RestaurantPageBody } from "./RestaurantPageBody"
import { RestaurantPageSkeleton } from "./RestaurantPageSkeleton"
import { metadataForStaticPage } from "@/lib/seo/pages"

export const dynamic = "force-dynamic"
export const revalidate = 120
export const metadata = metadataForStaticPage("restaurant")

export default function RestaurantPage() {
  return (
    <Suspense fallback={<RestaurantPageSkeleton />}>
      <RestaurantPageBody />
    </Suspense>
  )
}
