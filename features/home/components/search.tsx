"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wifi,
  ShieldCheck,
  Heart,
  User,
  Check,
  Zap,
  Sparkles,
  MapPin,
  Map,
  GraduationCap,
  Train,
  Hospital,
  Star
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";

const MOCK_CRITERIA = [
  { id: "boys", label: "Boys PG", icon: User, color: "text-primary bg-primary/10 border-primary/20" },
  { id: "girls", label: "Girls PG", icon: Heart, color: "text-secondary bg-secondary/10 border-secondary/20" },
  { id: "co-living", label: "Co-Living", icon: Sparkles, color: "text-accent bg-accent/10 border-accent/20" },
  { id: "wifi", label: "Wi-Fi Included", icon: Wifi, color: "text-primary bg-primary/10 border-primary/20" },
  { id: "verified", label: "Verified Host", icon: ShieldCheck, color: "text-accent bg-accent/10 border-accent/20" },
  { id: "deposit", label: "Zero Deposit", icon: Zap, color: "text-secondary bg-secondary/10 border-secondary/20" },
];

const SUGGESTIONS = [
  { category: "Popular Areas", label: "Vijay Nagar", icon: Map },
  { category: "Popular Areas", label: "Palasia", icon: Map },
  { category: "Popular Areas", label: "Bhawarkuan", icon: Map },
  { category: "Colleges", label: "IET DAVV", icon: GraduationCap },
  { category: "Landmarks", label: "C21 Mall", icon: Star },
  { category: "Hospitals", label: "Medanta Hospital", icon: Hospital },
];

export function Search() {
  const [selected, setSelected] = React.useState<string[]>(["boys", "wifi"]);
  const [query, setQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Get active client-side DOM elements dynamically to prevent detached hydration node issues
  const activeInput = typeof document !== "undefined"
    ? (document.querySelector('input[placeholder*="Where in Indore?"]') as HTMLInputElement)
    : null;

  const activeContainer = typeof document !== "undefined" && activeInput
    ? (activeInput.closest('.group\\/search') as HTMLElement)
    : null;

  // Filter mock suggestions based on the active query state
  const filtered = React.useMemo(() => {
    if (!query.trim()) return SUGGESTIONS;
    const lowerQuery = query.toLowerCase();
    return SUGGESTIONS.filter(
      (item) =>
        item.label.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  // Apply styling on the parent container when dropdown opens/closes
  React.useEffect(() => {
    if (activeContainer) {
      activeContainer.style.position = "relative";
    }
  }, [activeContainer, isOpen]);

  React.useEffect(() => {
    // Dynamic event delegation on the document element to bind interaction behaviors
    // to the search input in the Hero component dynamically.
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLInputElement;
      if (target && target.matches && target.matches('input[placeholder*="Where in Indore?"]')) {
        setIsOpen(true);
      }
    };

    const handleDocumentFocus = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement;
      if (target && target.matches && target.matches('input[placeholder*="Where in Indore?"]')) {
        setIsOpen(true);
      }
    };

    const handleDocumentInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target && target.matches && target.matches('input[placeholder*="Where in Indore?"]')) {
        setQuery(target.value);
        setIsOpen(true);
      }
    };

    const handleDocumentKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLInputElement;
      if (target && target.matches && target.matches('input[placeholder*="Where in Indore?"]')) {
        if (e.key === "Escape") {
          setIsOpen(false);
          target.blur();
        }
      }
    };

    // Attach listeners on document level
    document.addEventListener("click", handleDocumentClick, true);
    document.addEventListener("focus", handleDocumentFocus, true);
    document.addEventListener("input", handleDocumentInput);
    document.addEventListener("keydown", handleDocumentKeyDown);

    // Sync initial query state
    if (activeInput) {
      setQuery(activeInput.value);
    }

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      document.removeEventListener("focus", handleDocumentFocus, true);
      document.removeEventListener("input", handleDocumentInput);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [activeInput]);

  // Click outside to close the dropdown
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        activeInput &&
        activeContainer &&
        !activeInput.contains(target) &&
        !activeContainer.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeInput, activeContainer]);

  return (
    <>
      <Section className="bg-muted/10 py-10 relative overflow-hidden">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >
            {/* Header */}
            <div className="flex flex-col gap-1.5 text-left">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary">
                Quick Filter
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-primary">
                What are you looking for?
              </h2>
            </div>

            {/* Filters List */}
            <div className="flex flex-wrap gap-3">
              {MOCK_CRITERIA.map((item) => {
                const Icon = item.icon;
                const isSelected = selected.includes(item.id);

                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    onClick={() => toggleSelect(item.id)}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "flex items-center gap-2.5 px-4.5 py-3 rounded-2xl border text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer shadow-sm relative overflow-hidden",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary/30"
                        : "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:border-border"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isSelected ? "text-primary-foreground" : item.color.split(" ")[0])} />
                    <span>{item.label}</span>

                    {/* Micro indicator */}
                    {isSelected && (
                      <span className="w-3.5 h-3.5 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0 ml-1.5">
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Render Suggestions Dropdown using React Portal inside the search form container */}
      <AnimatePresence>
        {isOpen && activeContainer && activeInput && createPortal(
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: "8px",
              zIndex: 50,
            }}
            className="bg-card/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-premium max-h-[300px] overflow-y-auto p-2.5 flex flex-col gap-1 text-left"
          >
            {filtered.length > 0 ? (
              filtered.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.category + "-" + item.label}
                    onClick={() => {
                      activeInput.value = item.label;
                      activeInput.dispatchEvent(new Event("input", { bubbles: true }));
                      setQuery(item.label);
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer hover:bg-muted/40 transition-colors duration-250 group/item"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4.5 h-4.5 text-primary transition-transform duration-200 group-hover/item:scale-110" />
                      <span className="font-body text-sm font-semibold text-primary group-hover/item:text-secondary transition-colors duration-200">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-heading text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/80 bg-muted/50 px-2.5 py-1 rounded-lg">
                      {item.category}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="py-6 text-center flex flex-col items-center justify-center gap-2">
                <span className="text-2xl">🔍</span>
                <span className="font-body text-sm font-semibold text-muted-foreground">
                  No properties found for &ldquo;{query}&rdquo;
                </span>
              </div>
            )}
          </motion.div>,
          activeContainer
        )}
      </AnimatePresence>
    </>
  );
}

// CN Utility wrapper for standalone usage in components
import { cn } from "@/lib/utils";

export default Search;
