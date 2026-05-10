import type { Metadata } from "next"
import Link from "next/link"

import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { MockPersistHint } from "@/components/admin/MockPersistHint"
import { Button } from "@/components/ui/button"
import { mockNewsSummaries } from "@/data/mock"
import { formatNewsDate } from "@/lib/format-news-date"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "News",
}

export default function AdminNewsPage() {
  return (
    <>
      <AdminPageHeader
        title="News"
        description="Stories shown in the archive and `/news/[slug]` article template."
        actions={
          <Button type="button" size="sm" variant="secondary" disabled>
            New article (mock)
          </Button>
        }
      />
      <div className="flex-1 space-y-6 px-6 py-8 md:px-8 lg:px-10">
        <MockPersistHint />

        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/45">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="border-zinc-800 border-b bg-zinc-900/70 text-xs text-zinc-400 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Category</th>
                <th className="px-4 py-3 font-semibold">Published</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockNewsSummaries.map((article) => (
                <tr key={article.id} className="border-zinc-800/80 border-b last:border-none">
                  <td className="max-w-[16rem] px-4 py-3">
                    <div className="font-medium text-zinc-100 truncate">{article.title}</div>
                    <div className="mt-1 font-mono text-xs text-zinc-500">/{article.slug}</div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="inline-flex rounded-md bg-zinc-800 px-2 py-1 font-medium text-zinc-300 text-xs">
                      {article.category ?? "Insights"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">
                    {formatNewsDate(article.publishedAt)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Button
                      size="sm"
                      variant="ghost"
                      className={cn("text-zinc-300 hover:bg-zinc-800 hover:text-white")}
                      render={<Link href={`/news/${article.slug}`} />}
                    >
                      Preview
                    </Button>
                    <Button type="button" size="sm" variant="ghost" disabled className="text-zinc-500">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
