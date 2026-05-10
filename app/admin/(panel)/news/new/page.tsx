import type { Metadata } from "next"
import Link from "next/link"

import { createNewsPostAction } from "@/app/admin/(panel)/news/actions"
import { NewsPostForm } from "@/components/admin/NewsPostForm"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "New article",
}

export default function AdminNewNewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" size="sm" variant="outline" render={<Link href="/admin/news" />}>
          Back to list
        </Button>
      </div>
      <NewsPostForm mode="create" submitAction={createNewsPostAction} initial={null} heroPreviewUrl={null} />
    </div>
  )
}
