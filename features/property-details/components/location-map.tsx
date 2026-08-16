"use client";

import * as React from "react";
import { MapPin, Compass, ShieldCheck, Lock, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";

export interface LocationMapProps {
  address: string;
  area?: string;
  city?: string;
  landmark?: string;
  className?: string;
}

export function LocationMap({
  address = "Scheme 54, Vijay Nagar, Indore, MP 452010",
  area,
  city,
  landmark,
  className,
}: LocationMapProps) {
  const [isCopied, setIsCopied] = React.useState(false);

  const displayArea = area || "Vijay Nagar";
  const displayCity = city || "Indore";

  const handleCopyLocality = () => {
    const textToCopy = `${displayArea}, ${displayCity}`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    showToast.success("Locality Copied! 📍", `${textToCopy} copied to clipboard.`);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={cn("space-y-4 text-left select-none", className)}>
      {/* ── 1. Section Header ── */}
      <div className="flex flex-col gap-1">
        <span className="font-heading text-xs font-extrabold uppercase tracking-widest text-secondary flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5" /> Property Locality
        </span>
        <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
          Location & Neighborhood
        </h2>
      </div>

      {/* ── 2. Text-Based Location Card ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-card border border-border/80 shadow-premium space-y-4">
        
        {/* Locality & City Display */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                Locality & City
              </span>
              <h3 className="font-heading text-lg font-extrabold text-primary">
                {displayArea}, {displayCity}
              </h3>
            </div>
          </div>

          <button
            type="button"
            data-no-intercept="true"
            onClick={handleCopyLocality}
            className="px-3.5 py-2 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted font-heading text-xs font-bold text-foreground transition-all flex items-center gap-1.5 cursor-pointer w-fit"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Copy Locality</span>
              </>
            )}
          </button>
        </div>

        {/* Landmark (if present) */}
        {landmark && (
          <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
            <span className="font-bold text-primary">Nearby Landmark:</span>
            <span>{landmark}</span>
          </div>
        )}

        {/* Privacy Notice Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-xs font-body leading-relaxed">
          <div className="w-7 h-7 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-0.5">
            <span className="font-heading font-extrabold uppercase tracking-wider text-[10px] text-amber-600 dark:text-amber-400 block">
              Exact Address Privacy Policy
            </span>
            <p>
              For privacy & security, exact building unit address and host contact instructions are automatically unlocked and shared upon booking confirmation.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LocationMap;
