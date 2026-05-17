import { PageImageHero } from "@/components/layout/PageImageHero"
import { NewsArchiveExplorer } from "@/components/news/NewsArchiveExplorer"
import { getPublishedNewsSummariesPublic } from "@/lib/data/news-public"
import { getInteriorPageHeroPublic } from "@/lib/data/page-hero-public"
import { metadataForStaticPage } from "@/lib/seo/pages"

export const metadata = metadataForStaticPage("news")

export const dynamic = "force-dynamic"
export const revalidate = 120

export default async function NewsPage() {
  const [items, pageHero] = await Promise.all([
    getPublishedNewsSummariesPublic(),
    getInteriorPageHeroPublic("news", "Lajme nga Euromiti — stacione karburanti në Kosovë"),
  ])
  const chronological = [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  return (
    <>
      <PageImageHero
        imageSrc={pageHero.imageSrc}
        imageAlt={pageHero.imageAlt}
        trail={[{ label: "Ballina", href: "/" }, { label: "Lajme" }]}
        title="Lajme"
        visualPreset="flat-heavy"
        priority
      />
      <NewsArchiveExplorer items={chronological} />
    </>
  )
}
