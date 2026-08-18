"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcon, WifiOff, AlertTriangle, ShieldAlert, FileQuestion, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActionConfig {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  variant?: "primary" | "secondary" | "outline";
}

export interface EmptyStateProps {
  title: React.ReactNode;
  description: React.ReactNode;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  emoji?: string;
  illustration?: React.ReactNode;
  primaryAction?: ActionConfig;
  secondaryAction?: ActionConfig;
  size?: "sm" | "md" | "lg";
  suggestions?: string[];
  preset?: "offline" | "serverError" | "permissionDenied" | "notFound";
  className?: string;
}

const PRESET_CONFIGS: Record<string, { icon: LucideIcon; title: string; description: string; primaryAction: ActionConfig }> = {
  offline: {
    icon: WifiOff,
    title: "No Internet Connection",
    description: "Please check your network settings and try reconnecting to the internet.",
    primaryAction: { label: "Retry Connection", onClick: () => window.location.reload() },
  },
  serverError: {
    icon: AlertTriangle,
    title: "Server Error",
    description: "We're experiencing temporary technical difficulties. Please try refreshing the page.",
    primaryAction: { label: "Refresh Page", onClick: () => window.location.reload() },
  },
  permissionDenied: {
    icon: ShieldAlert,
    title: "Access Denied",
    description: "You do not have authorization to view this page or management dashboard.",
    primaryAction: { label: "Back to Home", href: "/" },
  },
  notFound: {
    icon: FileQuestion,
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist or may have been moved.",
    primaryAction: { label: "Explore Properties", href: "/search" },
  },
};

export function EmptyState({
  title,
  description,
  icon: IconProp,
  emoji,
  illustration,
  primaryAction,
  secondaryAction,
  size = "md",
  suggestions,
  preset,
  className,
}: EmptyStateProps) {
  const presetConfig = preset ? PRESET_CONFIGS[preset] : null;

  const displayTitle = title || presetConfig?.title || "No Data Available";
  const displayDescription = description || presetConfig?.description || "";
  const IconComponent = IconProp || presetConfig?.icon;
  const activePrimaryAction = primaryAction || presetConfig?.primaryAction;

  const paddingClasses = {
    sm: "p-5 sm:p-6 space-y-3 max-w-sm",
    md: "p-8 sm:p-12 space-y-5 max-w-lg",
    lg: "p-10 sm:p-16 space-y-6 max-w-2xl",
  };

  const iconSizeClasses = {
    sm: "w-12 h-12 rounded-2xl text-lg",
    md: "w-16 h-16 sm:w-20 sm:h-20 rounded-3xl text-2xl",
    lg: "w-20 h-20 sm:w-24 sm:h-24 rounded-3xl text-3xl",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "bg-card border border-border/80 rounded-3xl text-center shadow-premium mx-auto flex flex-col items-center justify-center select-none",
        paddingClasses[size],
        className
      )}
    >
      {/* 1. Illustration or Floating Icon */}
      {illustration ? (
        <div className="w-full flex items-center justify-center">{illustration}</div>
      ) : (
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className={cn(
            "bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs",
            iconSizeClasses[size]
          )}
        >
          {IconComponent ? (
            <IconComponent className="w-1/2 h-1/2 text-primary shrink-0" />
          ) : emoji ? (
            <span>{emoji}</span>
          ) : (
            <span>🏡</span>
          )}
        </motion.div>
      )}

      {/* 2. Copy Heading & Subtitle */}
      <div className="space-y-1.5 max-w-md text-center">
        <h3 className="font-heading text-lg sm:text-xl font-extrabold text-primary tracking-tight leading-snug">
          {displayTitle}
        </h3>
        {displayDescription && (
          <p className="font-body text-xs text-muted-foreground leading-relaxed">
            {displayDescription}
          </p>
        )}
      </div>

      {/* 3. Suggestions List */}
      {suggestions && suggestions.length > 0 && (
        <div className="pt-2 text-left w-full max-w-xs space-y-1.5 bg-muted/30 border border-border/60 p-3.5 rounded-2xl">
          <span className="text-[10px] font-extrabold text-secondary uppercase tracking-widest block mb-1">
            Suggestions:
          </span>
          <ul className="space-y-1">
            {suggestions.map((suggestion, idx) => (
              <li key={idx} className="font-body text-xs text-muted-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. Action CTAs */}
      {(activePrimaryAction || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full max-w-xs">
          {activePrimaryAction && (
            activePrimaryAction.href ? (
              <Link
                href={activePrimaryAction.href}
                className="w-full bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground py-3 px-5 rounded-xl font-heading text-xs font-bold transition-all shadow-md text-center flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>{activePrimaryAction.label}</span>
                {activePrimaryAction.icon && (
                  <activePrimaryAction.icon className="w-4 h-4 shrink-0" />
                )}
              </Link>
            ) : (
              <button
                type="button"
                data-no-intercept="true"
                onClick={activePrimaryAction.onClick}
                className="w-full bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground py-3 px-5 rounded-xl font-heading text-xs font-bold transition-all shadow-md text-center cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <span>{activePrimaryAction.label}</span>
                {activePrimaryAction.icon && (
                  <activePrimaryAction.icon className="w-4 h-4 shrink-0" />
                )}
              </button>
            )
          )}

          {secondaryAction && (
            secondaryAction.href ? (
              <Link
                href={secondaryAction.href}
                className="w-full bg-card border border-border hover:bg-muted/40 text-foreground py-3 px-5 rounded-xl font-heading text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{secondaryAction.label}</span>
              </Link>
            ) : (
              <button
                type="button"
                data-no-intercept="true"
                onClick={secondaryAction.onClick}
                className="w-full bg-card border border-border hover:bg-muted/40 text-foreground py-3 px-5 rounded-xl font-heading text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <span>{secondaryAction.label}</span>
              </button>
            )
          )}
        </div>
      )}
    </motion.div>
  );
}
