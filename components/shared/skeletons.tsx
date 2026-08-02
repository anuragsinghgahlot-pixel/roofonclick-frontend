"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

/**
 * 1. Primitive Skeleton with Shimmer Animation, ARIA support, and reduced motion fallback.
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-xl bg-muted/60 dark:bg-muted/30 relative overflow-hidden select-none motion-reduce:animate-none",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent motion-reduce:before:hidden",
        className
      )}
      {...props}
    />
  );
}

/**
 * 2. SkeletonText - Text line skeleton
 */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2.5 w-full", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, idx) => (
        <Skeleton
          key={idx}
          className={cn(
            "h-3.5 rounded-md",
            idx === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

/**
 * 3. SkeletonCard - Generic Card container skeleton
 */
export function SkeletonCard({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className={cn("bg-card border border-border/80 p-5 rounded-2xl shadow-xs space-y-4 text-left w-full", className)}
    >
      {children || (
        <>
          <Skeleton className="w-1/3 h-4 rounded-md" />
          <SkeletonText lines={3} />
          <Skeleton className="w-full h-10 rounded-xl" />
        </>
      )}
    </div>
  );
}

/**
 * 4. SkeletonAvatar - Circular or rounded avatar
 */
export function SkeletonAvatar({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };
  return <Skeleton className={cn("rounded-full shrink-0", sizeClasses[size], className)} aria-hidden="true" />;
}

/**
 * 5. SkeletonButton - Button skeleton
 */
export function SkeletonButton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-11 w-28 rounded-xl shrink-0", className)} aria-hidden="true" />;
}

/**
 * 6. SkeletonImage / LazyImage - Image component with Skeleton placeholder to prevent CLS layout shift
 */
export function SkeletonImage({
  src,
  alt,
  className,
  containerClassName,
  aspectRatio = "aspect-[4/3]",
}: {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
}) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-muted/60", aspectRatio, containerClassName)}>
      {!isLoaded && <Skeleton className="absolute inset-0 w-full h-full rounded-none z-10" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
      />
    </div>
  );
}

/**
 * 7. SkeletonPropertyCard - 1-to-1 matching skeleton for PropertyCard
 */
