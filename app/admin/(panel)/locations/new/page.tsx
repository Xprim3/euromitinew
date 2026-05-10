import type { Metadata } from "next"
import Link from "next/link"

import { createLocationAction } from "@/app/admin/(panel)/locations/actions"
import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { LocationEditorForm } from "@/components/admin/LocationEditorForm"
import { Button } from "@/components/ui/button"
import { emptyGalleryDraft } from "@/lib/data/locations-admin-shared"

export const metadata: Metadata = {
  title: "New location",
}

export default function AdminNewLocationPage() {
  return (
    <>
      <AdminPageHeader
        title="New location"
        description="Creates a row in `locations` and optional gallery links in `location_images`."
        actions={
          <Button type="button" size="sm" variant="outline" render={<Link href="/admin/locations" />}>
            Back to list
          </Button>
        }
      />
      <div className="flex-1 px-6 py-8 md:px-8 lg:px-10">
        <LocationEditorForm
          mode="create"
          submitAction={createLocationAction}
          initial={null}
          gallerySlots={emptyGalleryDraft()}
        />
      </div>
    </>
  )
}
