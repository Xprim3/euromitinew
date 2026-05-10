"use client"

import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"

export function ServicesSaveSubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Saving…" : "Save services page"}
    </Button>
  )
}
