import { PageImageHero } from "@/components/layout/PageImageHero"
import { NewsArchiveExplorer } from "@/components/news/NewsArchiveExplorer"
import { homeHeroDesign } from "@/data/mock/homepage-visual"
import { getPublishedNewsSummariesPublic } from "@/lib/data/news-public"
import { metadataForStaticPage } from "@/lib/seo/pages"

export const metadata = metadataForStaticPage("news")

export const dynamic = "force-dynamic"
export const revalidate = 120

export default async function NewsPage() {
  const items = await getPublishedNewsSummariesPublic()
  const chronological = [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  return (
    <>
      <PageImageHero
        imageSrc={homeHeroDesign.imageSrc}
        imageAlt="Lajme nga Euromiti — stacione karburanti në Kosovë"
        trail={[{ label: "Ballina", href: "/" }, { label: "Lajme" }]}
        title="Lajme"
        visualPreset="flat-heavy"
        priority
      />
      <NewsArchiveExplorer items={chronological} />
    </>
  )
}
