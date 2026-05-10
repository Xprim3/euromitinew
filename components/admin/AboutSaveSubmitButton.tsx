"use client"

import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"

export function AboutSaveSubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Saving…" : "Save about page"}
    </Button>
  )
}
