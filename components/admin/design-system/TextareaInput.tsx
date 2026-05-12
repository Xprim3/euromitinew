"use client"

import { forwardRef, useCallback, useEffect, useId, useRef, useState, type ReactNode, type TextareaHTMLAttributes } from "react"

import { cnDs } from "./cn-ds"

export type TextareaInputProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  helperText?: ReactNode
  /** @deprecated Use `helperText`; kept so existing forms can migrate gradually. */
  hint?: string
  error?: string
  showCharacterCount?: boolean
}

const controlClass =
  "min-h-[6.5rem] w-full resize-y rounded-[var(--admin-radius-input)] border border-slate-300 bg-white px-3 py-2.5 text-sm text-[var(--admin-text)] shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-[var(--admin-focus-ring)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70"

export const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(function TextareaInput(
  { label, helperText, hint, error, showCharacterCount, className, id, required, defaultValue, value, onChange, maxLength, ...rest },
  ref
) {
  const generatedId = useId()
  const safeId = id ?? rest.name?.toString() ?? `textarea-${generatedId}`
  const helpId = `${safeId}-help`
  const errorId = `${safeId}-error`
  const countId = `${safeId}-count`
  const descriptionIds = [error ? errorId : null, helperText || hint ? helpId : null, showCharacterCount || maxLength ? countId : null]
    .filter(Boolean)
    .join(" ") || undefined
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [textareaNode, setTextareaNode] = useState<HTMLTextAreaElement | null>(null)
  const [draft, setDraft] = useState(() => String(value ?? defaultValue ?? ""))
  const currentLength = String(value ?? draft).length

  const assignRef = useCallback((node: HTMLTextAreaElement | null) => {
    textareaRef.current = node
    setTextareaNode(node)
    if (typeof ref === "function") ref(node)
    else if (ref) ref.current = node
  }, [ref])

  useEffect(() => {
    const form = textareaNode?.form
    if (!form) return undefined

    function onReset() {
      setDraft(String(value ?? defaultValue ?? ""))
    }

    form.addEventListener("reset", onReset)
    return () => form.removeEventListener("reset", onReset)
  }, [defaultValue, textareaNode, value])

  return (
    <div className={cnDs("space-y-1.5", className)}>
      <label htmlFor={safeId} className="block text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase">
        {label}
        {required ? <span className="ml-0.5 text-[var(--admin-accent-active)]">*</span> : null}
      </label>
      <textarea
        ref={assignRef}
        id={safeId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionIds}
        className={cnDs(controlClass, error && "border-red-400 focus:ring-red-600")}
        defaultValue={defaultValue}
        value={value}
        maxLength={maxLength}
        onChange={(event) => {
          setDraft(event.target.value)
          onChange?.(event)
        }}
        {...rest}
      />
      <div className="flex flex-wrap items-start justify-between gap-2">
        {helperText || hint ? (
          <p id={helpId} className="text-xs leading-5 text-[var(--admin-text-muted)]">
            {helperText ?? hint}
          </p>
        ) : null}
        {showCharacterCount || maxLength ? (
          <p id={countId} className="ml-auto text-xs tabular-nums text-[var(--admin-text-muted)]">
            {currentLength}
            {maxLength ? ` / ${maxLength}` : ""} characters
          </p>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className="text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
})
