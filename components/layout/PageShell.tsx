import type { ReactNode } from "react"

import { Container } from "./Container"
import { PageHeader } from "./PageHeader"

type PageShellProps = {
  title: string
  children?: ReactNode
}

/** Minimal interior page scaffold — swaps to richer layouts later without losing routes. */
export function PageShell({ title, children }: PageShellProps) {
  return (
    <>
      <PageHeader title={title} />
      {children ? (
        <Container className="euromiti-section">{children}</Container>
      ) : null}
    </>
  )
}
