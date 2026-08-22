"use client";

import * as React from "react";
import { useWizard } from "./wizard-context";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const PROPERTY_TYPE_CARDS = [
  { value: "Hostel", label: "Hostel", desc: "Student & shared stays", icon: "🏢" },
  { value: "PG", label: "PG (Paying Guest)", desc: "Shared rooms with mess", icon: "🏠" },
  { value: "Studio Apartment", label: "Studio Apartment", desc: "Single open layout flat", icon: "🛋️" },
  { value: "RK", label: "RK", desc: "Room + Kitchen unit", icon: "🍳" },
  { value: "1 BHK", label: "1 BHK", desc: "1 Bed, Hall & Kitchen", icon: "🛏️" },
  { value: "2 BHK", label: "2 BHK", desc: "2 Bed, Hall & Kitchen", icon: "🛋️" },
  { value: "3 BHK", label: "3 BHK", desc: "3 Bed, Hall & Kitchen", icon: "🏰" },
  { value: "4+ BHK", label: "4+ BHK", desc: "Large luxury apartments", icon: "🏙️" },
];

const GENDER_OPTIONS = [
  { value: "Boys", label: "Boys Only", emoji: "👦" },
  { value: "Girls", label: "Girls Only", emoji: "👧" },
  { value: "Unisex", label: "Unisex / Family", emoji: "👥" },
];

export function StepBasicDetails() {
  const { form } = useWizard();
  const { register, watch, setValue } = form;

  const propertyTypeValue = watch("propertyType") || "Hostel";
  const descriptionValue = watch("description") || "";
  const genderValue = watch("gender") || "Boys";

  return (
    <div className="flex flex-col gap-6 w-full min-w-0">
      {/* Property Name */}
      <div className="flex flex-col gap-1.5 w-full min-w-0">
        <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
          Property Name <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          {...register("propertyName")}
          placeholder="e.g. Skyline Elite 2 BHK Flat or Premium PG"
          className="w-full bg-card border border-border/80 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold font-body text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300"
        />
      </div>

      {/* Property Type — Card Grid Selector */}
      <div className="flex flex-col gap-2.5 w-full min-w-0">
        <div className="flex items-center justify-between pl-1">
          <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider">
            Property Type <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] font-bold text-secondary">
            {propertyTypeValue} Selected
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full min-w-0">
          {PROPERTY_TYPE_CARDS.map((type) => {
            const isSelected = propertyTypeValue === type.value;
            return (
              <button
                key={type.value}
                type="button"
                data-no-intercept="true"
                onClick={() => {
                  setValue("propertyType", type.value as any, { shouldValidate: true });
                }}
                className={cn(
                  "flex flex-col items-start p-3 sm:p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer select-none relative overflow-hidden group min-w-0 w-full",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary shadow-sm font-bold ring-1 ring-primary/30"
                    : "border-border/80 bg-card hover:border-primary/50 text-foreground hover:bg-muted/30"
                )}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-lg sm:text-xl select-none">{type.icon}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <span className="font-heading text-[11px] sm:text-xs font-bold truncate w-full block">
                  {type.label}
                </span>
                <span className="font-body text-[9px] sm:text-[10px] text-muted-foreground truncate w-full mt-0.5 block">
                  {type.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Multi-unit building tip */}
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-2.5 text-left mt-1">
          <span className="text-base shrink-0">💡</span>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <span className="font-bold text-primary">Have multiple unit types in one building?</span> (e.g. both 1 BHK & 2 BHK, or 1 BHK & 1 RK). Choose your primary category here — you can add all individual flat & room configurations in <span className="font-bold text-primary">Step 3 (Pricing & Sharing)</span>!
          </p>
        </div>
      </div>

      {/* Target Gender */}
      <div className="flex flex-col gap-2.5">
        <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
          Target Gender / Occupancy
        </label>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {GENDER_OPTIONS.map((opt) => {
            const isSelected = genderValue === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue("gender", opt.value as "Boys" | "Girls" | "Unisex", { shouldValidate: true })}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border border-border/80 bg-card/65 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary shadow-[0_4px_12px_rgba(34,197,94,0.08)] font-bold"
                    : "hover:border-primary text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="text-xl select-none">{opt.emoji}</span>
                <span className="font-heading text-[11px] font-semibold uppercase tracking-wider">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Short Description */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-end pl-1 pr-1">
          <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider">
            Short Description
          </label>
          <span className={cn(
            "text-[10px] font-bold font-body",
            descriptionValue.length > 180 ? "text-rose-500" : "text-muted-foreground"
          )}>
            {descriptionValue.length} / 200
          </span>
        </div>
        <textarea
          maxLength={200}
          {...register("description")}
          placeholder="Introduce your property in a few sentences to attract potential tenants..."
          rows={4}
          className="w-full bg-card border border-border/80 rounded-xl px-4.5 py-3.5 text-sm font-semibold font-body text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 resize-none"
        />
      </div>
    </div>
  );
}
