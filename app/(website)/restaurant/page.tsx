import type { Metadata } from "next"
import { Suspense } from "react"

import { RestaurantPageBody } from "./RestaurantPageBody"
import { RestaurantPageSkeleton } from "./RestaurantPageSkeleton"

export const revalidate = 120

export const metadata: Metadata = {
  title: "Restaurant",
  description:
    "Euromiti restaurant — chef-led menus, wine service, private dining beside flagship forecourts.",
}

export default function RestaurantPage() {
  return (
    <Suspense fallback={<RestaurantPageSkeleton />}>
      <RestaurantPageBody />
    </Suspense>
  )
}
