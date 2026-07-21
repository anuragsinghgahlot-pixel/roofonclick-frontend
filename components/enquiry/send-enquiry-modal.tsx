"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, User, Phone, X, CheckCircle, Send } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { EnquiryService } from "@/services/enquiry";
import { toast } from "sonner";

interface SendEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyName: string;
}

const QUICK_SUGGESTIONS = [
  "Is this property available?",
  "Is food included?",
  "Is parking available?",
  "Can I schedule a visit?",
  "Is rent negotiable?",
];

export function SendEnquiryModal({
  isOpen,
  onClose,
  propertyId,
  propertyName,
}: SendEnquiryModalProps) {
  const { user } = useAuth();

  const [message, setMessage] = React.useState("");
  const [name, setName] = React.useState(user?.name || "");
  const [phone, setPhone] = React.useState(user?.phone || "");
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectSuggestion = (suggestion: string) => {
    setMessage((prev) => {
      if (!prev.trim()) return suggestion;
      return `${prev} ${suggestion}`;
    });
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!message.trim()) {
      setError("Please enter your message or select a quick question.");
      return;
    }

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    EnquiryService.createRequest({
      propertyId,
      propertyName,
      buyerName: name.trim(),
      buyerEmail: user?.email || "",
      buyerPhone: phone.trim(),
      requestType: "Enquiry",
      message: message.trim(),
    });

    setIsSubmitted(true);
    toast.success("Enquiry sent successfully to the property owner!");
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
                  <MessageSquare className="w-4 h-4" />
                  Direct Owner Contact
                </span>
                <h3 className="font-heading text-xl font-extrabold text-primary">
                  Send Enquiry
                </h3>
                <p className="font-body text-xs text-muted-foreground truncate">
                  {propertyName}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Quick Suggestion Chips */}
                <div className="space-y-1.5">
                  <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">
                    Quick Questions
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_SUGGESTIONS.map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        data-no-intercept="true"
                        onClick={() => handleSelectSuggestion(suggestion)}
                        className="text-[11px] font-semibold font-body bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 px-3 py-1 rounded-xl transition-all cursor-pointer"
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="space-y-1.5">
                  <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary">
                    Your Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setError(null);
                    }}
                    placeholder="Type your message here or pick a quick question above..."
                    className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold font-body text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary">
                      Your Name <span className="text-rose-500">*</span>
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
                        placeholder="John Doe"
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
                  <Send className="w-4 h-4" />
                  <span>Send Message to Owner</span>
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
                  Enquiry Sent!
                </h4>
                <p className="font-body text-xs text-muted-foreground max-w-sm mx-auto">
                  Your message has been delivered directly to the owner. They will reach out via phone or email soon.
                </p>
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
