import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Merge classes for admin design-system components. */
export function cnDs(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
