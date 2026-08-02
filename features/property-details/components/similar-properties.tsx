"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, BadgeCheck, ArrowRight, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/providers/wishlist-provider";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface SimilarPropertyItem {
  id: string;
  title: string;
  image: string;
  location: string;
  price: number;
  rating: number;
  type: string;
  isVerified?: boolean;
  onView?: () => void;
}

export interface SimilarPropertiesProps {
  /** List of similar properties to display */
  properties: SimilarPropertyItem[];
  /** Optional class override for container */
  className?: string;
}

// ─── Animation Variants ────────────────────────────────────────────────────────

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: PREMIUM_EASE },
  },
};

// ─── Component ─────────────────────────────────────────────────────────────────

export function SimilarProperties({ properties, className }: SimilarPropertiesProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-muted-foreground border border-dashed border-border rounded-2xl bg-card/50">
        No similar properties found.
      </div>
    );
  }

  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full",
        className
      )}
    >
      {properties.map((property) => {
        const isWishlisted = isInWishlist(property.id);
        return (
          <motion.div
            key={property.id}
            variants={cardVariants}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3, ease: PREMIUM_EASE }}
            className="flex flex-col w-full"
          >
            <div className="group bg-card rounded-[24px] overflow-hidden border border-border/80 hover:shadow-xl transition-shadow duration-300 flex flex-col relative w-full h-full">
              
              {/* ── Image Block ── */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  src={property.image}
                  alt={`${property.title} — ${property.type} in ${property.location}`}
                />

                {/* Verified Badge overlay */}
                {property.isVerified && (
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-primary text-primary-foreground border border-primary/20 shadow-sm">
                    <BadgeCheck className="w-3 h-3" />
                    Verified
                  </span>
                )}

                {/* Wishlist Button Overlay */}
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(property.id);
                  }}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-card/90 backdrop-blur-md border border-border/40 shadow-premium flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-150 z-20 cursor-pointer"
                >
                  <motion.div
                    animate={{ scale: isWishlisted ? [1, 1.25, 1] : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Heart
                      className={cn(
                        "w-4.5 h-4.5 transition-colors duration-200",
                        isWishlisted ? "fill-rose-500 text-rose-500" : "text-muted-foreground/80 hover:text-rose-500"
                      )}
                    />
                  </motion.div>
                </button>
              </div>

              {/* ── Info Block ── */}
              <div className="p-6 flex-1 flex flex-col gap-4 border-t border-border/80">
                
                {/* Category & Title */}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold text-secondary uppercase tracking-widest">
                      {property.type}
                    </span>
                    
                    {/* Rating Badge */}
                    <div className="flex items-center gap-1 bg-secondary/10 px-2.5 py-1 rounded-full shrink-0">
                      <Star className="w-3 h-3 text-secondary fill-current" />
                      <span className="text-xs font-bold text-primary">
                        {property.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-primary leading-snug truncate mt-1">
                    {property.title}
                  </h3>
                  
                  <p className="font-body text-xs text-muted-foreground mt-0.5">
                    {property.location}
                  </p>
                </div>

                {/* Price & CTA Section */}
                <div className="border-t border-border/80 pt-4 mt-auto flex justify-between items-center">
                  
                  {/* Price Display */}
                  <div className="flex items-baseline gap-0.5">
                    <span className="font-heading text-xl font-extrabold text-primary">
                      ₹{property.price.toLocaleString("en-IN")}
                    </span>
                    <span className="font-body text-[10px] text-muted-foreground font-semibold uppercase tracking-wider pl-0.5">
                      / month
                    </span>
                  </div>

                  {/* View Details Button */}
                  <Link
                    href={`/property/${property.id}`}
                    className="inline-flex items-center gap-1 bg-primary text-primary-foreground hover:bg-accent px-5 py-2.5 rounded-xl text-xs font-semibold active:scale-95 transition-all duration-200 cursor-pointer shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                </div>
              </div>

            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default SimilarProperties;
