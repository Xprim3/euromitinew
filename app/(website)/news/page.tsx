import type { Metadata } from "next"

import { PageImageHero } from "@/components/layout/PageImageHero"
import { NewsArchiveExplorer } from "@/components/news/NewsArchiveExplorer"
import { mockNewsSummaries } from "@/data/mock"
import { homeHeroDesign } from "@/data/mock/homepage-visual"

export const metadata: Metadata = {
  title: "News & Insights",
  description:
    "Euromiti news — forecourt upgrades, fuels, hospitality, and community programmes across Kosovo.",
}

function newestFirst(items: typeof mockNewsSummaries) {
  return [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export default function NewsPage() {
  const chronological = newestFirst(mockNewsSummaries)

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
