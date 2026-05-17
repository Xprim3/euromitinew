import { Suspense } from "react"

import { AboutPageBody } from "@/components/about/AboutPageBody"
import { AboutPageSkeleton } from "@/components/about/AboutPageSkeleton"
import { metadataForStaticPage } from "@/lib/seo/pages"

export const metadata = metadataForStaticPage("about")

export const dynamic = "force-dynamic"

/** Matches other marketing routes — admin save triggers `revalidatePath("/about")`. */
export const revalidate = 120

export default function AboutPage() {
  return (
    <Suspense fallback={<AboutPageSkeleton />}>
      <AboutPageBody />
    </Suspense>
  )
}
