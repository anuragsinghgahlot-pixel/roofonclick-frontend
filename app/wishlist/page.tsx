"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/shared/section";
import { useWishlist } from "@/providers/wishlist-provider";
import { PropertyCard } from "@/components/cards/property-card";
import { MOCK_PROPERTIES } from "@/constants/mock-properties";

// Reusable Loading Skeleton for Property Card
function PropertyCardSkeleton() {
  return (
    <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-premium flex flex-col animate-pulse select-none">
      {/* Image Container Skeleton */}
      <div className="relative aspect-[4/3] w-full bg-muted/65" />

      {/* Content Container Skeleton */}
      <div className="p-5 flex-1 flex flex-col justify-between text-left">
        <div>
          {/* Location and Rating Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="h-3.5 bg-muted/65 rounded-md w-24" />
            <div className="h-5 bg-muted/65 rounded-lg w-10" />
          </div>

          {/* Property Name */}
          <div className="h-5.5 bg-muted/65 rounded-md w-3/4 mb-4" />

          {/* Amenities Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <div className="h-5 bg-muted/65 rounded-md w-12" />
            <div className="h-5 bg-muted/65 rounded-md w-14" />
            <div className="h-5 bg-muted/65 rounded-md w-10" />
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="border-t border-border/60 pt-4 flex items-center justify-between mt-auto">
          <div className="space-y-1.5">
            <div className="h-3 bg-muted/65 rounded-md w-14" />
            <div className="h-5.5 bg-muted/65 rounded-md w-20" />
          </div>
          <div className="h-9.5 bg-muted/65 rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
}

import { Breadcrumb } from "@/components/shared/breadcrumb";
import { BackButton } from "@/components/shared/back-button";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
export function WishlistPage() {
  const router = useRouter();
  const { wishlist, getLastBrowsingRoute } = useWishlist();
  const [isLoading, setIsLoading] = React.useState(true);

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
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <Section className="bg-muted/10 pt-24 pb-12 relative overflow-hidden">
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
