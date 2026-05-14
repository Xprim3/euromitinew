"use client"

import { useState } from "react"

import {
  ADMIN_SERVICE_OPTIONS,
  AdminContentGrid,
  AdminSectionCard,
  FileUploadInput,
  FormSection,
  ImageGalleryManager,
  type GallerySlot,
  MultiSelectInput,
  SaveBar,
  SelectInput,
  TextareaInput,
  TextInput,
  ToggleInput,
} from "@/components/admin/design-system"

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
] as const

export function AdminFormComponentsPreview() {
  const [services, setServices] = useState<string[]>(["petrol", "restaurant"])
  const [gallerySlots, setGallerySlots] = useState<GallerySlot[]>([
    {
      id: "restaurant-main",
      label: "Restaurant hero",
      previewUrl: "/menu/menu4.jpg",
      altText: "Premium Euromiti restaurant interior",
    },
    {
      id: "restaurant-detail",
      label: "Restaurant detail",
      previewUrl: "/menu/menu7.jpg",
      altText: "Euromiti dining detail",
    },
  ])

  return (
    <form
      className="space-y-6 pb-24"
      onSubmit={(event) => {
        event.preventDefault()
      }}
    >
      <AdminSectionCard
        title="Phase 4 form component preview"
        description="This page is a non-persistent admin preview. It exercises reusable inputs only; no database writes happen here."
      >
        <AdminContentGrid>
          <TextInput
            label="Page title"
            name="preview_title"
            placeholder="Euromiti Prishtina Station"
            helperText="Use a clear public-facing title. Required fields show the red asterisk."
            required
          />
          <SelectInput
            label="Publish status"
            name="preview_status"
            placeholder="Choose status"
            options={statusOptions}
            defaultValue="draft"
            helperText="Only published content should appear on the public website."
            required
          />
          <TextInput
            label="URL slug"
            name="preview_slug"
            placeholder="prishtina-flagship"
            helperText="Lowercase letters, numbers, and hyphens."
            error="Example error state for validation copy."
          />
          <ToggleInput
            label="Featured"
            name="preview_featured"
            description="Promote this item in highlighted admin and public surfaces."
            checkedLabel="Featured"
            uncheckedLabel="Not featured"
            helperText="Use this same component for active/inactive and published/draft switches."
          />
        </AdminContentGrid>
      </AdminSectionCard>

      <FormSection
        title="Content fields"
        description="Textarea includes helper copy and a character counter for long editorial input."
      >
        <TextareaInput
          label="Summary"
          name="preview_summary"
          placeholder="Write a short section summary..."
          helperText="Keep this concise so it scans well in cards and page intros."
          maxLength={240}
          showCharacterCount
          rows={5}
        />
        <MultiSelectInput
          label="Services offered"
          name="preview_services"
          options={ADMIN_SERVICE_OPTIONS}
          value={services}
          onChange={setServices}
          helperText="Use for location service availability: Petrol, Restaurant, Carwash, and Mini Market."
          required
        />
      </FormSection>

      <FormSection
        title="Media fields"
        description="Reusable media components handle preview, replacement, removal, and alt text."
      >
        <FileUploadInput
          label="Main image"
          name="preview_main_image"
          helperText="Drag an image into the area or click to choose a file. Preview updates locally in this demo."
          previewUrl="/menu/menu4.jpg"
          previewAlt="Euromiti preview image"
          removeInputName="preview_remove_main_image"
        />
        <ImageGalleryManager
          label="Gallery images"
          name="preview_gallery"
          helperText="Manage multiple images, replacement files, removal, ordering, and alt text."
          slots={gallerySlots}
          onSlotsChange={setGallerySlots}
          maxSlots={6}
        />
      </FormSection>

      <SaveBar
        cancelLabel="Cancel preview"
        onCancel={() => {
          setServices(["petrol", "restaurant"])
        }}
      />
    </form>
  )
}
