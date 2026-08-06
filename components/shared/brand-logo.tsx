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
      className={cn("inline-flex items-center gap-[12px] select-none cursor-pointer", className)}
    >
      {/* Brand Icon Image with Dark Mode Adaptation & Retina Sharpness */}
      <div className="relative shrink-0 flex items-center justify-center">
        <Image
          src="/logos/roofonclick-brand-logo.png"
          alt="RoofOnClick Logo"
          width={176}
          height={176}
          priority
          quality={100}
          className="h-[34px] md:h-[38px] lg:h-[44px] w-auto object-contain transition-all duration-300 dark:brightness-125 dark:contrast-110"
        />
      </div>

      {/* Brand Wordmark Text */}
      {showText && (
        <span
          className={cn(
            "font-heading text-xl sm:text-2xl font-extrabold text-primary tracking-tight leading-none",
            textClassName
          )}
        >
          RoofOnClick
        </span>
      )}
    </div>
  );
}

export default BrandLogo;
