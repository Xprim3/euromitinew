import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { updateNewsPostAction } from "@/app/admin/(panel)/news/actions"
import { DeleteNewsPostForm } from "@/components/admin/DeleteNewsPostForm"
import { NewsPostForm } from "@/components/admin/NewsPostForm"
import { AdminSectionCard, cnDs, dsBtnSecondary, dsBtnTertiary } from "@/components/admin/design-system"
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
      <AdminSectionCard
        title="Edit news post"
        description={
          row.status === "published"
            ? "This post is visible on the public News page."
            : "This post is currently hidden from the public News page."
        }
        headerActions={
          <>
            {previewHref ? (
              <Link href={previewHref} target="_blank" className={cnDs(dsBtnSecondary, "min-h-10 px-4 text-xs")}>
                View live
              </Link>
            ) : null}
            <DeleteNewsPostForm id={row.id} slug={row.slug} label={row.title} redirectOnSuccess />
            <Link href="/admin/news" className={cnDs(dsBtnTertiary, "min-h-10 px-4 text-xs")}>
              Back to list
            </Link>
          </>
        }
      >
        <p className="text-sm text-[var(--admin-text-muted)]">Update the fields below and save to revalidate public News pages.</p>
      </AdminSectionCard>
      <NewsPostForm mode="edit" submitAction={updateNewsPostAction} initial={row} heroPreviewUrl={heroPreviewUrl} />
    </div>
  )
}
