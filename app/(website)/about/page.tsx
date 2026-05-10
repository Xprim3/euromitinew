import type { Metadata } from "next"
import { Suspense } from "react"

import { AboutPageBody } from "@/components/about/AboutPageBody"
import { AboutPageSkeleton } from "@/components/about/AboutPageSkeleton"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Euromiti — Kosovo forecourts built on dependable fuels, hospitality, mini markets, and car care.",
}

/** Matches other marketing routes — admin save triggers `revalidatePath("/about")`. */
export const revalidate = 120

export default function AboutPage() {
  return (
    <Suspense fallback={<AboutPageSkeleton />}>
      <AboutPageBody />
    </Suspense>
  )
}
