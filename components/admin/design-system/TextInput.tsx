import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react"

import { cnDs } from "./cn-ds"

export type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label: string
  helperText?: ReactNode
  /** @deprecated Use `helperText`; kept so existing forms can migrate gradually. */
  hint?: string
  error?: string
  leadingAddon?: ReactNode
  trailingAddon?: ReactNode
}

const controlClass =
  "min-h-11 w-full rounded-[var(--admin-radius-input)] border border-slate-300 bg-white px-3 text-sm text-[var(--admin-text)] shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-[var(--admin-focus-ring)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70"

/**
 * Single-line text field with label, optional hint, and error text (non-technical friendly copy).
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { label, helperText, hint, error, leadingAddon, trailingAddon, className, id, required, disabled, ...rest },
  ref
) {
  const generatedId = useId()
  const safeId = id ?? rest.name?.toString() ?? `text-input-${generatedId}`
  const helpId = `${safeId}-help`
  const errorId = `${safeId}-error`
  const descriptionId = error ? errorId : helperText || hint ? helpId : undefined

  return (
    <div className={cnDs("space-y-1.5", className)}>
      <label htmlFor={safeId} className="block text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase">
        {label}
        {required ? <span className="ml-0.5 text-[var(--admin-accent-active)]">*</span> : null}
      </label>
      <div className="relative">
        {leadingAddon ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-[var(--admin-text-muted)]">
            {leadingAddon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={safeId}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          className={cnDs(
            controlClass,
            leadingAddon && "pl-9",
            trailingAddon && "pr-9",
            error && "border-red-400 focus:border-red-500 focus:ring-red-600"
          )}
          {...rest}
        />
        {trailingAddon ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-[var(--admin-text-muted)]">
            {trailingAddon}
          </span>
        ) : null}
      </div>
      {helperText || hint ? (
        <p id={helpId} className="text-xs leading-5 text-[var(--admin-text-muted)]">
          {helperText ?? hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
})
