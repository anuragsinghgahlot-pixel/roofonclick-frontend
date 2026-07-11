# StayyNest Design System Specification

This document details the visual and behavioral foundation of the **StayyNest** platform. Engineered for a modern, premium, and youth-focused user experience, it balances aesthetics (inspired by Airbnb-level polish) with the technical integration guidelines of **Next.js 16**, **Tailwind CSS v4**, and **shadcn/ui**.

---

## 1. Brand Personality & Design Principles

To resonate with students and young professionals seeking premium accommodation, StayyNest aligns to five core principles:
* **Minimalist Sophistication**: Clean spacing, low-contrast borders, and spacious layouts that let property details take center stage.
* **Warm Trustworthiness**: Organic tones (Forest Green & Warm Gold) to convey safety, stable growth, and a feeling of home.
* **Tactile Polish**: High-legibility typography, smooth animations, and multi-layered shadows that make components feel physically present and alive.
* **Accessibility First**: Color selections that comply with WCAG AA standards (minimum contrast ratio of 4.5:1 for body text) and optimized interactive target sizes.

---

## 2. Color Palette (Custom HSL Values)

Instead of default configurations, the StayyNest palette relies on custom HSL definitions optimized for Tailwind CSS v4.

### The Foundation Colors

| Token Name | Token Variable | HSL Value | Hex | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Primary (Base)** | `--color-primary-800` | `hsl(158, 42%, 18%)` | `#1a3b2b` | Deep, premium Forest Green. Represents safety and stability. |
| **Primary (Light)**| `--color-primary-50` | `hsl(158, 42%, 96%)` | `#f3f7f5` | Forest green tint. Ideal for backgrounds, badges, and hover states. |
| **Secondary** | `--color-secondary-500`| `hsl(38, 55%, 52%)` | `#d4a373` | Warm Gold. Imparts high-value quality and organic warmth. |
| **Background** | `--color-background` | `hsl(40, 12%, 98.5%)` | `#faf9f6` | Soft White (creamy neutral). Prevents stark screen glare. |
| **Cards** | `--color-card` | `hsl(0, 0%, 100%)` | `#ffffff` | Pure White. Creates layered distinction above the soft white background. |
| **Accent** | `--color-accent` | `hsl(154, 62%, 36%)` | `#1b7a50` | Soft Emerald. Highly legible green used for interactive prompts/actions. |
| **Text (Dark)** | `--color-text-slate` | `hsl(160, 24%, 10%)` | `#0f1714` | Deep forest slate. Replaces harsh `#000000` with an organic neutral. |
| **Muted** | `--color-text-muted` | `hsl(150, 6%, 48%)` | `#757f7b` | Neutral Slate Gray. Ideal for secondary text, details, and borders. |
| **Success** | `--color-success` | `hsl(142, 69%, 36%)` | `#1c9646` | Vivid Green. Indicates positive states and bookings validation. |
| **Error** | `--color-error` | `hsl(0, 84%, 44%)` | `#cc1414` | Deep Red. Indicates issues, unavailability, or inputs failure. |

---

## 3. Typography Guidelines

StayyNest uses a dual-font structure to balance strong personality in headers with clean readability in data-dense sections.

* **Primary Font (Headings)**: `Plus Jakarta Sans` — A modern, geometric sans-serif that feels clean and active.
* **Secondary Font (Body)**: `Inter` — High-legibility neutral typeface designed for screen interfaces.

### Typographic Hierarchy

| Level | Size (rem) | Size (px) | Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | `3.5rem` | `56px` | Bold (`700`) | `1.1` | `-0.02em` | Hero titles, large promotional components |
| **H1** | `2.5rem` | `40px` | Bold (`700`) | `1.2` | `-0.01em` | Main section headings |
| **H2** | `2.0rem` | `32px` | Semibold (`600`) | `1.25` | `-0.01em` | Subsection headings |
| **H3** | `1.5rem` | `24px` | Semibold (`600`) | `1.3` | `normal` | Cards, dialog headers |
| **H4** | `1.25rem` | `20px` | Medium (`500`) | `1.4` | `normal` | Sub-card headers, detail titles |
| **Body Large**| `1.125rem` | `18px` | Regular (`400`) | `1.6` | `normal` | Intro text, blog post body |
| **Body Base** | `1rem` | `16px` | Regular (`400`) | `1.6` | `normal` | General system text, descriptions |
| **Body Small**| `0.875rem` | `14px` | Regular (`400`) | `1.5` | `normal` | Captions, muted text, form hints |
| **Detail** | `0.75rem` | `12px` | Medium (`500`) | `1.4` | `0.02em` | Micro-badges, table labels, dates |

---

## 4. Spacing (8pt Grid System)

StayyNest implements a strict 8-pixel grid for layouts, margins, padding, and gaps to ensure visual harmony.

| Token | Value (px) | Value (rem) | Typical Application |
| :--- | :--- | :--- | :--- |
| `space-0.5` | `2px` | `0.125rem` | Subtle border offsets, indicator dots |
| `space-1` | `4px` | `0.25rem` | Input padding inside checkmarks, small badge items |
| `space-2` | `8px` | `0.5rem` | Group spacing inside cards, labels-to-inputs |
| `space-3` | `12px` | `0.75rem` | Multi-line form element gaps |
| `space-4` | `16px` | `1rem` | Standard padding for card headers, lists |
| `space-5` | `20px` | `1.25rem` | Medium container padding, list item gaps |
| `space-6` | `24px` | `1.5rem` | Layout padding for mobile screens |
| `space-8` | `32px` | `2rem` | Inner padding for desktop cards and panels |
| `space-10` | `40px` | `2.5rem` | Row separation on main screens |
| `space-12` | `48px` | `3rem` | Section gaps in landing page |
| `space-16` | `64px` | `4rem` | Desktop hero margin and padding |

