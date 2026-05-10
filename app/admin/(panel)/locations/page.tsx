import type { Metadata } from "next"
import Link from "next/link"

import { DeleteLocationForm } from "@/components/admin/DeleteLocationForm"
import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { Button } from "@/components/ui/button"
import { normalizeLocationRow } from "@/lib/data/locations-admin-shared"
import { formatNewsDate } from "@/lib/format-news-date"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Locations",
}

export default async function AdminLocationsPage() {
  let message: string | null = null
  let rows: ReturnType<typeof normalizeLocationRow>[] = []

  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("city", { ascending: true })

    if (error) message = error.message
    else if (data?.length) rows = data.map((r) => normalizeLocationRow(r as Record<string, unknown>))
  } catch {
    message =
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local."
  }

  return (
    <>
      <AdminPageHeader
        title="Locations"
        description="Forecourt records for `/locations` — backed by Supabase `locations` and `location_images`."
        actions={
          <Button type="button" size="sm" variant="secondary" render={<Link href="/admin/locations/new" />}>
            Add location
          </Button>
        }
      />
      <div className="flex-1 space-y-6 px-6 py-8 md:px-8 lg:px-10">
        <p className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-emerald-100/95 text-sm">
          Saving or deleting revalidates the public{" "}
          <code className="rounded bg-zinc-900/80 px-1 py-0.5 text-xs">/locations</code> route.
        </p>

        {message ? (
          <p
            role="alert"
            className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-100 text-sm"
          >
            {message}
          </p>
        ) : null}

        {!message && rows.length === 0 ? (
          <p className="text-sm text-zinc-400">
            No locations yet.&nbsp;
            <Link href="/admin/locations/new" className="text-emerald-300 underline underline-offset-2 hover:text-emerald-200">
              Create the first station
            </Link>
            .
          </p>
        ) : null}

        {!message && rows.length > 0 ? (
          <ul className="grid gap-5 lg:grid-cols-2">
            {rows.map((loc) => (
              <li key={loc.id} className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3 border-zinc-800 border-b pb-4">
                  <div>
                    <h2 className="font-heading text-lg font-semibold text-white">{loc.city}</h2>
                    <p className="mt-0.5 font-mono text-xs text-zinc-500">{loc.slug}</p>
                    <p className="mt-2 text-xs text-zinc-500">
                      Updated <span className="text-zinc-400">{formatNewsDate(loc.updated_at)}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 font-medium text-xs ${
                        loc.is_active ? "bg-emerald-500/15 text-emerald-200" : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {loc.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <dl className="mt-4 space-y-2 text-sm text-zinc-300">
                  <div>
                    <dt className="text-zinc-500 text-xs uppercase tracking-wide">Address</dt>
                    <dd className="mt-1 whitespace-pre-wrap">{loc.address}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 text-xs uppercase tracking-wide">Phone</dt>
                    <dd className="mt-1">{loc.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 text-xs uppercase tracking-wide">Email</dt>
                    <dd className="mt-1">{loc.contact_email?.trim() || "—"}</dd>
                  </div>
                </dl>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="outline" render={<Link href={`/admin/locations/${loc.id}`} />}>
                    Edit
                  </Button>
                  <DeleteLocationForm id={loc.id} label={loc.city} />
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  )
}
