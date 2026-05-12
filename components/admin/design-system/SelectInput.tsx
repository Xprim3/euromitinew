import { forwardRef, useId, type ReactNode, type SelectHTMLAttributes } from "react"

import { cnDs } from "./cn-ds"

export type SelectInputOption = { value: string; label: string; disabled?: boolean }

export type SelectInputProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> & {
  label: string
  helperText?: ReactNode
  /** @deprecated Use `helperText`; kept so existing forms can migrate gradually. */
  hint?: string
  error?: string
  options: readonly SelectInputOption[]
  placeholder?: string
  placeholderOption?: ReactNode
}

const controlClass =
  "min-h-11 w-full rounded-[var(--admin-radius-input)] border border-slate-300 bg-white px-3 text-sm text-[var(--admin-text)] shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-[var(--admin-focus-ring)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70"

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(function SelectInput(
  { label, helperText, hint, error, options, placeholder, placeholderOption, className, id, required, ...rest },
  ref
) {
  const generatedId = useId()
  const safeId = id ?? rest.name?.toString() ?? `select-${generatedId}`
  const helpId = `${safeId}-help`
  const errorId = `${safeId}-error`
  const descriptionId = error ? errorId : helperText || hint ? helpId : undefined
  const placeholderLabel = placeholderOption ?? placeholder

  return (
    <div className={cnDs("space-y-1.5", className)}>
      <label htmlFor={safeId} className="block text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase">
        {label}
        {required ? <span className="ml-0.5 text-[var(--admin-accent-active)]">*</span> : null}
      </label>
      <select
        ref={ref}
        id={safeId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        className={cnDs(controlClass, error && "border-red-400 focus:ring-red-600")}
        {...rest}
      >
        {placeholderLabel ? (
          <option value="" disabled={required}>
            {placeholderLabel}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
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
