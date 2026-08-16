"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, X, ArrowRight, Trash2, ShieldCheck, Building } from "lucide-react";
import { useCompare } from "@/providers/compare-provider";
import { showToast } from "@/lib/toast";

export function CompareBar() {
  const { compareProperties, removeFromCompare, clearCompare } = useCompare();

  if (compareProperties.length === 0) return null;

  const count = compareProperties.length;
  const canCompare = count >= 2;

  const handleCompareClick = (e: React.MouseEvent) => {
    if (!canCompare) {
      e.preventDefault();
      showToast.info(
        "Select At Least 2 Properties",
        "Please select at least 2 properties to perform side-by-side comparison."
      );
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-4xl bg-card/95 border border-border/80 p-3 sm:p-4 rounded-3xl shadow-[0_20px_50px_-10px_rgba(15,28,22,0.22)] backdrop-blur-xl flex items-center justify-between gap-3 sm:gap-6 select-none"
      >
        {/* Left Info & Thumbnails */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="hidden sm:flex w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 items-center justify-center text-primary shrink-0">
            <Scale className="w-5 h-5" />
          </div>

          <div className="space-y-0.5 shrink-0 hidden md:block">
            <span className="font-heading text-[10px] font-extrabold uppercase tracking-widest text-secondary block">
              Comparison List
            </span>
            <div className="font-heading text-xs font-extrabold text-primary flex items-center gap-1">
              <span>{count}/4 Selected</span>
              {!canCompare && <span className="text-[10px] text-amber-600 font-normal">(Add 1 more)</span>}
            </div>
          </div>

          {/* Selected Property Thumbnails Strip */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {compareProperties.map((property) => (
              <div
                key={property.id}
                className="relative group shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border border-border/80 bg-muted/60 flex items-center justify-center"
              >
                {(property.coverPhoto || property.images?.[0]?.url) ? (
                  <img
                    src={property.coverPhoto || property.images?.[0]?.url}
                    alt={property.propertyName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building className="w-5 h-5 text-muted-foreground/50 stroke-1" />
                )}
                {((property as any).isVerified ?? true) && (
                  <div className="absolute top-0.5 right-0.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                    <ShieldCheck className="w-2.5 h-2.5" />
                  </div>
                )}
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={() => removeFromCompare(property.id)}
                  aria-label={`Remove ${property.propertyName} from comparison`}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {Array.from({ length: 4 - count }).map((_, idx) => (
              <div
                key={idx}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border border-dashed border-border/60 bg-muted/20 flex items-center justify-center text-muted-foreground/40 text-[10px] shrink-0 font-heading font-semibold"
              >
                +Add
              </div>
            ))}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            data-no-intercept="true"
            onClick={clearCompare}
            title="Clear all selected properties"
            className="p-2 sm:px-3 sm:py-2.5 rounded-xl border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/50 font-heading text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <Link
            href={canCompare ? "/compare" : "#"}
            onClick={handleCompareClick}
            className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-heading text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95 ${
              canCompare
                ? "bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground"
                : "bg-primary/50 text-primary-foreground/70 cursor-not-allowed"
            }`}
          >
            <span>Compare {count >= 2 ? `(${count})` : "Stays"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
