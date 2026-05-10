"use client"

import type { FormEvent } from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const fieldClass =
  "w-full rounded-[var(--rounded-DEFAULT)] border border-border bg-background px-4 py-3 text-foreground shadow-sm outline-none transition-[box-shadow,border-color] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/45"

type ContactFormProps = {
  className?: string
}

/** Demo contact UI — submits are client-only until backend wiring exists. */
export function ContactForm({ className }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className={cn("rounded-[var(--rounded-lg)] border border-border/80 bg-card p-6 shadow-(--shadow-euromiti-soft) md:p-8", className)}>
      <div className="mb-8 space-y-2">
        <h2 className="font-heading text-xl font-bold text-foreground md:text-2xl">
          Send a message
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          Share your enquiry — we reply during business hours. This form does not transmit data yet
          (mock UI only).
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="font-semibold text-foreground text-sm" htmlFor="contact-name">
              Full name
            </label>
            <input id="contact-name" name="name" type="text" autoComplete="name" className={fieldClass} required />
          </div>
          <div className="space-y-2">
            <label className="font-semibold text-foreground text-sm" htmlFor="contact-email">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              className={fieldClass}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-semibold text-foreground text-sm" htmlFor="contact-phone">
            Phone <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input id="contact-phone" name="phone" type="tel" autoComplete="tel" className={fieldClass} />
        </div>

        <div className="space-y-2">
          <label className="font-semibold text-foreground text-sm" htmlFor="contact-subject">
            Subject
          </label>
          <input id="contact-subject" name="subject" type="text" className={fieldClass} required />
        </div>

        <div className="space-y-2">
          <label className="font-semibold text-foreground text-sm" htmlFor="contact-message">
            Message
          </label>
          <textarea id="contact-message" name="message" rows={5} className={cn(fieldClass, "min-h-32 resize-y")} required />
        </div>

        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Submit enquiry
        </Button>

        {submitted ? (
          <p className="text-success text-sm font-medium" role="status">
            Thanks — this demo captured your input locally. Wire to email or CRM in a later phase.
          </p>
        ) : null}
      </form>
    </div>
  )
}
