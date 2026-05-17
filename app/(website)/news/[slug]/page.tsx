import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Container } from "@/components/layout/Container"
import { PageHeader } from "@/components/layout/PageHeader"
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
      <PageHeader
        title={article.title}
        breadcrumbs={
          <>
            <Link href="/">Ballina</Link>
            <span className="px-2 text-muted-foreground/80">/</span>
            <Link href="/news">Lajme</Link>
            <span className="px-2 text-muted-foreground/80">/</span>
            <span className="line-clamp-1 text-foreground">{article.title}</span>
          </>
        }
      />

      <Container className="euromiti-section">
        <SectionReveal once variant="fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {formatNewsDate(article.publishedAt)}
          </p>

          <div className="relative mx-auto mt-8 aspect-21/11 max-w-4xl overflow-hidden rounded-[var(--rounded-lg)] border border-border/80 bg-muted shadow-(--shadow-euromiti-soft)">
            <Image
              src={article.imageSrc}
              alt={article.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 56rem"
              className="object-cover"
            />
          </div>

          <article className="mx-auto mt-12 max-w-3xl">
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
