/**
 * Opt-in Tailwind/CSS utility hooks for the Euromiti motion layer.
 * Compose with `cn()` — does not activate until you reference these classes.
 */
export const EuromitiMotionClasses = {
  /** Subtle `-1px` lift on hover (real hover devices only). */
  buttonHover: "euromiti-btn-hover",
  /** Slight zoom via `.euromiti-img-zoom img` when using `<ImageHoverZoom>` (see globals). */
  imageZoomWrap: "euromiti-img-zoom",
  /** Legacy: zoom now targets descendant `img`; optional on raw `<img>` if you duplicate rules. */
  imageZoomTarget: "euromiti-img-zoom-target",
  /** ~1% scale on hover for cards/tiles */
  hoverScale: "euromiti-hover-scale",
  /** Scroll-driven primitives add these internally; exported for bespoke cases */
  reveal: "euromiti-reveal",
  revealFadeUp: "euromiti-reveal--fade-up",
  revealVisible: "euromiti-reveal--visible",
  sectionReveal: "euromiti-section-reveal",
  sectionRevealVisible: "euromiti-section-reveal--visible",
  staggerGroup: "euromiti-stagger-group",
  staggerActive: "euromiti-stagger-group--active",
} as const
