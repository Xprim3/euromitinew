import { mediaKindFromMimeAndUrl } from "@/lib/media-kind"

import { cnDs } from "./cn-ds"
import { ImagePreview } from "./ImagePreview"

type AdminMediaPreviewProps = {
  src: string | null | undefined
  alt: string
  mimeType?: string | null
  className?: string
  emptyLabel?: string
}

/** Admin preview for image or video (blob or public URL). */
export function AdminMediaPreview({ src, alt, mimeType, className, emptyLabel }: AdminMediaPreviewProps) {
  const trimmed = src?.trim() ?? ""
  if (!trimmed) {
    return <ImagePreview src={null} alt={alt} className={className} emptyLabel={emptyLabel} />
  }

  if (mediaKindFromMimeAndUrl(mimeType, trimmed) === "video") {
    return (
      <div
        className={cnDs(
          "relative aspect-video w-full max-w-md overflow-hidden rounded-[var(--admin-radius-input)] border border-[var(--admin-border)] bg-black",
          className
        )}
      >
        <video src={trimmed} className="size-full object-contain" controls muted playsInline preload="metadata" aria-label={alt} />
      </div>
    )
  }

  return <ImagePreview src={trimmed} alt={alt} className={className} emptyLabel={emptyLabel} />
}
