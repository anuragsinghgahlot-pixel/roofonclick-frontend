"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, X, Search, Check } from "lucide-react";
import { SavedSearchService } from "@/services/saved-searches";
import { showToast } from "@/lib/toast";

interface SaveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    location?: string;
    minRent?: number;
    maxRent?: number;
    propertyType?: string;
    gender?: string;
    sharingType?: string;
    amenities?: string[];
  };
  onSaved?: () => void;
}

export function SaveSearchModal({ isOpen, onClose, filters, onSaved }: SaveSearchModalProps) {
  const defaultName = React.useMemo(() => {
    const parts: string[] = [];
    if (filters.location) parts.push(filters.location);
    if (filters.propertyType) parts.push(filters.propertyType);
    if (filters.gender) parts.push(filters.gender);
    return parts.length > 0 ? `${parts.join(" - ")} Search` : "My Custom Search";
  }, [filters]);

  const [name, setName] = React.useState(defaultName);

  React.useEffect(() => {
    setName(defaultName);
  }, [defaultName, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast.error("Please enter a name for your search.");
      return;
    }

    SavedSearchService.saveSearch({
      name: name.trim(),
      ...filters,
    });

    showToast.success("Search Saved!", `Saved "${name.trim()}" to your account.`);
    if (onSaved) onSaved();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card border border-border/80 p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-premium text-left space-y-6 relative select-none"
        >
          <button
            type="button"
            data-no-intercept="true"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-1">
            <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5" />
              Save Criteria
            </span>
            <h3 className="font-heading text-xl font-extrabold text-primary tracking-tight">
              Save This Search
            </h3>
            <p className="font-body text-xs text-muted-foreground">
              Give your search criteria a recognizable name to quickly re-run it anytime from your profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="font-heading text-xs font-bold text-primary block">
                Search Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vijay Nagar Girls PG under ₹8k"
                className="w-full bg-background border border-border/80 rounded-xl px-4 py-3 text-xs font-body text-foreground focus:outline-none focus:border-primary shadow-xs"
              />
            </div>

            {/* Filter Summary Tags */}
            <div className="bg-muted/30 border border-border/60 p-4 rounded-2xl space-y-2">
              <span className="text-[10px] font-extrabold text-secondary uppercase tracking-wider block">
                Filter Parameters
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-body text-muted-foreground">
                {filters.location && (
                  <span className="bg-card border border-border/60 px-2.5 py-1 rounded-lg">
                    📍 Location: <strong>{filters.location}</strong>
                  </span>
                )}
                {filters.propertyType && (
                  <span className="bg-card border border-border/60 px-2.5 py-1 rounded-lg">
                    🏠 Type: <strong>{filters.propertyType}</strong>
                  </span>
                )}
                {(filters.minRent || filters.maxRent) && (
                  <span className="bg-card border border-border/60 px-2.5 py-1 rounded-lg">
                    💰 Budget: <strong>₹{filters.minRent || 0} - ₹{filters.maxRent || "20000+"}</strong>
                  </span>
                )}
                {filters.gender && (
                  <span className="bg-card border border-border/60 px-2.5 py-1 rounded-lg">
                    🛡 Gender: <strong>{filters.gender}</strong>
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                data-no-intercept="true"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-border text-muted-foreground font-heading text-xs font-bold hover:bg-muted/40 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                data-no-intercept="true"
                className="flex-1 py-3 rounded-xl bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground font-heading text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Search</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
