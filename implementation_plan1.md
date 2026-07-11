# Implementation Plan - Restructure StayyNest into a Scalable Startup Architecture

This plan outlines the restructuring of the **StayyNest** repository into a scalable, production-ready startup architecture that adheres to Next.js App Router conventions. No business logic or page contents will be modified.

## Proposed Changes

We will create a root-level directory layout alongside the existing `app/` directory, configure Next.js App Router group folders, create root-level placeholders, and organize the `public/` directory.

### 1. Root Directories to Create
We will create the following folders at the project root:

- `components`: Reusable, domain-agnostic UI and layout components.
- `features`: Feature-scoped code containing page-specific logic, components, state, hooks, schemas, and types.
- `hooks`: Shared, global React hooks.
- `lib`: Configurations and wrappers around external libraries/SDKs (e.g., Supabase client, Prisma client).
- `services`: Modular services handling external APIs or database interactions.
- `providers`: React context providers (e.g., ThemeProvider, AuthProvider).
- `types`: Global TypeScript type definitions and interfaces.
- `utils`: Pure, reusable helper functions.
- `constants`: Global, static constants (e.g., configuration values, routing tables).
- `config`: Environment and system configurations.
- `styles`: Project-wide stylesheets and CSS custom rules (excluding `globals.css` which stays in `app/`).
- `assets`: Static resources (images, SVGs, fonts, icons) used inside the code bundler.
- `shared`: Shared code, components, hooks, or utils that cross-cut features but aren't primitives.
- `store`: Global state management stores (e.g., Zustand, Jotai).
- `schemas`: Shared validation schemas (e.g., Zod schemas for forms/API validation).

To ensure Git tracks these directories without creating redundant empty `index.ts` files, we will place a `.gitkeep` file in each empty folder.

---

### 2. Component Subdirectories
Inside `components/`, we will create the following categories:
- `ui`: Atomic, primitive UI components (e.g., buttons, inputs, dialogs, badges).
- `layout`: Structural page layout components (e.g., containers, grids, dividers).
- `common`: Generic components used across multiple pages (e.g., search bars, loading spinners).
- `cards`: Specialized visual card elements (e.g., property cards, review cards).
- `forms`: Reusable form elements, controls, validation wrappers, and groups.
- `navigation`: Navigation-specific components (e.g., navbars, footers, sidebars, breadcrumbs).
- `feedback`: Interactive feedback and state elements (e.g., toast alerts, modals, skeletons).

---

### 3. Feature Subdirectories
Inside `features/`, we will organize modules by business domain to enforce strict encapsulation:
- `auth`: Authentication logic, signup/login forms, and user session management.
- `property`: PG and hostel listings details, search results presentation, and management.
- `search`: Location search, autocomplete, custom filters, and map search triggers.
- `owner`: Landlord/Host portal dashboard, listing submissions, and tenant interactions.
- `student`: Tenant dashboard, booking requests, saved lists, and profile management.
- `admin`: Back-office management, moderation, platform metrics, and verification dashboard.
- `home`: Landing page layout, marketing banners, and local Indore-specific promotions.

---

### 4. Next.js App Router Structure
We will align the `app/` folder with App Router conventions by adding route groups:

#### [NEW] [app/(marketing)](file:///e:/Projects/stayynest/stayynest/app/\(marketing\))
- Create `app/(marketing)` directory.
- Move `app/page.tsx` to `app/(marketing)/page.tsx` (retaining its logic exactly). This allows grouping all marketing pages while keeping `/` as the landing page.

#### [NEW] [app/(dashboard)](file:///e:/Projects/stayynest/stayynest/app/\(dashboard\))
- Create `app/(dashboard)` directory to house dashboard subroutes later.

#### [RETAIN] [globals.css](file:///e:/Projects/stayynest/stayynest/app/globals.css)
- Retain `app/globals.css` in its original location as requested.

#### [RETAIN] [layout.tsx](file:///e:/Projects/stayynest/stayynest/app/layout.tsx)
- Retain `app/layout.tsx` in its original location (importing `./globals.css`).

---

### 5. Root Middleware

#### [NEW] [middleware.ts](file:///e:/Projects/stayynest/stayynest/middleware.ts)
- Create an empty `middleware.ts` placeholder file at the root containing a simple descriptive comment.

---

### 6. Public Folder Organization
We will organize the static `public/` directory for asset organization:

- `public/logos`: Brand logos and wordmarks.
- `public/icons`: General UI icons and SVGs.
- `public/fonts`: Custom local fonts.
- `public/images`: Hero illustrations and general visual images.

To ensure Git tracks these directories, we will place a `.gitkeep` file in each folder.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify the Next.js project compiles correctly and imports resolve without issue (specifically verifying that moving `page.tsx` to `app/(marketing)/page.tsx` compiles and has no import/compilation errors).

### Manual Verification
- Verify the physical directory structure matches this design.
- Verify `app/layout.tsx` is untouched and `middleware.ts` exists at the root.
