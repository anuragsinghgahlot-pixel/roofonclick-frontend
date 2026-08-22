"use client";

/**
 * ClientProviders — wraps all non-SSR providers and layout-level modals.
 *
 * This MUST be a Client Component so that next/dynamic with `ssr: false`
 * is allowed (Server Components do not support it).
 *
 * Keeps the root layout.tsx a pure Server Component for optimal RSC behaviour.
 */

import * as React from "react";
import dynamic from "next/dynamic";

// ── Providers ────────────────────────────────────────────────────────────────
const NavigationProvider = dynamic(
  () => import("@/providers/navigation-provider").then((m) => ({ default: m.NavigationProvider })),
  { ssr: false }
);

const SmoothScrollProvider = dynamic(
  () => import("@/providers/smooth-scroll-provider").then((m) => ({ default: m.SmoothScrollProvider })),
  { ssr: false }
);

const CompareProvider = dynamic(
  () => import("@/providers/compare-provider").then((m) => ({ default: m.CompareProvider })),
  { ssr: false }
);

// ── UI / Modals ───────────────────────────────────────────────────────────────
const CompareBar = dynamic(
  () => import("@/components/compare/compare-bar").then((m) => ({ default: m.CompareBar })),
  { ssr: false }
);

const GuestAuthPromptModal = dynamic(
  () => import("@/components/modals/guest-auth-prompt-modal").then((m) => ({ default: m.GuestAuthPromptModal })),
  { ssr: false }
);

const PlatformReviewModal = dynamic(
  () => import("@/components/modals/platform-review-modal").then((m) => ({ default: m.PlatformReviewModal })),
  { ssr: false }
);

const PushNotificationPrompt = dynamic(
  () => import("@/components/shared/push-notification-prompt").then((m) => ({ default: m.PushNotificationPrompt })),
  { ssr: false }
);

const Toaster = dynamic(
  () => import("@/components/ui/toaster").then((m) => ({ default: m.Toaster })),
  { ssr: false }
);

// ─────────────────────────────────────────────────────────────────────────────
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <CompareProvider>
      <SmoothScrollProvider>
        <React.Suspense fallback={null}>
          <NavigationProvider>
            {children}
            <CompareBar />
            <GuestAuthPromptModal />
            <PlatformReviewModal />
            <PushNotificationPrompt />
            <Toaster />
          </NavigationProvider>
        </React.Suspense>
      </SmoothScrollProvider>
    </CompareProvider>
  );
}
