import type { Metadata } from "next"
import Link from "next/link"

import { createNewsPostAction } from "@/app/admin/(panel)/news/actions"
import { NewsPostForm } from "@/components/admin/NewsPostForm"
import { AdminSectionCard, cnDs, dsBtnTertiary } from "@/components/admin/design-system"

export const metadata: Metadata = {
  title: "New article",
}

export default function AdminNewNewsPage() {
  return (
    <div className="space-y-6">
      <AdminSectionCard
        title="Create news post"
        description="Draft the post, upload a featured image, and publish when ready."
        headerActions={
          <Link href="/admin/news" className={cnDs(dsBtnTertiary, "min-h-10 px-4 text-xs")}>
            Back to list
          </Link>
        }
      >
        <p className="text-sm text-[var(--admin-text-muted)]">Complete the editor below, then save the post.</p>
      </AdminSectionCard>
      <NewsPostForm mode="create" submitAction={createNewsPostAction} initial={null} heroPreviewUrl={null} />
    </div>
  )
}
