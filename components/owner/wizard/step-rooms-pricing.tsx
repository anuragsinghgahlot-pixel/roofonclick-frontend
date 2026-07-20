"use client";

import * as React from "react";
import { useFieldArray } from "react-hook-form";
import { useWizard } from "./wizard-context";
import { Plus, Trash2, ChevronDown, Check, X, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const ROOM_TYPES = [
  "Single Sharing",
  "Double Sharing",
  "Triple Sharing",
  "Four Sharing",
];

const AVAILABILITY_OPTIONS = [
  "Available Now",
  "Available Next Month",
  "Fully Occupied",
];

export function StepRoomsPricing() {
  const { form } = useWizard();
  const { control, register, watch, setValue, formState: { errors } } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rooms",
  });

  const roomsValues = watch("rooms") || [];

  // Local state to keep track of expanded configurations
  const [expandedIndices, setExpandedIndices] = React.useState<Record<number, boolean>>({ 0: true });

  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleAddConfiguration = () => {
    append({
      roomType: "Single Sharing",
      rent: 0,
      securityDeposit: 0,
      availableRooms: 1,
      availability: "Available Now",
      mealsIncluded: false,
      electricity: "Included",
    });
    // Expand the newly added configuration automatically
    setExpandedIndices((prev) => ({
      ...prev,
      [fields.length]: true,
    }));
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex justify-between items-center">
        <span className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
          Room Plans & Rates
        </span>
        <button
          type="button"
          onClick={handleAddConfiguration}
          className="flex items-center gap-1 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all duration-300 shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Configuration
        </button>
      </div>

      {roomsValues.length === 0 && (
        <div className="flex items-center gap-3 border border-dashed border-amber-300 bg-amber-500/10 p-5 rounded-2xl">
          <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0" />
          <div className="space-y-0.5">
            <h5 className="font-heading text-xs font-bold text-amber-500">
              No Room configurations
            </h5>
            <p className="font-body text-[11px] text-muted-foreground leading-relaxed">
              At least one room configuration is required to list your property. Click &quot;Add Configuration&quot; above to get started.
            </p>
          </div>
        </div>
      )}

      {/* Dynamic configurations list */}
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {fields.map((field, index) => {
            const isExpanded = expandedIndices[index] !== false;
            const currentRoomType = roomsValues[index]?.roomType || "Single Sharing";
            const currentRent = roomsValues[index]?.rent;
            const currentMeals = roomsValues[index]?.mealsIncluded;
            const currentElectricity = roomsValues[index]?.electricity;

            // Retrieve form errors for specific indexes
            const roomErrors = errors.rooms?.[index];

            return (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                transition={{ duration: 0.3 }}
                className="bg-card/75 border border-border/80 rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Accordion Header */}
                <div 
                  onClick={() => toggleExpand(index)}
                  className="flex items-center justify-between p-4.5 bg-muted/20 border-b border-border/40 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-heading font-extrabold text-primary">
                      Configuration #{index + 1}
                    </span>
                    <span className="bg-primary/10 text-primary text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg">
                      {currentRoomType}
                    </span>
                    {currentRent && (
                      <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                        ₹{currentRent} / mo
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(index);
                      }}
                      className="p-1.5 rounded-lg border border-border hover:border-rose-500/30 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-all duration-200 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform duration-300",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </div>
                </div>

                {/* Accordion Content */}
                <div
                  className={cn(
                    "transition-all duration-300",
                    isExpanded ? "p-5 block" : "hidden"
                  )}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    {/* Room Type */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                        Room Type
                      </label>
                      <div className="relative flex items-center">
                        <select
                          {...register(`rooms.${index}.roomType` as const)}
                          className="w-full bg-card border border-border/80 rounded-xl px-4.5 py-3 text-xs font-semibold font-body text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 appearance-none cursor-pointer"
                        >
                          {ROOM_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>

                    {/* Rent */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                        Monthly Rent (₹) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 8500"
                        {...register(`rooms.${index}.rent` as const, { valueAsNumber: true })}
                        className={cn(
                          "w-full bg-card border rounded-xl px-4.5 py-3 text-xs font-semibold font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all duration-300",
                          roomErrors?.rent ? "border-rose-500 focus:border-rose-500" : "border-border/80 focus:border-primary"
                        )}
                      />
                      {roomErrors?.rent && (
                        <span className="text-[10px] font-semibold text-rose-500 pl-0.5">
                          {roomErrors.rent.message}
                        </span>
                      )}
                    </div>

                    {/* Security Deposit */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                        Security Deposit (₹) <span className="text-muted-foreground/50 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 15000"
                        {...register(`rooms.${index}.securityDeposit` as const, { valueAsNumber: true })}
                        className="w-full bg-card border border-border/80 rounded-xl px-4.5 py-3 text-xs font-semibold font-body text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300"
                      />
                    </div>

                    {/* Available Rooms */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                        Number of Rooms <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 5"
                        {...register(`rooms.${index}.availableRooms` as const, { valueAsNumber: true })}
                        className={cn(
                          "w-full bg-card border rounded-xl px-4.5 py-3 text-xs font-semibold font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all duration-300",
                          roomErrors?.availableRooms ? "border-rose-500 focus:border-rose-500" : "border-border/80 focus:border-primary"
                        )}
                      />
                      {roomErrors?.availableRooms && (
                        <span className="text-[10px] font-semibold text-rose-500 pl-0.5">
                          {roomErrors.availableRooms.message}
                        </span>
                      )}
                    </div>

                    {/* Availability */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                        Availability Status
                      </label>
                      <div className="relative flex items-center">
                        <select
                          {...register(`rooms.${index}.availability` as const)}
                          className="w-full bg-card border border-border/80 rounded-xl px-4.5 py-3 text-xs font-semibold font-body text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 appearance-none cursor-pointer"
                        >
                          {AVAILABILITY_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>

                    {/* Meals Included Toggle */}
                    <div className="flex flex-col gap-1.5 text-left justify-center pt-2">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5 block mb-1">
                        Meals / Mess Facility
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setValue(`rooms.${index}.mealsIncluded` as const, true, { shouldValidate: true })}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-[11px] font-extrabold uppercase transition-all duration-200 cursor-pointer",
                            currentMeals
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <Check className="w-3.5 h-3.5" />
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setValue(`rooms.${index}.mealsIncluded` as const, false, { shouldValidate: true })}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-[11px] font-extrabold uppercase transition-all duration-200 cursor-pointer",
                            !currentMeals
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <X className="w-3.5 h-3.5" />
                          No
                        </button>
                      </div>
                    </div>

                    {/* Electricity Radio */}
                    <div className="flex flex-col gap-1.5 text-left sm:col-span-2">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                        Electricity Billing
                      </label>
                      <div className="flex items-center gap-4 pl-1 mt-1">
                        {[
                          { value: "Included", label: "Electricity charges included in Rent" },
                          { value: "Extra Charges", label: "Charges extra (Sub-meter billable)" },
                        ].map((opt) => {
                          const isSel = currentElectricity === opt.value;
                          return (
                            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-muted-foreground hover:text-primary transition-colors duration-200 select-none">
                              <input
                                type="radio"
                                value={opt.value}
                                checked={isSel}
                                {...register(`rooms.${index}.electricity` as const)}
                                className="w-4 h-4 accent-primary cursor-pointer"
                              />
                              <span>{opt.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
export default StepRoomsPricing;
