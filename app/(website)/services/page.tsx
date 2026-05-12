import type { Metadata } from "next"
import { Suspense } from "react"

import { ServicesPageBody } from "./ServicesPageBody"
import { ServicesPageSkeleton } from "./ServicesPageSkeleton"

export const dynamic = "force-dynamic"

export const revalidate = 120

export const metadata: Metadata = {
  title: "Services",
  description:
    "Euromiti services across Kosovo — petrol, restaurant, playground, car wash, and mini market details by location.",
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<ServicesPageSkeleton />}>
      <ServicesPageBody />
    </Suspense>
  )
}
