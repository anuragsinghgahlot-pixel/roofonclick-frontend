"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Sparkles, Send, Check } from "lucide-react";
import { Portal } from "@/components/shared/portal";
import { showToast } from "@/lib/toast";

const REVIEW_PROMPT_STORAGE_KEY = "roofonclick_last_review_prompt";
export const REVIEW_TRIGGER_EVENT = "roofonclick_trigger_review_modal";

export function PlatformReviewModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [rating, setRating] = React.useState<number>(5);
  const [hoverRating, setHoverRating] = React.useState<number>(0);
  const [feedbackText, setFeedbackText] = React.useState("");

  React.useEffect(() => {
    const handleTrigger = () => {
      const lastPrompt = localStorage.getItem(REVIEW_PROMPT_STORAGE_KEY);
      if (lastPrompt) {
        const weeksPassed = (Date.now() - parseInt(lastPrompt, 10)) / (1000 * 60 * 60 * 24 * 7);
        if (weeksPassed < 2) return; // Prevent spamming within 2 weeks
      }
      setIsOpen(true);
    };

    window.addEventListener(REVIEW_TRIGGER_EVENT, handleTrigger);
    return () => window.removeEventListener(REVIEW_TRIGGER_EVENT, handleTrigger);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(REVIEW_PROMPT_STORAGE_KEY, Date.now().toString());
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setHasSubmitted(true);
      localStorage.setItem(REVIEW_PROMPT_STORAGE_KEY, Date.now().toString());
      showToast.success("Thank you!", "Your feedback helps improve RoofOnClick for everyone.");

      setTimeout(() => {
        setIsOpen(false);
        setHasSubmitted(false);
        setFeedbackText("");
      }, 1500);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <AnimatePresence>
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-background/70 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md bg-card border border-border/80 rounded-3xl p-6 shadow-2xl z-10 text-left overflow-hidden"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close"
              className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {hasSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-extrabold text-primary">
                  Feedback Received!
                </h3>
                <p className="font-body text-xs text-muted-foreground">
                  Thank you for helping us make RoofOnClick better.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-extrabold text-primary">
                      Enjoying RoofOnClick?
                    </h3>
                    <p className="font-body text-xs text-muted-foreground">
                      We&apos;d love to hear your feedback on your stay discovery experience.
                    </p>
                  </div>
                </div>

                {/* Interactive Star Rating */}
                <div className="flex items-center justify-center gap-2 py-2 border-y border-border/60">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Text area */}
                <div className="space-y-1">
                  <label className="font-heading text-xs font-bold text-foreground">
                    Your Thoughts (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us what you loved or how we can improve..."
                    className="w-full p-3 rounded-2xl bg-muted/30 border border-border/80 focus:outline-none focus:border-primary/40 font-body text-xs text-foreground resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground py-2.5 px-4 rounded-xl font-heading text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Submitting..." : "⭐ Leave a Review"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="py-2.5 px-4 rounded-xl font-heading text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    Later
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </AnimatePresence>
    </Portal>
  );
}
