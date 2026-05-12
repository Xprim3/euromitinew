"use client"

import { useCallback, useMemo } from "react"
import { ChevronDown, ChevronUp, ImagePlus, Trash2 } from "lucide-react"

import { cnDs } from "./cn-ds"
import { dsBtnGhost, dsBtnTertiary } from "./ds-button-classes"
import { ImagePreview } from "./ImagePreview"

export type GallerySlot = {
  id: string
  label?: string
  /** Remote URL or blob preview. */
  previewUrl?: string | null
  altText?: string
  existingMediaId?: string
  clear?: boolean
}

export type ImageGalleryManagerProps = {
  label?: string
  helperText?: string
  error?: string
  /** Prefix for generated file and alt-text field names. */
  name?: string
  slots: GallerySlot[]
  maxSlots?: number
  onSlotsChange: (next: GallerySlot[]) => void
  /** Keep slot positions instead of removing entries; useful for fixed DB gallery slots. */
  fixedSlots?: boolean
  fileInputName?: (slot: GallerySlot, index: number) => string
  altInputName?: (slot: GallerySlot, index: number) => string
  existingMediaIdInputName?: (slot: GallerySlot, index: number) => string
  clearInputName?: (slot: GallerySlot, index: number) => string
  /** When omitted, image replace UI is hidden until Phase 2 wiring. */
  onFileForSlot?: (slotId: string, file: File) => void
  className?: string
}

/**
 * Reorderable gallery slots with file pick + remove — caller owns state (`slots` / `onSlotsChange`).
 */
export function ImageGalleryManager({
  label = "Gallery",
  helperText,
  error,
  name = "gallery",
  slots,
  maxSlots = 8,
  onSlotsChange,
  fixedSlots = false,
  fileInputName,
  altInputName,
  existingMediaIdInputName,
  clearInputName,
  onFileForSlot,
  className,
}: ImageGalleryManagerProps) {
  const canAdd = !fixedSlots && slots.length < maxSlots

  const move = useCallback(
    (index: number, dir: -1 | 1) => {
      const j = index + dir
      if (j < 0 || j >= slots.length) return
      const next = [...slots]
      const t = next[index]!
      next[index] = next[j]!
      next[j] = t
      onSlotsChange(next)
    },
    [onSlotsChange, slots]
  )

  const remove = useCallback(
    (id: string) => {
      if (fixedSlots) {
        onSlotsChange(
          slots.map((slot) =>
            slot.id === id
              ? { ...slot, previewUrl: null, existingMediaId: "", clear: true }
              : slot
          )
        )
        return
      }
      onSlotsChange(slots.filter((s) => s.id !== id))
    },
    [fixedSlots, onSlotsChange, slots]
  )

  const addSlot = useCallback(() => {
    if (!canAdd) return
    onSlotsChange([...slots, { id: crypto.randomUUID(), label: `Image ${slots.length + 1}`, previewUrl: null, altText: "" }])
  }, [canAdd, onSlotsChange, slots])

  const fileInputs = useMemo(() => slots.map((s) => `gallery-file-${s.id}`), [slots])

  const updateAltText = useCallback(
    (id: string, altText: string) => {
      onSlotsChange(slots.map((slot) => (slot.id === id ? { ...slot, altText } : slot)))
    },
    [onSlotsChange, slots]
  )

  const replacePreview = useCallback(
    (slotId: string, file: File) => {
      onFileForSlot?.(slotId, file)
      if (!file.type.startsWith("image/")) return
      const previewUrl = URL.createObjectURL(file)
      onSlotsChange(slots.map((slot) => (slot.id === slotId ? { ...slot, previewUrl, clear: false } : slot)))
    },
    [onFileForSlot, onSlotsChange, slots]
  )

  return (
    <div className={cnDs("space-y-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase">{label}</p>
          {helperText ? <p className="mt-1 text-xs leading-5 text-[var(--admin-text-muted)]">{helperText}</p> : null}
        </div>
        {!fixedSlots ? (
          <button type="button" className={cnDs(dsBtnTertiary, "min-h-9 px-3 text-xs")} onClick={addSlot} disabled={!canAdd}>
            <ImagePlus className="size-4" aria-hidden />
            Add image
          </button>
        ) : null}
      </div>

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {slots.map((slot, index) => (
          <li
            key={slot.id}
            className="rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-sm"
          >
            <div className="space-y-4">
              <ImagePreview src={slot.previewUrl} alt={slot.altText || slot.label || "Gallery image"} className="max-w-full" />
              <div className="min-w-0 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-sm text-[var(--admin-text)]">{slot.label ?? `Image ${index + 1}`}</p>
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      className={cnDs(dsBtnGhost, "min-h-9 px-2")}
                      aria-label="Move up"
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                    >
                      <ChevronUp className="size-4" />
                    </button>
                    <button
                      type="button"
                      className={cnDs(dsBtnGhost, "min-h-9 px-2")}
                      aria-label="Move down"
                      disabled={index === slots.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      <ChevronDown className="size-4" />
                    </button>
                    <button
                      type="button"
                      className={cnDs(dsBtnGhost, "min-h-9 px-2 text-red-700 hover:bg-red-50")}
                      aria-label="Remove slot"
                      onClick={() => remove(slot.id)}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                {existingMediaIdInputName ? (
                  <input type="hidden" name={existingMediaIdInputName(slot, index)} value={slot.existingMediaId ?? ""} />
                ) : null}
                {clearInputName ? (
                  <input type="hidden" name={clearInputName(slot, index)} value={slot.clear ? "true" : "false"} />
                ) : null}
                <input
                  id={fileInputs[index]}
                  name={fileInputName ? fileInputName(slot, index) : `${name}_${index}_file`}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) replacePreview(slot.id, f)
                  }}
                />
                <label htmlFor={fileInputs[index]} className={cnDs(dsBtnTertiary, "inline-flex min-h-9 cursor-pointer px-3 text-xs")}>
                  Replace image
                </label>
                <div className="space-y-1.5">
                  <label
                    htmlFor={`${name}-${slot.id}-alt`}
                    className="block text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase"
                  >
                    Alt text
                  </label>
                  <input
                    id={`${name}-${slot.id}-alt`}
                    name={altInputName ? altInputName(slot, index) : `${name}_${index}_alt`}
                    value={slot.altText ?? ""}
                    onChange={(event) => updateAltText(slot.id, event.target.value)}
                    placeholder="Describe this image for accessibility"
                    className="min-h-10 w-full rounded-[var(--admin-radius-input)] border border-slate-300 bg-white px-3 text-sm text-[var(--admin-text)] shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-[var(--admin-focus-ring)] focus:ring-offset-2"
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {slots.length === 0 ? (
        <p className="text-sm text-[var(--admin-text-muted)]">No images yet. Use &quot;Add image&quot; to begin.</p>
      ) : null}
      {error ? (
        <p className="text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
