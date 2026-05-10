import type { ReactNode } from "react"

import { Container } from "./Container"
import { PageHeader } from "./PageHeader"

type PageShellProps = {
  title: string
  description?: string
  children?: ReactNode
}

/** Minimal interior page scaffold — swaps to richer layouts later without losing routes. */
export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <>
      <PageHeader title={title} description={description} />
      {children ? (
        <Container className="euromiti-section">{children}</Container>
      ) : null}
    </>
  )
}
