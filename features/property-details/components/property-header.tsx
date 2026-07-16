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
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: PREMIUM_EASE },
  },
};

// ─── Type Badge Colors ─────────────────────────────────────────────────────────

const TYPE_STYLES: Record<PropertyType, string> = {
  PG: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20 shadow-[0_2px_8px_rgba(16,185,129,0.04)]",
  Hostel: "bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20 shadow-[0_2px_8px_rgba(59,130,246,0.04)]",
  "Co-Living": "bg-violet-500/10 text-violet-500 dark:text-violet-400 border-violet-500/20 shadow-[0_2px_8px_rgba(139,92,246,0.04)]",
  Studio: "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20 shadow-[0_2px_8px_rgba(245,158,11,0.04)]",
  "1 RK": "bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20 shadow-[0_2px_8px_rgba(244,63,94,0.04)]",
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
      className={cn("flex flex-col gap-4 w-full relative z-10", className)}
    >
      {/* ── Row 1: Badges ── */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2">
        {/* Property Type Badge */}
        <span
          className={cn(
            "inline-flex items-center px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border transition-all duration-300",
            TYPE_STYLES[type]
          )}
        >
          {type}
        </span>

        {/* Verified Badge */}
        {isVerified && (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 shadow-[0_2px_8px_rgba(26,59,43,0.04)]">
            <BadgeCheck className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
            Verified Host
          </span>
        )}
      </motion.div>

      {/* ── Row 2: Title + Actions ── */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-8">
        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight leading-[1.12] max-w-4xl"
        >
          {title}
        </motion.h1>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="flex items-center gap-2.5 shrink-0">
          {/* Share Button */}
          <motion.button
            type="button"
            onClick={onShare}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: PREMIUM_EASE }}
            className="inline-flex items-center gap-2 px-4.5 py-3 rounded-2xl border border-border/80 bg-card/65 backdrop-blur-md hover:bg-muted/40 hover:border-border text-muted-foreground hover:text-foreground text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </motion.button>

          {/* Wishlist Button */}
          <motion.button
            type="button"
            onClick={handleWishlist}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: PREMIUM_EASE }}
            className={cn(
              "inline-flex items-center gap-2 px-4.5 py-3 rounded-2xl border text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-sm",
              wishlisted
                ? "border-rose-500/25 bg-rose-500/10 text-rose-500 hover:bg-rose-500/15 shadow-[0_4px_12px_rgba(244,63,94,0.12)]"
                : "border-border/80 bg-card/65 backdrop-blur-md hover:bg-muted/40 hover:border-border text-muted-foreground hover:text-foreground"
            )}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("w-4 h-4 transition-transform duration-300", wishlisted && "fill-current scale-110")} />
            <span>{wishlisted ? "Saved" : "Save"}</span>
          </motion.button>
        </motion.div>
      </div>

      {/* ── Row 3: Location + Rating Details ── */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-6 mt-1"
      >
        {/* Address Row */}
        <div className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors duration-200 cursor-pointer group">
          <MapPin className="w-4.5 h-4.5 shrink-0 text-secondary transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
          <span className="font-body text-sm font-semibold tracking-wide underline-offset-4 group-hover:underline">
            {address}
          </span>
        </div>

        {/* Divider — desktop only */}
        <div className="hidden sm:block w-px h-4.5 bg-border/60" />

        {/* Rating Block / Chip */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-secondary/15 border border-secondary/25 px-3 py-1 rounded-full shadow-[0_2px_8px_rgba(212,163,115,0.06)]">
            <Star className="w-3.5 h-3.5 text-secondary fill-current" />
            <span className="text-sm font-extrabold text-primary leading-none mt-0.5">
              {rating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            {reviewCount} {reviewCount === 1 ? "verified review" : "verified reviews"}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PropertyHeader;
