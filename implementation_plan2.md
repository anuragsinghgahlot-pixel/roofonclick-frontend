# Implementation Plan - Implement Design System Foundation

This plan outlines the steps to implement the global design foundation for **StayyNest** by configuring fonts, CSS variables, Tailwind CSS v4 `@theme`, global HTML styles, selection, scrollbars, and motion presets.

## Proposed Changes

We will modify two core files in the `app/` directory to configure the visual foundation:

### 1. Typography Integration

#### [MODIFY] [layout.tsx](file:///e:/Projects/stayynest/stayynest/app/layout.tsx)
- Import `Plus_Jakarta_Sans` and `Inter` from `next/font/google`.
- Initialize fonts with custom CSS variables (`--font-heading` and `--font-body`).
- Apply these variables globally via the HTML root className (`className="${plusJakarta.variable} ${inter.variable} ..."`).
- Remove the unused `Geist` and `Geist_Mono` imports and initializations.

---

### 2. Styling Tokens and Base Styles

#### [MODIFY] [globals.css](file:///e:/Projects/stayynest/stayynest/app/globals.css)
We will completely rewrite `app/globals.css` to contain:
- **Tailwind Import**: Keep `@import "tailwindcss";` at the top.
- **CSS Variables (:root)**: Light theme design tokens representing our custom palette (Forest Green, Warm Gold, Soft White, Card, Muted, Accent, etc.).
- **CSS Variables (Dark Media Query)**: Corresponding dark mode token definitions mapped to `@media (prefers-color-scheme: dark)`.
- **Tailwind v4 Theme (@theme)**: Map all CSS variables to Tailwind utility classes (e.g. `--color-primary`, `--font-heading`, `--radius-lg`, `--shadow-premium`, `--ease-premium`, etc.).
- **Selection Style Configuration**: Set selection colors to soft emerald with light/dark contrast safety.
- **Custom Webkit & Standard Scrollbar**: Clean, thin, rounded scrollbar utilizing brand color overlays.
- **Base HTML Element Styles**: Reset and assign font families, margins, colors, inputs, default button actions, and custom focus rings using `color-mix()` for glow borders.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to confirm the application compiles without errors, fonts load correctly, and Tailwind CSS v4 config builds successfully.

### Manual Verification
- View layout and style structure manually to ensure proper syntax and no hardcoded color values.
