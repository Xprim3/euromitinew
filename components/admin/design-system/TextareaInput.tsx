import { forwardRef, type TextareaHTMLAttributes } from "react"

import { cnDs } from "./cn-ds"

export type TextareaInputProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  hint?: string
  error?: string
}

const controlClass =
  "min-h-[6.5rem] w-full resize-y rounded-[var(--admin-radius-input)] border border-slate-300 bg-white px-3 py-2.5 text-sm text-[var(--admin-text)] shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-[var(--admin-focus-ring)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70"

export const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(function TextareaInput(
  { label, hint, error, className, id, required, ...rest },
  ref
) {
  const safeId = id ?? rest.name?.toString() ?? `textarea-${label.replace(/\s+/g, "-").toLowerCase()}`

  return (
    <div className={cnDs("space-y-1.5", className)}>
      <label htmlFor={safeId} className="block text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase">
        {label}
        {required ? <span className="ml-0.5 text-[var(--admin-accent-active)]">*</span> : null}
      </label>
      <textarea
        ref={ref}
        id={safeId}
        required={required}
        className={cnDs(controlClass, error && "border-red-400 focus:ring-red-600")}
        {...rest}
      />
      {hint ? <p className="text-xs text-[var(--admin-text-muted)]">{hint}</p> : null}
      {error ? (
        <p className="text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
})
