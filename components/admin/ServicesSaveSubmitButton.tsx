"use client"

import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"

type ServicesSaveSubmitButtonProps = {
  label?: string
  pendingLabel?: string
}

export function ServicesSaveSubmitButton(props?: ServicesSaveSubmitButtonProps) {
  const { label = "Save services page", pendingLabel = "Saving…" } = props ?? {}
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  )
}
