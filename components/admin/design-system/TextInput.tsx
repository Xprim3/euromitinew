import { forwardRef, type InputHTMLAttributes } from "react"

import { cnDs } from "./cn-ds"

export type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label: string
  hint?: string
  error?: string
}

const controlClass =
  "min-h-11 w-full rounded-[var(--admin-radius-input)] border border-slate-300 bg-white px-3 text-sm text-[var(--admin-text)] shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-[var(--admin-focus-ring)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70"

/**
 * Single-line text field with label, optional hint, and error text (non-technical friendly copy).
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { label, hint, error, className, id, required, ...rest },
  ref
) {
  const inputId = id ?? rest.name?.toString() ?? undefined
  const safeId = inputId ?? `text-input-${label.replace(/\s+/g, "-").toLowerCase()}`

  return (
    <div className={cnDs("space-y-1.5", className)}>
      <label htmlFor={safeId} className="block text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase">
        {label}
        {required ? <span className="ml-0.5 text-[var(--admin-accent-active)]">*</span> : null}
      </label>
      <input ref={ref} id={safeId} required={required} className={cnDs(controlClass, error && "border-red-400 focus:ring-red-600")} {...rest} />
      {hint ? <p className="text-xs text-[var(--admin-text-muted)]">{hint}</p> : null}
      {error ? (
        <p className="text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
})
