"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Phone,
  MessageSquare,
  BadgeCheck,
  Calendar,
  Building,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface OwnerCardProps {
  /** Owner's display name */
  ownerName: string;
  /** Image URL for owner avatar */
  ownerImage: string;
  /** Verification status of the owner */
  isVerified?: boolean;
  /** How fast the owner typically responds (e.g., "Within 10 minutes") */
  responseTime: string;
  /** Phone number of the owner (can be used in tel: link if needed) */
  phone: string;
  /** Date the owner joined StayyNest (e.g., "July 2024") */
  joinedDate: string;
  /** Number of listings managed by this owner on StayyNest */
  listingsCount: number;
  /** Call Owner click handler */
  onCall?: () => void;
  /** Message/Chat click handler */
  onMessage?: () => void;
  /** Optional class override for container */
  className?: string;
}

// ─── Animation Variants ────────────────────────────────────────────────────────

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: PREMIUM_EASE },
  },
};

// ─── OwnerCard Component ───────────────────────────────────────────────────────

export function OwnerCard({
  ownerName,
  ownerImage,
  isVerified = false,
  responseTime,
  phone,
  joinedDate,
  listingsCount,
  onCall,
  onMessage,
  className,
}: OwnerCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: PREMIUM_EASE }}
      className={cn(
        "w-full rounded-[24px] bg-card border border-border/80 p-6 shadow-md hover:shadow-lg transition-shadow duration-300",
        className
      )}
    >
      {/* ── Heading / Profile Section ── */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative shrink-0 w-16 h-16 rounded-full overflow-hidden border border-border bg-muted">
          <img
            src={ownerImage}
            alt={`${ownerName} avatar`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Owner Info Details */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-heading text-lg font-bold text-primary truncate">
              {ownerName}
            </h3>
            {isVerified && (
              <BadgeCheck
                className="w-5 h-5 text-primary shrink-0"
                aria-label="Verified Host"
              />
            )}
          </div>
          <span className="font-body text-xs text-muted-foreground mt-0.5">
            Host / Property Owner
          </span>
        </div>
      </div>

      {/* ── Metadata Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 py-4 border-y border-border/60">
        {/* Response Time */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              Replies
            </span>
            <span className="font-heading text-xs font-bold text-foreground truncate">
              {responseTime}
            </span>
          </div>
        </div>

        {/* Joined Date */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-secondary/5 flex items-center justify-center text-secondary shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              Host Since
            </span>
            <span className="font-heading text-xs font-bold text-foreground truncate">
              {joinedDate}
            </span>
          </div>
        </div>

        {/* Total Listings */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
            <Building className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              Listings
            </span>
            <span className="font-heading text-xs font-bold text-foreground truncate">
              {listingsCount} {listingsCount === 1 ? "Property" : "Properties"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Action CTAs ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Call Owner - Primary */}
        <motion.button
          type="button"
          onClick={onCall}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-accent py-3.5 rounded-xl font-heading text-sm font-bold tracking-wide shadow-md transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Phone className="w-4 h-4" />
          Call Owner
        </motion.button>

        {/* Message - Secondary */}
        <motion.button
          type="button"
          onClick={onMessage}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex items-center justify-center gap-2 border border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground text-primary py-3.5 rounded-xl font-heading text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <MessageSquare className="w-4 h-4" />
          Message
        </motion.button>
      </div>
    </motion.div>
  );
}

export default OwnerCard;
