"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface Amenity {
  /** Lucide Icon component */
  icon: React.ElementType;
  /** Name of the amenity (e.g., "High-Speed Wi-Fi") */
  title: string;
  /** Optional availability status (defaults to true) */
  isAvailable?: boolean;
  /** Optional text status badge (e.g., "Chargeable", "On Request") */
  statusText?: string;
}

export interface AmenitiesProps {
  /** Array of amenities to display */
  items: Amenity[];
  /** Optional class override for the grid container */
  className?: string;
}

// ─── Animation Variants ────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

// ─── Amenities Component ───────────────────────────────────────────────────────

export function Amenities({ items, className }: AmenitiesProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-muted-foreground">
        No amenities listed.
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full",
        className
      )}
    >
      {items.map((item, index) => {
        const Icon = item.icon;
        const isAvailable = item.isAvailable !== false; // defaults to true

        return (
          <motion.div
            key={`${item.title}-${index}`}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "group relative flex items-center gap-4 p-4 rounded-2xl border bg-card transition-all duration-300",
              isAvailable
                ? "border-border/80 hover:border-primary/30 hover:shadow-md cursor-default"
                : "border-border/40 opacity-50 cursor-not-allowed"
            )}
          >
            {/* Icon Container */}
            <div
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-xl border transition-colors duration-300",
                isAvailable
                  ? "bg-primary/5 border-primary/10 group-hover:bg-primary/10 group-hover:border-primary/20 text-primary"
                  : "bg-muted border-border text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={2} />
            </div>

            {/* Content info */}
            <div className="flex flex-col min-w-0 pr-6">
              <span
                className={cn(
                  "font-heading text-sm font-bold truncate transition-colors duration-300",
                  isAvailable ? "text-foreground group-hover:text-primary" : "text-muted-foreground"
                )}
              >
                {item.title}
              </span>
              {item.statusText && (
                <span className="font-body text-[10px] font-semibold text-secondary uppercase tracking-wider mt-0.5">
                  {item.statusText}
                </span>
              )}
            </div>

            {/* Micro Badge for Availability (Check/Cross) */}
            <div className="absolute top-3 right-3">
              {isAvailable ? (
                <Check className="w-3.5 h-3.5 text-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity" />
              ) : (
                <X className="w-3.5 h-3.5 text-rose-500 opacity-60" />
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default Amenities;
