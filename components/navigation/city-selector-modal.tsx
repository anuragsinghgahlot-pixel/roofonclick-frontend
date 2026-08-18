"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Search, Check, Sparkles, X, Loader2 } from "lucide-react";
import { useCity } from "@/providers/city-provider";
import { CityConfig } from "@/constants/cities";
import { Portal } from "@/components/shared/portal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CitySelectorModal({ isOpen, onClose }: CitySelectorModalProps) {
  const { selectedCity, setCity, detectLocation, isLocating, availableCities } = useCity();
  const [searchQuery, setSearchQuery] = React.useState("");

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  const filteredCities = React.useMemo(() => {
    if (!searchQuery.trim()) return availableCities;
    const q = searchQuery.toLowerCase().trim();
    return availableCities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.popularAreas.some((a) => a.name.toLowerCase().includes(q))
    );
  }, [availableCities, searchQuery]);

  const handleSelectCity = (city: CityConfig) => {
    if (!city.isLive) {
      toast.info(`${city.name} Stays Launching Soon`, {
        description: `RoofOnClick is currently active in Indore. We are onboarding verified properties in ${city.name}.`,
      });
      return;
    }
    setCity(city);
    onClose();
  };

  const handleDetectGPS = async () => {
    const city = await detectLocation();
    if (city && city.isLive) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl bg-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-6 pb-4 border-b border-border/60 flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-xl font-extrabold text-foreground flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-secondary" />
                    Select Your City
                  </h2>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">
                    Browse verified stays and co-living spaces isolated to your destination
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* GPS Button + Search Filter */}
              <div className="p-6 pb-2 space-y-3">
                {/* 1-Click GPS Detect Button */}
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={isLocating}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-secondary/10 hover:bg-secondary/15 border border-secondary/25 text-foreground transition-all group cursor-pointer active:scale-[0.99] disabled:opacity-70"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center font-bold">
                      {isLocating ? (
                        <Loader2 className="w-4.5 h-4.5 animate-spin text-secondary" />
                      ) : (
                        <Navigation className="w-4.5 h-4.5 text-secondary group-hover:scale-110 transition-transform" />
                      )}
                    </div>
                    <div className="text-left">
                      <span className="font-heading text-xs sm:text-sm font-extrabold block text-foreground">
                        {isLocating ? "Detecting GPS coordinates..." : "Use Current Location"}
                      </span>
                      <span className="font-body text-[10px] sm:text-[11px] text-muted-foreground block">
                        Auto-detect nearest student hub using device GPS
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-secondary hidden sm:inline-block">
                    Detect →
                  </span>
                </button>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search city or locality (e.g. Indore, Vijay Nagar)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border/80 font-body text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Cities Grid */}
              <div className="p-6 pt-3 overflow-y-auto space-y-2 flex-1 scrollbar-thin">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block mb-2">
                  Popular Hubs ({filteredCities.length})
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredCities.map((city) => {
                    const isSelected = selectedCity.id === city.id;
                    return (
                      <div
                        key={city.id}
                        onClick={() => handleSelectCity(city)}
                        aria-disabled={!city.isLive}
                        className={cn(
                          "relative p-3.5 rounded-2xl border transition-all flex items-center justify-between text-left select-none",
                          isSelected
                            ? "bg-primary/10 border-primary text-foreground shadow-xs cursor-pointer"
                            : city.isLive
                            ? "bg-muted/30 hover:bg-muted/60 border-border/60 text-foreground hover:border-border cursor-pointer active:scale-[0.99]"
                            : "bg-muted/15 border-dashed border-border/40 text-muted-foreground opacity-60 cursor-not-allowed hover:bg-muted/20"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : city.isLive
                                ? "bg-card border border-border/60 text-primary"
                                : "bg-muted/40 border border-border/30 text-muted-foreground/60"
                            )}
                          >
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className={cn("font-heading text-sm font-extrabold", !city.isLive && "text-muted-foreground")}>
                                {city.name}
                              </span>
                              {city.isLive ? (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  🟢 Live
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-muted/60 text-muted-foreground border border-border/40">
                                  ⏳ Soon
                                </span>
                              )}
                            </div>
                            <span className="font-body text-[10px] text-muted-foreground line-clamp-1">
                              {city.state}
                            </span>
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : !city.isLive ? (
                          <span className="text-[9px] font-bold text-muted-foreground/70 uppercase tracking-wider">
                            Locked
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 px-6 bg-muted/20 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-secondary" />
                  Currently active: <strong className="text-foreground">{selectedCity.name}</strong>
                </span>
                <span>Press ESC to close</span>
              </div>
            </motion.div>
          </div>
        </Portal>
      )}
    </AnimatePresence>
  );
}
