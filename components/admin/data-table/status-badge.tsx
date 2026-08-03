"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { StatusType, StatusConfig } from "./types";

/* ─── Status Configuration Map ─── */
const STATUS_MAP: Record<StatusType, StatusConfig> = {
  pending: {
    label: "Pending",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-700",
    borderColor: "border-amber-500/20",
    dotColor: "bg-amber-500",
  },
  approved: {
    label: "Approved",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-500/20",
    dotColor: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    bgColor: "bg-destructive/10",
    textColor: "text-destructive",
    borderColor: "border-destructive/20",
    dotColor: "bg-destructive",
  },
  active: {
    label: "Active",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-500/20",
    dotColor: "bg-emerald-500",
  },
  inactive: {
    label: "Inactive",
    bgColor: "bg-muted/60",
    textColor: "text-muted-foreground",
    borderColor: "border-border/60",
    dotColor: "bg-muted-foreground",
  },
  blocked: {
    label: "Blocked",
    bgColor: "bg-destructive/10",
    textColor: "text-destructive",
    borderColor: "border-destructive/20",
    dotColor: "bg-destructive",
  },
  draft: {
    label: "Draft",
    bgColor: "bg-muted/60",
    textColor: "text-muted-foreground",
    borderColor: "border-border/60",
    dotColor: "bg-muted-foreground",
  },
  expired: {
    label: "Expired",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-600",
    borderColor: "border-orange-500/20",
    dotColor: "bg-orange-500",
  },
  verified: {
    label: "Verified",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-700",
    borderColor: "border-blue-500/20",
    dotColor: "bg-blue-500",
  },
  suspended: {
    label: "Suspended",
    bgColor: "bg-destructive/10",
    textColor: "text-destructive",
    borderColor: "border-destructive/20",
    dotColor: "bg-destructive",
  },
  processing: {
    label: "Processing",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-700",
    borderColor: "border-blue-500/20",
    dotColor: "bg-blue-500",
  },
};

/* ─── Status Badge Component ─── */
export function StatusBadge({
  status,
  label,
  size = "sm",
  className,
}: {
  status: StatusType;
  label?: string;
  size?: "xs" | "sm" | "md";
  className?: string;
}) {
  const config = STATUS_MAP[status] || STATUS_MAP.pending;
  const displayLabel = label || config.label;

  const sizeClasses = {
    xs: "text-[9px] px-1.5 py-0.5 gap-1",
    sm: "text-[10px] px-2.5 py-0.5 gap-1.5",
    md: "text-xs px-3 py-1 gap-1.5",
  };

  const dotSizes = {
    xs: "w-1 h-1",
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-heading font-extrabold uppercase tracking-wide border select-none",
        sizeClasses[size],
        config.bgColor,
        config.textColor,
        config.borderColor,
        className
      )}
    >
      <span
        className={cn(
          "rounded-full shrink-0",
          dotSizes[size],
          config.dotColor,
          status === "processing" || status === "pending" ? "animate-pulse" : ""
        )}
      />
      <span>{displayLabel}</span>
    </span>
  );
}

/** Helper to get status config for custom use */
export function getStatusConfig(status: StatusType): StatusConfig {
  return STATUS_MAP[status] || STATUS_MAP.pending;
}
