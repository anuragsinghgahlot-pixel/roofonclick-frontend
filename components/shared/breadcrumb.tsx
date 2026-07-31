"use client";

import * as React from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import { cn } from "@/lib/utils";

interface BreadcrumbProps {
  customLabel?: string;
  className?: string;
}

export function Breadcrumb({ customLabel, className }: BreadcrumbProps) {
  const items = useBreadcrumbs(customLabel);

  if (items.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className={cn(
        "hidden md:flex items-center gap-1.5 font-body text-xs text-muted-foreground max-w-[260px] md:max-w-[380px] lg:max-w-[500px] overflow-hidden truncate",
        className
      )}
    >
      {items.map((item, index) => {
        const isFirst = index === 0;

        return (
          <React.Fragment key={item.href}>
            {index > 0 && (
              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground/50" />
            )}

            {item.isCurrent ? (
              <span
                className="font-semibold text-primary truncate max-w-[120px] sm:max-w-[220px]"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                data-no-intercept="true"
                className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
              >
                {isFirst && <Home className="w-3.5 h-3.5 text-secondary shrink-0" />}
                <span>{item.label}</span>
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