export function SkeletonPropertyCard({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("bg-card border border-border/80 rounded-2xl overflow-hidden shadow-xs flex flex-col w-full", className)}>
      <div className="relative aspect-[4/3] w-full bg-muted/60">
        <Skeleton className="w-full h-full rounded-none" />
        <Skeleton className="absolute top-3 left-3 w-16 h-5 rounded-md" />
        <Skeleton className="absolute top-3 right-3 w-20 h-5 rounded-md" />
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4 text-left">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="w-24 h-3.5 rounded-md" />
            <Skeleton className="w-10 h-4 rounded-md" />
          </div>
          <Skeleton className="w-3/4 h-5 rounded-md mt-1" />
          <Skeleton className="w-1/2 h-3.5 rounded-md" />
        </div>

        <div className="pt-3 border-t border-border/60 flex items-center justify-between">
          <Skeleton className="w-24 h-6 rounded-full" />
          <Skeleton className="w-20 h-6 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/**
 * 8. SkeletonReview - Customer review skeleton
 */
export function SkeletonReview() {
  return (
    <div aria-hidden="true" className="bg-card border border-border/80 p-5 rounded-2xl shadow-xs space-y-4 text-left w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SkeletonAvatar size="md" />
          <div className="space-y-1.5">
            <Skeleton className="w-28 h-4 rounded-md" />
            <Skeleton className="w-20 h-3 rounded-md" />
          </div>
        </div>
        <Skeleton className="w-16 h-4 rounded-md" />
      </div>

      <SkeletonText lines={2} />
    </div>
  );
}

/**
 * 9. SkeletonOwnerCard - Host owner card skeleton
 */
export function SkeletonOwnerCard() {
  return (
    <div aria-hidden="true" className="w-full rounded-[24px] bg-card border border-border/80 p-6 shadow-md space-y-6 text-left">
      <div className="flex items-center gap-4">
        <SkeletonAvatar size="lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="w-32 h-5 rounded-md" />
          <Skeleton className="w-24 h-3.5 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 py-4 border-y border-border/60">
        <Skeleton className="h-10 rounded-lg" />
        <Skeleton className="h-10 rounded-lg" />
        <Skeleton className="h-10 rounded-lg" />
      </div>

      <div className="space-y-2">
        <Skeleton className="w-full h-11 rounded-xl" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/**
 * 10. SkeletonDashboardCard - Owner dashboard stat card skeleton
 */
export function SkeletonDashboardCard() {
  return (
    <div aria-hidden="true" className="bg-card border border-border/80 p-5 rounded-2xl shadow-xs space-y-3 text-left w-full">
      <div className="flex items-center justify-between">
        <Skeleton className="w-24 h-3.5 rounded-md" />
        <Skeleton className="w-9 h-9 rounded-xl" />
      </div>
      <Skeleton className="w-20 h-7 rounded-md" />
      <Skeleton className="w-32 h-3 rounded-md" />
    </div>
  );
}

/**
 * 11. SkeletonTable - Table rows skeleton
 */
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div aria-hidden="true" className="w-full bg-card border border-border/80 rounded-2xl overflow-hidden text-left shadow-xs">
      <div className="bg-muted/40 p-4 border-b border-border/60 flex items-center justify-between">
        <Skeleton className="w-32 h-4 rounded-md" />
        <Skeleton className="w-24 h-4 rounded-md" />
      </div>
      <div className="divide-y divide-border/60">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="w-44 h-4 rounded-md" />
                <Skeleton className="w-28 h-3 rounded-md" />
              </div>
            </div>
            <Skeleton className="w-20 h-8 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 12. SkeletonGallery - 4-photo gallery grid skeleton
 */
export function SkeletonGallery() {
  return (
    <div aria-hidden="true" className="grid grid-cols-1 md:grid-cols-4 gap-3.5 h-[340px] md:h-[440px] w-full">
      <Skeleton className="md:col-span-2 md:row-span-2 rounded-2xl" />
      <Skeleton className="rounded-2xl hidden md:block" />
      <Skeleton className="rounded-2xl hidden md:block" />
      <Skeleton className="rounded-2xl hidden md:block" />
      <Skeleton className="rounded-2xl hidden md:block" />
    </div>
  );
}

/**
 * 13. SkeletonProfile - Profile and settings page skeleton
 */
export function SkeletonProfile() {
  return (
    <div aria-hidden="true" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full text-left">
      <div className="lg:col-span-4 bg-card border border-border/80 p-6 rounded-3xl space-y-5 flex flex-col items-center text-center">
        <SkeletonAvatar size="xl" />
        <Skeleton className="w-36 h-5 rounded-md" />
        <Skeleton className="w-28 h-4 rounded-md" />
        <Skeleton className="w-full h-11 rounded-xl mt-2" />
      </div>

      <div className="lg:col-span-8 bg-card border border-border/80 p-6 sm:p-8 rounded-3xl space-y-6">
        <Skeleton className="w-40 h-6 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
        <Skeleton className="w-32 h-11 rounded-xl ml-auto" />
      </div>
    </div>
  );
}

/**
 * 14. SkeletonSearchResults - Search page skeleton
 */
export function SkeletonSearchResults() {
  return (
    <div aria-hidden="true" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start w-full text-left">
      <div className="hidden md:block md:col-span-4 lg:col-span-3 space-y-6">
        <div className="bg-card border border-border/80 p-5 rounded-2xl space-y-4 shadow-xs">
          <Skeleton className="w-32 h-5 rounded-md" />
          <Skeleton className="w-full h-10 rounded-xl" />
          <Skeleton className="w-full h-24 rounded-xl" />
          <Skeleton className="w-full h-32 rounded-xl" />
        </div>
      </div>

      <div className="md:col-span-8 lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonPropertyCard key={idx} />
        ))}
      </div>
    </div>
  );
}

/**
 * 15. SkeletonHero - Homepage Hero skeleton
 */
export function SkeletonHero() {
  return (
    <div aria-hidden="true" className="grid lg:grid-cols-12 gap-8 items-center w-full text-left py-8">
      <div className="lg:col-span-7 space-y-6">
        <Skeleton className="w-48 h-8 rounded-full" />
        <Skeleton className="w-4/5 h-14 rounded-2xl" />
        <Skeleton className="w-3/4 h-5 rounded-md" />
        <Skeleton className="w-full max-w-xl h-16 rounded-2xl" />
      </div>
      <div className="lg:col-span-5">
        <Skeleton className="w-full aspect-[4/3] rounded-3xl" />
      </div>
    </div>
  );
}

/**
 * 16. SkeletonPropertyDetails - Property details page skeleton
 */
export function SkeletonPropertyDetails() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-8 md:gap-12 w-full text-left">
      <div className="space-y-4">
        <Skeleton className="w-24 h-6 rounded-full" />
        <Skeleton className="w-3/4 max-w-2xl h-10 rounded-xl" />
        <Skeleton className="w-1/2 max-w-md h-4 rounded-md" />
      </div>

      <SkeletonGallery />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Skeleton className="w-full h-32 rounded-2xl" />
          <Skeleton className="w-full h-48 rounded-2xl" />
          <Skeleton className="w-full h-64 rounded-2xl" />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <SkeletonOwnerCard />
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable Loading Button Component with Spinner and Width Preservation
 */
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function LoadingButton({
  isLoading = false,
  loadingText,
  disabled,
  className,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "relative inline-flex items-center justify-center transition-all duration-200 select-none",
        isLoading && "cursor-not-allowed opacity-90",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>{loadingText || children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

/**
 * Export Aliases for backwards compatibility
 */
export const PropertyCardSkeleton = SkeletonPropertyCard;
export const SearchPageSkeleton = SkeletonSearchResults;
