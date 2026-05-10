import type { Metadata } from "next"
import Link from "next/link"

import { createNewsPostAction } from "@/app/admin/(panel)/news/actions"
import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { NewsPostForm } from "@/components/admin/NewsPostForm"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "New article",
}

export default function AdminNewNewsPage() {
  return (
    <>
      <AdminPageHeader
        title="New article"
        description="Adds a draft or published row in `news_posts` with optional hero image in `euromiti-media`."
        actions={
          <Button type="button" size="sm" variant="outline" render={<Link href="/admin/news" />}>
            Back to list
          </Button>
        }
      />
      <div className="flex-1 px-6 py-8 md:px-8 lg:px-10">
        <NewsPostForm mode="create" submitAction={createNewsPostAction} initial={null} heroPreviewUrl={null} />
      </div>
    </>
  )
}
