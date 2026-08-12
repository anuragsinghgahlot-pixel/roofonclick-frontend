import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { NavigationHandler } from "@/components/shared/navigation-handler";
import { WishlistProvider } from "@/providers/wishlist-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { NavigationProvider } from "@/providers/navigation-provider";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { Suspense } from "react";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RoofOnClick - Find Hostels & PGs in Indore",
  description: "Modern accommodation discovery platform helping students and working professionals find premium hostels and PGs in Indore.",
};

import { AIAssistantWidget } from "@/components/ai/ai-assistant-widget";
import { GuestAuthPromptModal } from "@/components/modals/guest-auth-prompt-modal";
import { PlatformReviewModal } from "@/components/modals/platform-review-modal";
import { Toaster } from "@/components/ui/toaster";
import { CompareProvider } from "@/providers/compare-provider";
import { CompareBar } from "@/components/compare/compare-bar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${inter.variable} antialiased`}
    >
      <body className="font-body bg-background text-foreground">
        <NavigationHandler />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <WishlistProvider>
              <CompareProvider>
                <SmoothScrollProvider>
                  <Suspense fallback={null}>
                    <NavigationProvider>
                      {children}
                      <AIAssistantWidget />
                      <CompareBar />
                      <GuestAuthPromptModal />
                      <PlatformReviewModal />
                      <Toaster />
                    </NavigationProvider>
                  </Suspense>
                </SmoothScrollProvider>
              </CompareProvider>
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
