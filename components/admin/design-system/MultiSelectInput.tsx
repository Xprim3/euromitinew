"use client"

import { useCallback, useId, useMemo, useState } from "react"

import { cnDs } from "./cn-ds"

export type MultiSelectOption = { value: string; label: string; disabled?: boolean }

export type MultiSelectInputProps = {
  label: string
  name: string
  options: readonly MultiSelectOption[]
  /** Controlled selection. */
  value?: string[]
  defaultValue?: string[]
  onChange?: (next: string[]) => void
  hint?: string
  error?: string
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
  hint,
  error,
  className,
}: MultiSelectInputProps) {
  const groupId = useId()
  const [uncontrolled, setUncontrolled] = useState<string[]>(() => defaultValue ?? [])
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

  return (
    <fieldset className={cnDs("space-y-2", className)} aria-labelledby={`${groupId}-legend`}>
      <legend id={`${groupId}-legend`} className="mb-1 block text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase">
        {label}
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
      {hint ? <p className="text-xs text-[var(--admin-text-muted)]">{hint}</p> : null}
      {error ? (
        <p className="text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}
