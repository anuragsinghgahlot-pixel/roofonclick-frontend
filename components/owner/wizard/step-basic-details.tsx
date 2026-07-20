"use client";

import * as React from "react";
import { useWizard } from "./wizard-context";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const PROPERTY_TYPES = [
  { value: "PG", label: "PG (Paying Guest)" },
  { value: "Hostel", label: "Hostel" },
  { value: "Co-living", label: "Co-living" },
  { value: "Apartment", label: "Apartment" },
];

const GENDER_OPTIONS = [
  { value: "Boys", label: "Boys Only", emoji: "👦" },
  { value: "Girls", label: "Girls Only", emoji: "👧" },
  { value: "Unisex", label: "Unisex / Co-ed", emoji: "👥" },
];

export function StepBasicDetails() {
  const { form } = useWizard();
  const { register, watch, setValue } = form;

  const descriptionValue = watch("description") || "";
  const genderValue = watch("gender");

  return (
    <div className="flex flex-col gap-6">
      {/* Property Name */}
      <div className="flex flex-col gap-1.5">
        <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
          Property Name <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          {...register("propertyName")}
          placeholder="e.g. Skyline Elite Premium PG"
          className="w-full bg-card border border-border/80 rounded-xl px-4.5 py-3.5 text-sm font-semibold font-body text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300"
        />
      </div>

      {/* Property Type */}
      <div className="flex flex-col gap-1.5">
        <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
          Property Type
        </label>
        <div className="relative flex items-center">
          <select
            {...register("propertyType")}
            className="w-full bg-card border border-border/80 rounded-xl px-4.5 py-3.5 text-sm font-semibold font-body text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 appearance-none cursor-pointer"
          >
            {PROPERTY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Target Gender */}
      <div className="flex flex-col gap-2.5">
        <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
          Target Gender / Occupancy
        </label>
        <div className="grid grid-cols-3 gap-3">
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
