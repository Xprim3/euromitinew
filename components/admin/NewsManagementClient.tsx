"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

import { DeleteNewsPostForm } from "@/components/admin/DeleteNewsPostForm"
import {
  AdminContentGrid,
  AdminSectionCard,
  AdminTable,
  AdminTableBody,
  AdminTableHead,
  AdminTableRow,
  AdminTableTd,
  AdminTableTh,
  SelectInput,
  StatusBadge,
  TableActions,
  TextInput,
  cnDs,
  dsBtnGhost,
  dsBtnPrimary,
} from "@/components/admin/design-system"
import { formatNewsDate } from "@/lib/format-news-date"
import type { NewsPostRow } from "@/types/supabase-cms"

type NewsManagementClientProps = {
  rows: NewsPostRow[]
}

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
] as const

function statusTone(status: string): "success" | "warning" | "neutral" {
  if (status === "published") return "success"
  if (status === "archived") return "neutral"
  return "warning"
}

export function NewsManagementClient({ rows }: NewsManagementClientProps) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((post) => {
      const matchesStatus = status === "all" || post.status === status
      const haystack = `${post.title} ${post.slug} ${post.category ?? ""}`.toLowerCase()
      return matchesStatus && (!q || haystack.includes(q))
    })
  }, [query, rows, status])

  return (
    <AdminSectionCard
      title="News management"
      description="Create, edit, filter, and publish Euromiti news posts."
      headerActions={
        <Link href="/admin/news/new" className={cnDs(dsBtnPrimary, "min-h-10 px-4 text-xs")}>
          Add post
        </Link>
      }
    >
      <div className="space-y-5">
        <AdminContentGrid columns={2}>
          <TextInput
            label="Search posts"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, slug, or category"
          />
          <SelectInput
            label="Filter by status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            options={statusOptions}
          />
        </AdminContentGrid>

        <AdminTable>
          <AdminTableHead>
            <AdminTableRow>
              <AdminTableTh>Title</AdminTableTh>
              <AdminTableTh>Status</AdminTableTh>
              <AdminTableTh>Category</AdminTableTh>
              <AdminTableTh>Published</AdminTableTh>
              <AdminTableTh className="text-right">Actions</AdminTableTh>
            </AdminTableRow>
          </AdminTableHead>
          <AdminTableBody>
            {filtered.length === 0 ? (
              <AdminTableRow>
                <AdminTableTd colSpan={5} className="py-10 text-center text-[var(--admin-text-muted)]">
                  No posts match this filter.
                </AdminTableTd>
              </AdminTableRow>
            ) : (
              filtered.map((post) => (
                <AdminTableRow key={post.id}>
                  <AdminTableTd>
                    <div className="font-medium">{post.title}</div>
                    <div className="mt-1 font-mono text-xs text-[var(--admin-text-muted)]">/news/{post.slug}</div>
                  </AdminTableTd>
                  <AdminTableTd>
                    <StatusBadge tone={statusTone(post.status)}>{post.status}</StatusBadge>
                  </AdminTableTd>
                  <AdminTableTd>{post.category ?? "—"}</AdminTableTd>
                  <AdminTableTd>
                    {post.status === "published" && post.published_at ? formatNewsDate(post.published_at) : "—"}
                  </AdminTableTd>
                  <AdminTableTd className="text-right">
                    <TableActions>
                      {post.status === "published" ? (
                        <Link
                          href={`/news/${post.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className={cnDs(dsBtnGhost, "min-h-9 px-3 text-xs")}
                        >
                          View
                        </Link>
                      ) : null}
                      <Link href={`/admin/news/${post.id}`} className={cnDs(dsBtnGhost, "min-h-9 px-3 text-xs")}>
                        Edit
                      </Link>
                      <DeleteNewsPostForm id={post.id} slug={post.slug} label={post.title} />
                    </TableActions>
                  </AdminTableTd>
                </AdminTableRow>
              ))
            )}
          </AdminTableBody>
        </AdminTable>
      </div>
    </AdminSectionCard>
  )
}
