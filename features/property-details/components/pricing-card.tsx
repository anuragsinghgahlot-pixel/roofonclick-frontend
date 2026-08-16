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

import { AvailabilityService } from "@/services/availability";
import { BookingService, PriceBreakdown } from "@/services/booking";
import { BookingConfirmationModal } from "@/components/booking/booking-confirmation-modal";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type AvailabilityStatus = "available" | "few-left" | "sold-out";

export interface PricingCardProps {
  /** Property ID */
  propertyId?: string;
  /** Property Name */
  propertyName?: string;
  /** Property Address */
  address?: string;
  /** Property Cover Photo */
  coverPhoto?: string;
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
  /** Controlled selected room type */
  selectedRoomType?: string;
  /** Callback when room type changes */
  onRoomTypeChange?: (roomType: string) => void;
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

function formatDisplayDate(isoStr: string): string {
  if (!isoStr) return "";
  const d = new Date(isoStr + "T00:00:00");
  if (isNaN(d.getTime())) return isoStr;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── PricingCard ──────────────────────────────────────────────────────────────

export function PricingCard({
  propertyId = "p1",
  propertyName = "StayyNest Property",
  address,
  coverPhoto,
  monthlyRent,
  securityDeposit,
  brokerage,
  availability,
  includedBenefits,
  selectedRoomType,
  onRoomTypeChange,
  onBookNow,
  onContactOwner,
  onScheduleVisit,
  onSendEnquiry,
  className,
}: PricingCardProps) {
  const avail = AVAILABILITY_CONFIG[availability];
  const isSoldOut = availability === "sold-out";
  const isZeroBrokerage = brokerage === 0;

  const todayISO = React.useMemo(() => new Date().toISOString().split("T")[0], []);
  const maxISO = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    return `${currentYear + 2}-12-31`;
  }, []);

  const [internalRoom, setInternalRoom] = React.useState<string>("Single Room");
  const selectedRoom = selectedRoomType || internalRoom;

  const handleRoomSelect = (room: string) => {
    setInternalRoom(room);
    if (onRoomTypeChange) onRoomTypeChange(room);
  };
  const [moveInDate, setMoveInDate] = React.useState<string>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    return today.toISOString().split("T")[0];
  });
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = React.useState(false);

  const handleDateChange = (val: string) => {
    if (!val) return;
    if (val < todayISO) {
      setMoveInDate(todayISO);
      return;
    }
    if (val > maxISO) {
      setMoveInDate(maxISO);
      return;
    }
    setMoveInDate(val);
  };

  const activeRent = selectedRoom === "Double Sharing" ? Math.round(monthlyRent * 0.75) : monthlyRent;

  const pricing = React.useMemo(() => {
    return BookingService.calculatePricing({
      monthlyRent: activeRent,
      securityDeposit: securityDeposit || activeRent,
    });
  }, [activeRent, securityDeposit]);

  const handleBookNowClick = () => {
    setIsConfirmationModalOpen(true);
    if (onBookNow) onBookNow();
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "relative overflow-hidden w-full rounded-[28px] bg-card/75 backdrop-blur-xl border border-border/80 shadow-premium text-left",
          className
        )}
      >
        {/* Ambient gradient top glow for premium appearance */}
        <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-primary/5 via-primary/0 to-transparent pointer-events-none" />
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
                ₹{formatINR(activeRent)}
              </span>
              <span className="font-body text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                / month
              </span>
            </div>
          </div>
        </div>

        {/* ── Booking Options (Room, Move-in Date, Duration) ── */}
        <div className="relative z-10 px-6 pt-5 pb-2 space-y-4">
          <div className="flex flex-col gap-3.5 border-t border-border/60 pt-4">
            {/* Room Status Selector */}
            <div className="space-y-1.5">
              <span className="font-body text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground block">
                Select Room Type & Status
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={() => handleRoomSelect("Single Room")}
                  className={cn(
                    "p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer select-none",
                    selectedRoom === "Single Room"
                      ? "bg-primary/10 border-primary text-primary shadow-xs"
                      : "bg-muted/30 border-border/60 text-muted-foreground hover:border-primary/40"
                  )}
                >
                  <span className="font-heading text-xs font-bold block">Single Room</span>
                  <span className="text-[9px] font-heading font-extrabold uppercase text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-md inline-block mt-1 w-fit">
                    Available
                  </span>
                </button>

                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={() => handleRoomSelect("Double Sharing")}
                  className={cn(
                    "p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer select-none",
                    selectedRoom === "Double Sharing"
                      ? "bg-primary/10 border-primary text-primary shadow-xs"
                      : "bg-muted/30 border-border/60 text-muted-foreground hover:border-primary/40"
                  )}
                >
                  <span className="font-heading text-xs font-bold block">Double Sharing</span>
                  <span className="text-[9px] font-heading font-extrabold uppercase text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded-md inline-block mt-1 w-fit">
                    Limited
                  </span>
                </button>
              </div>
            </div>

            {/* Preferred Move-in Date Picker */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-body text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground block">
                  Preferred Move-in Date
                </label>
                {moveInDate && (
                  <span className="text-[10px] font-heading font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    {formatDisplayDate(moveInDate)}
                  </span>
                )}
              </div>
              <input
                type="date"
                value={moveInDate}
                min={todayISO}
                max={maxISO}
                onKeyDown={(e) => e.preventDefault()}
                onClick={(e) => e.currentTarget.showPicker?.()}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full bg-background border border-border/80 rounded-xl px-3 py-2 text-xs font-body text-foreground focus:outline-none focus:border-primary cursor-pointer select-none"
              />
            </div>

            {/* ── Price Summary Matrix ── */}
            <div className="space-y-2.5 border-t border-border/60 pt-3.5 text-xs font-body">
              <span className="font-heading text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground block">
                Price Summary
              </span>
              <div className="flex justify-between text-muted-foreground">
                <span>Monthly Rent</span>
                <span className="font-bold text-foreground">₹{formatINR(pricing.monthlyRent)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Security Deposit</span>
                <span className="font-bold text-foreground">₹{formatINR(pricing.securityDeposit)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Platform Fee</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="h-px bg-border/60 my-1" />
              <div className="flex justify-between font-heading text-xs font-extrabold text-primary pt-0.5">
                <span>Total Due Today</span>
                <span className="text-secondary text-sm">₹{formatINR(pricing.totalDueNow)}</span>
              </div>
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
            onClick={handleBookNowClick}
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

    <BookingConfirmationModal
      isOpen={isConfirmationModalOpen}
      onClose={() => setIsConfirmationModalOpen(false)}
      propertyId={propertyId}
      propertyName={propertyName}
      coverImage={coverPhoto}
      roomType={selectedRoom}
      moveInDate={moveInDate}
      pricing={pricing}
      propertyAddress={address}
    />
  </>
  );
}

export default PricingCard;
