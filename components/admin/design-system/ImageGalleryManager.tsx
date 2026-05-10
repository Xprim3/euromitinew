"use client"

import { useCallback, useMemo } from "react"
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react"

import { cnDs } from "./cn-ds"
import { dsBtnGhost, dsBtnTertiary } from "./ds-button-classes"
import { ImagePreview } from "./ImagePreview"

export type GallerySlot = {
  id: string
  label?: string
  /** Remote URL or blob preview. */
  previewUrl?: string | null
}

export type ImageGalleryManagerProps = {
  slots: GallerySlot[]
  maxSlots?: number
  onSlotsChange: (next: GallerySlot[]) => void
  /** When omitted, image replace UI is hidden until Phase 2 wiring. */
  onFileForSlot?: (slotId: string, file: File) => void
  className?: string
}

/**
 * Reorderable gallery slots with file pick + remove — caller owns state (`slots` / `onSlotsChange`).
 */
export function ImageGalleryManager({
  slots,
  maxSlots = 8,
  onSlotsChange,
  onFileForSlot,
  className,
}: ImageGalleryManagerProps) {
  const canAdd = slots.length < maxSlots

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
      onSlotsChange(slots.filter((s) => s.id !== id))
    },
    [onSlotsChange, slots]
  )

  const addSlot = useCallback(() => {
    if (!canAdd) return
    onSlotsChange([...slots, { id: crypto.randomUUID(), label: `Image ${slots.length + 1}`, previewUrl: null }])
  }, [canAdd, onSlotsChange, slots])

  const fileInputs = useMemo(() => slots.map((s) => `gallery-file-${s.id}`), [slots])

  return (
    <div className={cnDs("space-y-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase">Gallery</p>
        <button type="button" className={cnDs(dsBtnTertiary, "min-h-9 px-3 text-xs")} onClick={addSlot} disabled={!canAdd}>
          Add slot
        </button>
      </div>

      <ul className="space-y-4">
        {slots.map((slot, index) => (
          <li
            key={slot.id}
            className="rounded-[var(--admin-radius-card)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-sm"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              <div className="md:w-72 shrink-0">
                <ImagePreview src={slot.previewUrl} alt={slot.label ?? "Gallery image"} className="max-w-full" />
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap gap-2">
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
                {onFileForSlot ? (
                  <>
                    <input
                      id={fileInputs[index]}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="sr-only"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) onFileForSlot(slot.id, f)
                        e.target.value = ""
                      }}
                    />
                    <label htmlFor={fileInputs[index]} className={cnDs(dsBtnTertiary, "inline-flex min-h-9 cursor-pointer px-3 text-xs")}>
                      Replace image
                    </label>
                  </>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {slots.length === 0 ? (
        <p className="text-sm text-[var(--admin-text-muted)]">No slots yet. Use &quot;Add slot&quot; to begin.</p>
      ) : null}
    </div>
  )
}
