"use client"

import { useEffect, useId, useState, type InputHTMLAttributes, type ReactNode } from "react"

import { cnDs } from "./cn-ds"

export type ToggleInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & {
  label: string
  description?: string
  helperText?: ReactNode
  error?: string
  checkedLabel?: string
  uncheckedLabel?: string
}

/**
 * Accessible switch: invisible checkbox over the track + sliding knob (`peer-checked`).
 */
export function ToggleInput({
  label,
  description,
  helperText,
  error,
  checkedLabel = "Active",
  uncheckedLabel = "Inactive",
  className,
  id,
  disabled,
  checked,
  defaultChecked,
  onChange,
  ...rest
}: ToggleInputProps) {
  const uid = useId()
  const inputId = id ?? uid
  const helpId = `${inputId}-help`
  const errorId = `${inputId}-error`
  const [uncontrolled, setUncontrolled] = useState(Boolean(defaultChecked))
  const [inputNode, setInputNode] = useState<HTMLInputElement | null>(null)
  const currentChecked = checked ?? uncontrolled

  useEffect(() => {
    const form = inputNode?.form
    if (!form) return undefined

    function onReset() {
      if (checked === undefined) setUncontrolled(Boolean(defaultChecked))
    }

    form.addEventListener("reset", onReset)
    return () => form.removeEventListener("reset", onReset)
  }, [checked, defaultChecked, inputNode])

  return (
    <div className={cnDs("flex flex-col gap-1", className)}>
      <div className="flex items-start gap-3">
        <div className="relative mt-0.5 inline-flex h-7 w-12 shrink-0 items-center">
          <input
            ref={setInputNode}
            type="checkbox"
            role="switch"
            id={inputId}
            disabled={disabled}
            checked={checked}
            defaultChecked={defaultChecked}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helpId : undefined}
            className={cnDs(
              "peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)] focus-visible:ring-offset-2 rounded-full"
            )}
            onChange={(event) => {
              if (checked === undefined) setUncontrolled(event.target.checked)
              onChange?.(event)
            }}
            {...rest}
          />
          <span
            className={cnDs(
              "pointer-events-none absolute inset-0 rounded-full border border-slate-300 bg-slate-200 transition",
              "peer-checked:border-[var(--admin-accent-active)] peer-checked:bg-[var(--admin-accent-active)]"
            )}
            aria-hidden
          />
          <span
            className={cnDs(
              "pointer-events-none absolute top-1 left-1 z-0 size-5 rounded-full bg-white shadow transition-transform",
              "peer-checked:translate-x-5"
            )}
            aria-hidden
          />
        </div>
        <div className="min-w-0">
          <label htmlFor={inputId} className="block text-sm font-semibold text-[var(--admin-text)]">
            {label}
          </label>
          {description ? <p className="mt-0.5 text-xs text-[var(--admin-text-muted)]">{description}</p> : null}
          <p className="mt-1 text-xs font-medium text-[var(--admin-text-muted)]">
            Current: <span className={currentChecked ? "text-emerald-700" : "text-slate-500"}>{currentChecked ? checkedLabel : uncheckedLabel}</span>
          </p>
        </div>
      </div>
      {helperText ? <p id={helpId} className="pl-[3.75rem] text-xs leading-5 text-[var(--admin-text-muted)]">{helperText}</p> : null}
      {error ? (
        <p id={errorId} className="pl-[3.75rem] text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
