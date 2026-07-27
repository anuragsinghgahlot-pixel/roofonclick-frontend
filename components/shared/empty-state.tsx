"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ActionConfig {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  emoji?: string;
  title: string;
  description: string;
  primaryAction?: ActionConfig;
  secondaryAction?: ActionConfig;
  className?: string;
}

export function EmptyState({
  icon,
  emoji = "🏡",
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "bg-card border border-border/80 rounded-3xl p-8 sm:p-12 text-center shadow-premium space-y-5 max-w-lg mx-auto flex flex-col items-center justify-center",
        className
      )}
    >
      {/* Icon / Emoji Pill */}
      <div className="w-20 h-20 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary text-4xl shadow-sm select-none">
        {icon ? icon : <span>{emoji}</span>}
      </div>

      {/* Copy */}
      <div className="space-y-1.5 max-w-md">
        <h3 className="font-heading text-xl font-extrabold text-primary tracking-tight">
          {title}
        </h3>
        <p className="font-body text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action CTAs */}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full max-w-xs">
          {primaryAction && (
            primaryAction.href ? (
              <Link
                href={primaryAction.href}
                className="w-full bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground py-3 px-5 rounded-xl font-heading text-xs font-bold transition-all shadow-md text-center"
              >
                {primaryAction.label}
              </Link>
            ) : (
              <button
                type="button"
                data-no-intercept="true"
                onClick={primaryAction.onClick}
                className="w-full bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground py-3 px-5 rounded-xl font-heading text-xs font-bold transition-all shadow-md text-center cursor-pointer"
              >
                {primaryAction.label}
              </button>
            )
          )}

          {secondaryAction && (
            secondaryAction.href ? (
              <Link
                href={secondaryAction.href}
                className="w-full bg-card border border-border hover:bg-muted/40 text-foreground py-3 px-5 rounded-xl font-heading text-xs font-bold transition-all text-center"
              >
                {secondaryAction.label}
              </Link>
            ) : (
              <button
                type="button"
                data-no-intercept="true"
                onClick={secondaryAction.onClick}
                className="w-full bg-card border border-border hover:bg-muted/40 text-foreground py-3 px-5 rounded-xl font-heading text-xs font-bold transition-all text-center cursor-pointer"
              >
                {secondaryAction.label}
              </button>
            )
          )}
        </div>
      )}
    </motion.div>
  );
}
