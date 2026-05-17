import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Container } from "@/components/layout/Container"
import { PageImageHero } from "@/components/layout/PageImageHero"
import { SectionReveal } from "@/components/motion/SectionReveal"
import { JsonLd } from "@/components/seo/JsonLd"
import { getNewsArticleBySlugPublic } from "@/lib/data/news-public"
import { formatNewsDate } from "@/lib/format-news-date"
import { buildPageMetadata, resolveOgImageUrl } from "@/lib/seo/metadata"
import { buildBreadcrumbSchema, buildNewsArticleSchema } from "@/lib/seo/json-ld"

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 120

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getNewsArticleBySlugPublic(slug)
  if (!article) {
    return buildPageMetadata({
      title: "Lajme",
      description: "Artikulli i kërkuar nuk u gjet.",
      path: `/news/${slug}`,
      noIndex: true,
    })
  }

  const title = article.seoTitle?.trim() || article.title
  const description = article.seoDescription?.trim() || article.excerpt

  return buildPageMetadata({
    title,
    description,
    path: `/news/${article.slug}`,
    ogType: "article",
    ogImage: article.imageSrc,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    noIndex: article.noIndex,
  })
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getNewsArticleBySlugPublic(slug)
  if (!article) {
    notFound()
  }

  const imageForSchema = article.imageSrc.startsWith("http")
    ? article.imageSrc
    : resolveOgImageUrl(article.imageSrc)

  return (
    <>
      <JsonLd
        data={[
          buildNewsArticleSchema({
            title: article.title,
            description: article.excerpt,
            slug: article.slug,
            publishedAt: article.publishedAt,
            updatedAt: article.updatedAt,
            imageUrl: imageForSchema,
          }),
          buildBreadcrumbSchema([
            { name: "Ballina", path: "/" },
            { name: "Lajme", path: "/news" },
            { name: article.title, path: `/news/${article.slug}` },
          ]),
        ]}
      />
      <PageImageHero
        imageSrc={article.imageSrc}
        imageAlt={article.imageAlt}
        trail={[
          { label: "Ballina", href: "/" },
          { label: "Lajme", href: "/news" },
          { label: article.title },
        ]}
        title={article.title}
        visualPreset="flat-heavy"
        priority
      />

      <Container className="euromiti-section">
        <SectionReveal once variant="fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {formatNewsDate(article.publishedAt)}
          </p>

          <article className="mx-auto mt-10 max-w-3xl md:mt-12">
            <div className="space-y-6 text-base leading-relaxed text-muted-foreground md:text-[1.0625rem]">
              {[...article.contentParagraphs].map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </article>

          <p className="mx-auto mt-12 max-w-3xl border-border/70 border-t pt-8">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              ← Kthehu te lajmet
            </Link>
          </p>
        </SectionReveal>
      </Container>
    </>
  )
}
