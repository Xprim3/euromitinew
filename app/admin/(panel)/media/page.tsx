import type { Metadata } from "next"

import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { MockPersistHint } from "@/components/admin/MockPersistHint"
import { Button } from "@/components/ui/button"
import { mockAdminMediaAssets } from "@/data/mock/admin"
import { formatAdminBytes } from "@/lib/admin-format"
import { formatNewsDate } from "@/lib/format-news-date"

export const metadata: Metadata = {
  title: "Media",
}

export default function AdminMediaPage() {
  return (
    <>
      <AdminPageHeader
        title="Media library"
        description="Uploaded photography and collateral — wire to storage in Phase 6+."
        actions={
          <Button type="button" size="sm" variant="secondary" disabled>
            Upload files (mock)
          </Button>
        }
      />
      <div className="flex-1 space-y-6 px-6 py-8 md:px-8 lg:px-10">
        <MockPersistHint />

        <div
          role="presentation"
          className="flex min-h-[8rem] flex-col items-center justify-center rounded-xl border border-zinc-800 border-dashed bg-zinc-900/35 px-6 py-10 text-center"
        >
          <p className="font-medium text-sm text-zinc-300">Drop files here (disabled)</p>
          <p className="mt-2 max-w-md text-sm text-zinc-500">
            Local uploads hook up once Supabase Storage or another provider is configured.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/45">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="border-zinc-800 border-b bg-zinc-900/70 text-xs text-zinc-400 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Kind</th>
                <th className="px-4 py-3 font-semibold">Used in</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Size</th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">Uploaded</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockAdminMediaAssets.map((asset) => (
                <tr key={asset.id} className="border-zinc-800/80 border-b last:border-none">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-100">{asset.name}</div>
                    <div className="font-mono text-xs text-zinc-500">{asset.path}</div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="rounded-md bg-zinc-800 px-2 py-1 font-semibold capitalize text-[0.7rem] text-zinc-300">
                      {asset.kind}
                    </span>
                  </td>
                  <td className="max-w-[14rem] px-4 py-3 text-zinc-400">{asset.usedIn}</td>
                  <td className="hidden px-4 py-3 text-zinc-500 md:table-cell whitespace-nowrap">
                    {formatAdminBytes(asset.bytes)}
                  </td>
                  <td className="hidden px-4 py-3 text-zinc-500 lg:table-cell whitespace-nowrap">
                    {formatNewsDate(asset.uploadedAt)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Button type="button" size="sm" variant="ghost" disabled className="text-zinc-500">
                      Replace
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
