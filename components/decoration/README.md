# Decorative design system (Euromiti)

Premium, low-contrast accents for public pages. **Do not spam** — one or two layers per section band is enough.

Global rules

- Every decorative layer is **`pointer-events-none`** (or wraps content with an inner `pointer-events-auto` shell where needed).
- Parent must be **`relative overflow-x-hidden`** when using absolute fill patterns or blobs.
- Prefer **`aria-hidden`** on purely visual SVG/div shells.
- Mobile: components already reduce opacity/size; avoid stacking more than one heavy layer on small screens.
- Colors: navy `#0F172A`, gold `#F59E0B`, deep red `#B91C1C` only in hints.

---

## `SectionWaveDivider`

Subtle wave strip between stacked sections.

**Where:** Between homepage bands, between About narrative blocks, footer prelude.

**Example**

```tsx
import { SectionWaveDivider } from "@/components/decoration"

<section>...</section>
<SectionWaveDivider flip className="opacity-[0.35]" />
<section className="relative">...</section>
```

---

## `DecorativeLines`

Thin SVG rules or arcs beside headings / media columns.

**Where:** Hero eyebrow rows, split layouts, image captions.

**Variants:** `rule` | `arc` · **`gold` | `navy` | `redSoft`**

**Example**

```tsx
import { DecorativeLines } from "@/components/decoration"

<div className="flex items-start gap-3">
  <DecorativeLines accent="gold" className="max-md:hidden" />
  <h2>Our Services</h2>
</div>
```

---

## `SoftGradientBlob`

Large blurred radial wash behind photography or hero shells.

**Where:** Hero right column, Restaurant feature image, Careers culture photo.

**Placement presets:** `top-right` (default), `top-left`, `bottom-right`, `bottom-left`

**Example**

```tsx
import { SoftGradientBlob } from "@/components/decoration"

<div className="relative overflow-hidden">
  <SoftGradientBlob tint="goldWash" placement="top-right" />
  {/* existing image / content */}
</div>
```

---

## `PremiumSectionLabel`

Micro uppercase luxury label **above** primary headings (different shape language than `BrandEyebrow`).

**Where:** Homepage proof bands, About timeline intros, Locations list header, Restaurant tasting notes.

**Example**

```tsx
import { PremiumSectionLabel } from "@/components/decoration"

<PremiumSectionLabel>Euromiti Locations</PremiumSectionLabel>
<h2 className="font-display text-4xl ...">Across the region</h2>
```

---

## `ImageAccentFrame`

Adds a tonal gradient bezel + faint ring; **does not change layout**.

**Where:** Signature restaurant plating shots, exec portraits (About), service category cards.

**Example**

```tsx
import { ImageAccentFrame } from "@/components/decoration"

<ImageAccentFrame rounded="rounded-3xl" className="max-w-xl">
  <Image src="..." alt="..." className="rounded-3xl" />
</ImageAccentFrame>
```

Inner media should repeat the same `rounded-*` for a flush corner match.

---

## `BackgroundPattern`

Large abstract mesh for full-width sections only.

**Where:** Careers values band, Contact map backdrop (behind content), long Services grid.

**Example**

```tsx
import { BackgroundPattern } from "@/components/decoration"

<section className="relative overflow-x-hidden py-24">
  <BackgroundPattern />
  <div className="relative z-10 ...">{/* existing content */}</div>
</section>
```

---

## Token export

`decorationTokens` in `decoration-styles.ts` mirrors brand hex values for bespoke SVG strokes if needed.
