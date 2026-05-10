---
name: Euromiti Core
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#b6191a'
  on-secondary: '#ffffff'
  secondary-container: '#d9352f'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb4ab'
  on-secondary-fixed: '#410002'
  on-secondary-fixed-variant: '#93000b'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-bold:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-muted:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 24px
  gutter: 16px
  margin-sm: 8px
  margin-md: 16px
  margin-lg: 32px
  sidebar-width: 280px
---

## Brand & Style
The visual identity of this design system is rooted in **Corporate Premium** aesthetics, designed for high-stakes administrative environments where clarity and authority are paramount. The system leverages a "Legacy meets Modern" narrative, utilizing a deep navy and crimson palette to evoke trust and institutional strength, while maintaining a spacious, functional layout that prevents cognitive overload.

The style emphasizes:
- **Precision:** Mathematical spacing and strict alignment.
- **Authority:** A heavy emphasis on typography hierarchy and subtle, intentional use of brand colors.
- **Efficiency:** Clear data visualization containers and high-readability interfaces for prolonged professional use.

## Colors
This design system utilizes a high-contrast palette optimized for an administrative environment. 

- **Primary Navy (#0F172A):** Reserved for sidebars, primary navigation headers, and high-level structural elements.
- **Deep Red (#B91C1C):** Used sparingly for primary actions, brand accents, and critical indicators.
- **Surface Strategy:** The background uses a cool-toned Slate (#F8FAFC) to differentiate from the pure White (#FFFFFF) card surfaces, providing a subtle "layering" effect without heavy shadows.
- **Status Indicators:** Standardized semantic colors for immediate data interpretation, ensuring the gold accent remains distinct from general "warning" states by utilizing varied saturation.

## Typography
The system employs a dual-font strategy. **Montserrat** provides a geometric, confident personality for headings and display titles, while **Inter** is used for all functional body text, data tables, and interface labels due to its exceptional legibility at small sizes.

- **Hierarchy:** Use `label-bold` for table headers and section overlines.
- **Readability:** Body text should maintain a 1.5x line-height ratio to ensure comfort during heavy data entry.
- **Responsive Scaling:** On mobile devices, `display-lg` should scale down to `display-md` to maintain layout integrity.

## Layout & Spacing
The layout follows a **Fixed-Fluid hybrid** model. The sidebar remains fixed at 280px, while the main content area utilizes a fluid 12-column grid with a maximum container width of 1440px to prevent excessive line lengths on ultra-wide monitors.

- **Rhythm:** An 8px base grid governs all padding and margins.
- **Data Tables:** Tables should use "Spacious" vertical padding (12px - 16px per row) to improve scanning speed.
- **Breakpoints:**
  - **Desktop:** 1200px+ (12 columns, 24px margins)
  - **Tablet:** 768px - 1199px (8 columns, 16px margins, sidebar collapses to icons)
  - **Mobile:** <767px (4 columns, 16px margins, top navigation bar)

## Elevation & Depth
Depth is created through **Tonal Layering** supplemented by refined shadows. 

- **Level 0 (Background):** #F8FAFC. The lowest layer.
- **Level 1 (Cards/Content):** #FFFFFF with a 1px border (#E2E8F0) and a "Soft Drop" shadow: `0px 1px 3px rgba(15, 23, 42, 0.08)`.
- **Level 2 (Hover/Active):** Slightly more pronounced shadow: `0px 10px 15px -3px rgba(15, 23, 42, 0.12)`.
- **Level 3 (Modals/Dropdowns):** Deep shadow to pull elements away from the interface: `0px 20px 25px -5px rgba(0, 0, 0, 0.1)`.

Avoid heavy gradients; depth should feel structural, not decorative.

## Shapes
This design system utilizes the `ROUND_EIGHT` standard. 

- **Components:** Buttons, Input fields, and Card containers use a 0.5rem (8px) radius.
- **Nested Elements:** Elements inside a card (like images or sub-containers) should use a slightly smaller radius (4px) to maintain visual harmony.
- **Chips/Badges:** Use a fully rounded pill shape (9999px) to distinguish status indicators from clickable buttons.

## Components
- **Buttons:** 
  - *Primary:* Deep Red background, White text. 
  - *Secondary:* Dark Navy background, White text. 
  - *Tertiary:* White background, Slate-200 border, Navy text.
- **Input Fields:** 8px rounded corners, 1px Slate-300 border. Focus state uses a 2px Navy ring with 4px offset.
- **Data Tables:** Borderless rows with a subtle bottom divider (#F1F5F9). Alternating row stripes are not required; use hover states to highlight rows instead.
- **Cards:** White surface, 8px radius, 1px border (#E2E8F0). Headers within cards should have a subtle bottom divider.
- **Navigation:** Sidebar uses the Primary Navy background. Active states should be indicated by a Deep Red vertical bar (4px wide) on the left edge of the menu item and a slight opacity shift in the background.
- **Status Chips:** Low-opacity background of the semantic color (e.g., 10% Success Green) with high-contrast text of the same hue.