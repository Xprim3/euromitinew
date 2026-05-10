import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Container } from "@/components/layout/Container"
import { SectionReveal } from "@/components/motion/SectionReveal"
import { PageHeader } from "@/components/layout/PageHeader"
import { getNewsArticleBySlugPublic } from "@/lib/data/news-public"
import { formatNewsDate } from "@/lib/format-news-date"

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 120

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getNewsArticleBySlugPublic(slug)
  if (!article) {
    return { title: "News" }
  }
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      ...(article.imageSrc.startsWith("https://")
        ? { images: [{ url: article.imageSrc }] }
        : {}),
    },
  }
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getNewsArticleBySlugPublic(slug)
  if (!article) {
    notFound()
  }

  return (
    <>
      <PageHeader
        title={article.title}
        description={article.excerpt}
        breadcrumbs={
          <>
            <Link href="/">Home</Link>
            <span className="px-2 text-muted-foreground/80">/</span>
            <Link href="/news">News</Link>
            <span className="px-2 text-muted-foreground/80">/</span>
            <span className="text-foreground line-clamp-1">{article.title}</span>
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
              ← Back to news
            </Link>
          </p>
        </SectionReveal>
      </Container>
    </>
  )
}
