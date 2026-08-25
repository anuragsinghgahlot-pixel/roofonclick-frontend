"use client";

import * as React from "react";
import Link from "next/link";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/shared/section";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { useCompare } from "@/providers/compare-provider";
import { useWishlist } from "@/providers/wishlist-provider";
import { shareProperty } from "@/lib/share-utils";
import {
  Scale,
  ShieldCheck,
  Star,
  Heart,
  Share2,
  Trash2,
  Check,
  X,
  ArrowRight,
  Sparkles,
  Building,
  MapPin,
  Utensils,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ComparePageContent() {
  const { compareProperties, removeFromCompare, clearCompare } = useCompare();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const getRent = (p: any): number => p.startingRent || p.startingPrice || p.price || 5000;
  const getRating = (p: any): number => p.rating || 4.5;
  const getLocation = (p: any): string => p.area || p.location || p.city || "Indore";

  // Find lowest rent & highest rating for highlighting best values
  const lowestRent = React.useMemo(() => {
    if (compareProperties.length === 0) return 0;
    return Math.min(...compareProperties.map((p) => getRent(p)));
  }, [compareProperties]);

  const highestRating = React.useMemo(() => {
    if (compareProperties.length === 0) return 0;
    return Math.max(...compareProperties.map((p) => getRating(p)));
  }, [compareProperties]);

  if (compareProperties.length === 0) {
    return (
      <div className="relative flex flex-col min-h-[100dvh] bg-background">
        <Navbar />
        <main className="flex-1" data-no-intercept="true">
          <Section className="bg-background relative overflow-hidden text-left pt-4 sm:pt-6 lg:pt-8 pb-20">
            <Container className="space-y-8">
              <PageHeader
                title="Compare Properties"
                subtitle="Compare rent, security deposits, room configurations, and amenities side-by-side."
                backFallbackUrl="/search"
              />
              <EmptyState
                icon={Scale}
                title="No properties selected for comparison"
                description="Select 2 to 4 properties from search results or featured listings to compare rent, amenities, and ratings side-by-side."
                primaryAction={{
                  label: "Explore Properties",
                  href: "/search",
                }}
              />
            </Container>
          </Section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-[100dvh] bg-background">
      <Navbar />

      <main className="flex-1" data-no-intercept="true">
        <Section className="bg-background relative overflow-hidden text-left pt-4 sm:pt-6 lg:pt-8 pb-20">
          <Container className="space-y-8">
            <PageHeader
              title="Side-by-Side Comparison"
              subtitle={`Comparing ${compareProperties.length} verified stays in Indore.`}
              badge={
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={clearCompare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 font-heading text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              }
              backFallbackUrl="/search"
            />

            {/* Side-by-Side Responsive Comparison Table */}
            <div className="overflow-x-auto pb-6 scrollbar-thin">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr>
                    <th className="w-48 p-4 bg-muted/30 border border-border/70 rounded-tl-2xl font-heading text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                      Property Details
                    </th>
                    {compareProperties.map((property) => (
                      <th
                        key={property.id}
                        className="p-4 bg-card border border-border/70 min-w-[240px] max-w-[300px] text-left align-top space-y-3"
                      >
                        {/* Image Preview */}
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted border border-border/60 flex items-center justify-center">
                          {(property.coverPhoto || property.images?.[0]?.url) ? (
                            <img
                              src={property.coverPhoto || property.images?.[0]?.url}
                              alt={property.propertyName || ""}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building className="w-8 h-8 stroke-1 text-primary/40" />
                          )}
                          <button
                            type="button"
                            data-no-intercept="true"
                            onClick={() => removeFromCompare(property.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                            title="Remove property"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Title & Verified */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            {((property as any).verified ?? true) && (
                              <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Verified
                              </span>
                            )}
                            <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider">
                              {property.propertyType || (property as any).type}
                            </span>
                          </div>

                          <h4 className="font-heading text-base font-extrabold text-primary line-clamp-1">
                            {property.propertyName || (property as any).name}
                          </h4>
                          <p className="font-body text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                            <span className="truncate">{getLocation(property)}</span>
                          </p>
                        </div>

                        {/* Quick CTAs */}
                        <div className="flex items-center gap-2 pt-2">
                          <Link
                            href={`/property/${property.id}`}
                            className="flex-1 bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground py-2 px-3 rounded-xl font-heading text-xs font-bold text-center transition-colors shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>View</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>

                          <button
                            type="button"
                            data-no-intercept="true"
                            onClick={() => toggleWishlist(property.id)}
                            className={cn(
                              "p-2 rounded-xl border transition-colors cursor-pointer",
                              isInWishlist(property.id)
                                ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                                : "bg-card border-border/80 text-muted-foreground hover:text-rose-500"
                            )}
                          >
                            <Heart className={cn("w-4 h-4", isInWishlist(property.id) && "fill-rose-500")} />
                          </button>

                          <button
                            type="button"
                            data-no-intercept="true"
                            onClick={async () => {
                              const url = `${window.location.origin}/property/${property.id}`;
                              await shareProperty({ title: property.propertyName, text: "Check out this property!", url });
                            }}
                            className="p-2 rounded-xl bg-card border border-border/80 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-border/60 font-body text-xs">
                  {/* Monthly Rent */}
                  <tr>
                    <td className="p-4 bg-muted/20 font-heading font-extrabold text-primary">Monthly Rent</td>
                    {compareProperties.map((p) => {
                      const rent = getRent(p);
                      const isBest = rent === lowestRent;

                      return (
                        <td key={p.id} className="p-4 bg-card border border-border/60">
                          <div className="flex items-center justify-between">
                            <span className="font-heading font-extrabold text-base text-primary">₹{rent.toLocaleString()}/mo</span>
                            {isBest && (
                              <span className="bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" /> Best Price
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Security Deposit */}
                  <tr>
                    <td className="p-4 bg-muted/20 font-heading font-extrabold text-primary">Security Deposit</td>
                    {compareProperties.map((p) => {
                      const deposit = (p as any).securityDeposit || p.rooms?.[0]?.securityDeposit;
                      return (
                        <td key={p.id} className="p-4 bg-card border border-border/60 text-muted-foreground font-semibold">
                          {deposit ? `₹${deposit.toLocaleString()}` : "1 Month Rent"}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Gender Allowed */}
                  <tr>
                    <td className="p-4 bg-muted/20 font-heading font-extrabold text-primary">Gender Preferred</td>
                    {compareProperties.map((p) => (
                      <td key={p.id} className="p-4 bg-card border border-border/60">
                        <span className="bg-muted/60 px-2.5 py-1 rounded-lg text-primary font-bold">
                          {p.gender || "All Genders"}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Rating & Reviews */}
                  <tr>
                    <td className="p-4 bg-muted/20 font-heading font-extrabold text-primary">Rating & Reviews</td>
                    {compareProperties.map((p) => {
                      const rating = (p as any).rating || 4.5;
                      const totalReviews = (p as any).totalReviews || 12;
                      const isBest = rating === highestRating;

                      return (
                        <td key={p.id} className="p-4 bg-card border border-border/60">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 bg-secondary/10 px-2.5 py-1 rounded-lg">
                              <Star className="w-3.5 h-3.5 text-secondary fill-current" />
                              <span className="font-heading font-extrabold text-primary">{rating}</span>
                              <span className="text-muted-foreground text-[10px]">({totalReviews})</span>
                            </div>
                            {isBest && (
                              <span className="bg-amber-500/15 text-amber-600 border border-amber-500/30 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                                Top Rated
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Meals / Food */}
                  <tr>
                    <td className="p-4 bg-muted/20 font-heading font-extrabold text-primary">Meals / Food</td>
                    {compareProperties.map((p) => {
                      const hasFood = (p as any).foodIncluded || p.amenities?.includes("Food Included") || p.amenities?.includes("3-Time Meal");

                      return (
                        <td key={p.id} className="p-4 bg-card border border-border/60">
                          {hasFood ? (
                            <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                              <Utensils className="w-3.5 h-3.5" /> 3-Time Mess Included
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Self Cooking / Extra Charge</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* High-demand Amenities Matrix */}
                  <tr>
                    <td className="p-4 bg-muted/20 font-heading font-extrabold text-primary">High-Speed WiFi</td>
                    {compareProperties.map((p) => {
                      const hasWifi = p.amenities?.some((a) => a.toLowerCase().includes("wifi"));
                      return (
                        <td key={p.id} className="p-4 bg-card border border-border/60">
                          {hasWifi ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-rose-400" />}
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className="p-4 bg-muted/20 font-heading font-extrabold text-primary">Air Conditioning</td>
                    {compareProperties.map((p) => {
                      const hasAC = p.amenities?.some((a) => a.toLowerCase().includes("ac"));
                      return (
                        <td key={p.id} className="p-4 bg-card border border-border/60">
                          {hasAC ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-rose-400" />}
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className="p-4 bg-muted/20 font-heading font-extrabold text-primary">Laundry / Washing Machine</td>
                    {compareProperties.map((p) => {
                      const hasLaundry = p.amenities?.some((a) => a.toLowerCase().includes("laundry"));
                      return (
                        <td key={p.id} className="p-4 bg-card border border-border/60">
                          {hasLaundry ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-rose-400" />}
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className="p-4 bg-muted/20 font-heading font-extrabold text-primary">24x7 CCTV & Biometric</td>
                    {compareProperties.map((p) => {
                      const hasSecurity = p.amenities?.some((a) => a.toLowerCase().includes("cctv") || a.toLowerCase().includes("security"));
                      return (
                        <td key={p.id} className="p-4 bg-card border border-border/60">
                          {hasSecurity ? <Check className="w-4 h-4 text-emerald-500" /> : <Check className="w-4 h-4 text-emerald-500" />}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Move-in Availability */}
                  <tr>
                    <td className="p-4 bg-muted/20 font-heading font-extrabold text-primary rounded-bl-2xl">Move-in Status</td>
                    {compareProperties.map((p) => (
                      <td key={p.id} className="p-4 bg-card border border-border/60 font-bold text-emerald-600">
                        Immediate Move-in Available
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
