---
name: Clinical Excellence
colors:
  surface: '#f7f9fc'
  surface-dim: '#d8dadd'
  surface-bright: '#f7f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f7'
  surface-container: '#eceef1'
  surface-container-high: '#e6e8eb'
  surface-container-highest: '#e0e3e6'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f4'
  outline: '#76777e'
  outline-variant: '#c6c6ce'
  surface-tint: '#545e7c'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#101a36'
  on-primary-container: '#7983a4'
  inverse-primary: '#bcc5e9'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#301403'
  on-tertiary-container: '#a77a60'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#bcc5e9'
  on-primary-fixed: '#101a36'
  on-primary-fixed-variant: '#3c4663'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#ffdbc9'
  tertiary-fixed-dim: '#f0bb9e'
  on-tertiary-fixed: '#301403'
  on-tertiary-fixed-variant: '#633e28'
  background: '#f7f9fc'
  on-background: '#191c1e'
  surface-variant: '#e0e3e6'
  slate-professional: '#64748B'
  success-mint: '#10B981'
  warning-amber: '#F59E0B'
  error-rose: '#E11D48'
  patient-lavender: '#818CF8'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-margin: 32px
  gutter: 24px
  section-padding: 64px
  stack-sm: 12px
  stack-md: 24px
---

## Brand & Style

The design system is engineered for a high-end medical technology platform, balancing clinical precision with an approachable, patient-centric warmth. It serves two primary audiences: fertility clinic specialists who require data density and enterprise-grade reliability, and prospective parents who seek comfort and clarity.

The visual style is **Corporate / Modern** with a lean toward **Minimalism**. It utilizes expansive white space to denote cleanliness and a "breathing room" philosophy essential in high-stress medical contexts. The aesthetic is polished and high-fidelity, conveying institutional trust through subtle depth, refined typography, and a deliberate lack of decorative clutter.

Key attributes:
- **Trustworthy:** Every element feels intentional and secure.
- **Efficient:** Information hierarchy is optimized for rapid clinical decision-making.
- **Human:** Softened edges and gentle gradients prevent the UI from feeling cold or sterile.

## Colors

The palette is anchored by a **Deep Navy** primary color, chosen for its traditional association with medical authority and stability. This is complemented by a **Vibrant Blue** secondary color used for primary actions and interactive states.

- **Primary (Deep Navy):** Used for typography, sidebars, and structural grounding.
- **Secondary (Blue):** Highlights key CTAs, active navigation states, and progress indicators.
- **Neutral (Slate/Ice):** A range of cool grays and off-whites are used to define surface areas without introducing harsh contrast.
- **Semantic Colors:** Softened versions of green, amber, and red are used for clinical status tracking (e.g., cycle phases, appointment urgency).

Soft linear gradients are used sparingly on card headers or buttons to add a layer of "glassy" sophistication, moving from the primary blue to a lighter tint.

## Typography

This design system uses a dual-sans-serif approach to define its enterprise character. 

**Hanken Grotesk** is the primary display face. Its sharp, contemporary geometry provides a sophisticated "tech-forward" feel for headlines and section titles. 

**Inter** is utilized for all functional UI elements, body copy, and data-heavy tables. Its exceptional legibility and neutral tone make it ideal for the high-density requirements of a CRM while maintaining a modern aesthetic.

Line heights are intentionally generous (typically 1.5x) to ensure medical data remains scannable and non-intimidating for patients.

## Layout & Spacing

The layout utilizes a **Fixed Grid** system for desktop (12 columns, 1280px max-width) to maintain a controlled, professional environment. For dashboard views, a **Fluid Sidebar** model is used, where the navigation stays fixed at 280px and the content area expands to fill the viewport.

Spacing follows an 8px rhythmic scale. Generous external margins (32px+) are used to separate major functional blocks, reinforcing the minimalist, "airy" brand philosophy. 

**Responsive Behavior:**
- **Desktop:** 12-column grid, 24px gutters.
- **Tablet:** 8-column grid, 16px gutters, margins reduced to 24px.
- **Mobile:** 4-column grid, 16px gutters, margins reduced to 16px. Vertical stacking is enforced for all card-based components.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Ambient Shadows**. Surfaces are not purely flat but utilize subtle z-axis cues to define interactivity.

- **Base Layer:** The application background uses the neutral `#F7F9FC` to reduce eye strain.
- **Mid Layer:** Primary content cards use a pure white background with a very soft, diffused shadow (15% opacity of the Navy brand color) and a 1px border in a slightly darker neutral tint.
- **Top Layer:** Modals and dropdowns feature a more pronounced shadow and a backdrop blur (Glassmorphism) to maintain context while focusing user attention.

Avoid heavy black shadows; instead, use tinted shadows derived from the primary navy color to keep the interface feeling "clean" and clinical.

## Shapes

The design system employs a **Rounded** shape language. This specific level of corner radius (8px base) strikes the perfect balance between the rigid precision of a medical instrument and the approachability of a modern consumer app.

- **Cards & Containers:** Use `rounded-lg` (16px) to create a friendly, "contained" feel for patient data.
- **Buttons & Inputs:** Use the base `rounded` (8px) for a professional, clickable appearance.
- **Chips & Badges:** Use `pill-shaped` (100px) to distinguish status indicators from functional buttons.

## Components

### Buttons
- **Primary:** Solid Deep Navy or Blue with white text. High-contrast. 
- **Secondary:** White background with 1px Navy border and Navy text.
- **Tertiary:** Ghost style, Blue text, no border. Used for "Cancel" or "Learn more."

### Cards
Cards are the primary organizational unit. They must include a `rounded-lg` corner radius, a subtle 1px neutral border, and a low-diffusion shadow. Headers within cards should use the `title-md` typography level.

### Input Fields
Inputs should have a white background, 8px rounded corners, and a 1px border that shifts to Blue on focus. Labels use `label-sm` and are placed consistently above the field.

### Chips & Status Badges
Status indicators (e.g., "Active," "Pending") use a soft-tinted background of their semantic color (e.g., light green background with dark green text) in a pill shape.

### Progress Indicators
For IVF cycle tracking, use circular progress indicators or "steppers" with soft gradients to denote movement and positive progression.