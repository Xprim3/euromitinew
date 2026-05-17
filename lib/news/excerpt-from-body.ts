/** Max length for list/card previews derived from the article body. */
const LIST_EXCERPT_MAX = 240

/**
 * Short preview from body paragraphs (news list, homepage, SEO fallback).
 * Truncates at a word boundary and adds an ellipsis when clipped.
 */
export function excerptFromParagraphs(paragraphs: readonly string[]): string {
  const plain = paragraphs
    .map((p) => p.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()

  if (!plain) return ""
  if (plain.length <= LIST_EXCERPT_MAX) return plain

  const slice = plain.slice(0, LIST_EXCERPT_MAX)
  const lastSpace = slice.lastIndexOf(" ")
  const cut = lastSpace > LIST_EXCERPT_MAX * 0.55 ? slice.slice(0, lastSpace) : slice.trimEnd()
  return `${cut}…`
}
