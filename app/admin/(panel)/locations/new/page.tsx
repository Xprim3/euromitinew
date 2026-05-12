import type { Metadata } from "next"
import Link from "next/link"

import { createLocationAction } from "@/app/admin/(panel)/locations/actions"
import { LocationEditorForm } from "@/components/admin/LocationEditorForm"
import { AdminSectionCard } from "@/components/admin/design-system"
import { dsBtnTertiary } from "@/components/admin/design-system/ds-button-classes"
import { emptyGalleryDraft } from "@/lib/data/locations-admin-shared"

export const metadata: Metadata = {
  title: "New location",
}

export default function AdminNewLocationPage() {
  return (
    <div className="space-y-6">
      <AdminSectionCard>
        <Link href="/admin/locations" className={dsBtnTertiary}>
          Back to list
        </Link>
      </AdminSectionCard>
      <LocationEditorForm
        mode="create"
        submitAction={createLocationAction}
        initial={null}
        gallerySlots={emptyGalleryDraft()}
        mainPreviewUrl={null}
        mainImageAlt=""
      />
    </div>
  )
}
