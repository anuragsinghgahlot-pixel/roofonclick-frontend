"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Calendar, Clock, User, FileText, X, CheckCircle, Sparkles, HelpCircle } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { CallbackService } from "@/services/callback/callback.service";
import { CallbackPurpose } from "@/services/callback/callback.types";
import { toast } from "sonner";

interface BookCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyName: string;
}

const PURPOSE_OPTIONS: CallbackPurpose[] = [
  "General Enquiry",
  "Schedule Visit",
  "Pricing Discussion",
  "Room Availability",
  "Amenities",
  "Other",
];

const TIME_SLOTS = [
  "Morning (9 AM - 12 PM)",
  "Afternoon (12 PM - 4 PM)",
  "Evening (4 PM - 8 PM)",
];

export function BookCallModal({
  isOpen,
  onClose,
  propertyId,
  propertyName,
}: BookCallModalProps) {
  const { user } = useAuth();

  const [name, setName] = React.useState(user?.name || "");
  const [phone, setPhone] = React.useState(user?.phone || "+91 98765 43210");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState(TIME_SLOTS[0]);
  const [purpose, setPurpose] = React.useState<CallbackPurpose>("General Enquiry");
  const [notes, setNotes] = React.useState("");

  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Today in YYYY-MM-DD format for min date
  const todayISO = React.useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!date) {
      setError("Please select a preferred callback date.");
      return;
    }

    if (!time) {
      setError("Please select a preferred callback time slot.");
      return;
    }

    try {
      CallbackService.createRequest({
        propertyId,
        propertyName,
        buyerName: name.trim(),
        buyerPhone: phone.trim(),
        preferredDate: date,
        preferredTime: time,
        purpose,
        notes: notes.trim() || undefined,
      });

      setIsSubmitted(true);
      toast.success("Callback request submitted successfully!");
    } catch {
      setError("Failed to submit callback request. Please try again.");
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card border border-border/80 p-6 sm:p-8 rounded-3xl max-w-lg w-full shadow-premium text-left relative space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            type="button"
            data-no-intercept="true"
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {!isSubmitted ? (
            <>
              {/* Modal Header */}
              <div className="space-y-1">
                <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  Direct Owner Connect
                </span>
                <h3 className="font-heading text-xl font-extrabold text-primary">
                  Book a Callback
                </h3>
                <p className="font-body text-xs text-muted-foreground truncate">
                  {propertyName}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-0.5">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full bg-background border border-border/80 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold font-body text-foreground focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-0.5">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Phone className="absolute left-3 w-4 h-4 text-muted-foreground" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-background border border-border/80 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold font-body text-foreground focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Preferred Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-0.5">
                      Preferred Date <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Calendar className="absolute left-3 w-4 h-4 text-muted-foreground" />
                      <input
                        type="date"
                        required
                        min={todayISO}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-background border border-border/80 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold font-body text-foreground focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-0.5">
                      Preferred Time Slot <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Clock className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-background border border-border/80 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold font-body text-foreground focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                      >
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Purpose Option Select */}
                <div className="space-y-1.5">
                  <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-0.5">
                    Call Purpose <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <HelpCircle className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value as CallbackPurpose)}
                      className="w-full bg-background border border-border/80 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold font-body text-foreground focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                    >
                      {PURPOSE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-1.5">
                  <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-0.5">
                    Additional Notes <span className="text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <div className="relative flex items-start">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Mention any specific queries or preferred topics..."
                      className="w-full bg-background border border-border/80 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold font-body text-foreground focus:outline-none focus:border-primary transition-all resize-none"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-body text-xs font-semibold">
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground py-3.5 rounded-xl font-heading text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Request Callback</span>
                </button>
              </form>
            </>
          ) : (
            /* Success confirmation screen */
            <div className="py-6 space-y-4 text-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading text-xl font-extrabold text-primary">
                  Callback Requested!
                </h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  The property host has been notified. They will call you on{" "}
                  <span className="font-bold text-primary">{phone}</span> on{" "}
                  <span className="font-bold text-primary">{date}</span> ({time}).
                </p>
              </div>
              <button
                type="button"
                data-no-intercept="true"
                onClick={handleResetAndClose}
                className="w-full bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground py-3 rounded-xl font-heading text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
