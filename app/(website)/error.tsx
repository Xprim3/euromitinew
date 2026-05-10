"use client"

import Link from "next/link"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"

export default function WebsiteGlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[website:error]", error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center bg-muted/30 px-4 py-16 text-center">
      <p className="font-semibold text-destructive text-sm uppercase tracking-wide">Something went wrong</p>
      <h1 className="mt-3 max-w-md font-heading text-foreground text-xl font-bold tracking-tight md:text-2xl">
        We couldn&apos;t finish loading this screen
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground text-sm">
        Refresh the page or return home. If the problem continues, reach us via contact.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
        <Button variant="outline" render={<Link href="/" />}>
          Home
        </Button>
      </div>
    </div>
  )
}
