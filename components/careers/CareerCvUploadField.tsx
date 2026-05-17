"use client"

import { useCallback, useId, useRef, useState } from "react"

import { MaterialSymbol } from "@/components/ui/MaterialSymbol"
import { cn } from "@/lib/utils"

const CV_ACCEPT =
  ".pdf,.doc,.docx,.rtf,.odt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/rtf,text/rtf,application/vnd.oasis.opendocument.text"

const MAX_BYTES = 5 * 1024 * 1024

function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return ""
  if (bytes < 1024) return `${Math.round(bytes)} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

type CareerCvUploadFieldProps = {
  error?: string
}

export function CareerCvUploadField({ error }: CareerCvUploadFieldProps) {
  const uid = useId()
  const inputId = `ja-cv-${uid}`
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const assignFile = useCallback((next: File | null) => {
    setLocalError(null)
    if (next && next.size > MAX_BYTES) {
      setLocalError("Dokumenti nuk duhet të jetë më i madh se 5 MB.")
      setFile(null)
      if (inputRef.current) inputRef.current.value = ""
      return
    }
    setFile(next)
    const input = inputRef.current
    if (!input) return
    if (next) {
      const dt = new DataTransfer()
      dt.items.add(next)
      input.files = dt.files
    } else {
      input.value = ""
    }
  }, [])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null
    assignFile(picked)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files?.[0] ?? null
    assignFile(dropped)
  }

  const displayError = error ?? localError ?? undefined

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        CV / dokumenti <span className="text-brand-red-vivid">*</span>
      </label>

      <input
        ref={inputRef}
        id={inputId}
        name="cv"
        type="file"
        accept={CV_ACCEPT}
        required={!file}
        className="sr-only"
        aria-invalid={Boolean(displayError)}
        onChange={onInputChange}
      />

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setDragOver(false)
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={cn(
          "relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors",
          "bg-muted/25 hover:border-primary/50 hover:bg-primary/5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          dragOver && "border-primary bg-primary/8",
          displayError && "border-destructive/60 bg-destructive/5 hover:border-destructive/70",
          file && "border-border/80 bg-background py-6 hover:bg-muted/20"
        )}
      >
        {file ? (
          <>
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MaterialSymbol name="description" className="text-[1.75rem]!" />
            </span>
            <p className="mt-3 max-w-full truncate px-2 font-semibold text-foreground text-sm">{file.name}</p>
            <p className="mt-1 text-muted-foreground text-xs">{formatFileSize(file.size)}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                assignFile(null)
              }}
              className="mt-4 text-xs font-semibold text-primary underline-offset-4 hover:underline"
            >
              Ndrysho dokumentin
            </button>
          </>
        ) : (
          <>
            <span className="flex size-14 items-center justify-center rounded-full border border-border/70 bg-background shadow-(--shadow-euromiti-soft)">
              <MaterialSymbol name="upload_file" className="text-[2rem]! text-secondary" />
            </span>
            <p className="mt-4 font-heading text-base font-bold tracking-tight text-foreground">
              Klikoni ose zvarritni dokumentin
            </p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Formate të pranuara: PDF, Word (.doc, .docx), RTF ose ODT. Madhësia maksimale: 5 MB.
            </p>
          </>
        )}
      </div>

      {displayError ? (
        <p className="text-destructive text-xs" role="alert">
          {displayError}
        </p>
      ) : null}
    </div>
  )
}
