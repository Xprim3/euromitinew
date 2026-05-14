import type { Metadata } from "next"
import Link from "next/link"

import { DeleteLocationForm } from "@/components/admin/DeleteLocationForm"
import { AdminSectionCard, ErrorMessage, StatusBadge, SuccessMessage } from "@/components/admin/design-system"
import { dsBtnPrimary, dsBtnTertiary } from "@/components/admin/design-system/ds-button-classes"
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
    <div className="space-y-6">
      <AdminSectionCard
        title="Locations management"
        description="Manage Prishtina, Ferizaj, and Gjilan location content, contact details, service availability, and media."
        headerActions={
          <Link href="/admin/locations/new" className={dsBtnPrimary}>
            Add location
          </Link>
        }
      >
        <p className="text-sm text-[var(--admin-text-muted)]">
          Each card opens a full editor with services, map link, main image, and active/inactive visibility.
        </p>
      </AdminSectionCard>

      <SuccessMessage title="Public revalidation">
          Saving or deleting revalidates the public{" "}
          <code className="rounded bg-emerald-100 px-1 py-0.5 text-xs">/locations</code> route and homepage
          preview.
      </SuccessMessage>

      {message ? (
        <ErrorMessage title="Locations could not load">
          {message}
        </ErrorMessage>
      ) : null}

      {!message && rows.length === 0 ? (
        <AdminSectionCard>
          <p className="text-sm text-[var(--admin-text-muted)]">
            No locations yet.&nbsp;
            <Link href="/admin/locations/new" className="font-medium text-[var(--admin-text)] underline underline-offset-2">
              Create the first station
            </Link>
            .
          </p>
        </AdminSectionCard>
      ) : null}

      {!message && rows.length > 0 ? (
        <div className="grid gap-5 xl:grid-cols-3">
          {rows.map((loc) => (
            <AdminSectionCard
              key={loc.id}
              title={loc.city}
              description={loc.page_heading?.trim() || loc.slug}
              headerActions={
                <StatusBadge tone={loc.is_active ? "success" : "neutral"}>
                  {loc.is_active ? "Active" : "Inactive"}
                </StatusBadge>
              }
            >
              <div className="space-y-5">
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-[var(--admin-text-muted)] text-xs uppercase tracking-wide">Address</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-[var(--admin-text)]">{loc.address}</dd>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <div>
                      <dt className="text-[var(--admin-text-muted)] text-xs uppercase tracking-wide">Phone</dt>
                      <dd className="mt-1 text-[var(--admin-text)]">{loc.phone}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--admin-text-muted)] text-xs uppercase tracking-wide">Email</dt>
                      <dd className="mt-1 text-[var(--admin-text)]">{loc.contact_email?.trim() || "—"}</dd>
                    </div>
                  </div>
                  <div>
                    <dt className="text-[var(--admin-text-muted)] text-xs uppercase tracking-wide">Updated</dt>
                    <dd className="mt-1 text-[var(--admin-text)]">{formatNewsDate(loc.updated_at)}</dd>
                  </div>
                </dl>

                <div>
                  <p className="mb-2 text-[var(--admin-text-muted)] text-xs uppercase tracking-wide">Services</p>
                  <div className="flex flex-wrap gap-2">
                    {loc.services.length ? (
                      loc.services.map((service) => (
                        <span key={service} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {service.replace("_", " ")}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-[var(--admin-text-muted)]">No services selected</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 border-[var(--admin-border)] border-t pt-4">
                  <Link href={`/admin/locations/${loc.id}`} className={dsBtnTertiary}>
                    Edit location
                  </Link>
                  <DeleteLocationForm id={loc.id} label={loc.city} />
                </div>
              </div>
            </AdminSectionCard>
          ))}
        </div>
      ) : null}
    </div>
  )
}
