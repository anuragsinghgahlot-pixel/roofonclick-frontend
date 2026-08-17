"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellRing, X, Sparkles } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { PushNotificationService } from "@/services/push-notification";

const DISMISSED_KEY = "roofonclick_push_prompt_dismissed";

export function PushNotificationPrompt() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = React.useState(false);
  const [isSubscribing, setIsSubscribing] = React.useState(false);

  React.useEffect(() => {
    // Only prompt authenticated users if push is supported and permission is 'default' (unasked)
    if (!user) return;
    if (!PushNotificationService.isSupported()) return;

    if (Notification.permission === "default") {
      const isDismissed = sessionStorage.getItem(DISMISSED_KEY);
      if (!isDismissed) {
        // Show after 2.5 seconds for a polite, non-blocking onboarding experience
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 2500);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const handleEnable = async () => {
    setIsSubscribing(true);
    try {
      const ok = await PushNotificationService.subscribe();
      if (ok) {
        setIsVisible(false);
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem(DISMISSED_KEY, "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 right-5 z-[999] max-w-sm w-[calc(100vw-40px)] sm:w-96 rounded-3xl bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl p-4 sm:p-5 select-none overflow-hidden text-left"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss prompt"
            className="absolute top-3.5 right-3.5 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>

            <div className="space-y-1 pr-4 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-heading text-sm font-extrabold text-foreground truncate">
                  Enable Device Notifications
                </h4>
                <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
              </div>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                Receive instant lock-screen alerts for booking confirmations, visits, and property updates even when the browser is closed.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 mt-4 pt-3 border-t border-border/60">
            <button
              type="button"
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-xl text-xs font-heading font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Maybe Later
            </button>
            <button
              type="button"
              onClick={handleEnable}
              disabled={isSubscribing}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-heading font-extrabold shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubscribing ? "Enabling..." : "Allow Notifications"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
