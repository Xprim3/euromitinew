"use client"

import type { FormEvent } from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"

export function FooterNewsletterForm() {
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <input
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="Email address"
        className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white placeholder:text-white/30 transition-colors focus:border-brand-red-vivid focus:outline-none"
      />
      <Button
        type="submit"
        variant="secondary"
        className="rounded-xl bg-brand-red-vivid px-6 py-4 text-xs font-black uppercase tracking-widest hover:bg-secondary"
      >
        Subscribe now
      </Button>
      {sent ? (
        <p className="text-xs font-medium text-white/50">
          Thanks — this demo does not send email yet.
        </p>
      ) : null}
    </form>
  )
}
