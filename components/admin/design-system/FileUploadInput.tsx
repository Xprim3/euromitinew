"use client"

import { forwardRef, useCallback, useEffect, useId, useRef, useState, type DragEvent, type InputHTMLAttributes, type ReactNode } from "react"
import { ImageIcon, UploadCloud, X } from "lucide-react"

import { cnDs } from "./cn-ds"
import { dsBtnDanger, dsBtnTertiary } from "./ds-button-classes"
import { ImagePreview } from "./ImagePreview"

export type FileUploadInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & {
  label: string
  helperText?: ReactNode
  /** @deprecated Use `helperText`; kept so existing forms can migrate gradually. */
  hint?: string
  error?: string
  previewUrl?: string | null
  previewAlt?: string
  removeInputName?: string
  replaceLabel?: string
  removeLabel?: string
  acceptedFileTypesLabel?: string
  layout?: "auto" | "stacked"
  onFileSelect?: (file: File) => void
  onRemove?: () => void
}

/**
 * Professional image upload field with drag/drop, preview, replace, and remove affordances.
 */
export const FileUploadInput = forwardRef<HTMLInputElement, FileUploadInputProps>(function FileUploadInput(
  {
    label,
    helperText,
    hint,
    error,
    previewUrl,
    previewAlt,
    removeInputName,
    replaceLabel = "Upload image",
    removeLabel = "Remove image",
    acceptedFileTypesLabel = "JPEG, PNG, WebP, or GIF",
    layout = "auto",
    onFileSelect,
    onRemove,
    className,
    id,
    required,
    accept = "image/jpeg,image/png,image/webp,image/gif",
    disabled,
    onChange,
    ...rest
  },
  ref
) {
  const generatedId = useId()
  const safeId = id ?? rest.name?.toString() ?? `file-${generatedId}`
  const helpId = `${safeId}-help`
  const errorId = `${safeId}-error`
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [inputNode, setInputNode] = useState<HTMLInputElement | null>(null)
  const [dragging, setDragging] = useState(false)
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [removed, setRemoved] = useState(false)
  const activePreview = selectedPreview ?? (removed ? null : previewUrl)

  useEffect(() => {
    return () => {
      if (selectedPreview?.startsWith("blob:")) URL.revokeObjectURL(selectedPreview)
    }
  }, [selectedPreview])

  const assignRef = useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node
    setInputNode(node)
    if (typeof ref === "function") ref(node)
    else if (ref) ref.current = node
  }, [ref])

  useEffect(() => {
    const form = inputNode?.form
    if (!form) return undefined

    function onReset() {
      setDragging(false)
      setRemoved(false)
      setSelectedFileName(null)
      setSelectedPreview((old) => {
        if (old?.startsWith("blob:")) URL.revokeObjectURL(old)
        return null
      })
    }

    form.addEventListener("reset", onReset)
    return () => form.removeEventListener("reset", onReset)
  }, [inputNode])

  function setFile(file: File) {
    setRemoved(false)
    setSelectedFileName(file.name)
    setSelectedPreview((old) => {
      if (old?.startsWith("blob:")) URL.revokeObjectURL(old)
      return file.type.startsWith("image/") ? URL.createObjectURL(file) : null
    })
    onFileSelect?.(file)
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setDragging(false)
    if (disabled) return
    const file = event.dataTransfer.files?.[0]
    if (!file) return
    if (inputRef.current) inputRef.current.files = event.dataTransfer.files
    setFile(file)
  }

  return (
    <div className={cnDs("space-y-3", className)}>
      <span className="block text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase">
        {label}
        {required ? <span className="ml-0.5 text-[var(--admin-accent-active)]">*</span> : null}
      </span>
      <label
        htmlFor={safeId}
        onDragEnter={(event) => {
          event.preventDefault()
          if (!disabled) setDragging(true)
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cnDs(
          "grid min-h-40 cursor-pointer gap-4 rounded-[var(--admin-radius-input)] border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-slate-400 hover:bg-white",
          layout === "auto" && "sm:grid-cols-[minmax(0,16rem)_1fr]",
          dragging && "border-[var(--admin-accent-active)] bg-red-50/60",
          disabled && "cursor-not-allowed opacity-70",
          error && "border-red-400 bg-red-50/60"
        )}
      >
        <ImagePreview src={activePreview} alt={previewAlt ?? label} className="max-w-full" emptyLabel="Image preview" />
        <span className="flex flex-col justify-center gap-3 text-left">
          <span className="inline-flex size-11 items-center justify-center rounded-full bg-white text-[var(--admin-accent-active)] shadow-sm">
            {activePreview ? <ImageIcon className="size-5" aria-hidden /> : <UploadCloud className="size-5" aria-hidden />}
          </span>
          <span className="text-sm font-semibold text-[var(--admin-text)]">
            Drag and drop an image, or click to choose a file
          </span>
          <span className="text-xs leading-5 text-[var(--admin-text-muted)]">
            Accepted file types: {acceptedFileTypesLabel}.
          </span>
          {selectedFileName ? <span className="text-xs font-medium text-[var(--admin-text)]">Selected: {selectedFileName}</span> : null}
        </span>
        <input
          ref={assignRef}
          id={safeId}
          type="file"
          required={required}
          accept={accept}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText || hint ? helpId : undefined}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) setFile(file)
            onChange?.(event)
          }}
          {...rest}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <label htmlFor={safeId} className={cnDs(dsBtnTertiary, "min-h-10 cursor-pointer px-3 text-xs")}>
          {activePreview ? "Replace image" : replaceLabel}
        </label>
        {activePreview || selectedFileName ? (
          <button
            type="button"
            className={cnDs(dsBtnDanger, "min-h-10 px-3 text-xs")}
            onClick={() => {
              setRemoved(true)
              setSelectedFileName(null)
              setSelectedPreview((old) => {
                if (old?.startsWith("blob:")) URL.revokeObjectURL(old)
                return null
              })
              if (inputRef.current) inputRef.current.value = ""
              onRemove?.()
            }}
          >
            <X className="size-4" aria-hidden />
            {removeLabel}
          </button>
        ) : null}
      </div>
      {removeInputName ? <input type="hidden" name={removeInputName} value={removed ? "true" : "false"} /> : null}
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
