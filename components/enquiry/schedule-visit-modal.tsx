"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, Phone, X, CheckCircle } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { EnquiryService, EnquiryRequest } from "@/services/enquiry";
import { toast } from "sonner";

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyName: string;
}

export function ScheduleVisitModal({
  isOpen,
  onClose,
  propertyId,
  propertyName,
}: ScheduleVisitModalProps) {
  const { user } = useAuth();

  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("11:00 AM");
  const [name, setName] = React.useState(user?.name || "");
  const [phone, setPhone] = React.useState(user?.phone || "");
  const [notes, setNotes] = React.useState("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [createdRequest, setCreatedRequest] = React.useState<EnquiryRequest | null>(null);

  // Compute minimum date (Today's date in YYYY-MM-DD format)
  const todayISO = React.useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!date) {
      setError("Please select a preferred visit date.");
      return;
    }

    if (date < todayISO) {
      setError("Visit date cannot be in the past.");
      return;
    }

    if (!time) {
      setError("Please select a preferred time.");
      return;
    }

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter a valid phone number.");
      return;
    }

    const req = EnquiryService.createRequest({
      propertyId,
      propertyName,
      buyerName: name.trim(),
      buyerEmail: user?.email || "",
      buyerPhone: phone.trim(),
      requestType: "Visit",
      preferredDate: date,
      preferredTime: time,
      notes: notes.trim(),
    });

    setCreatedRequest(req);
    setIsSubmitted(true);
    toast.success("Visit scheduled successfully! The owner will confirm shortly.");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card border border-border/80 p-6 sm:p-8 rounded-3xl max-w-lg w-full shadow-premium text-left space-y-6 relative"
        >
          {/* Close button */}
          <button
            type="button"
            data-no-intercept="true"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="space-y-1">
                <span className="font-heading text-xs font-extrabold text-secondary uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  In-Person Inspection
                </span>
                <h3 className="font-heading text-xl font-extrabold text-primary">
                  Schedule Property Visit
                </h3>
                <p className="font-body text-xs text-muted-foreground truncate">
                  {propertyName}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Preferred Date */}
                  <div className="space-y-1.5">
                    <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary">
                      Preferred Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={todayISO}
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setError(null);
                      }}
                      className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold font-body text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
                    />
                  </div>

                  {/* Preferred Time */}
                  <div className="space-y-1.5">
                    <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary">
                      Preferred Time <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={time}
                      onChange={(e) => {
                        setTime(e.target.value);
                        setError(null);
                      }}
                      className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold font-body text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
                    >
                      <option value="10:00 AM">10:00 AM (Morning)</option>
                      <option value="11:30 AM">11:30 AM (Morning)</option>
                      <option value="02:00 PM">02:00 PM (Afternoon)</option>
                      <option value="04:30 PM">04:30 PM (Evening)</option>
                      <option value="06:00 PM">06:00 PM (Evening)</option>
                    </select>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setError(null);
                      }}
                      placeholder="e.g. John Doe"
                      className="w-full bg-background border border-border/80 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold font-body text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setError(null);
                      }}
                      placeholder="+91 98765 43210"
                      className="w-full bg-background border border-border/80 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold font-body text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary">
                    Additional Notes <span className="text-muted-foreground/60 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Specific questions or room type preference..."
                    className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold font-body text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-body text-xs font-semibold">
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  data-no-intercept="true"
                  className="w-full bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground py-3 rounded-xl font-heading text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Confirm Visit Request</span>
                </button>
              </form>
            </>
          ) : (
            /* Success View */
            <div className="text-center py-4 space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="font-heading text-xl font-extrabold text-primary">
                  Visit Requested!
                </h4>
                <p className="font-body text-xs text-muted-foreground max-w-sm mx-auto">
                  Your visit request has been sent to the property owner. You will receive a confirmation alert once approved.
                </p>
              </div>

              <div className="bg-muted/30 border border-border/60 p-4 rounded-2xl text-left text-xs font-body space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Property:</span>
                  <span className="font-bold text-primary truncate max-w-[200px]">{propertyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Date & Time:</span>
                  <span className="font-bold text-primary">{createdRequest?.preferredDate} at {createdRequest?.preferredTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Contact:</span>
                  <span className="font-bold text-primary">{createdRequest?.buyerName} ({createdRequest?.buyerPhone})</span>
                </div>
              </div>

              <button
                type="button"
                data-no-intercept="true"
                onClick={onClose}
                className="w-full bg-primary hover:bg-accent text-primary-foreground py-3 rounded-xl font-heading text-xs font-bold transition-all shadow-md cursor-pointer"
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
