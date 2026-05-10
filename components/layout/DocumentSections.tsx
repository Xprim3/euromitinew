import type { DocumentSectionBlock } from "@/types/public"

import { cn } from "@/lib/utils"

type DocumentSectionsProps = {
  sections: readonly DocumentSectionBlock[]
  className?: string
}

/** Stacked headings + paragraphs for legal pages and similar long-form mock content. */
export function DocumentSections({ sections, className }: DocumentSectionsProps) {
  return (
    <div className={cn("space-y-10 md:space-y-14", className)}>
      {sections.map((block) => (
        <section key={block.title} className="space-y-4">
          <h2 className="font-heading text-xl font-bold tracking-tight text-foreground md:text-2xl">
            {block.title}
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed md:text-[1.05rem]">
            {block.paragraphs.map((p, i) => (
              <p key={`${block.title}-${i}`}>{p}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
