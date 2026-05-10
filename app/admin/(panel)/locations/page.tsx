import type { Metadata } from "next"

import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { MockPersistHint } from "@/components/admin/MockPersistHint"
import { adminInputClass, adminLabelClass } from "@/components/admin/cn-admin"
import { amenityLabels } from "@/components/cards/amenity-icons"
import { Button } from "@/components/ui/button"
import { mockLocations } from "@/data/mock"

export const metadata: Metadata = {
  title: "Locations",
}

export default function AdminLocationsPage() {
  return (
    <>
      <AdminPageHeader
        title="Locations"
        description="Addresses, dial-in numbers, amenities, and map links surfaced on Locations + Contact."
        actions={
          <Button type="button" size="sm" variant="secondary" disabled>
            Add station (mock)
          </Button>
        }
      />
      <div className="flex-1 space-y-8 px-6 py-8 md:px-8 lg:px-10">
        <MockPersistHint />

        <ul className="grid gap-6 lg:grid-cols-2">
          {mockLocations.map((loc) => (
            <li key={loc.id} className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-heading text-lg font-semibold text-white">{loc.city}</h2>
                  <p className="font-mono text-xs text-zinc-500">{loc.id}</p>
                </div>
                <span className="rounded-full bg-zinc-800 px-2.5 py-1 font-medium text-zinc-300 text-xs">
                  Published
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className={adminLabelClass} htmlFor={`addr-${loc.id}`}>
                    Address
                  </label>
                  <textarea
                    id={`addr-${loc.id}`}
                    name={`address_${loc.id}`}
                    rows={2}
                    defaultValue={loc.address}
                    className={`min-h-0 resize-y ${adminInputClass}`}
                  />
                </div>
                <div>
                  <label className={adminLabelClass} htmlFor={`phone-${loc.id}`}>
                    Phone
                  </label>
                  <input id={`phone-${loc.id}`} name={`phone_${loc.id}`} defaultValue={loc.phone} className={adminInputClass} />
                </div>
                <div>
                  <label className={adminLabelClass} htmlFor={`hours-${loc.id}`}>
                    Opening hours
                  </label>
                  <textarea
                    id={`hours-${loc.id}`}
                    rows={3}
                    name={`hours_${loc.id}`}
                    defaultValue={loc.openingHours}
                    className={`min-h-0 resize-y ${adminInputClass}`}
                  />
                </div>
                <div>
                  <label className={adminLabelClass} htmlFor={`maps-${loc.id}`}>
                    Google Maps URL
                  </label>
                  <input id={`maps-${loc.id}`} name={`maps_${loc.id}`} defaultValue={loc.googleMapsUrl} className={adminInputClass} />
                </div>
                <fieldset>
                  <legend className={`${adminLabelClass} mb-2`}>On-site amenities</legend>
                  <ul className="flex flex-wrap gap-2">
                    {loc.services.map((s) => (
                      <li key={s}>
                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950/50 px-2.5 py-1.5 text-xs text-zinc-300">
                          <input type="checkbox" name={`svc_${loc.id}_${s}`} defaultChecked className="rounded border-zinc-600" />
                          {amenityLabels[s]}
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-zinc-800 border-t pt-4">
                <Button type="button" size="sm" variant="outline" disabled className="border-zinc-600 text-zinc-300">
                  Save (mock)
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
