import { CareersPageView } from "@/components/careers/CareersPageView"
import { JsonLd } from "@/components/seo/JsonLd"
import { getApplicationJobOptionsPublic } from "@/lib/data/careers-public"
import { buildJobPostingSchema } from "@/lib/seo/json-ld"
import { metadataForStaticPage } from "@/lib/seo/pages"

export const dynamic = "force-dynamic"
export const metadata = metadataForStaticPage("careers")

type CareersPageProps = {
  searchParams: Promise<{ p?: string }>
}

export default async function CareersPage({ searchParams }: CareersPageProps) {
  const { p } = await searchParams
  const positions = await getApplicationJobOptionsPublic()
  const activePositions = positions.filter((job) => job.is_active)
  const defaultPositionSlug = typeof p === "string" && p.trim() ? p.trim() : undefined

  return (
    <>
      {activePositions.length > 0 ? (
        <JsonLd data={activePositions.map((job) => buildJobPostingSchema(job))} />
      ) : null}
      <CareersPageView positions={positions} defaultPositionSlug={defaultPositionSlug} />
    </>
  )
}
