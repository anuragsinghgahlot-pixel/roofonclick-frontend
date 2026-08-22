import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { NavigationHandler } from "@/components/shared/navigation-handler";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { WishlistProvider } from "@/providers/wishlist-provider";
import { CityProvider } from "@/providers/city-provider";
import { ClientProviders } from "@/components/shared/client-providers";
import Script from "next/script";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "RoofOnClick - Find Hostels & PGs in Indore",
  description: "Modern accommodation discovery platform helping students and working professionals find premium hostels and PGs in Indore.",
};

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
                {/* ClientProviders is a "use client" component — all ssr:false dynamic imports live there */}
                <ClientProviders>
                  {children}
                </ClientProviders>
              </WishlistProvider>
            </CityProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
