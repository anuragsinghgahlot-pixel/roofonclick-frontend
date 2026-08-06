"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Filter, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  selectedGenders: string[];
  onGenderChange: (gender: string) => void;
  selectedTypes: string[];
  onTypeChange: (type: string) => void;
  selectedBhk?: string[];
  onBhkChange?: (bhk: string) => void;
  selectedBudget: string | null;
  onBudgetChange: (budget: string | null) => void;
  selectedAmenities: string[];
  onAmenityChange: (amenity: string) => void;
  selectedSharing: string[];
  onSharingChange: (option: string) => void;
  onClearAll?: () => void;
}

export function FilterSidebar({
  selectedGenders,
  onGenderChange,
  selectedTypes,
  onTypeChange,
  selectedBhk = [],
  onBhkChange = () => {},
  selectedBudget,
  onBudgetChange,
  selectedAmenities,
  onAmenityChange,
  selectedSharing,
  onSharingChange,
  onClearAll,
}: FilterSidebarProps) {
  // Track open collapsible sections (all open by default for rich discoverability)
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    types: true,
    bhk: true,
    gender: true,
    budget: true,
    sharing: false,
    amenities: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const hasActiveFilters =
    selectedGenders.length > 0 ||
    selectedTypes.length > 0 ||
    selectedBhk.length > 0 ||
    selectedBudget !== null ||
    selectedAmenities.length > 0 ||
    selectedSharing.length > 0;

  return (
    <aside
      className="hidden md:block md:w-[240px] lg:w-[280px] shrink-0 sticky top-[100px] z-20"
      data-no-intercept="true"
    >
      <div
        tabIndex={0}
        onWheel={(e) => {
          e.stopPropagation();
        }}
        className="bg-card border border-border/80 rounded-3xl p-5 shadow-premium flex flex-col gap-4 text-left select-none max-h-[calc(100vh-120px)] overflow-y-auto overscroll-contain touch-pan-y custom-scrollbar focus:outline-none focus:ring-1 focus:ring-primary/20"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" />
            <h2 className="font-heading text-sm font-extrabold text-primary">Filters</h2>
          </div>
          {hasActiveFilters && onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-[11px] font-heading font-bold text-muted-foreground hover:text-rose-500 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* 1. Property Type (Collapsible) */}
        <div className="flex flex-col border-b border-border/60 pb-3">
          <button
            type="button"
            onClick={() => toggleSection("types")}
            className="flex items-center justify-between py-1 text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <span className="font-heading text-xs font-extrabold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                Property Type
              </span>
              {selectedTypes.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-extrabold flex items-center justify-center">
                  {selectedTypes.length}
                </span>
              )}
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted-foreground transition-transform duration-200",
                openSections.types && "rotate-180"
              )}
            />
          </button>

          <AnimatePresence initial={false}>
            {openSections.types && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pt-2.5 flex flex-col gap-2"
              >
                {["PG", "Hostel", "Studio / RK", "Apartment / BHK"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2.5 text-xs font-semibold text-primary cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => onTypeChange(type)}
                      className="rounded border-border/80 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. BHK Configuration (Collapsible - NEW!) */}
        <div className="flex flex-col border-b border-border/60 pb-3">
          <button
            type="button"
            onClick={() => toggleSection("bhk")}
            className="flex items-center justify-between py-1 text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <span className="font-heading text-xs font-extrabold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                BHK Configuration
              </span>
              {selectedBhk.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-extrabold flex items-center justify-center">
                  {selectedBhk.length}
                </span>
              )}
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted-foreground transition-transform duration-200",
                openSections.bhk && "rotate-180"
              )}
            />
          </button>

          <AnimatePresence initial={false}>
            {openSections.bhk && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pt-2.5 grid grid-cols-2 gap-1.5"
              >
                {["RK", "Studio", "1 BHK", "2 BHK", "3 BHK", "4+ BHK"].map((bhk) => {
                  const isSelected = selectedBhk.includes(bhk);
                  return (
                    <button
                      key={bhk}
                      type="button"
                      onClick={() => onBhkChange(bhk)}
                      className={cn(
                        "py-1.5 px-2.5 rounded-xl text-xs font-bold border transition-all duration-200 text-center cursor-pointer shadow-xs select-none",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary/30"
                          : "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:border-border/60"
                      )}
                    >
                      {bhk}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Gender (Collapsible) */}
        <div className="flex flex-col border-b border-border/60 pb-3">
          <button
            type="button"
            onClick={() => toggleSection("gender")}
            className="flex items-center justify-between py-1 text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <span className="font-heading text-xs font-extrabold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                Gender
              </span>
              {selectedGenders.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-extrabold flex items-center justify-center">
                  {selectedGenders.length}
                </span>
              )}
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted-foreground transition-transform duration-200",
                openSections.gender && "rotate-180"
              )}
            />
          </button>

          <AnimatePresence initial={false}>
            {openSections.gender && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pt-2.5 flex flex-col gap-2"
              >
                <label className="flex items-center gap-2.5 text-xs font-semibold text-primary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedGenders.includes("boys")}
                    onChange={() => onGenderChange("boys")}
                    className="rounded border-border/80 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  <span>Boys Only</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs font-semibold text-primary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedGenders.includes("girls")}
                    onChange={() => onGenderChange("girls")}
                    className="rounded border-border/80 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  <span>Girls Only</span>
                </label>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. Budget (Collapsible) */}
        <div className="flex flex-col border-b border-border/60 pb-3">
          <button
            type="button"
            onClick={() => toggleSection("budget")}
            className="flex items-center justify-between py-1 text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <span className="font-heading text-xs font-extrabold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                Budget
              </span>
              {selectedBudget && (
                <span className="w-2 h-2 rounded-full bg-secondary" />
              )}
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted-foreground transition-transform duration-200",
                openSections.budget && "rotate-180"
              )}
            />
          </button>

          <AnimatePresence initial={false}>
            {openSections.budget && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pt-2.5 flex flex-wrap gap-1.5"
              >
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
                      onClick={() => onBudgetChange(budget)}
                      className={cn(
                        "px-2.5 py-1.5 rounded-full text-[10px] font-bold border transition-all duration-200 cursor-pointer shadow-xs select-none",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary/30"
                          : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {budget}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 5. Sharing (Collapsible) */}
        <div className="flex flex-col border-b border-border/60 pb-3">
          <button
            type="button"
            onClick={() => toggleSection("sharing")}
            className="flex items-center justify-between py-1 text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <span className="font-heading text-xs font-extrabold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                Sharing Options
              </span>
              {selectedSharing.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-extrabold flex items-center justify-center">
                  {selectedSharing.length}
                </span>
              )}
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted-foreground transition-transform duration-200",
                openSections.sharing && "rotate-180"
              )}
            />
          </button>

          <AnimatePresence initial={false}>
            {openSections.sharing && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pt-2.5 flex flex-col gap-2"
              >
                {[
                  "Single Sharing",
                  "Double Sharing",
                  "Triple Sharing",
                  "Four Sharing",
                ].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2.5 text-xs font-semibold text-primary cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSharing.includes(option)}
                      onChange={() => onSharingChange(option)}
                      className="rounded border-border/80 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 6. Amenities (Collapsible) */}
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => toggleSection("amenities")}
            className="flex items-center justify-between py-1 text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <span className="font-heading text-xs font-extrabold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                Amenities
              </span>
              {selectedAmenities.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-extrabold flex items-center justify-center">
                  {selectedAmenities.length}
                </span>
              )}
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted-foreground transition-transform duration-200",
                openSections.amenities && "rotate-180"
              )}
            />
          </button>

          <AnimatePresence initial={false}>
            {openSections.amenities && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pt-2.5 flex flex-col gap-2"
              >
                {[
                  "WiFi",
                  "AC",
                  "Non-AC",
                  "Laundry",
                  "Mess Included",
                  "Room Cleaning",
                  "Washing Machine",
                  "Gym",
                  "Security",
                  "Parking",
                ].map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-2.5 text-xs font-semibold text-primary cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => onAmenityChange(amenity)}
                      className="rounded border-border/80 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
}

export default FilterSidebar;
