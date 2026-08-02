"use client";

import * as React from "react";
import { useFieldArray } from "react-hook-form";
import { useWizard } from "./wizard-context";
import { Plus, Trash2, ChevronDown, Check, ShieldAlert, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { calculateRoomAvailability } from "@/lib/availability-utils";

const SHARING_TYPES = [
  "Single",
  "Double",
  "Triple",
  "Four Sharing",
  "Private Suite",
];

const GENDER_OPTIONS = ["Boys", "Girls", "Co-living", "Any"];

const FURNISHED_OPTIONS = ["Fully Furnished", "Semi Furnished", "Unfurnished"];

export function StepRoomsPricing() {
  const { form } = useWizard();
  const { control, register, watch, setValue, formState: { errors } } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rooms",
  });

  const roomsValues = watch("rooms") || [];

  // Track accordion expand state
  const [expandedIndices, setExpandedIndices] = React.useState<Record<number, boolean>>({ 0: true });

  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Find unused default sharing type for auto-filling
  const getNextAvailableSharingType = (): string => {
    const existingTypes = new Set(
      roomsValues.map((r) => (r.sharingType || r.roomType || "").trim().toLowerCase())
    );
    for (const type of SHARING_TYPES) {
      if (!existingTypes.has(type.toLowerCase())) {
        return type;
      }
    }
    return `Custom ${roomsValues.length + 1}`;
  };

  const handleAddConfiguration = () => {
    const nextType = getNextAvailableSharingType();
    append({
      sharingType: nextType,
      monthlyRent: 8000,
      securityDeposit: 10000,
      totalRooms: 5,
      availableRooms: 3,
      gender: "Boys",
      attachedBathroom: true,
      furnished: "Fully Furnished",
      roomType: nextType,
      rent: 8000,
    });

    setExpandedIndices((prev) => ({
      ...prev,
      [fields.length]: true,
    }));
  };

  // Check duplicate sharing types across current entries
  const currentSharingTypes = roomsValues.map((r) => (r.sharingType || r.roomType || "").trim().toLowerCase());
  const duplicateTypes = new Set(
    currentSharingTypes.filter((type, idx) => type.length > 0 && currentSharingTypes.indexOf(type) !== idx)
  );

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <span className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1 block">
            Room Configurations & Pricing
          </span>
          <p className="font-body text-xs text-muted-foreground">
            Configure different room options available at your property.
          </p>
        </div>
        <button
          type="button"
          data-no-intercept="true"
          onClick={handleAddConfiguration}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-xs font-bold px-4 py-3 rounded-xl transition-all duration-300 shadow-sm cursor-pointer border border-primary/20 shrink-0 min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Room Config</span>
        </button>
      </div>

      {/* Global Room Warnings */}
      {duplicateTypes.size > 0 && (
        <div className="flex items-center gap-3 border border-rose-500/30 bg-rose-500/10 p-4 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <p className="font-body text-xs font-semibold text-rose-500">
            Sharing types must be unique within the property. Duplicate detected.
          </p>
        </div>
      )}

      {roomsValues.length === 0 && (
        <div className="flex items-center gap-3 border border-dashed border-amber-300 bg-amber-500/10 p-5 rounded-2xl">
          <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0" />
          <div className="space-y-0.5">
            <h5 className="font-heading text-xs font-bold text-amber-500">
              At least one room configuration is required
            </h5>
            <p className="font-body text-[11px] text-muted-foreground leading-relaxed">
              Click &quot;Add Another Room Configuration&quot; above to create room choices for your tenants.
            </p>
          </div>
        </div>
      )}

      {/* Dynamic configurations list */}
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {fields.map((field, index) => {
            const isExpanded = expandedIndices[index] !== false;
            const currentRoom = roomsValues[index] || {};
            const currentType = currentRoom.sharingType || currentRoom.roomType || "Single";
            const currentRent = currentRoom.monthlyRent ?? currentRoom.rent ?? 0;
            const currentTotal = currentRoom.totalRooms ?? 1;
            const currentAvail = currentRoom.availableRooms ?? 1;
            const currentBath = currentRoom.attachedBathroom;
            const currentFurnished = currentRoom.furnished || "Fully Furnished";

            const availability = calculateRoomAvailability(currentAvail, currentTotal);

            const roomErrors = errors.rooms?.[index] as Record<string, { message?: string }> | undefined;
            const isDuplicate = duplicateTypes.has((currentType || "").trim().toLowerCase());

            return (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "bg-card/85 border rounded-2xl shadow-sm overflow-hidden text-left transition-all",
                  isDuplicate ? "border-rose-500/80 ring-2 ring-rose-500/10" : "border-border/80"
                )}
              >
                {/* Accordion Header Bar */}
                <div
                  onClick={() => toggleExpand(index)}
                  className="flex items-center justify-between p-4 bg-muted/20 border-b border-border/40 cursor-pointer select-none"
                >
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-heading font-extrabold text-primary">
                      Configuration #{index + 1}
                    </span>
                    <span className="bg-primary/10 text-primary text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg border border-primary/20">
                      {currentType}
                    </span>
                    {currentRent > 0 && (
                      <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-extrabold px-2.5 py-1 rounded-lg border border-emerald-500/20">
                        ₹{currentRent.toLocaleString()} / mo
                      </span>
                    )}
                    <span className={cn("text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border flex items-center gap-1.5", availability.bgColor, availability.textColor, availability.borderColor)}>
                      <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", availability.dotColor)} />
                      <span>{availability.label}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={fields.length <= 1}
                      data-no-intercept="true"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (fields.length > 1) {
                          remove(index);
                        }
                      }}
                      className={cn(
                        "p-1.5 rounded-lg border transition-all duration-200 shrink-0",
                        fields.length <= 1
                          ? "border-border/30 opacity-40 cursor-not-allowed text-muted-foreground"
                          : "border-border hover:border-rose-500/30 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 cursor-pointer"
                      )}
                      title={fields.length <= 1 ? "At least one room configuration is required" : "Remove Configuration"}
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

                {/* Accordion Body */}
                <div className={cn("transition-all duration-300", isExpanded ? "p-5 block space-y-5" : "hidden")}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* 1. Sharing Type */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                        Sharing Type <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <select
                          {...register(`rooms.${index}.sharingType` as const)}
                          onChange={(e) => {
                            setValue(`rooms.${index}.sharingType` as const, e.target.value, { shouldValidate: true });
                            setValue(`rooms.${index}.roomType` as const, e.target.value, { shouldValidate: true });
                          }}
                          className={cn(
                            "w-full bg-card border rounded-xl px-4 py-3 text-xs font-semibold font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer appearance-none",
                            isDuplicate ? "border-rose-500" : "border-border/80 focus:border-primary"
                          )}
                        >
                          {SHARING_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      </div>
                      {isDuplicate && (
                        <span className="text-[10px] font-semibold text-rose-500 pl-0.5">
                          Sharing Type cannot be duplicated within the same property
                        </span>
                      )}
                    </div>

                    {/* 2. Monthly Rent */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                        Monthly Rent (₹/month) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 8500"
                        {...register(`rooms.${index}.monthlyRent` as const, {
                          valueAsNumber: true,
                          onChange: (e) => {
                            setValue(`rooms.${index}.rent` as const, Number(e.target.value), { shouldValidate: true });
                          },
                        })}
                        className={cn(
                          "w-full bg-card border rounded-xl px-4 py-3 text-xs font-semibold font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all",
                          roomErrors?.monthlyRent ? "border-rose-500" : "border-border/80 focus:border-primary"
                        )}
                      />
                      {roomErrors?.monthlyRent && (
                        <span className="text-[10px] font-semibold text-rose-500 pl-0.5">
                          {roomErrors.monthlyRent.message}
                        </span>
                      )}
                    </div>

                    {/* 3. Security Deposit */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                        Security Deposit (₹) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 10000"
                        {...register(`rooms.${index}.securityDeposit` as const, { valueAsNumber: true })}
                        className={cn(
                          "w-full bg-card border rounded-xl px-4 py-3 text-xs font-semibold font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all",
                          roomErrors?.securityDeposit ? "border-rose-500" : "border-border/80 focus:border-primary"
                        )}
                      />
                      {roomErrors?.securityDeposit && (
                        <span className="text-[10px] font-semibold text-rose-500 pl-0.5">
                          {roomErrors.securityDeposit.message}
                        </span>
                      )}
                    </div>

                    {/* 4. Total Rooms */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                        Total Rooms <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 5"
                        {...register(`rooms.${index}.totalRooms` as const, { valueAsNumber: true })}
                        className={cn(
                          "w-full bg-card border rounded-xl px-4 py-3 text-xs font-semibold font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all",
                          roomErrors?.totalRooms ? "border-rose-500" : "border-border/80 focus:border-primary"
                        )}
                      />
                      {roomErrors?.totalRooms && (
                        <span className="text-[10px] font-semibold text-rose-500 pl-0.5">
                          {roomErrors.totalRooms.message}
                        </span>
                      )}
                    </div>

                    {/* 5. Available Rooms */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                        Available Rooms <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 3"
                        {...register(`rooms.${index}.availableRooms` as const, { valueAsNumber: true })}
                        className={cn(
                          "w-full bg-card border rounded-xl px-4 py-3 text-xs font-semibold font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all",
                          roomErrors?.availableRooms ? "border-rose-500" : "border-border/80 focus:border-primary"
                        )}
                      />
                      {roomErrors?.availableRooms && (
                        <span className="text-[10px] font-semibold text-rose-500 pl-0.5">
                          {roomErrors.availableRooms.message}
                        </span>
                      )}
                      {currentAvail > currentTotal && (
                        <span className="text-[10px] font-semibold text-rose-500 pl-0.5">
                          Available Rooms cannot exceed Total Rooms ({currentTotal})
                        </span>
                      )}
                    </div>

                    {/* Automatic Calculated Availability Indicator */}
                    <div className="flex flex-col gap-1.5 text-left sm:col-span-2">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                        Automatic Availability Status
                      </label>
                      <div className={cn("p-3 rounded-xl border flex flex-wrap items-center justify-between font-heading text-xs font-extrabold transition-all gap-2", availability.bgColor, availability.textColor, availability.borderColor)}>
                        <div className="flex items-center gap-2">
                          <span className={cn("w-2.5 h-2.5 rounded-full animate-pulse", availability.dotColor)} />
                          <span>{availability.label}</span>
                        </div>
                        <span className="font-body text-[11px] font-semibold text-muted-foreground">
                          {currentAvail} of {currentTotal} rooms available ({currentTotal > 0 ? Math.round((currentAvail / currentTotal) * 100) : 0}% inventory)
                        </span>
                      </div>
                    </div>

                    {/* 6. Gender */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                        Allowed Gender
                      </label>
                      <div className="relative flex items-center">
                        <select
                          {...register(`rooms.${index}.gender` as const)}
                          className="w-full bg-card border border-border/80 rounded-xl px-4 py-3 text-xs font-semibold font-body text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer appearance-none"
                        >
                          {GENDER_OPTIONS.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>

                    {/* 7. Attached Bathroom Toggle */}
                    <div className="flex flex-col gap-1.5 text-left justify-center">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5 block">
                        Bathroom Setup
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          data-no-intercept="true"
                          onClick={() => setValue(`rooms.${index}.attachedBathroom` as const, true, { shouldValidate: true })}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                            currentBath
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <Check className="w-3.5 h-3.5" />
                          Attached Bath
                        </button>
                        <button
                          type="button"
                          data-no-intercept="true"
                          onClick={() => setValue(`rooms.${index}.attachedBathroom` as const, false, { shouldValidate: true })}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                            !currentBath
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Shared Bath
                        </button>
                      </div>
                    </div>

                    {/* 8. Furnished Status */}
                    <div className="flex flex-col gap-1.5 text-left sm:col-span-2">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                        Furnishing Status
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {FURNISHED_OPTIONS.map((opt) => {
                          const isSel = currentFurnished === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              data-no-intercept="true"
                              onClick={() => setValue(`rooms.${index}.furnished` as const, opt as "Fully Furnished" | "Semi Furnished" | "Unfurnished", { shouldValidate: true })}
                              className={cn(
                                "py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center truncate",
                                isSel
                                  ? "bg-primary/10 border-primary text-primary shadow-sm"
                                  : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                              )}
                            >
                              {opt}
                            </button>
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
