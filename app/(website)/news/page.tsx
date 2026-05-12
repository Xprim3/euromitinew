import type { Metadata } from "next"

import { PageImageHero } from "@/components/layout/PageImageHero"
import { NewsArchiveExplorer } from "@/components/news/NewsArchiveExplorer"
import { homeHeroDesign } from "@/data/mock/homepage-visual"
import { getPublishedNewsSummariesPublic } from "@/lib/data/news-public"

export const metadata: Metadata = {
  title: "News & Insights",
  description:
    "Euromiti news — forecourt upgrades, fuels, hospitality, and community programmes across Kosovo.",
}

export const dynamic = "force-dynamic"

export const revalidate = 120

export default async function NewsPage() {
  const items = await getPublishedNewsSummariesPublic()

  const chronological = [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  return (
    <>
      <PageImageHero
        imageSrc={homeHeroDesign.imageSrc}
        imageAlt="Euromiti network insights and roadside updates"
        trail={[{ label: "Home", href: "/" }, { label: "News & Insights" }]}
        title="News & Insights"
        description={
          "Operational updates, fuels innovation, and community initiatives from Euromiti’s Kosovo network."
        }
        visualPreset="flat-heavy"
        priority
      />

      <NewsArchiveExplorer items={chronological} />
    </>
  )
}
