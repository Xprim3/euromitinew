"use client"

import Link from "next/link"
import { useEffect } from "react"

import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"

export default function LocationsErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[locations error boundary]", error)
  }, [error])

  return (
    <section className="bg-muted euromiti-section">
      <Container className="py-16">
        <div className="mx-auto max-w-lg rounded-xl border border-border bg-card px-6 py-8 text-center shadow-(--shadow-euromiti-soft)">
          <h2 className="font-heading text-lg font-semibold text-foreground">Something went wrong</h2>
          <p className="mt-2 text-muted-foreground text-sm">
            The locations page failed to render. Try again — if this keeps happening, contact support.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button type="button" variant="default" size="sm" onClick={() => reset()}>
              Try again
            </Button>
            <Button type="button" variant="outline" size="sm" render={<Link href="/" />}>
              Back home
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
