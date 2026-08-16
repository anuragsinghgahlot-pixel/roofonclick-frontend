import * as React from "react";
import { Search, X, ChevronDown, Check, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Portal } from "@/components/shared/portal";

interface SearchToolbarProps {
  selectedGenders: string[];
  onGenderChange: (gender: string) => void;
  selectedTypes: string[];
  onTypeChange: (type: string) => void;
  selectedBudget: string | null;
  onBudgetChange: (budget: string | null) => void;
  selectedAmenities: string[];
  onAmenityChange: (amenity: string) => void;
  selectedSharing: string[];
  onSharingChange: (option: string) => void;
  hasActiveFilters: boolean;
  onClearAll: () => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
}

export function SearchToolbar({
  selectedGenders,
  onGenderChange,
  selectedTypes,
  onTypeChange,
  selectedBudget,
  onBudgetChange,
  selectedAmenities,
  onAmenityChange,
  selectedSharing,
  onSharingChange,
  hasActiveFilters,
  onClearAll,
  selectedSort,
  onSortChange,
}: SearchToolbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Lock body scrolling when mobile filter drawer is open
  React.useEffect(() => {
    if (!isMobileFilterOpen) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFilterOpen]);

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Close dropdown on escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsMobileFilterOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Generate active filter chips
  const activeFilters = React.useMemo(() => {
    const list: { id: string; label: string; onRemove: () => void }[] = [];

    // Genders
    selectedGenders.forEach((gender) => {
      list.push({
        id: `gender-${gender}`,
        label: gender === "boys" ? "Boys Only" : "Girls Only",
        onRemove: () => onGenderChange(gender),
      });
    });

    // Sidebar types
    selectedTypes.forEach((type) => {
      list.push({
        id: `type-${type}`,
        label: type,
        onRemove: () => onTypeChange(type),
      });
    });

    // Budget
    if (selectedBudget) {
      list.push({
        id: `budget-${selectedBudget}`,
        label: selectedBudget,
        onRemove: () => onBudgetChange(selectedBudget),
      });
    }

    // Amenities
    selectedAmenities.forEach((amenity) => {
      list.push({
        id: `amenity-${amenity}`,
        label: amenity,
        onRemove: () => onAmenityChange(amenity),
      });
    });

    // Sharing
    selectedSharing.forEach((sharing) => {
      list.push({
        id: `sharing-${sharing}`,
        label: sharing,
        onRemove: () => onSharingChange(sharing),
      });
    });

    return list;
  }, [
    selectedGenders,
    selectedTypes,
    selectedBudget,
    selectedAmenities,
    selectedSharing,
    onGenderChange,
    onTypeChange,
    onBudgetChange,
    onAmenityChange,
    onSharingChange,
  ]);

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-3.5 sm:p-5 shadow-premium flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-8 text-left" data-no-intercept="true">
      {/* Top Row: Search Input, Mobile Filter Button, Sort Dropdown & Clear All */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        {/* Section 1: Search Input */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-muted-foreground">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search properties..."
            className="w-full bg-background border border-border/80 rounded-xl pl-10 pr-4 py-2 sm:py-2.5 text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        {/* Right side: Mobile Filter Button, Sort By & Clear All */}
        <div className="flex items-center gap-2.5 sm:gap-3 justify-between sm:justify-end">
          {/* Mobile Filter Button (Visible on < md) */}
          <button
            type="button"
            data-no-intercept="true"
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-primary/10 border border-primary/25 text-primary rounded-xl px-3.5 py-2 text-xs font-bold hover:bg-primary/20 transition-all cursor-pointer select-none"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-secondary" />
            )}
          </button>

          {/* Section 2: Sort By Custom Dropdown */}
          <div className="flex items-center gap-2 relative" ref={dropdownRef}>
            <span className="hidden sm:inline text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground whitespace-nowrap select-none">
              Sort By:
            </span>
            
            <button
              type="button"
              data-no-intercept="true"
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex items-center justify-between gap-2 bg-background border border-border/80 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-xs font-bold text-primary hover:border-border/60 hover:shadow-sm transition-all duration-200 cursor-pointer select-none"
            >
              <span>{selectedSort}</span>
              <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-48 bg-card border border-border/80 rounded-xl shadow-premium p-1.5 z-50 flex flex-col gap-0.5"
                >
                  {[
                    "Recommended",
                    "Price: Low to High",
                    "Price: High to Low",
                    "Highest Rated",
                    "Newest",
                  ].map((option) => {
                    const isSelected = selectedSort === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        data-no-intercept="true"
                        onClick={() => {
                          onSortChange(option);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors duration-150 cursor-pointer select-none",
                          isSelected
                            ? "bg-primary/10 text-primary font-bold"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <span>{option}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-primary stroke-[3]" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Section 3: Clear All */}
          <button
            type="button"
            data-no-intercept="true"
            disabled={!hasActiveFilters}
            onClick={onClearAll}
            className={cn(
              "px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-bold transition-all duration-200 select-none",
              hasActiveFilters
                ? "text-secondary hover:bg-secondary/5 cursor-pointer"
                : "text-muted-foreground/50 bg-transparent cursor-not-allowed"
            )}
          >
            Clear All
          </button>
        </div>
      </div>

      <hr className="border-border/60" />

      {/* Bottom Row: Section 4: Active Filters horizontal scrollable row */}
      <div className="flex items-center gap-2.5 overflow-hidden">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground shrink-0 select-none">
          Active:
        </span>
        
        {activeFilters.length > 0 ? (
          <div className="flex-1 flex items-center gap-2 overflow-x-auto whitespace-nowrap py-1 scrollbar-none">
            {activeFilters.map((filter) => (
              <span
                key={filter.id}
                className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[11px] font-bold transition-all duration-200"
              >
                <span>{filter.label}</span>
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={filter.onRemove}
                  className="w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-primary/20 text-primary cursor-pointer"
                >
                  <X className="w-3 h-3 stroke-[2.5]" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center text-xs font-semibold text-muted-foreground/60 italic py-1">
            No filters applied
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer / Bottom Sheet */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <Portal>
            {/* Backdrop Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 z-backdrop bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              className="fixed inset-x-0 bottom-0 top-16 z-modal bg-background rounded-t-[28px] shadow-2xl border-t border-border flex flex-col md:hidden overflow-hidden"
              data-no-intercept="true"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between shrink-0 bg-card">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  <h2 className="font-heading text-lg font-extrabold text-primary mb-0 leading-none">All Filters</h2>
                </div>
                <div className="flex items-center gap-3">
                  {hasActiveFilters && (
                    <button
                      type="button"
                      data-no-intercept="true"
                      onClick={onClearAll}
                      className="text-xs font-bold text-secondary hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    type="button"
                    data-no-intercept="true"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-2 rounded-xl bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                    aria-label="Close filters"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Filter Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
                {/* Gender */}
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                    Gender
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    <label className="flex items-center gap-3 text-sm font-semibold text-primary cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedGenders.includes("boys")}
                        onChange={() => onGenderChange("boys")}
                        className="rounded border-border/80 text-primary focus:ring-primary w-4.5 h-4.5 cursor-pointer"
                      />
                      <span>Boys Only</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm font-semibold text-primary cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedGenders.includes("girls")}
                        onChange={() => onGenderChange("girls")}
                        className="rounded border-border/80 text-primary focus:ring-primary w-4.5 h-4.5 cursor-pointer"
                      />
                      <span>Girls Only</span>
                    </label>
                  </div>
                </div>

                <hr className="border-border/60" />

                {/* Property Type */}
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                    Property Type
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    <label className="flex items-center gap-3 text-sm font-semibold text-primary cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes("PG")}
                        onChange={() => onTypeChange("PG")}
                        className="rounded border-border/80 text-primary focus:ring-primary w-4.5 h-4.5 cursor-pointer"
                      />
                      <span>PG</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm font-semibold text-primary cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes("Hostel")}
                        onChange={() => onTypeChange("Hostel")}
                        className="rounded border-border/80 text-primary focus:ring-primary w-4.5 h-4.5 cursor-pointer"
                      />
                      <span>Hostel</span>
                    </label>
                  </div>
                </div>

                <hr className="border-border/60" />

                {/* Budget */}
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                    Budget
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Under ₹5,000",
                      "₹5,000 – ₹8,000",
                      "₹8,000 – ₹12,000",
                      "Above ₹12,000",
                    ].map((budget) => {
                      const isSelected = selectedBudget === budget;
                      return (
                        <button
                          key={budget}
                          type="button"
                          data-no-intercept="true"
                          onClick={() => onBudgetChange(budget)}
                          className={cn(
                            "px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 cursor-pointer shadow-sm select-none",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary/30"
                              : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {budget}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <hr className="border-border/60" />

                {/* Sharing */}
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                    Sharing Options
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    {[
                      "Single Sharing",
                      "Double Sharing",
                      "Triple Sharing",
                      "Four Sharing",
                    ].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 text-sm font-semibold text-primary cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSharing.includes(option)}
                          onChange={() => onSharingChange(option)}
                          className="rounded border-border/80 text-primary focus:ring-primary w-4.5 h-4.5 cursor-pointer"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <hr className="border-border/60" />

                {/* Amenities */}
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                    Amenities
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    {[
                      "WiFi",
                      "AC",
                      "Non-AC",
                      "Laundry",
                      "Mess Included",
                      "Room Cleaning",
                      "Washing Machine",
                    ].map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center gap-3 text-sm font-semibold text-primary cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => onAmenityChange(amenity)}
                          className="rounded border-border/80 text-primary focus:ring-primary w-4.5 h-4.5 cursor-pointer"
                        />
                        <span>{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="p-4 border-t border-border bg-card shrink-0">
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground font-heading text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchToolbar;
