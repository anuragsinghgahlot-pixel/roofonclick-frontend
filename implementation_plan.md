# Implementation Plan - Restructure StayyNest into a Scalable Startup Architecture

This plan outlines the restructuring of the **StayyNest** repository. The goal is to prepare the codebase for scalability, modularity, and high-quality modular development using a feature-based architecture pattern, without adding any pages or business logic.

## Proposed Changes

We will create a root-level directory layout alongside the existing `app/` directory.

### Root Directories to Create

- `components`: Reusable, domain-agnostic UI and layout components.
- `features`: Feature-scoped code containing page-specific logic, components, state, hooks, and types (e.g., auth, property, search).
- `hooks`: Shared, global React hooks.
- `lib`: Configurations and wrappers around external libraries/SDKs (e.g., Supabase client, Prisma client later).
- `services`: Modular services handling external APIs or database interactions.
- `providers`: React context providers (e.g., ThemeProvider, AuthProvider).
- `types`: Global TypeScript type definitions and interfaces.
- `utils`: Pure, reusable helper functions.
- `constants`: Global, static application constants (e.g., config values, static page text).
- `config`: Environment and system configurations.
- `styles`: Global styles, themes, and CSS configurations.
- `assets`: Static resources (images, SVGs, fonts, icons) used across the application.

---

### Component Subdirectories
Inside `components/`, we will create the following categories:
- `ui`: Atomic, primitive UI components (e.g., buttons, inputs, dialogs, badges).
- `layout`: Structural page layout components (e.g., containers, grids, dividers).
- `common`: Generic components used across multiple pages (e.g., search bars, loading spinners).
- `cards`: Specialized visual card elements (e.g., property cards, review cards).
- `forms`: Reusable form elements, controls, validation wrappers, and groups.
- `navigation`: Navigation-specific components (e.g., navbars, footers, sidebars, breadcrumbs).
- `feedback`: Interactive feedback and state elements (e.g., toast alerts, modals, skeletons).

---

### Feature Subdirectories
Inside `features/`, we will organize logic by business modules to enforce strict encapsulation and avoid bloated global folders:
- `auth`: Authentication and registration logic, forms, and session state.
- `property`: Property detailed page modules, grid listings, and PG/hostel management.
- `search`: Discovery filter states, maps integration, search logic, and sorting.
- `owner`: Host/Owner portal dashboard, listings publisher, and performance analytics.
- `student`: Tenant/Student dashboard, saved properties, booking history, and profile.
- `admin`: Back-office management portal, reports, reviews approval, and user moderator.
- `home`: Landing page hero, search trigger, features grid, and Indore focus content.

---

### File Relocations & Clean Up

#### [MODIFY] [layout.tsx](file:///e:/Projects/stayynest/stayynest/app/layout.tsx)
- Update the import statement `import "./globals.css";` to point to the new location: `import "@/styles/globals.css";`.

#### [NEW] [globals.css](file:///e:/Projects/stayynest/stayynest/styles/globals.css)
- Move existing `app/globals.css` into `styles/globals.css`.

#### [DELETE] [globals.css](file:///e:/Projects/stayynest/stayynest/app/globals.css)
- Delete the old style sheet from the app route directory.

---

### Index Files to Create

We will create empty `index.ts` (or `index.tsx` where appropriate) file entrypoints in the following directories so they are tracked by Git and act as clean public APIs:
- `components/ui/index.ts`
- `components/layout/index.ts`
- `components/common/index.ts`
- `components/cards/index.ts`
- `components/forms/index.ts`
- `components/navigation/index.ts`
- `components/feedback/index.ts`
- `features/auth/index.ts`
- `features/property/index.ts`
- `features/search/index.ts`
- `features/owner/index.ts`
- `features/student/index.ts`
- `features/admin/index.ts`
- `features/home/index.ts`
- `hooks/index.ts`
- `lib/index.ts`
- `services/index.ts`
- `providers/index.ts`
- `types/index.ts`
- `utils/index.ts`
- `constants/index.ts`
- `config/index.ts`

For the `assets` folder, we will create a `.gitkeep` file to ensure the folder structure is retained in Git.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify Next.js configuration resolves imports properly with the new CSS path and that typescript compilation completes without errors.

### Manual Verification
- Verify directories are created under the root as expected.
- Verify `app/layout.tsx` imports the global CSS correctly.
