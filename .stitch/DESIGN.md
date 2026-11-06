# Design System: [Client Name] ([Business Type])

<!--
  ┌─────────────────────────────────────────────────────────────────┐
  │  ASCEND AI MARKETING — DESIGN.MD TEMPLATE                       │
  │                                                                 │
  │  HOW TO USE THIS FILE:                                          │
  │  1. Replace every [PLACEHOLDER] with client-specific values     │
  │  2. This file is read by Google Stitch for design generation    │
  │  3. This file is read by Claude Code for consistent building    │
  │  4. The CSS tokens in global.css must match these values        │
  │  5. Commit this file to the repo root + .stitch/ folder         │
  └─────────────────────────────────────────────────────────────────┘
-->

---

## 1. Visual Theme & Atmosphere

[2–4 sentences describing the emotional feel and personality of this brand.
What does the design say about the company? What makes it different from
competitors in this market? What should a first-time visitor feel?

Example: "Apex Roofing's design is built to convey durability and trust —
the visual equivalent of a solid handshake. Deep slate tones and structured
layouts communicate professionalism, while warm accent colors and approachable
typography remind homeowners this is a family business, not a faceless contractor.
Where competitors use generic stock-photo-heavy sites, Apex leads with real
project photography and clear social proof."]

**Key Characteristics:**
- [Characteristic 1 — e.g. "Clean, structured layouts that signal professionalism"]
- [Characteristic 2 — e.g. "Warm accents that humanize a trade business"]
- [Characteristic 3 — e.g. "Real photography over stock images"]
- [Characteristic 4 — e.g. "Bold, scannable headlines for busy homeowners"]

---

## 2. Color Palette & Roles

### Primary
- **Brand Primary** (`#[HEX]`): [Role — e.g. "CTA buttons, links, active nav states, key highlights"]
- **Brand Hover** (`#[HEX]`): [Role — e.g. "Hover state for brand primary elements"]
- **Brand Accent** (`#[HEX]`): [Role — e.g. "Secondary highlights, badges, decorative elements"]

### Surfaces & Backgrounds
- **Background** (`#[HEX]`): [Role — e.g. "Primary page background"]
- **Background Muted** (`#[HEX]`): [Role — e.g. "Section alternation, card backgrounds"]
- **Background Dark** (`#[HEX]`): [Role — e.g. "Footer, dark CTA sections"]

### Text
- **Text Primary** (`#[HEX]`): [Role — e.g. "Headings and high-emphasis body text"]
- **Text Muted** (`#[HEX]`): [Role — e.g. "Body copy, descriptions, secondary info"]
- **Text Inverse** (`#[HEX]`): [Role — e.g. "Text on dark backgrounds"]

### Borders
- **Border** (`#[HEX]`): [Role — e.g. "Default borders, card outlines, dividers"]
- **Border Strong** (`#[HEX]`): [Role — e.g. "Prominent borders, hover states"]

### Semantic
- **Success** (`#[HEX]`): [Role — e.g. "Form success states, confirmation messages"]
- **Error** (`#[HEX]`): [Role — e.g. "Form errors, warnings"]

---

## 3. Typography Rules

### Font Families
- **Heading**: `[Font Name]` — [Why this font / what it conveys]
- **Body**: `[Font Name]` — [Why this font / what it conveys]
- **Mono** (optional): `[Font Name]` — for code or data

*Google Fonts import URL: `[paste the Google Fonts URL here]`*

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|---|---|---|---|---|---|
| Display / H1 | [Heading] | clamp(2rem, 5vw, 3.5rem) | 800 | 1.1 | Homepage hero only |
| H2 | [Heading] | clamp(1.75rem, 3vw, 2.5rem) | 700 | 1.2 | Section headings |
| H3 | [Heading] | 1.5rem | 700 | 1.3 | Card titles, sub-sections |
| H4 | [Heading] | 1.125rem | 600 | 1.4 | Small headings |
| Body Large | [Body] | 1.125rem | 400 | 1.6 | Intro paragraphs |
| Body | [Body] | 1rem | 400 | 1.6 | Standard body copy |
| Body Small | [Body] | 0.875rem | 400 | 1.5 | Captions, metadata |
| Label | [Body] | 0.75rem | 600 | 1.4 | Badges, tags, overlines |
| Button | [Body] | 1rem | 700 | 1 | All button text |

### Principles
- [Principle 1 — e.g. "Headings are bold and assertive — this is a trade business, not a spa"]
- [Principle 2 — e.g. "Body text is generous at 1.6 line-height — mobile readers need breathing room"]
- [Principle 3 — e.g. "No font sizes below 14px anywhere on the site"]

---

## 4. Component Stylings

### Buttons

**Primary Button**
- Background: Brand Primary (`#[HEX]`)
- Text: White or Text Inverse
- Padding: `0.75rem 1.75rem`
- Radius: `var(--radius-md)` ([VALUE]px)
- Hover: Brand Hover (`#[HEX]`)
- [Any other notes]

**Secondary / Outline Button**
- Background: Transparent
- Border: 2px solid Border Strong
- Text: Text Primary
- Hover: Background Muted fill
- Radius: same as primary

**Ghost Button**
- Background: Transparent
- Text: Brand Primary
- No border
- Hover: Background Muted

### Cards
- Background: Background Muted (`#[HEX]`)
- Border: 1px solid Border (`#[HEX]`)
- Radius: `var(--radius-xl)` ([VALUE]px)
- Padding: `2rem`
- Hover: Lifted shadow — `0 8px 30px rgba(0,0,0,0.08)`

### Forms / Inputs
- Background: Background (`#[HEX]`)
- Border: 1px solid Border
- Focus: 2px ring, Brand Primary color
- Radius: `var(--radius-md)`
- Padding: `0.625rem 0.875rem`
- Font size: `1rem`

### Navigation
- Background: Background + `backdrop-filter: blur(8px)`
- Position: `sticky top-0`
- Height: `4rem`
- Border-bottom: 1px solid Border
- Active link: Text Primary + Background Muted highlight
- CTA button: Primary Button style

### Hero Section
- Background: Background Muted
- Layout: [Single column / Two column split / Full-width image overlay]
- Headline size: Display (clamp)
- [Any other notes]

---

## 5. Layout Principles

### Spacing System (base 8px)
- `--spacing-1`: 0.5rem (8px)
- `--spacing-2`: 1rem (16px)
- `--spacing-3`: 1.5rem (24px)
- `--spacing-4`: 2rem (32px)
- `--spacing-6`: 3rem (48px)
- `--spacing-8`: 4rem (64px)
- `--spacing-10`: 5rem (80px)

### Container
- Max width: `1200px`
- Padding: `1.5rem` each side (mobile: `1rem`)

### Section Padding
- Standard sections: `5rem` top and bottom
- Hero: `5rem` top, `5rem` bottom
- Compact sections: `3rem` top and bottom

### Grid System
- Mobile: single column
- Tablet (640px+): 2-column
- Desktop (1024px+): up to 3-column
- Gap: `1.5rem` standard, `2rem` for feature grids

### Border Radius Scale
- `--radius-sm`: 4px — minimal elements
- `--radius-md`: 8px — buttons, inputs
- `--radius-lg`: 12px — small cards
- `--radius-xl`: 16px — standard cards
- `--radius-2xl`: 24px — hero images, large containers
- `--radius-full`: 9999px — pills, badges

---

## 6. Depth & Elevation

| Level | Treatment | Used For |
|---|---|---|
| Flat | No shadow, no border | Page background |
| Bordered | `1px solid var(--color-border)` | Cards, inputs |
| Lifted | `0 4px 16px rgba(0,0,0,0.06)` | Hover cards |
| Floating | `0 8px 30px rgba(0,0,0,0.10)` | Modals, dropdowns |
| Hero | `0 25px 50px rgba(0,0,0,0.15)` | Hero images |

---

## 7. Do's and Don'ts

### Do
- [DO 1 — e.g. "Use Brand Primary only for CTAs and key interactive elements"]
- [DO 2 — e.g. "Alternate section backgrounds between Background and Background Muted"]
- [DO 3 — e.g. "Use real client photography wherever possible"]
- [DO 4 — e.g. "Keep paragraphs short — 2–3 sentences max for this audience"]
- [DO 5 — e.g. "Include a CTA in every section — this is a lead-gen site"]

### Don't
- [DON'T 1 — e.g. "Don't use more than 2 type weights — bold and regular only"]
- [DON'T 2 — e.g. "Don't use gradients — flat color only"]
- [DON'T 3 — e.g. "Don't use decorative fonts — legibility is priority one"]
- [DON'T 4 — e.g. "Don't stack more than 2 CTAs in the same view"]
- [DON'T 5 — e.g. "Don't use cool-toned grays — all neutrals should feel warm"]

---

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Single column, stacked nav, reduced type scale |
| Tablet | 640px–1023px | 2-column grids, condensed nav |
| Desktop | 1024px+ | Full layout, multi-column, max typography |

### Collapsing Strategy
- Navigation: full horizontal → hamburger at mobile
- Hero: 2-column → single column stacked (text above image)
- Service cards: 3-col → 2-col → 1-col
- Footer: 3-col → 2-col → 1-col
- Type scale: clamp() handles fluid scaling automatically

---

## 9. Agent Prompt Guide

### Quick Color Reference
```
Brand Primary:    #[HEX]
Brand Hover:      #[HEX]
Background:       #[HEX]
Background Muted: #[HEX]
Text Primary:     #[HEX]
Text Muted:       #[HEX]
Border:           #[HEX]
```

### CSS Variable Mapping
```css
--color-brand:         #[HEX];
--color-brand-hover:   #[HEX];
--color-bg:            #[HEX];
--color-bg-muted:      #[HEX];
--color-bg-dark:       #[HEX];
--color-text:          #[HEX];
--color-text-muted:    #[HEX];
--color-text-inverse:  #[HEX];
--color-border:        #[HEX];
--color-border-strong: #[HEX];
--font-heading:        '[Font Name]', system-ui, sans-serif;
--font-body:           '[Font Name]', system-ui, sans-serif;
```

### Example Component Prompts (for Stitch)
- "Create a hero section on [Background Muted] with a [Display] headline in [Heading font] weight 800.
   Subheadline in [Text Muted] at Body Large. Primary CTA button in [Brand Primary] with white text,
   [radius-md] radius. Two-column layout with text left, image right."

- "Design a service card on [Background Muted] with [border] border, [radius-xl] radius.
   Icon placeholder in [Brand Primary]. Card title in H3 [Heading font]. Description in Body [Body font]
   [Text Muted]. Hover: lifted shadow."

- "Build a dark CTA banner section on [Background Dark] background. Headline in white H2.
   Body text in white 80% opacity. Button in white background, [Brand Primary] text."

---

*Generated by Ascend AI Marketing — Design.MD Generator*
*Client: [Client Name] | Date: [DATE] | Version: 1.0*
