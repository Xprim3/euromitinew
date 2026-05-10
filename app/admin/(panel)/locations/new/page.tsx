import type { Metadata } from "next"
import Link from "next/link"

import { createLocationAction } from "@/app/admin/(panel)/locations/actions"
import { LocationEditorForm } from "@/components/admin/LocationEditorForm"
import { Button } from "@/components/ui/button"
import { emptyGalleryDraft } from "@/lib/data/locations-admin-shared"

export const metadata: Metadata = {
  title: "New location",
}

export default function AdminNewLocationPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" size="sm" variant="outline" render={<Link href="/admin/locations" />}>
          Back to list
        </Button>
      </div>
      <LocationEditorForm
        mode="create"
        submitAction={createLocationAction}
        initial={null}
        gallerySlots={emptyGalleryDraft()}
      />
    </div>
  )
}
