import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { updateNewsPostAction } from "@/app/admin/(panel)/news/actions"
import { DeleteNewsPostForm } from "@/components/admin/DeleteNewsPostForm"
import { NewsPostForm } from "@/components/admin/NewsPostForm"
import { Button } from "@/components/ui/button"
import { getMediaPublicUrlAdmin, getNewsPostByIdAdmin } from "@/lib/data/news-admin"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const row = await getNewsPostByIdAdmin(id)
  if (!row) return { title: "Article" }
  return { title: `Edit · ${row.title}` }
}

export default async function AdminEditNewsPage({ params }: Props) {
  const { id } = await params
  const row = await getNewsPostByIdAdmin(id)
  if (!row) notFound()

  const heroPreviewUrl = await getMediaPublicUrlAdmin(row.hero_media_id)

  const previewHref = row.status === "published" ? `/news/${row.slug}` : null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-end gap-2">
        {previewHref ? (
          <Button type="button" size="sm" variant="secondary" render={<Link href={previewHref} target="_blank" />}>
            View live
          </Button>
        ) : null}
        <DeleteNewsPostForm id={row.id} slug={row.slug} label={row.title} />
        <Button type="button" size="sm" variant="outline" render={<Link href="/admin/news" />}>
          Back to list
        </Button>
      </div>
      <NewsPostForm
        mode="edit"
        submitAction={updateNewsPostAction}
        initial={row}
        heroPreviewUrl={heroPreviewUrl}
      />
    </div>
  )
}
