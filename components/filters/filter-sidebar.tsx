import * as React from "react";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  selectedGenders: string[];
  onGenderChange: (gender: string) => void;
  selectedTypes: string[];
  onTypeChange: (type: string) => void;
  selectedBudget: string | null;
  onBudgetChange: (budget: string | null) => void;
}

export function FilterSidebar({
  selectedGenders,
  onGenderChange,
  selectedTypes,
  onTypeChange,
  selectedBudget,
  onBudgetChange,
}: FilterSidebarProps) {
  return (
    <aside className="hidden md:block md:w-[240px] lg:w-[280px] shrink-0 sticky top-[100px] z-20" data-no-intercept="true">
      <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-premium flex flex-col gap-6 text-left">
        {/* Title Section */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <h2 className="font-heading text-base font-bold text-primary">Filters</h2>
        </div>

        {/* Section 1: Gender checkboxes */}
        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Gender
          </h3>
          <div className="flex flex-col gap-2.5">
            <label className="flex items-center gap-2.5 text-sm font-semibold text-primary cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedGenders.includes("boys")}
                onChange={() => onGenderChange("boys")}
                className="rounded border-border/80 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
              <span>Boys Only</span>
            </label>
            <label className="flex items-center gap-2.5 text-sm font-semibold text-primary cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedGenders.includes("girls")}
                onChange={() => onGenderChange("girls")}
                className="rounded border-border/80 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
              <span>Girls Only</span>
            </label>
          </div>
        </div>

        <hr className="border-border/60" />

        {/* Section 2: Property Type checkboxes */}
        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Property Type
          </h3>
          <div className="flex flex-col gap-2.5">
            <label className="flex items-center gap-2.5 text-sm font-semibold text-primary cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedTypes.includes("PG")}
                onChange={() => onTypeChange("PG")}
                className="rounded border-border/80 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
              <span>PG</span>
            </label>
            <label className="flex items-center gap-2.5 text-sm font-semibold text-primary cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedTypes.includes("Hostel")}
                onChange={() => onTypeChange("Hostel")}
                className="rounded border-border/80 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
              <span>Hostel</span>
            </label>
          </div>
        </div>

        <hr className="border-border/60" />

        {/* Section 3: Budget pills */}
        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Budget
          </h3>
          <div className="flex flex-wrap gap-2.5">
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
                  onClick={() => onBudgetChange(budget)}
                  className={cn(
                    "px-3.5 py-2 rounded-full text-[10px] font-bold border transition-all duration-200 cursor-pointer shadow-sm select-none",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary/30"
                      : "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:border-border/60"
                  )}
                >
                  {budget}
                </button>
              );
            })}
          </div>
        </div>

        <hr className="border-border/60" />

        {/* Section 4: Sharing */}
        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Sharing
          </h3>
          <div className="text-xs text-muted-foreground/60 italic px-1">
            (Sharing selection placeholder)
          </div>
        </div>

        <hr className="border-border/60" />

        {/* Section 5: Amenities */}
        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Amenities
          </h3>
          <div className="text-xs text-muted-foreground/60 italic px-1">
            (Amenities selection placeholder)
          </div>
        </div>
      </div>
    </aside>
  );
}

export default FilterSidebar;
