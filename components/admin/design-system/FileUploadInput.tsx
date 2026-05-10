import { forwardRef, type InputHTMLAttributes } from "react"

import { cnDs } from "./cn-ds"

export type FileUploadInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & {
  label: string
  hint?: string
  error?: string
}

/**
 * Single accessible label wrapping the native file input (drop-zone styling).
 */
export const FileUploadInput = forwardRef<HTMLInputElement, FileUploadInputProps>(function FileUploadInput(
  { label, hint, error, className, id, required, ...rest },
  ref
) {
  const safeId = id ?? rest.name?.toString() ?? `file-${label.replace(/\s+/g, "-").toLowerCase()}`

  return (
    <div className={cnDs("space-y-1.5", className)}>
      <span className="block text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase">
        {label}
        {required ? <span className="ml-0.5 text-[var(--admin-accent-active)]">*</span> : null}
      </span>
      <label
        htmlFor={safeId}
        className={cnDs(
          "flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--admin-radius-input)] border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-slate-400 hover:bg-white",
          error && "border-red-400 bg-red-50/60"
        )}
      >
        <span className="text-sm font-medium text-[var(--admin-text)]">Click to choose a file</span>
        <span className="text-xs text-[var(--admin-text-muted)]">Images: JPEG, PNG, WebP, GIF</span>
        <input ref={ref} id={safeId} type="file" required={required} className="sr-only" {...rest} />
      </label>
      {hint ? <p className="text-xs text-[var(--admin-text-muted)]">{hint}</p> : null}
      {error ? (
        <p className="text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
})
