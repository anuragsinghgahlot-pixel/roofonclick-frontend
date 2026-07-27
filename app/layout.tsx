import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { NavigationHandler } from "@/components/shared/navigation-handler";
import { WishlistProvider } from "@/providers/wishlist-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { NavigationProvider } from "@/providers/navigation-provider";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="font-body min-h-full bg-background text-foreground flex flex-col">
        <NavigationHandler />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <WishlistProvider>
              <Suspense fallback={null}>
                <NavigationProvider>
                  {children}
                </NavigationProvider>
              </Suspense>
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