---

## 5. Border Radius & Shadows

To establish depth and structure, elements are grouped onto layers using soft rounded shapes and shadows.

### Border Radius
- `--radius-sm`: `6px` (`0.375rem`) — Applied to badges, tag labels, and tiny utility controls.
- `--radius-md`: `12px` (`0.75rem`) — Applied to form fields, input groups, and buttons.
- `--radius-lg`: `16px` (`1rem`) — Applied to standard property cards, search sheets, and filters.
- `--radius-xl`: `24px` (`1.5rem`) — Applied to main dialogs, detail sections, and hero imagery.
- `--radius-full`: `9999px` — Applied to avatar rings, pill badges, and active sliding status bars.

### Shadows (Multi-layered & Ambient)
We avoid hard grey shadows in favor of ambient multi-layered shadows, incorporating a tiny touch of primary green color (`hsl(158, 42%, 18%)`) to make the shadow organic.

* **Shadow SM (`shadow-sm`)**:
  `0 1px 2px 0 rgba(15, 23, 20, 0.03)`
  *Subtle separator line replacement for input fields and static cards.*
* **Shadow MD (`shadow-md`)**:
  `0 4px 6px -1px rgba(15, 23, 20, 0.04), 0 2px 4px -1px rgba(15, 23, 20, 0.02)`
  *Standard elevation for sticky headers, navigation, and resting interactive cards.*
* **Shadow LG (`shadow-lg`)**:
  `0 10px 15px -3px rgba(15, 23, 20, 0.04), 0 4px 6px -2px rgba(15, 23, 20, 0.02)`
  *Used during card hover states and smaller dropdown select overlays.*
* **Shadow XL (`shadow-xl`)**:
  `0 20px 25px -5px rgba(15, 23, 20, 0.06), 0 10px 10px -5px rgba(15, 23, 20, 0.03)`
  *Used for context menus, popup selectors, and desktop side sheets.*
* **Shadow Premium (`shadow-premium`)**:
  `0 25px 50px -12px rgba(15, 23, 20, 0.08)`
  *Used on floating search widgets, main modals, and accommodation pricing calculators.*

---

## 6. Motion & Interaction (Premium Easings)

Micro-interactions must feel fluid and natural. We bypass linear animations for custom cubic bezier profiles.

### Easings
* **Premium Ease (`ease-in-out-premium`)**: `cubic-bezier(0.16, 1, 0.3, 1)`
  *An ultra-smooth deceleration profile. Essential for slide-in drawer menus, full page sheets, and expanding search blocks.*
* **Swift Ease (`ease-swift`)**: `cubic-bezier(0.4, 0, 0.2, 1)`
  *Ideal for immediate states that require snappiness without visual jar, such as button background hovers, checkbox fills, or tab active lines.*

### Durations
- **Fast (`duration-fast`)**: `150ms` — Tooltip fades, hover transitions, tag selection changes.
- **Normal (`duration-normal`)**: `300ms` — Input field focus rings, collapsible details, drawer sheets.
- **Slow (`duration-slow`)**: `500ms` — Modals scaling up, full layout animations, search grid refreshes.

---

## 7. Iconography & Sizes

Standardizing icon dimensions prevents misalignment in UI rows.

- **Icon XS (`icon-xs`)**: `12px` / `0.75rem` — Inline status dots, sub-indicators.
- **Icon SM (`icon-sm`)**: `16px` / `1rem` — Default icons in buttons, search bars, inputs, list items.
- **Icon MD (`icon-md`)**: `20px` / `1.25rem` — Standard secondary navigation, detail specs (e.g. WiFi icon, AC icon).
- **Icon LG (`icon-lg`)**: `24px` / `1.5rem` — Primary action items, title prefixes, bottom navigation tabs.
- **Icon XL (`icon-xl`)**: `32px` / `2rem` — Success/Failure indicators, dashboard summary statistics cards.

---

## 8. Tailwind CSS v4 Theme Mapping Configuration

When implementation begins, these tokens will be mapped in the CSS configuration under the `@theme` block:

```css
@theme {
  /* Color Palette overrides */
  --color-primary-50: hsl(158, 42%, 96%);
  --color-primary-100: hsl(158, 42%, 90%);
  --color-primary-500: hsl(158, 42%, 50%);
  --color-primary-800: hsl(158, 42%, 18%);
  
  --color-secondary-100: hsl(38, 55%, 92%);
  --color-secondary-500: hsl(38, 55%, 52%);
  
  --color-background: hsl(40, 12%, 98.5%);
  --color-card: hsl(0, 0%, 100%);
  
  --color-accent: hsl(154, 62%, 36%);
  
  --color-text-slate: hsl(160, 24%, 10%);
  --color-text-muted: hsl(150, 6%, 48%);
  
  /* Typographic bindings */
  --font-heading: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'Inter', sans-serif;
  
  /* Radii */
  --radius-sm: 0.375rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  
  /* Custom Motion definitions */
  --ease-premium: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-swift: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Shadows overrides */
  --shadow-sm: 0 1px 2px 0 rgba(15, 23, 20, 0.03);
  --shadow-md: 0 4px 6px -1px rgba(15, 23, 20, 0.04), 0 2px 4px -1px rgba(15, 23, 20, 0.02);
  --shadow-lg: 0 10px 15px -3px rgba(15, 23, 20, 0.04), 0 4px 6px -2px rgba(15, 23, 20, 0.02);
  --shadow-xl: 0 20px 25px -5px rgba(15, 23, 20, 0.06), 0 10px 10px -5px rgba(15, 23, 20, 0.03);
  --shadow-premium: 0 25px 50px -12px rgba(15, 23, 20, 0.08);
}
```
