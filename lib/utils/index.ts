import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** `tel:` URI from a display phone string (digits and `+` only; collapses duplicate `+`; `00` → `+`). */
export function telHrefFromDisplayPhone(phone: string): string | undefined {
  const d = phone
    .trim()
    .replace(/[^\d+]/g, "")
    .replace(/^\++/g, "+")
  let core = d
  if (!core.startsWith("+") && core.startsWith("00")) {
    core = `+${core.slice(2)}`
  }
  const digitCount = (core.match(/\d/g) ?? []).length
  if (digitCount < 6) return undefined
  return `tel:${core}`
}
