import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { NavigationHandler } from "@/components/shared/navigation-handler";
import { WishlistProvider } from "@/providers/wishlist-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { NavigationProvider } from "@/providers/navigation-provider";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { CityProvider } from "@/providers/city-provider";
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
  metadataBase: new URL("https://roofonclick.com"),
  title: {
    default: "RoofOnClick | Verified Hostels, PGs & Rentals in Indore",
    template: "%s | RoofOnClick",
  },
  description:
    "Discover verified student housing, boys & girls PGs, hostels, studio rooms, and BHK rental flats across popular educational and IT hubs in Indore with zero brokerage hassle.",
  alternates: {
    canonical: "https://roofonclick.com",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://roofonclick.com/",
    siteName: "RoofOnClick",
    title: "RoofOnClick | Verified Hostels, PGs & Rentals in Indore",
    description:
      "Discover verified student housing, boys & girls PGs, hostels, studio rooms, and BHK rental flats across popular educational and IT hubs in Indore with zero brokerage hassle.",
    images: [
      {
        url: "/logos/roofonclick-brand-logo.png",
        width: 512,
        height: 512,
        alt: "RoofOnClick - Verified Stays in Indore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoofOnClick | Verified Hostels, PGs & Rentals in Indore",
    description:
      "Discover verified student housing, boys & girls PGs, hostels, studio rooms, and BHK rental flats across popular educational and IT hubs in Indore with zero brokerage hassle.",
    images: ["/logos/roofonclick-brand-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://roofonclick.com/#organization",
      name: "RoofOnClick",
      url: "https://roofonclick.com",
      logo: "https://roofonclick.com/logos/roofonclick-brand-logo.png",
      sameAs: [
        "https://instagram.com/roofonclick",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://roofonclick.com/#website",
      url: "https://roofonclick.com",
      name: "RoofOnClick",
      publisher: {
        "@id": "https://roofonclick.com/#organization",
      },
    },
  ],
};

import { GuestAuthPromptModal } from "@/components/modals/guest-auth-prompt-modal";
import { PlatformReviewModal } from "@/components/modals/platform-review-modal";
import { PushNotificationPrompt } from "@/components/shared/push-notification-prompt";
import { Toaster } from "@/components/ui/toaster";
import { CompareProvider } from "@/providers/compare-provider";
import { CompareBar } from "@/components/compare/compare-bar";

import Script from "next/script";

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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          id="chunk-error-trap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                window.addEventListener('error', function(e) {
                  if (e && e.target && (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK')) {
                    var src = e.target.src || e.target.href || '';
                    if (src.indexOf('/_next/static/chunks/') !== -1) {
                      var last = sessionStorage.getItem('chunk_err_reload');
                      var now = Date.now();
                      if (!last || now - Number(last) > 8000) {
                        sessionStorage.setItem('chunk_err_reload', String(now));
                        window.location.reload();
                      }
                    }
                  }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body className="font-body bg-background text-foreground" suppressHydrationWarning>
        <NavigationHandler />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CityProvider>
              <WishlistProvider>
                <CompareProvider>
                  <SmoothScrollProvider>
                    <Suspense fallback={null}>
                      <NavigationProvider>
                        {children}
                        <CompareBar />
                        <GuestAuthPromptModal />
                        <PlatformReviewModal />
                        <PushNotificationPrompt />
                        <Toaster />
                      </NavigationProvider>
                    </Suspense>
                  </SmoothScrollProvider>
                </CompareProvider>
              </WishlistProvider>
            </CityProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
