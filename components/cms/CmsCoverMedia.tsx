import Image from "next/image"

import { mediaKindFromMimeAndUrl } from "@/lib/media-kind"
import { cn } from "@/lib/utils"

type CmsCoverMediaProps = {
  src: string
  alt: string
  mimeType?: string | null
  className?: string
  /** Passed to next/image when rendering a still image. */
  sizes?: string
  priority?: boolean
}

/**
 * Renders a full-bleed cover image or autoplaying muted loop video for CMS media slots.
 */
export function CmsCoverMedia({ src, alt, mimeType, className, sizes = "100vw", priority }: CmsCoverMediaProps) {
  const kind = mediaKindFromMimeAndUrl(mimeType, src)

  if (kind === "video") {
    return (
      <video
        src={src}
        className={cn("absolute inset-0 size-full object-cover", className)}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  )
}
