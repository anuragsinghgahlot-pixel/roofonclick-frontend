"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Zap,
  Check,
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
  /** Callback when "Contact Owner" or "Send Enquiry" is clicked */
  onContactOwner?: () => void;
  /** Callback when "Schedule Visit" is clicked */
  onScheduleVisit?: () => void;
  /** Callback when "Send Enquiry" is clicked */
  onSendEnquiry?: () => void;
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
  { label: string; dot: string; text: string; bg: string; shadow: string }
> = {
  available: {
    label: "Available Now",
    dot: "bg-emerald-500",
    text: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-500/5",
    shadow: "shadow-[0_2px_8px_rgba(16,185,129,0.06)]",
  },
  "few-left": {
    label: "Few Rooms Left",
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20 dark:bg-amber-500/5",
    shadow: "shadow-[0_2px_8px_rgba(245,158,11,0.06)]",
  },
  "sold-out": {
    label: "Sold Out",
    dot: "bg-rose-500",
    text: "text-rose-500 dark:text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20 dark:bg-rose-500/5",
    shadow: "shadow-[0_2px_8px_rgba(239,68,68,0.06)]",
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
  onScheduleVisit,
  onSendEnquiry,
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
        "relative overflow-hidden w-full rounded-[28px] bg-card/75 backdrop-blur-xl border border-border/80 shadow-premium",
        className
      )}
    >
      {/* Ambient gradient top glow for premium appearance */}
      <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-primary/5 via-primary/0 to-transparent pointer-events-none" />
      {/* Inner premium border glare */}
      <div className="absolute inset-0 rounded-[28px] border border-white/[0.04] pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10 p-6 pb-0 flex flex-col gap-5">
        {/* Availability + Zero-Brokerage Row */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border",
              avail.bg,
              avail.text,
              avail.shadow
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", avail.dot)} />
            {avail.label}
          </span>

          {isZeroBrokerage && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-secondary/10 text-secondary border border-secondary/20 shadow-[0_2px_8px_rgba(212,163,115,0.06)]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Zero Brokerage
            </span>
          )}
        </div>

        {/* Rent Value Display */}
        <div className="flex flex-col gap-0.5">
          <span className="font-body text-[10px] font-semibold text-muted-foreground uppercase tracking-widest pl-0.5">
            Monthly Rent
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading text-4xl sm:text-5xl font-extrabold text-primary tracking-tight leading-none">
              ₹{formatINR(monthlyRent)}
            </span>
            <span className="font-body text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              / month
            </span>
          </div>
        </div>
      </div>

      {/* ── Breakdown ── */}
      <div className="relative z-10 px-6 pt-5 pb-2">
        <div className="flex flex-col gap-3.5 border-t border-border/60 pt-5">
          {/* Security Deposit */}
          <div className="flex items-center justify-between">
            <span className="font-body text-sm text-muted-foreground">Security Deposit</span>
            <span className="font-heading text-sm font-bold text-foreground">
              ₹{formatINR(securityDeposit)}
            </span>
          </div>

          {/* Brokerage */}
          <div className="flex items-center justify-between">
            <span className="font-body text-sm text-muted-foreground">Brokerage Fees</span>
            {isZeroBrokerage ? (
              <span className="font-heading text-xs font-extrabold text-secondary bg-secondary/10 px-2 py-0.5 rounded-md border border-secondary/15 uppercase tracking-wide">
                FREE
              </span>
            ) : (
              <span className="font-heading text-sm font-bold text-foreground">
                ₹{formatINR(brokerage)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Included Benefits ── */}
      {includedBenefits.length > 0 && (
        <div className="relative z-10 px-6 py-4">
          <div className="flex flex-col gap-4 border-t border-border/60 pt-5">
            <span className="font-heading text-xs font-bold text-foreground/80 uppercase tracking-widest pl-0.5">
              Included In Rent
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {includedBenefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-[0_1.5px_4px_rgba(26,59,43,0.04)]">
                    <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
                  </div>
                  <span className="font-body text-sm text-foreground/80 font-medium truncate">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ── Action CTAs ── */}
      <div className="relative z-10 px-6 pb-6 pt-3 flex flex-col gap-3">
        {/* Book Now — Primary */}
        <motion.button
          type="button"
          data-no-intercept="true"
          onClick={onBookNow}
          disabled={isSoldOut}
          whileHover={!isSoldOut ? { scale: 1.015, y: -1 } : undefined}
          whileTap={!isSoldOut ? { scale: 0.985 } : undefined}
          transition={{ duration: 0.2, ease: PREMIUM_EASE }}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-heading text-sm font-bold tracking-wide shadow-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isSoldOut
              ? "bg-muted text-muted-foreground cursor-not-allowed shadow-none border border-border/40"
              : "bg-primary text-primary-foreground hover:bg-accent hover:shadow-lg hover:shadow-primary/10 cursor-pointer border border-primary/20"
          )}
        >
          <CalendarCheck className="w-4 h-4" />
          {isSoldOut ? "Sold Out" : "Book Now"}
        </motion.button>

        {/* Schedule Visit & Send Enquiry Grid */}
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            type="button"
            data-no-intercept="true"
            onClick={onScheduleVisit}
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.985 }}
            transition={{ duration: 0.2, ease: PREMIUM_EASE }}
            className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl border border-secondary/40 bg-secondary/10 hover:bg-secondary hover:text-secondary-foreground text-secondary font-heading text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Schedule Visit</span>
          </motion.button>

          <motion.button
            type="button"
            data-no-intercept="true"
            onClick={onSendEnquiry || onContactOwner}
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.985 }}
            transition={{ duration: 0.2, ease: PREMIUM_EASE }}
            className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl border border-primary/25 bg-primary/5 hover:bg-primary hover:text-primary-foreground text-primary font-heading text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Send Enquiry</span>
          </motion.button>
        </div>
      </div>

      {/* ── Trust Footer / HUD ── */}
      <div className="relative z-10 px-6 pb-6">
        <div className="flex items-center justify-center gap-1.5 text-[9px] font-extrabold text-muted-foreground/60 uppercase tracking-widest border-t border-border/50 pt-4 text-center">
          <Zap className="w-3.5 h-3.5 text-secondary animate-pulse" />
          Instant Confirmation &middot; No Hidden Charges
        </div>
      </div>
    </motion.div>
  );
}

export default PricingCard;
