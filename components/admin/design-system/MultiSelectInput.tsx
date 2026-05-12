"use client"

import { useCallback, useEffect, useId, useMemo, useState, type ReactNode } from "react"

import { cnDs } from "./cn-ds"

export type MultiSelectOption = { value: string; label: string; disabled?: boolean }

export const ADMIN_SERVICE_OPTIONS: readonly MultiSelectOption[] = [
  { value: "petrol", label: "Petrol" },
  { value: "restaurant", label: "Restaurant" },
  { value: "carwash", label: "Carwash" },
  { value: "mini_market", label: "Mini Market" },
] as const

export type MultiSelectInputProps = {
  label: string
  name: string
  options: readonly MultiSelectOption[]
  /** Controlled selection. */
  value?: string[]
  defaultValue?: string[]
  onChange?: (next: string[]) => void
  helperText?: ReactNode
  /** @deprecated Use `helperText`; kept so existing forms can migrate gradually. */
  hint?: string
  error?: string
  required?: boolean
  showSelectedCount?: boolean
  className?: string
}

/**
 * Checkbox list for choosing multiple values — clearer for staff than `<select multiple>`.
 * In server actions, read repeated keys or serialize a hidden JSON field in Phase 2.
 */
export function MultiSelectInput({
  label,
  name,
  options,
  value: controlled,
  defaultValue,
  onChange,
  helperText,
  hint,
  error,
  required,
  showSelectedCount = true,
  className,
}: MultiSelectInputProps) {
  const groupId = useId()
  const helpId = `${groupId}-help`
  const errorId = `${groupId}-error`
  const [uncontrolled, setUncontrolled] = useState<string[]>(() => defaultValue ?? [])
  const [fieldsetNode, setFieldsetNode] = useState<HTMLFieldSetElement | null>(null)
  const isControlled = controlled !== undefined
  const selected = isControlled ? controlled! : uncontrolled

  const toggle = useCallback(
    (v: string, checked: boolean) => {
      const next = checked ? [...selected, v] : selected.filter((x) => x !== v)
      if (!isControlled) setUncontrolled(next)
      onChange?.(next)
    },
    [isControlled, onChange, selected]
  )

  const set = useMemo(() => new Set(selected), [selected])

  useEffect(() => {
    const form = fieldsetNode?.form
    if (!form) return undefined

    function onReset() {
      if (!isControlled) setUncontrolled(defaultValue ?? [])
    }

    form.addEventListener("reset", onReset)
    return () => form.removeEventListener("reset", onReset)
  }, [defaultValue, fieldsetNode, isControlled])

  return (
    <fieldset
      ref={setFieldsetNode}
      className={cnDs("space-y-2", className)}
      aria-labelledby={`${groupId}-legend`}
      aria-describedby={error ? errorId : helperText || hint ? helpId : undefined}
      aria-invalid={Boolean(error)}
    >
      <legend id={`${groupId}-legend`} className="mb-1 block text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase">
        {label}
        {required ? <span className="ml-0.5 text-[var(--admin-accent-active)]">*</span> : null}
      </legend>
      <div className="max-h-60 space-y-2 overflow-y-auto rounded-[var(--admin-radius-input)] border border-slate-300 bg-white p-3 shadow-sm">
        {options.map((opt) => {
          const id = `${groupId}-${opt.value}`
          const checked = set.has(opt.value)
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={cnDs(
                "flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-slate-50",
                opt.disabled && "cursor-not-allowed opacity-50"
              )}
            >
              <input
                id={id}
                type="checkbox"
                name={`${name}[]`}
                value={opt.value}
                checked={checked}
                disabled={opt.disabled}
                onChange={(e) => toggle(opt.value, e.target.checked)}
                className="size-4 rounded border-slate-300 text-[var(--admin-accent-active)] focus:ring-[var(--admin-focus-ring)]"
              />
              <span className="text-[var(--admin-text)]">{opt.label}</span>
            </label>
          )
        })}
      </div>
      <div className="flex flex-wrap items-start justify-between gap-2">
        {helperText || hint ? (
          <p id={helpId} className="text-xs leading-5 text-[var(--admin-text-muted)]">
            {helperText ?? hint}
          </p>
        ) : null}
        {showSelectedCount ? (
          <p className="ml-auto text-xs tabular-nums text-[var(--admin-text-muted)]">
            {selected.length} selected
          </p>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className="text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}
