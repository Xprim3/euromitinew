import Image from "next/image"

import { cnDs } from "./cn-ds"

export type ImagePreviewProps = {
  src: string | null | undefined
  alt: string
  /** Fixed frame height; image uses `object-contain`. */
  className?: string
  emptyLabel?: string
}

/**
 * Rounded preview frame for a single image URL (`next/image` for http(s); `<img>` for blob/data).
 */
export function ImagePreview({ src, alt, className, emptyLabel = "No image" }: ImagePreviewProps) {
  const trimmed = src?.trim() ?? ""
  const isRemote = /^https?:\/\//i.test(trimmed)

  if (!trimmed) {
    return (
      <div
        className={cnDs(
          "flex aspect-video w-full max-w-md items-center justify-center rounded-[var(--admin-radius-input)] border border-dashed border-[var(--admin-border-strong)] bg-slate-50 text-sm text-[var(--admin-text-muted)]",
          className
        )}
      >
        {emptyLabel}
      </div>
    )
  }

  if (isRemote) {
    return (
      <div className={cnDs("relative aspect-video w-full max-w-md overflow-hidden rounded-[var(--admin-radius-input)] border border-[var(--admin-border)] bg-white", className)}>
        <Image src={trimmed} alt={alt} fill className="object-contain" sizes="(max-width:768px) 100vw, 28rem" />
      </div>
    )
  }

  return (
    <div className={cnDs("relative aspect-video w-full max-w-md overflow-hidden rounded-[var(--admin-radius-input)] border border-[var(--admin-border)] bg-white", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- blob/data URLs */}
      <img src={trimmed} alt={alt} className="size-full object-contain" />
    </div>
  )
}
