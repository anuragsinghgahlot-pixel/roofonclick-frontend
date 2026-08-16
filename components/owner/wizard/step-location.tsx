"use client";

import * as React from "react";
import { useWizard } from "./wizard-context";
import { ChevronDown } from "lucide-react";

const AREA_OPTIONS = [
  "Vijay Nagar",
  "Bhawarkuan",
  "Palasia",
  "Rajendra Nagar",
  "Bengali Square",
];

export function StepLocation() {
  const { form } = useWizard();
  const { register } = form;

  return (
    <div className="flex flex-col gap-6">
      {/* City */}
      <div className="flex flex-col gap-1.5">
        <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
          City
        </label>
        <div className="relative flex items-center">
          <select
            {...register("city")}
            className="w-full bg-card border border-border/80 rounded-xl px-4.5 py-3.5 text-sm font-semibold font-body text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 appearance-none cursor-pointer"
          >
            <option value="Indore">Indore</option>
          </select>
          <ChevronDown className="absolute right-4 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Area / Locality */}
      <div className="flex flex-col gap-1.5">
        <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
          Area / Locality <span className="text-rose-500">*</span>
        </label>
        <div className="relative flex items-center">
          <select
            {...register("area")}
            className="w-full bg-card border border-border/80 rounded-xl px-4.5 py-3.5 text-sm font-semibold font-body text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 appearance-none cursor-pointer"
          >
            {AREA_OPTIONS.map((ar) => (
              <option key={ar} value={ar}>
                {ar}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Complete Address */}
      <div className="flex flex-col gap-1.5">
        <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
          Complete Address <span className="text-rose-500">*</span>
        </label>
        <textarea
          required
          {...register("address")}
          placeholder="Enter the full street address, building number, floor details..."
          rows={3}
          className="w-full bg-card border border-border/80 rounded-xl px-4.5 py-3.5 text-sm font-semibold font-body text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 resize-none"
        />
      </div>

      {/* Landmark */}
      <div className="flex flex-col gap-1.5">
        <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
          Landmark <span className="text-muted-foreground/50 font-normal">(Optional)</span>
        </label>
        <input
          type="text"
          {...register("landmark")}
          placeholder="e.g. Near Medanta Hospital / C21 Mall"
          className="w-full bg-card border border-border/80 rounded-xl px-4.5 py-3.5 text-sm font-semibold font-body text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300"
        />
      </div>

    </div>
  );
}
