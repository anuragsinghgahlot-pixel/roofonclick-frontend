"use client";

import * as React from "react";
import { BackButton } from "@/components/shared/back-button";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  showBack?: boolean;
  backFallbackUrl?: string;
  showBreadcrumb?: boolean;
  customBreadcrumbLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  showBack = true,
  backFallbackUrl = "/",
  showBreadcrumb = true,
  customBreadcrumbLabel,
  className,
  children,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3 pb-4 sm:pb-6 mb-6 border-b border-border/80 text-left", className)}>
      {/* Row 1: Back Button (placed safely below fixed Navbar) */}
      {showBack && (
        <div className="flex items-center justify-between w-full">
          <BackButton fallbackUrl={backFallbackUrl} />
          {showBreadcrumb && <Breadcrumb customLabel={customBreadcrumbLabel} />}
        </div>
      )}

      {/* Row 2: Page Title & Badge / Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-primary tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <div className="font-body text-xs sm:text-base text-muted-foreground">
              {subtitle}
            </div>
          )}
        </div>
        {badge && <div className="mt-1 sm:mt-0 shrink-0">{badge}</div>}
      </div>

      {children}
    </div>
  );
}

export default PageHeader;
