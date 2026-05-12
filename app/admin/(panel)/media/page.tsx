import type { Metadata } from "next"

import { MediaLibraryClient } from "@/components/admin/MediaLibraryClient"
import { ErrorMessage } from "@/components/admin/design-system"
import { listMediaUploadsAdmin } from "@/lib/data/media-library-admin"

export const metadata: Metadata = {
  title: "Media",
}

async function loadMedia() {
  try {
    const media = await listMediaUploadsAdmin()
    return { ok: true as const, media }
  } catch (e) {
    return { ok: false as const, message: e instanceof Error ? e.message : "Unexpected error loading media." }
  }
}

export default async function AdminMediaPage() {
  const result = await loadMedia()

  if (!result.ok) {
    return <ErrorMessage title="Media library could not load">{result.message}</ErrorMessage>
  }

  return <MediaLibraryClient media={result.media} />
}
