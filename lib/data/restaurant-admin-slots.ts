import {
  ADMIN_RESTAURANT_GALLERY_SLOTS,
  ADMIN_RESTAURANT_MENU_SLOTS,
  ADMIN_RESTAURANT_PILLAR_SLOTS,
} from "@/lib/validations/restaurant-content"
import type { RestaurantContentRow } from "@/types/supabase-cms"

export type MenuSlotDraft = {
  title: string
  body: string
  mediaId: string
  previewUrl: string
}

export type GallerySlotDraft = {
  mediaId: string
  previewUrl: string
}

export type PillarSlotDraft = {
  title: string
  body: string
}

export function emptyMenuDrafts(): MenuSlotDraft[] {
  return Array.from({ length: ADMIN_RESTAURANT_MENU_SLOTS }, () => ({
    title: "",
    body: "",
    mediaId: "",
    previewUrl: "",
  }))
}

export function emptyGalleryDrafts(): GallerySlotDraft[] {
  return Array.from({ length: ADMIN_RESTAURANT_GALLERY_SLOTS }, () => ({
    mediaId: "",
    previewUrl: "",
  }))
}

export function emptyPillarDrafts(): PillarSlotDraft[] {
  return Array.from({ length: ADMIN_RESTAURANT_PILLAR_SLOTS }, () => ({
    title: "",
    body: "",
  }))
}

type MenuHl = { title?: unknown; body?: unknown; image_media_id?: unknown }

export function menuDraftsFromRow(
  row: RestaurantContentRow,
  urlById: Record<string, string | undefined>
): MenuSlotDraft[] {
  const slots = emptyMenuDrafts()
  const arr = Array.isArray(row.menu_highlights_json) ? row.menu_highlights_json : []
  for (let i = 0; i < ADMIN_RESTAURANT_MENU_SLOTS; i++) {
    const raw = arr[i]
    if (!raw || typeof raw !== "object") continue
    const m = raw as MenuHl
    const title = typeof m.title === "string" ? m.title : ""
    const body = typeof m.body === "string" ? m.body : ""
    const mediaId =
      typeof m.image_media_id === "string" && m.image_media_id.length > 0 ? m.image_media_id : ""
    slots[i] = {
      title,
      body,
      mediaId,
      previewUrl: mediaId ? urlById[mediaId] ?? "" : "",
    }
  }
  return slots
}

type PillarHl = { title?: unknown; body?: unknown }

export function pillarDraftsFromRow(row: RestaurantContentRow): PillarSlotDraft[] {
  const slots = emptyPillarDrafts()
  const arr = Array.isArray(row.experience_pillars_json) ? row.experience_pillars_json : []
  for (let i = 0; i < ADMIN_RESTAURANT_PILLAR_SLOTS; i++) {
    const raw = arr[i]
    if (!raw || typeof raw !== "object") continue
    const m = raw as PillarHl
    const title = typeof m.title === "string" ? m.title : ""
    const body = typeof m.body === "string" ? m.body : ""
    slots[i] = { title, body }
  }
  return slots
}

export function galleryDraftsFromRow(
  row: RestaurantContentRow,
  urlById: Record<string, string | undefined>
): GallerySlotDraft[] {
  const slots = emptyGalleryDrafts()
  const ids = row.gallery_media_ids ?? []
  for (let i = 0; i < ADMIN_RESTAURANT_GALLERY_SLOTS; i++) {
    const mediaId = typeof ids[i] === "string" ? ids[i] : ""
    if (!mediaId) continue
    slots[i] = {
      mediaId,
      previewUrl: urlById[mediaId] ?? "",
    }
  }
  return slots
}
