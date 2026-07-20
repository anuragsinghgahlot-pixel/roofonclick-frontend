import * as React from "react";
import { Search, X, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
  const dropdownRef = React.useRef<HTMLDivElement>(null);

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
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-premium flex flex-col gap-4 mb-8 text-left" data-no-intercept="true">
      {/* Top Row: Search Input, Sort Dropdown & Clear All */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Section 1: Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-muted-foreground">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search properties..."
            className="w-full bg-background border border-border/80 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        {/* Right side: Sort By & Clear All */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Section 2: Sort By Custom Dropdown */}
          <div className="flex items-center gap-2 relative" ref={dropdownRef}>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground whitespace-nowrap select-none">
              Sort By:
            </span>
            
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex items-center justify-between gap-2.5 bg-background border border-border/80 rounded-xl px-4 py-2.5 text-xs font-bold text-primary hover:border-border/60 hover:shadow-sm transition-all duration-200 cursor-pointer select-none"
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
            disabled={!hasActiveFilters}
            onClick={onClearAll}
            className={cn(
              "px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 select-none",
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
      <div className="flex items-center gap-3 overflow-hidden">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground shrink-0 select-none">
          Active Filters:
        </span>
        
        {activeFilters.length > 0 ? (
          <div className="flex-1 flex items-center gap-2 overflow-x-auto whitespace-nowrap py-1.5 scrollbar-thin">
            {activeFilters.map((filter) => (
              <span
                key={filter.id}
                className="inline-flex items-center gap-1.5 bg-primary/10 hover:bg-primary/15 text-primary border border-primary/20 px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200"
              >
                <span>{filter.label}</span>
                <button
                  onClick={filter.onRemove}
                  className="w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-primary/20 text-primary cursor-pointer"
                >
                  <X className="w-3 h-3 stroke-[2.5]" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center text-xs font-semibold text-muted-foreground/60 italic py-1.5">
            No filters applied
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchToolbar;
