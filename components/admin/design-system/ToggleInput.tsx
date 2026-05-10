"use client"

import { useId, type InputHTMLAttributes } from "react"

import { cnDs } from "./cn-ds"

export type ToggleInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & {
  label: string
  description?: string
}

/**
 * Accessible switch: invisible checkbox over the track + sliding knob (`peer-checked`).
 */
export function ToggleInput({ label, description, className, id, disabled, checked, defaultChecked, ...rest }: ToggleInputProps) {
  const uid = useId()
  const inputId = id ?? uid

  return (
    <div className={cnDs("flex flex-col gap-1", className)}>
      <div className="flex items-start gap-3">
        <div className="relative mt-0.5 inline-flex h-7 w-12 shrink-0 items-center">
          <input
            type="checkbox"
            role="switch"
            id={inputId}
            disabled={disabled}
            checked={checked}
            defaultChecked={defaultChecked}
            className={cnDs(
              "peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-focus-ring)] focus-visible:ring-offset-2 rounded-full"
            )}
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
        </div>
      </div>
    </div>
  )
}
