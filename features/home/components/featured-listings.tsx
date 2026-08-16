"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, Heart, BadgeCheck, ArrowRight, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/providers/wishlist-provider";
import { useAuth } from "@/providers/auth-provider";
import { ListingsAPI } from "@/services/listings/listings.api";
import { Property } from "@/services/property/property.types";

function getGenderBadge(gender?: string): { label: string; style: string } {
  const g = (gender || "").toLowerCase();
  if (g.includes("boy")) return { label: "Boys Only", style: "bg-primary/10 text-primary border-primary/20" };
  if (g.includes("girl")) return { label: "Girls Only", style: "bg-secondary/10 text-secondary border-secondary/20" };
  return { label: "Co-Living", style: "bg-accent/10 text-accent border-accent/20" };
}

export function FeaturedListings() {
  const { user, role } = useAuth();
  const isOwner = user !== null && (user.role === "owner" || role === "owner");
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [listings, setListings] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    ListingsAPI.getListings({ limit: 6 })
      .then((res) => {
        if (isMounted) {
          setListings(res.listings || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setListings([]);
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <Section className="bg-muted/5">
      <Container>
        {/* Header Block */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-12">
          <div className="flex flex-col gap-2 text-left">
            <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary">
              Handpicked for You
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary tracking-tight leading-[1.15]">
              Featured Listings
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-md">
              Discover student hostels, luxury PGs, and premium co-living rooms verified by our team.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-muted/40 rounded-2xl" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          /* Empty State */
          <div className="bg-card border border-border/80 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-primary">No Listings Available Yet</h3>
            <p className="font-body text-xs text-muted-foreground max-w-sm">
              There are currently no active properties listed on RoofOnClick. Property owners will add new stays soon!
            </p>
            {isOwner && (
              <Link
                href="/owner/properties"
                className="mt-2 inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all"
              >
                List Your Property
              </Link>
            )}
          </div>
        ) : (
          /* Listings Grid */
          <motion.div
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
          >
            {listings.map((property) => {
              const isFavorite = isInWishlist(property.id);
              const genderDetails = getGenderBadge(property.gender);

              return (
                <motion.div
                  key={property.id}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                  }}
                  className="group bg-card border border-border/80 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Image Header */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted flex items-center justify-center">
                    {property.coverPhoto ? (
                      <img
                        src={property.coverPhoto}
                        alt={property.propertyName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted via-muted/80 to-muted/50 flex flex-col items-center justify-center gap-1.5 text-muted-foreground p-4 text-center">
                        <Building2 className="w-8 h-8 stroke-1 text-primary/40" />
                        <span className="font-heading text-[11px] font-bold text-foreground/70">{property.propertyName}</span>
                      </div>
                    )}

                    {/* Gender badge */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md", genderDetails.style)}>
                        {genderDetails.label}
                      </span>
                    </div>

                    {/* Wishlist toggle button */}
                    {!isOwner && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(property.id);
                        }}
                        className="absolute top-3 right-3 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-all"
                      >
                        <Heart className={cn("w-4 h-4", isFavorite && "fill-rose-500 text-rose-500")} />
                      </button>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col gap-2.5 text-left flex-1 justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] font-bold uppercase text-secondary tracking-wider">
                          {property.propertyType}
                        </span>
                        <span className="text-xs font-bold text-muted-foreground">
                          {property.area}, {property.city}
                        </span>
                      </div>

                      <h3 className="font-heading text-base font-bold text-primary tracking-tight mt-1 line-clamp-1">
                        {property.propertyName}
                      </h3>
                    </div>

                    {/* Footer / Price */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/60">
                      <div>
                        <span className="text-xs text-muted-foreground">Starting from </span>
                        <span className="font-heading text-sm font-extrabold text-primary">
                          ₹{(property.startingRent || property.startingPrice || 0).toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-muted-foreground">/mo</span>
                      </div>

                      <Link
                        href={`/property/${property.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold font-heading text-secondary hover:underline"
                      >
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </Container>
    </Section>
  );
}
