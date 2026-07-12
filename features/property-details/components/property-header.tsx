"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Heart,
  Share2,
  BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type PropertyType = "PG" | "Hostel" | "Co-Living" | "Studio" | "1 RK";

export interface PropertyHeaderProps {
  /** Property display title */
  title: string;
  /** Property category */
  type: PropertyType;
  /** Full address string */
  address: string;
  /** Average rating (0–5) */
  rating: number;
  /** Total number of reviews */
  reviewCount: number;
  /** Whether the property is verified by StayyNest */
  isVerified?: boolean;
  /** Whether the user has already wishlisted this property */
  isWishlisted?: boolean;
  /** Callback when the wishlist button is clicked */
  onWishlistToggle?: () => void;
  /** Callback when the share button is clicked */
  onShare?: () => void;
  /** Optional class override */
  className?: string;
}

// ─── Animation ─────────────────────────────────────────────────────────────────

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: PREMIUM_EASE },
  },
};

// ─── Type Badge Colors ─────────────────────────────────────────────────────────

const TYPE_STYLES: Record<PropertyType, string> = {
  PG: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Hostel: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "Co-Living": "bg-violet-500/10 text-violet-500 border-violet-500/20",
  Studio: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  "1 RK": "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

// ─── PropertyHeader ────────────────────────────────────────────────────────────

export function PropertyHeader({
  title,
  type,
  address,
  rating,
  reviewCount,
  isVerified = false,
  isWishlisted = false,
  onWishlistToggle,
  onShare,
  className,
}: PropertyHeaderProps) {
  const [wishlisted, setWishlisted] = React.useState(isWishlisted);

  const handleWishlist = () => {
    setWishlisted((prev) => !prev);
    onWishlistToggle?.();
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("flex flex-col gap-4", className)}
    >
      {/* ── Row 1: Badges ── */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2">
        {/* Property Type Badge */}
        <span
          className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border",
            TYPE_STYLES[type]
          )}
        >
          {type}
        </span>

        {/* Verified Badge */}
        {isVerified && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
            <BadgeCheck className="w-3 h-3" />
            Verified
          </span>
        )}
      </motion.div>

      {/* ── Row 2: Title + Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary tracking-tight leading-[1.15]"
        >
          {title}
        </motion.h1>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 shrink-0">
          {/* Share */}
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted/30 text-muted-foreground hover:text-foreground text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Wishlist */}
          <button
            type="button"
            onClick={handleWishlist}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-sm",
              wishlisted
                ? "border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/15"
                : "border-border/80 bg-card hover:bg-muted/30 text-muted-foreground hover:text-foreground"
            )}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("w-4 h-4", wishlisted && "fill-current")} />
            <span className="hidden sm:inline">{wishlisted ? "Saved" : "Save"}</span>
          </button>
        </motion.div>
      </div>

      {/* ── Row 3: Location + Rating ── */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5"
      >
        {/* Address */}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="w-4 h-4 shrink-0 text-secondary" />
          <span className="font-body text-sm">{address}</span>
        </div>

        {/* Divider — desktop only */}
        <div className="hidden sm:block w-px h-4 bg-border/70" />

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-secondary/10 px-2.5 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 text-secondary fill-current" />
            <span className="text-sm font-bold text-primary">
              {rating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PropertyHeader;
