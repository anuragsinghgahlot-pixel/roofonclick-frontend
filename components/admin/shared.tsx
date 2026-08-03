"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

/* ─── Page Header ─── */
export function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
        className
      )}
    >
      <div className="space-y-1 min-w-0">
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary tracking-tight truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}

/* ─── Section Card ─── */
export function SectionCard({
  title,
  subtitle,
  icon: Icon,
  actions,
  children,
  className,
  noPadding = false,
}: {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden",
        className
      )}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border/40">
          <div className="flex items-center gap-3 min-w-0">
            {Icon && (
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Icon className="w-[18px] h-[18px]" />
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="font-heading text-sm font-bold text-foreground truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="font-body text-[11px] text-muted-foreground mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-2 shrink-0">{actions}</div>
          )}
        </div>
      )}
      <div className={cn(!noPadding && "p-5")}>{children}</div>
    </div>
  );
}

/* ─── Stat Card ─── */
export function StatCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  className,
}: {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
  className?: string;
}) {
  const changeColors = {
    positive: "text-emerald-600 bg-emerald-500/10",
    negative: "text-destructive bg-destructive/10",
    neutral: "text-muted-foreground bg-muted/60",
  };

  return (
    <div
      className={cn(
        "bg-card border border-border/60 rounded-2xl p-5 flex flex-col gap-3 hover:border-primary/30 transition-all group",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-body text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
            <Icon className="w-[18px] h-[18px]" />
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className="font-heading text-3xl font-extrabold text-foreground tracking-tight leading-none">
          {value}
        </span>
        {change && (
          <span
            className={cn(
              "font-heading text-[10px] font-extrabold px-2 py-0.5 rounded-lg",
              changeColors[changeType]
            )}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Admin Page Container ─── */
export function AdminPageContainer({
  children,
  className,
  maxWidth = "1600px",
}: {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}) {
  return (
    <div
      className={cn(
        "w-full mx-auto space-y-6 sm:space-y-8 transition-all duration-300",
        className
      )}
      style={{ maxWidth }}
    >
      {children}
    </div>
  );
}

