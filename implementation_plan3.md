# Implementation Plan - Homepage Foundation

This plan outlines the implementation of the **StayyNest** homepage foundation. We will establish the core layout, shared layout components, a sticky page wrapper, and homepage placeholder sections using a feature-based architecture.

## Proposed Changes

We will create the main structural layout components, a marketing route layout, and homepage feature placeholder sections. No UI styles or business logic will be implemented.

### 1. Shared Layout Components

#### [NEW] [container.tsx](file:///e:/Projects/stayynest/stayynest/components/layout/container.tsx)
- Create a reusable `<Container>` component to handle max-width boundaries and horizontal padding (`max-w-7xl px-4 sm:px-6 lg:px-8`).

#### [NEW] [section.tsx](file:///e:/Projects/stayynest/stayynest/components/layout/section.tsx)
- Create a reusable `<Section>` component to manage consistent vertical spacing sizes (`sm`, `md`, `lg`, `xl`) for the page layout.

---

### 2. Shared Navigation Components

#### [NEW] [navbar.tsx](file:///e:/Projects/stayynest/stayynest/components/navigation/navbar.tsx)
- Create a shared `<Navbar>` component configured with sticky positioning, backdrop-blur transparency, and z-index overlays.

#### [NEW] [footer.tsx](file:///e:/Projects/stayynest/stayynest/components/navigation/footer.tsx)
- Create a shared `<Footer>` component providing structural placement for copyright and brand labels.

---

### 3. Marketing Route Layout & Sticky Page Structure

#### [NEW] [layout.tsx](file:///e:/Projects/stayynest/stayynest/app/\(marketing\)/layout.tsx)
- Add a group-level route layout to wrap all marketing pages.
- Integrate the `<Navbar>` and `<Footer>` layout structure to keep the navbar sticky at the top and the footer pushed to the bottom of the viewport (`min-h-screen flex flex-col`).

---

### 4. Homepage Feature Components

We will create placeholder sections under `features/home/components/` representing the approved Google Stitch sections:
- **`hero.tsx`** (Hero search banner section)
- **`search.tsx`** (Advanced filter trigger section)
- **`popular-areas.tsx`** (Locations in Indore grid)
- **`featured-listings.tsx`** (Featured hostels and PGs)
- **`categories.tsx`** (Hostel types / PG filters)
- **`advantages.tsx`** (StayyNest value propositions)
- **`testimonials.tsx`** (User reviews and reviews carousel)
- **`partner-cta.tsx`** (Owner onboarding advertisement CTA)

Each section will be structured as a React functional component containing a TODO comment and a simple non-styled border wrapper stating its name.

---

### 5. Homepage Skeleton Integration

#### [MODIFY] [page.tsx](file:///e:/Projects/stayynest/stayynest/app/\(marketing\)/page.tsx)
- Completely replace the default template with the final homepage layout structure importing and rendering all homepage sections in sequential order.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to confirm compiling completes successfully without TypeScript errors or path resolution issues.

### Manual Verification
- Verify the physical directory and component structure conforms to the plan.
