"use client"

import { forwardRef, useCallback, useEffect, useId, useRef, useState, type DragEvent, type InputHTMLAttributes, type ReactNode } from "react"
import { ImageIcon, Loader2, UploadCloud, X } from "lucide-react"

import { ADMIN_IMAGE_ACCEPT, ADMIN_IMAGE_ACCEPT_LABEL, ADMIN_IMAGE_MAX_BYTES, validateAdminImageFile } from "@/lib/admin-image-file"

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
 * Uses a single hidden file input (no nested labels) to avoid mobile picker freezes.
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
    acceptedFileTypesLabel = ADMIN_IMAGE_ACCEPT_LABEL,
    layout = "auto",
    onFileSelect,
    onRemove,
    className,
    id,
    required,
    accept = ADMIN_IMAGE_ACCEPT,
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
  const [processing, setProcessing] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [removed, setRemoved] = useState(false)
  const activePreview = selectedPreview ?? (removed ? null : previewUrl)
  const displayError = error ?? localError ?? undefined

  useEffect(() => {
    return () => {
      if (selectedPreview?.startsWith("blob:")) URL.revokeObjectURL(selectedPreview)
    }
  }, [selectedPreview])

  const assignRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      setInputNode(node)
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  useEffect(() => {
    const form = inputNode?.form
    if (!form) return undefined

    function onReset() {
      setDragging(false)
      setProcessing(false)
      setLocalError(null)
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

  const openPicker = useCallback(() => {
    if (disabled || processing) return
    inputRef.current?.click()
  }, [disabled, processing])

  function applyFile(file: File) {
    const validated = validateAdminImageFile(file, ADMIN_IMAGE_MAX_BYTES)
    if (!validated.ok) {
      setLocalError(validated.error)
      if (inputRef.current) inputRef.current.value = ""
      return
    }

    setLocalError(null)
    setRemoved(false)
    setSelectedFileName(file.name)
    setSelectedPreview((old) => {
      if (old?.startsWith("blob:")) URL.revokeObjectURL(old)
      return URL.createObjectURL(file)
    })
    onFileSelect?.(file)
  }

  function handleFiles(fileList: FileList | null | undefined) {
    const file = fileList?.[0]
    if (!file) return
    setProcessing(true)
    window.requestAnimationFrame(() => {
      try {
        applyFile(file)
      } finally {
        setProcessing(false)
      }
    })
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
    if (disabled || processing) return
    const file = event.dataTransfer.files?.[0]
    if (!file) return
    if (inputRef.current) {
      const dt = new DataTransfer()
      dt.items.add(file)
      inputRef.current.files = dt.files
    }
    handleFiles(event.dataTransfer.files)
  }

  return (
    <div className={cnDs("space-y-3", className)}>
      <span className="block text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase">
        {label}
        {required ? <span className="ml-0.5 text-[var(--admin-accent-active)]">*</span> : null}
      </span>

      <input
        ref={assignRef}
        id={safeId}
        type="file"
        required={required && !activePreview && !selectedFileName}
        accept={accept}
        disabled={disabled || processing}
        aria-invalid={Boolean(displayError)}
        aria-describedby={displayError ? errorId : helperText || hint ? helpId : undefined}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          handleFiles(event.target.files)
          onChange?.(event)
        }}
        {...rest}
      />

      <div
        role="button"
        tabIndex={disabled || processing ? -1 : 0}
        aria-controls={safeId}
        aria-disabled={disabled || processing}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            openPicker()
          }
        }}
        onClick={openPicker}
        onDragEnter={(event) => {
          event.preventDefault()
          if (!disabled && !processing) setDragging(true)
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cnDs(
          "grid min-h-40 cursor-pointer gap-4 rounded-[var(--admin-radius-input)] border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-slate-400 hover:bg-white",
          layout === "auto" && "sm:grid-cols-[minmax(0,16rem)_1fr]",
          dragging && "border-[var(--admin-accent-active)] bg-red-50/60",
          (disabled || processing) && "cursor-not-allowed opacity-70",
          displayError && "border-red-400 bg-red-50/60"
        )}
      >
        <ImagePreview src={activePreview} alt={previewAlt ?? label} className="max-w-full pointer-events-none" emptyLabel="Image preview" />
        <span className="pointer-events-none flex flex-col justify-center gap-3 text-left">
          <span className="inline-flex size-11 items-center justify-center rounded-full bg-white text-[var(--admin-accent-active)] shadow-sm">
            {processing ? (
              <Loader2 className="size-5 animate-spin" aria-hidden />
            ) : activePreview ? (
              <ImageIcon className="size-5" aria-hidden />
            ) : (
              <UploadCloud className="size-5" aria-hidden />
            )}
          </span>
          <span className="text-sm font-semibold text-[var(--admin-text)]">
            {processing ? "Preparing preview…" : "Drag and drop an image, or tap to choose a file"}
          </span>
          <span className="text-xs leading-5 text-[var(--admin-text-muted)]">
            Accepted file types: {acceptedFileTypesLabel} (max {Math.round(ADMIN_IMAGE_MAX_BYTES / (1024 * 1024))} MB).
          </span>
          {selectedFileName ? (
            <span className="break-all text-xs font-medium text-[var(--admin-text)]">Selected: {selectedFileName}</span>
          ) : null}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={cnDs(dsBtnTertiary, "min-h-10 px-3 text-xs")} disabled={disabled || processing} onClick={openPicker}>
          {activePreview ? "Replace image" : replaceLabel}
        </button>
        {activePreview || selectedFileName ? (
          <button
            type="button"
            className={cnDs(dsBtnDanger, "min-h-10 px-3 text-xs")}
            disabled={disabled || processing}
            onClick={() => {
              setRemoved(true)
              setSelectedFileName(null)
              setLocalError(null)
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
      {displayError ? (
        <p id={errorId} className="text-xs font-medium text-red-700" role="alert">
          {displayError}
        </p>
      ) : null}
    </div>
  )
})
