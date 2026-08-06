"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  CreditCard,
  User,
  Phone,
  Mail,
  Building,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from "lucide-react";
import { PriceBreakdown, BookingService } from "@/services/booking";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/shared/portal";

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyName: string;
  coverImage?: string;
  roomType: string;
  moveInDate: string;
  pricing: PriceBreakdown;
  onConfirmSuccess?: () => void;
}

// ─── 4-Step Definition ─────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, name: "Choose Room" },
  { id: 2, name: "Your Details" },
  { id: 3, name: "Payment" },
  { id: 4, name: "Confirmation" },
];

export function BookingConfirmationModal({
  isOpen,
  onClose,
  propertyId,
  propertyName,
  coverImage = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
  roomType,
  moveInDate,
  pricing,
  onConfirmSuccess,
}: BookingConfirmationModalProps) {
  const [currentStep, setCurrentStep] = React.useState<number>(2); // Start at Step 2 Details since Step 1 is chosen on card
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = React.useState(false);
  const [createdReservation, setCreatedReservation] = React.useState<any>(null);

  // Form Fields State
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    occupation: "Student",
    emergencyContact: "",
    paymentMethod: "online",
  });

  // Form Validation Error State
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  // Reset modal state on open
  React.useEffect(() => {
    if (isOpen) {
      setCurrentStep(2);
      setIsSubmitting(false);
      setCreatedReservation(null);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.email.trim() || !formData.email.includes("@")) {
      newErrors.email = "Valid email address is required";
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = "Valid 10-digit mobile number required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 2) {
      if (!validateStep2()) return;
      setCurrentStep(3);
    }
  };

  const handleConfirmReservation = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const res = BookingService.createBookingReservation({
        propertyId,
        propertyName,
        roomType,
        moveInDate,
        pricing,
        guestDetails: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          occupation: formData.occupation,
        },
      });

      setIsSubmitting(false);
      setCreatedReservation(res);
      setCurrentStep(4);
      showToast.success("Booking Submitted Successfully! 🎉", `Reservation ID: ${res.reservationId}`);
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("roofonclick_trigger_review_modal"));
        }, 1200);
      }
      if (onConfirmSuccess) onConfirmSuccess();
    }, 1000);
  };

  return (
    <Portal>
      <AnimatePresence>
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-[1200] flex items-center justify-center p-2 sm:p-6 bg-background/80 backdrop-blur-md overscroll-none"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl bg-card border border-border/80 rounded-2xl sm:rounded-3xl shadow-2xl text-left select-none my-auto max-h-[92vh] sm:max-h-[88vh] flex flex-col z-10"
          >
          {/* ── Modal Top Bar ── */}
          <div className="p-4 sm:p-6 pb-0 flex items-center justify-between border-b border-border/60 pb-4 shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg sm:text-xl font-extrabold text-primary leading-tight">
                  Reserve Your Stay
                </h3>
                <p className="font-body text-xs text-muted-foreground">
                  RoofOnClick Verified Instant Booking Experience
                </p>
              </div>
            </div>

            <button
              type="button"
              data-no-intercept="true"
              onClick={onClose}
              className="p-2 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Close Booking Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── 1. Progress Indicator Stepper ── */}
          <div className="px-4 sm:px-6 shrink-0">
            <div className="grid grid-cols-4 gap-2 border-b border-border/60 pb-4">
              {STEPS.map((step) => {
                const isCompleted = step.id < currentStep || currentStep === 4;
                const isCurrent = step.id === currentStep && currentStep !== 4;

                return (
                  <div key={step.id} className="flex flex-col gap-1.5 text-center sm:text-left">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center font-heading text-xs font-extrabold transition-all shrink-0",
                          isCompleted
                            ? "bg-emerald-500 text-white"
                            : isCurrent
                            ? "bg-primary text-primary-foreground ring-2 ring-primary/40"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.id}
                      </div>
                      <span
                        className={cn(
                          "font-heading text-xs font-bold truncate hidden sm:inline",
                          isCurrent
                            ? "text-primary"
                            : isCompleted
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-muted-foreground"
                        )}
                      >
                        {step.name}
                      </span>
                    </div>
                    {/* Progress Bar Track */}
                    <div
                      className={cn(
                        "h-1 rounded-full w-full transition-colors",
                        isCompleted
                          ? "bg-emerald-500"
                          : isCurrent
                          ? "bg-primary"
                          : "bg-muted/80"
                      )}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Mobile Summary Collapsible Toggle ── */}
          <div className="lg:hidden px-4 sm:px-6 shrink-0">
            <button
              type="button"
              data-no-intercept="true"
              onClick={() => setIsMobileSummaryOpen((prev) => !prev)}
              className="w-full p-3 rounded-2xl bg-muted/40 border border-border/60 flex items-center justify-between font-heading text-xs font-bold text-foreground"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span>Booking Summary (Total: ₹{pricing.totalDueNow.toLocaleString()})</span>
              </div>
              {isMobileSummaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isMobileSummaryOpen && (
              <div className="mt-2 p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2 text-xs font-body">
                <div className="flex justify-between text-muted-foreground">
                  <span>Room Type:</span>
                  <span className="font-bold text-foreground">{roomType}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Move-in Date:</span>
                  <span className="font-bold text-foreground">{moveInDate}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Monthly Rent:</span>
                  <span className="font-bold text-foreground">₹{pricing.monthlyRent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Security Deposit:</span>
                  <span className="font-bold text-foreground">₹{pricing.securityDeposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Platform Fee:</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
                <div className="h-px bg-border/60 pt-1" />
                <div className="flex justify-between font-heading text-sm font-extrabold text-primary">
                  <span>Total Payable Today:</span>
                  <span className="text-secondary">₹{pricing.totalDueNow.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Modal Body Content (Flexible Scroll Area) ── */}
          <div data-lenis-prevent="true" className="px-4 sm:px-6 overflow-y-auto flex-1 overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
            {currentStep === 4 ? (
              /* ── Step 4: SUCCESS CONFIRMATION SCREEN ── */
              <div className="py-8 space-y-6 text-center max-w-lg mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto"
                >
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </motion.div>

                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-heading text-xs font-extrabold uppercase tracking-widest border border-emerald-500/20">
                    ✓ Booking Request Submitted
                  </span>
                  <h3 className="font-heading text-2xl font-extrabold text-primary">
                    Your Room is Reserved!
                  </h3>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">
                    We have sent the move-in schedule and property owner contact details to your registered email.
                  </p>
                </div>

                {/* Reservation Voucher Summary */}
                <div className="p-5 rounded-2xl bg-muted/30 border border-border/80 space-y-3 text-left font-body text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-border/60">
                    <span className="text-muted-foreground">Booking ID</span>
                    <span className="font-heading font-extrabold text-secondary">
                      {createdReservation?.reservationId || "RN-2026-8942"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Property</span>
                    <span className="font-bold text-foreground truncate max-w-[200px]">{propertyName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Room Type</span>
                    <span className="font-bold text-foreground">{roomType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Move-in Date</span>
                    <span className="font-bold text-foreground">{moveInDate}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <a
                    href="/booking"
                    className="w-full sm:w-1/2 py-3 rounded-2xl bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground font-heading text-xs font-extrabold transition-all shadow-md text-center"
                  >
                    View My Bookings
                  </a>
                  <a
                    href="/search"
                    className="w-full sm:w-1/2 py-3 rounded-2xl border border-border/80 bg-card hover:bg-muted/40 text-foreground font-heading text-xs font-bold transition-all text-center"
                  >
                    Continue Exploring
                  </a>
                </div>
              </div>
            ) : (
              /* ── Steps 2 & 3: FORM + SUMMARY LAYOUT ── */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-4">
                
                {/* Left Column: Interactive Form Inputs */}
                <div className="lg:col-span-7 space-y-6">
                  {currentStep === 2 && (
                    /* Step 2: Guest Details Form */
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h4 className="font-heading text-sm font-extrabold text-primary">
                          Enter Guest Details
                        </h4>
                        <p className="font-body text-xs text-muted-foreground">
                          Please provide your information for lease agreement & owner verification.
                        </p>
                      </div>

                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="font-heading text-xs font-bold text-foreground flex items-center gap-1">
                          <span>Full Name</span> <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Rahul Sharma"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className={cn(
                              "w-full pl-9 pr-4 py-2.5 rounded-2xl border bg-card text-foreground font-body text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all",
                              errors.fullName ? "border-rose-500 ring-1 ring-rose-500/50" : "border-border/80"
                            )}
                          />
                        </div>
                        {errors.fullName && <p className="text-[10px] text-rose-500 font-body">{errors.fullName}</p>}
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1.5">
                        <label className="font-heading text-xs font-bold text-foreground flex items-center gap-1">
                          <span>Email Address</span> <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="email"
                            placeholder="rahul.sharma@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={cn(
                              "w-full pl-9 pr-4 py-2.5 rounded-2xl border bg-card text-foreground font-body text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all",
                              errors.email ? "border-rose-500 ring-1 ring-rose-500/50" : "border-border/80"
                            )}
                          />
                        </div>
                        {errors.email && <p className="text-[10px] text-rose-500 font-body">{errors.email}</p>}
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-1.5">
                        <label className="font-heading text-xs font-bold text-foreground flex items-center gap-1">
                          <span>Mobile Number</span> <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={cn(
                              "w-full pl-9 pr-4 py-2.5 rounded-2xl border bg-card text-foreground font-body text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all",
                              errors.phone ? "border-rose-500 ring-1 ring-rose-500/50" : "border-border/80"
                            )}
                          />
                        </div>
                        {errors.phone && <p className="text-[10px] text-rose-500 font-body">{errors.phone}</p>}
                      </div>

                      {/* Occupation Dropdown */}
                      <div className="space-y-1.5">
                        <label className="font-heading text-xs font-bold text-foreground">
                          Occupation Status
                        </label>
                        <select
                          value={formData.occupation}
                          onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-2xl border border-border/80 bg-card text-foreground font-body text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all cursor-pointer"
                        >
                          <option value="Student">Student (College / Coaching)</option>
                          <option value="Working Professional">Working Professional</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    /* Step 3: Payment Options Form */
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h4 className="font-heading text-sm font-extrabold text-primary">
                          Select Payment Mode
                        </h4>
                        <p className="font-body text-xs text-muted-foreground">
                          Reserve instantly online or choose pay-at-property option.
                        </p>
                      </div>

                      {/* Option A: Instant Online Booking */}
                      <label
                        onClick={() => setFormData({ ...formData, paymentMethod: "online" })}
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer",
                          formData.paymentMethod === "online"
                            ? "bg-primary/10 border-primary ring-1 ring-primary/40 shadow-xs"
                            : "bg-card border-border/80 hover:border-primary/40"
                        )}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={formData.paymentMethod === "online"}
                          onChange={() => setFormData({ ...formData, paymentMethod: "online" })}
                          className="mt-1 accent-primary"
                        />
                        <div className="space-y-0.5 min-w-0">
                          <span className="font-heading text-xs font-extrabold text-foreground block">
                            Instant Online Payment (UPI / Cards / NetBanking)
                          </span>
                          <p className="font-body text-[11px] text-muted-foreground">
                            Lock your room instantly with 100% money-back guarantee if canceled within 24h.
                          </p>
                        </div>
                      </label>

                      {/* Option B: Pay at Property */}
                      <label
                        onClick={() => setFormData({ ...formData, paymentMethod: "property" })}
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer",
                          formData.paymentMethod === "property"
                            ? "bg-primary/10 border-primary ring-1 ring-primary/40 shadow-xs"
                            : "bg-card border-border/80 hover:border-primary/40"
                        )}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={formData.paymentMethod === "property"}
                          onChange={() => setFormData({ ...formData, paymentMethod: "property" })}
                          className="mt-1 accent-primary"
                        />
                        <div className="space-y-0.5 min-w-0">
                          <span className="font-heading text-xs font-extrabold text-foreground block">
                            Pay at Property on Move-in Date
                          </span>
                          <p className="font-body text-[11px] text-muted-foreground">
                            Reserve room now and pay directly to the property manager upon arrival.
                          </p>
                        </div>
                      </label>
                    </div>
                  )}
                </div>

                {/* Right Column: Sticky Booking Summary Card (Desktop) */}
                <div className="lg:col-span-5 hidden lg:block sticky top-0">
                  <div className="p-5 rounded-3xl bg-muted/30 border border-border/80 space-y-4">
                    <span className="font-heading text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                      Booking Summary
                    </span>

                    {/* Property Card */}
                    <div className="flex items-center gap-3">
                      <img
                        src={coverImage}
                        alt={propertyName}
                        className="w-16 h-16 rounded-2xl object-cover border border-border/60 shrink-0"
                      />
                      <div className="space-y-0.5 min-w-0">
                        <h5 className="font-heading text-xs font-extrabold text-primary truncate">
                          {propertyName}
                        </h5>
                        <p className="font-body text-[11px] text-secondary font-bold truncate">
                          {roomType}
                        </p>
                        <span className="text-[10px] font-body text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-secondary shrink-0" /> {moveInDate}
                        </span>
                      </div>
                    </div>

                    {/* Price Matrix */}
                    <div className="space-y-2 border-t border-border/60 pt-3 text-xs font-body">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Monthly Rent</span>
                        <span className="font-bold text-foreground">₹{pricing.monthlyRent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Security Deposit</span>
                        <span className="font-bold text-foreground">₹{pricing.securityDeposit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Platform Fee</span>
                        <span className="font-bold text-emerald-600">FREE</span>
                      </div>
                      <div className="h-px bg-border/60 my-1" />
                      <div className="flex justify-between font-heading text-sm font-extrabold text-primary">
                        <span>Total Payable Today</span>
                        <span className="text-secondary text-base">₹{pricing.totalDueNow.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── Modal Footer Controls ── */}
          {currentStep !== 4 && (
            <div className="p-4 sm:p-6 border-t border-border/60 flex items-center justify-between shrink-0 bg-card">
              {currentStep > 2 ? (
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-2xl border border-border/80 text-muted-foreground hover:text-foreground font-heading text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep === 2 && (
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 rounded-2xl bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground font-heading text-xs font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer ml-auto"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === 3 && (
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={handleConfirmReservation}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-2xl bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground font-heading text-xs font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer ml-auto disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Reservation...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Reserve</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  </Portal>
  );
}

export default BookingConfirmationModal;
