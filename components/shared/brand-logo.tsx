"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
  onClick?: () => void;
}

export function BrandLogo({
  className,
  showText = true,
  textClassName,
  onClick,
}: BrandLogoProps) {
  return (
    <div
      onClick={onClick}
      className={cn("inline-flex items-center gap-2 select-none cursor-pointer group", className)}
    >
      {/* Brand Icon */}
      <div className="relative shrink-0 flex items-center justify-center">
        <Image
          src="/logos/roofonclick-brand-logo.png"
          alt="RoofOnClick Logo"
          width={176}
          height={176}
          priority
          quality={100}
          className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Vertical Divider */}
      {showText && (
        <div className="h-6 sm:h-7 w-[1px] bg-border/80 dark:bg-border/60 shrink-0" />
      )}

      {/* Stacked Brand Wordmark Text: Roof on Top & On Click (golden) Below with 4px gap */}
      {showText && (
        <div className={cn("flex flex-col justify-center select-none text-left leading-none gap-[4px]", textClassName)}>
          <span className="font-heading text-sm sm:text-[15px] md:text-base font-black tracking-tight text-primary leading-none">
            Roof
          </span>
          <span className="font-heading text-xs sm:text-[12px] md:text-[13px] font-black tracking-tight text-secondary leading-none">
            On Click
          </span>
        </div>
      )}
    </div>
  );
}

export default BrandLogo;
