"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Zap,
  Check,
  IndianRupee,
  ShieldCheck,
  CalendarCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type AvailabilityStatus = "available" | "few-left" | "sold-out";

export interface PricingCardProps {
  /** Monthly rent in ₹ */
  monthlyRent: number;
  /** Security deposit in ₹ */
  securityDeposit: number;
  /** Brokerage amount in ₹ — pass 0 for zero-brokerage */
  brokerage: number;
  /** Current availability status */
  availability: AvailabilityStatus;
  /** List of benefits included in the rent (e.g. "Wi-Fi", "Electricity") */
  includedBenefits: string[];
  /** Callback when "Book Now" is clicked */
  onBookNow?: () => void;
  /** Callback when "Contact Owner" is clicked */
  onContactOwner?: () => void;
  /** Optional class override */
  className?: string;
}

// ─── Animation ─────────────────────────────────────────────────────────────────

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: PREMIUM_EASE },
  },
};

// ─── Availability Helpers ──────────────────────────────────────────────────────

const AVAILABILITY_CONFIG: Record<
  AvailabilityStatus,
  { label: string; dot: string; text: string; bg: string }
> = {
  available: {
    label: "Available Now",
    dot: "bg-emerald-500",
    text: "text-emerald-500",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  "few-left": {
    label: "Few Rooms Left",
    dot: "bg-amber-500",
    text: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  "sold-out": {
    label: "Sold Out",
    dot: "bg-red-500",
    text: "text-red-500",
    bg: "bg-red-500/10 border-red-500/20",
  },
};

// ─── Utility ───────────────────────────────────────────────────────────────────

function formatINR(amount: number): string {
  return amount.toLocaleString("en-IN");
}

// ─── PricingCard ──────────────────────────────────────────────────────────────

export function PricingCard({
  monthlyRent,
  securityDeposit,
  brokerage,
  availability,
  includedBenefits,
  onBookNow,
  onContactOwner,
  className,
}: PricingCardProps) {
  const avail = AVAILABILITY_CONFIG[availability];
  const isSoldOut = availability === "sold-out";
  const isZeroBrokerage = brokerage === 0;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "lg:sticky lg:top-24 w-full rounded-[24px] bg-card border border-border/80 shadow-lg overflow-hidden",
        className
      )}
    >
      {/* ── Header ── */}
      <div className="p-6 pb-0 flex flex-col gap-4">
        {/* Availability + Zero-Brokerage */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border",
              avail.bg,
              avail.text
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", avail.dot)} />
            {avail.label}
          </span>

          {isZeroBrokerage && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-secondary/10 text-secondary border border-secondary/20">
              <ShieldCheck className="w-3 h-3" />
              Zero Brokerage
            </span>
          )}
        </div>

        {/* Monthly Rent */}
        <div className="flex items-baseline gap-1">
          <span className="font-heading text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            ₹{formatINR(monthlyRent)}
          </span>
          <span className="font-body text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            / month
          </span>
        </div>
      </div>

      {/* ── Breakdown ── */}
      <div className="px-6 pt-4 pb-2">
        <div className="flex flex-col gap-3 border-t border-border/60 pt-4">
          {/* Security Deposit */}
          <div className="flex items-center justify-between">
            <span className="font-body text-sm text-muted-foreground">Security Deposit</span>
            <span className="font-heading text-sm font-bold text-primary">
              ₹{formatINR(securityDeposit)}
            </span>
          </div>

          {/* Brokerage */}
          <div className="flex items-center justify-between">
            <span className="font-body text-sm text-muted-foreground">Brokerage</span>
            {isZeroBrokerage ? (
              <span className="font-heading text-sm font-bold text-secondary">
                FREE
              </span>
            ) : (
              <span className="font-heading text-sm font-bold text-primary">
                ₹{formatINR(brokerage)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Included Benefits ── */}
      {includedBenefits.length > 0 && (
        <div className="px-6 py-4">
          <div className="flex flex-col gap-3 border-t border-border/60 pt-4">
            <span className="font-heading text-xs font-bold text-foreground/80 uppercase tracking-widest">
              Included in Rent
            </span>
            <ul className="flex flex-col gap-2">
              {includedBenefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="font-body text-sm text-foreground/85">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ── CTAs ── */}
      <div className="px-6 pb-6 pt-2 flex flex-col gap-3">
        {/* Book Now — Primary */}
        <motion.button
          type="button"
          onClick={onBookNow}
          disabled={isSoldOut}
          whileHover={!isSoldOut ? { scale: 1.02 } : undefined}
          whileTap={!isSoldOut ? { scale: 0.97 } : undefined}
          transition={{ duration: 0.2 }}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-heading text-sm font-bold tracking-wide shadow-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isSoldOut
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-accent cursor-pointer"
          )}
          aria-label={isSoldOut ? "Property is sold out" : "Book this property now"}
        >
          <CalendarCheck className="w-4 h-4" />
          {isSoldOut ? "Sold Out" : "Book Now"}
        </motion.button>

        {/* Contact Owner — Secondary */}
        <motion.button
          type="button"
          onClick={onContactOwner}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground text-primary font-heading text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Phone className="w-4 h-4" />
          Contact Owner
        </motion.button>
      </div>

      {/* ── Trust Footer ── */}
      <div className="px-6 pb-5">
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
          <Zap className="w-3 h-3" />
          Instant confirmation · No hidden charges
        </div>
      </div>
    </motion.div>
  );
}

export default PricingCard;
