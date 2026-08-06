"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { Portal } from "@/components/shared/portal";

const STORAGE_KEY = "roofonclick_guest_prompt_dismissed";

export function GuestAuthPromptModal() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role } = useAuth();
  const [isVisible, setIsVisible] = React.useState(false);

  // Hide on auth routes or for any authenticated user (buyer, owner, admin)
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/auth");

  const isUserAuthenticated = Boolean(user || role);

  React.useEffect(() => {
    if (isUserAuthenticated || isAuthRoute) return;

    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem(STORAGE_KEY);
    if (isDismissed === "true") return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const scrollPercent = (window.scrollY / scrollHeight) * 100;

      // Show when scrolled approx 40% of the page
      if (scrollPercent >= 40) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isUserAuthenticated, isAuthRoute]);

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  const handleSignUp = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
    router.push("/signup");
  };

  if (!isVisible || isUserAuthenticated || isAuthRoute) return null;

  return (
    <Portal>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:w-[380px] z-[1100] bg-card/95 backdrop-blur-xl border border-primary/20 rounded-3xl p-5 shadow-2xl text-left select-none overflow-hidden"
          data-no-intercept="true"
        >
          {/* Top subtle glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close modal"
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-heading text-sm font-extrabold text-primary">
              Unlock More with RoofOnClick
            </h3>
          </div>

          <p className="font-body text-xs text-muted-foreground mb-3 leading-relaxed">
            Create a free account or sign in to get full access to Indore&apos;s verified stays:
          </p>

          {/* Perks list */}
          <ul className="space-y-1.5 mb-4 text-xs font-heading font-semibold text-foreground/90">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Save favorite properties to Wishlist</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Compare room pricing &amp; amenities side-by-side</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Get personalized location recommendations</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Book visits &amp; connect with verified owners</span>
            </li>
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleSignUp}
              className="flex-1 bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground py-2.5 px-4 rounded-xl font-heading text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Sign In / Sign Up</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="py-2.5 px-3 rounded-xl font-heading text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
            >
              Maybe Later
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </Portal>
  );
}
