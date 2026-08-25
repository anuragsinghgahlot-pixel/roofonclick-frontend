"use client";

/**
 * ClientProviders — wraps all non-SSR providers and layout-level modals.
 *
 * Context providers (CompareProvider, SmoothScrollProvider, NavigationProvider)
 * are imported directly so their children are server-rendered.
 * Only standalone UI widgets (modals, toasts, compare bar) use ssr: false.
 *
 * Keeps the root layout.tsx a pure Server Component for optimal RSC behaviour.
 */

import * as React from "react";
import dynamic from "next/dynamic";

// ── Context Providers ────────────────────────────────────────────────────────
// Imported directly (NOT via next/dynamic ssr:false) so that {children}
// passes through them without triggering a full SSR bailout.
// They are already "use client" components with SSR-safe code.
import { NavigationProvider } from "@/providers/navigation-provider";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { CompareProvider } from "@/providers/compare-provider";

// ── UI / Modals (browser-only, do NOT wrap children) ──────────────────────────
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
        <NavigationProvider>
          {children}
          <React.Suspense fallback={null}>
            <CompareBar />
            <GuestAuthPromptModal />
            <PlatformReviewModal />
            <PushNotificationPrompt />
            <Toaster />
          </React.Suspense>
        </NavigationProvider>
      </SmoothScrollProvider>
    </CompareProvider>
  );
}
