---
name: Corporate Excellence
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#45464d'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
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
  tertiary-container: '#2a1700'
  on-tertiary-container: '#b87500'
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
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  section-gap: 80px
---

## Brand & Style
The brand identity for this design system is rooted in the concepts of stability, heritage, and modern efficiency. It targets a professional audience that values precision and reliability. The aesthetic leans heavily into a **Corporate / Modern** style, utilizing a high-contrast palette to establish clear information hierarchy while maintaining a premium, "Blue Chip" feel. 

Visuals should be spacious and organized, avoiding clutter to evoke a sense of calm authority. The interface prioritizes clarity and functional beauty, ensuring that every element serves a specific purpose in the user journey.

## Colors
The color palette is designed to balance authority with energy. 
- **Primary (Dark Navy):** Used for global navigation, primary headings, and high-level structural elements to ground the design.
- **Secondary (Deep Red):** Reserved for secondary actions, critical alerts, or brand-specific accents that require attention without being distracting.
- **Accent (Gold):** Used sparingly for highlighting premium features, active states, or "call to success" elements.
- **Surface Strategy:** Use the Light Section Background (#F8FAFC) to create subtle separation between content blocks on long-scrolling pages.

## Typography
The typographic system utilizes **Montserrat** for headings to provide a geometric, confident, and professional structure. For body text, **Inter** is employed for its exceptional legibility and neutral character, which is particularly effective for data-heavy corporate interfaces.

- **Weight Usage:** Reserve Bold (700) for Display and Headline levels. Use Semi-Bold (600) for sub-headers and button labels.
- **Readability:** Maintain a line height of at least 1.5 for body text to ensure ease of reading on mobile devices.
- **Hierarchy:** Use the Gold accent color for "Label" styles occasionally to draw attention to categories or statuses.

## Layout & Spacing
The design system follows a **Fixed Grid** model for desktop to maintain a premium, editorial feel, while transitioning to a fluid model for mobile devices.

- **Grid:** A 12-column grid is used for desktop (breakpoints at 1024px+). 
- **Rhythm:** An 8px linear scale governs all padding and margin decisions. 
- **Safe Zones:** Mobile layouts must maintain a minimum 16px lateral margin. 
- **Sectioning:** Use generous vertical padding (80px+) between major sections to emphasize a "premium" sense of space and prevent the UI from feeling crowded.

## Elevation & Depth
Depth is achieved through **Tonal Layers** and **Ambient Shadows**. The design system avoids heavy gradients, favoring flat surfaces that feel "lifted" from the background.

- **Surface Levels:** The main background is white (#FFFFFF). Elevated elements like cards use a soft, multi-layered shadow (e.g., `0px 4px 20px rgba(15, 23, 42, 0.08)`).
- **Interactions:** On hover, cards should subtly increase their elevation (shadow becomes slightly more diffused) to provide tactile feedback.
- **Outlines:** Use a 1px border (#E2E8F0) for non-elevated interactive elements like input fields to maintain a crisp, professional structure.

## Shapes
The shape language is **Rounded**, using a 0.5rem (8px) base radius. This strikes a balance between the "sharp" traditional corporate look and the "friendly" consumer-tech look.

- **Small Components:** Checkboxes and small tags use `rounded-sm` (4px).
- **Standard Components:** Buttons, Input fields, and Cards use the base `rounded` (8px).
- **Large Components:** Modals and large feature containers use `rounded-lg` (16px).

## Components
- **Buttons:** Large tap targets (min-height 48px). Primary buttons use Dark Navy with white text. Secondary buttons use Deep Red. Ghost buttons should use a Navy outline. Use the Gold accent for specific high-conversion "Gold" or "Premium" tiers.
- **Cards:** White background, 8px corner radius, and an ambient shadow. Ensure a minimum of 24px internal padding for content.
- **Input Fields:** 1px solid border (#CBD5E1) with a 2px Navy border focus state. Labels should be positioned above the field using the `label-md` typography style.
- **Icons:** Use 24px line icons with a 2px stroke weight for a consistent professional look. Icons should match the text color (#111827) or the Primary Navy for emphasis.
- **Chips/Badges:** Use the Light Section Background (#F8FAFC) as the fill color with Dark Navy text for a subtle, modern tag style.
- **Navigation:** Top-tier navigation should be sticky, utilizing the Primary Navy background with White text for a strong brand anchor.