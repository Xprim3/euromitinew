import type { Metadata } from "next"
import Link from "next/link"

import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { Button } from "@/components/ui/button"
import { listNewsPostsAdmin } from "@/lib/data/news-admin"
import { formatNewsDate } from "@/lib/format-news-date"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "News",
}

function statusTone(status: string) {
  if (status === "published") return "bg-emerald-500/25 text-emerald-200 ring-emerald-500/35"
  if (status === "archived") return "bg-zinc-700 text-zinc-300 ring-zinc-600"
  return "bg-amber-500/18 text-amber-100 ring-amber-400/35"
}

export default async function AdminNewsPage() {
  const rows = await listNewsPostsAdmin()

  return (
    <>
      <AdminPageHeader
        title="News"
        description="Create and manage posts for `/news` and `/news/[slug]`. Published items appear on the public site."
        actions={
          <Button type="button" size="sm" variant="secondary" render={<Link href="/admin/news/new" />}>
            New article
          </Button>
        }
      />
      <div className="flex-1 space-y-6 px-6 py-8 md:px-8 lg:px-10">
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/45">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="border-zinc-800 border-b bg-zinc-900/70 text-xs text-zinc-400 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Status</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Category</th>
                <th className="px-4 py-3 font-semibold">Published</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-zinc-500">
                    No posts yet. Use <span className="text-zinc-300">New article</span> to create one.
                  </td>
                </tr>
              ) : (
                rows.map((article) => {
                  return (
                    <tr key={article.id} className="border-zinc-800/80 border-b last:border-none">
                      <td className="max-w-[16rem] px-4 py-3">
                        <div className="truncate font-medium text-zinc-100">{article.title}</div>
                        <div className="mt-1 font-mono text-xs text-zinc-500">/{article.slug}</div>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <span
                          className={cn(
                            "inline-flex rounded-md px-2 py-1 font-medium text-xs ring-1 ring-inset",
                            statusTone(article.status)
                          )}
                        >
                          {article.status}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        <span className="inline-flex rounded-md bg-zinc-800 px-2 py-1 font-medium text-xs text-zinc-300">
                          {article.category ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">
                        {article.status === "published" && article.published_at
                          ? formatNewsDate(article.published_at)
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {article.status === "published" ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-zinc-300 hover:bg-zinc-800 hover:text-white"
                            render={<Link href={`/news/${article.slug}`} target="_blank" rel="noreferrer" />}
                          >
                            View
                          </Button>
                        ) : null}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-zinc-300 hover:bg-zinc-800 hover:text-white"
                          render={<Link href={`/admin/news/${article.id}`} />}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
