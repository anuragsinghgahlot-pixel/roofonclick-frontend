"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { useAuth } from "@/providers/auth-provider";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

export default function RoleSelectionPage() {
  const router = useRouter();
  const { setRole } = useAuth();
  const [selectedRole, setSelectedRole] = React.useState<"buyer" | "owner" | null>(null);

  const handleRoleSelect = (role: "buyer" | "owner") => {
    setSelectedRole(role);
    setRole(role);

    // Auto-navigate after a short delay for selection animation feedback
    setTimeout(() => {
      if (role === "buyer") {
        router.push("/");
      } else {
        router.push("/owner/dashboard");
      }
    }, 550);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-6 relative overflow-hidden">
      <title>Onboarding | RoofOnClick</title>
      {/* Background ambient radial highlights */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <Container className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Onboarding Step Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: PREMIUM_EASE }}
          className="flex flex-col items-center gap-2 mb-8"
        >
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary bg-secondary/10 px-3 py-1 rounded-full">
            Step 1 of 2
          </span>
          <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden mt-1">
            <div className="w-1/2 h-full bg-secondary rounded-full" />
          </div>
        </motion.div>

        {/* Headings */}
        <div className="text-center max-w-2xl mb-12 flex flex-col gap-3">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: PREMIUM_EASE }}
            className="font-heading text-3xl sm:text-4xl font-extrabold text-primary tracking-tight"
          >
            Welcome to RoofOnClick 🎉
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: PREMIUM_EASE }}
            className="font-body text-sm sm:text-base text-muted-foreground"
          >
            Your account has been created successfully. Let&apos;s personalize your experience in less than 10 seconds.
          </motion.p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Card 1: Buyer */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: PREMIUM_EASE }}
            onClick={() => handleRoleSelect("buyer")}
            className={cn(
              "group bg-card border border-border/80 rounded-[28px] p-8 flex flex-col justify-between text-left cursor-pointer transition-all duration-300 relative overflow-hidden select-none",
              selectedRole === "buyer"
                ? "border-primary ring-2 ring-primary/20 shadow-2xl scale-[0.98]"
                : "hover:border-primary hover:shadow-xl hover:scale-[1.01]"
            )}
          >
            {/* Top Info */}
            <div className="flex flex-col gap-4">
              <span className="text-5xl group-hover:scale-110 transition-transform duration-300 block select-none">
                🏠
              </span>
              <div>
                <h3 className="font-heading text-xl font-extrabold text-primary group-hover:text-primary transition-colors">
                  I&apos;m Looking for a Stay
                </h3>
                <p className="font-body text-xs text-muted-foreground mt-2 leading-relaxed">
                  Explore verified PGs, hostels, co-living spaces and rental properties.
                </p>
              </div>

              {/* Features List */}
              <ul className="flex flex-col gap-2.5 mt-6 border-t border-border/60 pt-6">
                {[
                  "Search verified stays",
                  "Save favourites",
                  "Contact owners",
                  "Book confidently",
                ].map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5 font-body text-xs font-semibold text-primary">
                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <div className="mt-8 pt-4">
              <button
                className={cn(
                  "w-full py-3.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider transition-all duration-300 pointer-events-none select-none",
                  selectedRole === "buyer"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md"
                )}
              >
                Continue as Buyer
              </button>
            </div>
          </motion.div>

          {/* Card 2: Owner */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: PREMIUM_EASE }}
            onClick={() => handleRoleSelect("owner")}
            className={cn(
              "group bg-card border border-border/80 rounded-[28px] p-8 flex flex-col justify-between text-left cursor-pointer transition-all duration-300 relative overflow-hidden select-none",
              selectedRole === "owner"
                ? "border-primary ring-2 ring-primary/20 shadow-2xl scale-[0.98]"
                : "hover:border-primary hover:shadow-xl hover:scale-[1.01]"
            )}
          >
            {/* Top Info */}
            <div className="flex flex-col gap-4">
              <span className="text-5xl group-hover:scale-110 transition-transform duration-300 block select-none">
                🏢
              </span>
              <div>
                <h3 className="font-heading text-xl font-extrabold text-primary group-hover:text-primary transition-colors">
                  I&apos;m a Property Owner
                </h3>
                <p className="font-body text-xs text-muted-foreground mt-2 leading-relaxed">
                  List your property, manage enquiries and grow your occupancy.
                </p>
              </div>

              {/* Features List */}
              <ul className="flex flex-col gap-2.5 mt-6 border-t border-border/60 pt-6">
                {[
                  "List properties",
                  "Manage bookings",
                  "Track performance",
                  "Reach more tenants",
                ].map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5 font-body text-xs font-semibold text-primary">
                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <div className="mt-8 pt-4">
              <button
                className={cn(
                  "w-full py-3.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider transition-all duration-300 pointer-events-none select-none",
                  selectedRole === "owner"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md"
                )}
              >
                Continue as Owner
              </button>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
