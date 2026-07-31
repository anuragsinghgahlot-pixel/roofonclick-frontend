"use client";

import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useNavigation } from "@/providers/navigation-provider";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  label?: string;
  fallbackUrl?: string;
  className?: string;
}

export function BackButton({
  label = "Back",
  fallbackUrl = "/",
  className,
}: BackButtonProps) {
  const router = useRouter();
  const { sourceRoute } = useNavigation();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (sourceRoute) {
      router.push(sourceRoute);
    } else if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackUrl || "/");
    }
  };

  return (
    <motion.button
      type="button"
      data-no-intercept="true"
      onClick={handleBack}
      whileHover={{ x: -3 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-card border border-border/80 text-muted-foreground hover:text-primary hover:border-border font-heading text-xs font-bold transition-all shadow-xs cursor-pointer select-none shrink-0",
        className
      )}
      aria-label={label}
    >
      <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary shrink-0" />
      <span>{label}</span>
    </motion.button>
  );
}

export default BackButton;
