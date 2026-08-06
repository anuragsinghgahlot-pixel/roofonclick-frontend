"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/shared/section";
import { useWishlist } from "@/providers/wishlist-provider";
import { useAuth } from "@/providers/auth-provider";
import { PropertyCard } from "@/components/cards/property-card";
import { MOCK_PROPERTIES } from "@/constants/mock-properties";
import { PropertyCardSkeleton } from "@/components/shared/skeletons";

import { Breadcrumb } from "@/components/shared/breadcrumb";
import { BackButton } from "@/components/shared/back-button";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
export function WishlistPage() {
  const router = useRouter();
  const { wishlist, getLastBrowsingRoute } = useWishlist();
  const { user, role } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);

  // Route Protection: Owners visiting /wishlist directly are redirected to /owner/dashboard
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const isUserLoggedIn = user !== null || !!localStorage.getItem("auth_user");
      const activeRole = user?.role || role || (localStorage.getItem("auth_role") as any);

      if (isUserLoggedIn && activeRole === "owner") {
        router.replace("/owner/dashboard");
        return;
      }
    }
  }, [user, role, router]);

  // Simulated API fetch delay on page load
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Filter properties that exist in the wishlist array
  const savedProperties = React.useMemo(() => {
    return MOCK_PROPERTIES.filter((property) => wishlist.includes(property.id));
  }, [wishlist]);

  return (
    <div className="relative flex flex-col min-h-[100dvh] bg-background">
      <Navbar />

      <main className="flex-1">
        <Section className="bg-muted/10 pt-4 sm:pt-6 lg:pt-8 pb-12 relative overflow-hidden">
          {/* Ambient background decorative elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />

          <Container>
            {/* Standardized Page Header */}
            <PageHeader
              title="❤️ Wishlist"
              subtitle="Your Saved Properties"
              badge={
                <span className="font-body text-xs font-extrabold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl">
                  {isLoading ? "Loading..." : `${savedProperties.length} Saved Properties`}
                </span>
              }
              backFallbackUrl={getLastBrowsingRoute()}
            />

            {/* Properties Grid, Loading skeletons, or Empty State */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: Math.max(3, wishlist.length) }).map((_, idx) => (
                  <PropertyCardSkeleton key={idx} />
                ))}
              </div>
            ) : savedProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedProperties.map((property) => (
                  <PropertyCard property={property} key={property.id} />
                ))}
              </div>
            ) : (
              <EmptyState
                emoji="❤️"
                title="Your Wishlist is Empty"
                description="Explore verified PGs, hostels, and co-living spaces to save your favorite properties for later."
                primaryAction={{
                  label: "Explore Properties",
                  onClick: () => router.push(getLastBrowsingRoute()),
                }}
              />
            )}
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

export default WishlistPage;
