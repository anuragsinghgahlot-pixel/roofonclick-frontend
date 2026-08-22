"use client";

import * as React from "react";
import { useFieldArray } from "react-hook-form";
import { useWizard, isApartmentType } from "./wizard-context";
import {
  Plus,
  Trash2,
  ChevronDown,
  ShieldAlert,
  Sparkles,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { calculateRoomAvailability } from "@/lib/availability-utils";

export const CONFIG_PRESETS = [
  { value: "1 BHK", label: "1 BHK Flat", icon: "🛏️", category: "apartment" },
  { value: "2 BHK", label: "2 BHK Flat", icon: "🛋️", category: "apartment" },
  { value: "1 RK", label: "1 RK Unit", icon: "🍳", category: "apartment" },
  { value: "Studio Apartment", label: "Studio Apt", icon: "🏢", category: "apartment" },
  { value: "3 BHK", label: "3 BHK Flat", icon: "🏰", category: "apartment" },
  { value: "Single", label: "Single Room", icon: "👤", category: "hostel" },
  { value: "Double", label: "Double Sharing", icon: "👥", category: "hostel" },
  { value: "Triple", label: "Triple Sharing", icon: "👨‍👦‍👦", category: "hostel" },
  { value: "Four Sharing", label: "Four Sharing", icon: "🧑‍🤝‍🧑", category: "hostel" },
  { value: "Private Suite", label: "Private Suite", icon: "⭐", category: "hostel" },
];

const FURNISHED_OPTIONS = ["Fully Furnished", "Semi Furnished", "Unfurnished"] as const;
const KITCHEN_OPTIONS = ["Attached Kitchen", "Modular Kitchen", "Open Kitchen", "None"];
const BATHROOM_OPTIONS = [
  { label: "Attached Bath", value: true },
  { label: "Common Bath", value: false },
];
const GENDER_OPTIONS = [
  { label: "Boys Only", value: "Boys" },
  { label: "Girls Only", value: "Girls" },
  { label: "Family / Any", value: "Any" },
  { label: "Co-living", value: "Co-living" },
] as const;
const PARKING_OPTIONS = ["Bike", "Car", "Both", "None"];
const BROKERAGE_OPTIONS = ["Zero Brokerage", "15 Days Rent", "1 Month Rent"];

export function StepRoomsPricing() {
  const { form } = useWizard();
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const propertyType = watch("propertyType") || "Hostel";
  const isApartment = isApartmentType(propertyType);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rooms",
  });

  const roomsValues = watch("rooms") || [];
  const apartmentDetails = watch("apartmentDetails") || {};
  const apartmentPricing = watch("apartmentPricing") || {};

  // Accordion open/close state
  const [expandedIndices, setExpandedIndices] = React.useState<Record<number, boolean>>({ 0: true });
  const [showBuildingFeatures, setShowBuildingFeatures] = React.useState(isApartment);

  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Ensure at least 1 room configuration is present on mount
  React.useEffect(() => {
    if (fields.length === 0) {
      const defaultType = isApartment ? (propertyType === "Apartment" ? "1 BHK" : propertyType) : "Single";
      append({
        sharingType: defaultType,
        monthlyRent: isApartment ? 12000 : 8000,
        securityDeposit: isApartment ? 12000 : 10000,
        totalRooms: 3,
        availableRooms: 2,
        gender: "Boys",
        attachedBathroom: true,
        furnished: "Fully Furnished",
        roomType: defaultType,
        rent: isApartment ? 12000 : 8000,
      });
      setExpandedIndices({ 0: true });
    }
  }, [fields.length, append, isApartment, propertyType]);

  const handleAddConfiguration = () => {
    const existingTypes = new Set(roomsValues.map((r) => (r.sharingType || r.roomType || "").trim().toLowerCase()));
    let nextType = isApartment ? "2 BHK" : "Double";

    for (const preset of CONFIG_PRESETS) {
      if (!existingTypes.has(preset.value.toLowerCase())) {
        nextType = preset.value;
        break;
      }
    }

    const defaultRent = nextType.includes("2 BHK")
      ? 18000
      : nextType.includes("1 BHK")
      ? 12000
      : nextType.includes("RK")
      ? 7000
      : 8000;

    append({
      sharingType: nextType,
      monthlyRent: defaultRent,
      securityDeposit: defaultRent,
      totalRooms: 3,
      availableRooms: 2,
      gender: "Boys",
      attachedBathroom: true,
      furnished: "Fully Furnished",
      roomType: nextType,
      rent: defaultRent,
    });

    setExpandedIndices((prev) => ({
      ...prev,
      [fields.length]: true,
    }));
  };

  return (
    <div className="flex flex-col gap-6 text-left w-full max-w-full min-w-0">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-3 w-full min-w-0">
        <div className="min-w-0">
          <span className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1 block">
            Pricing & Unit Configurations
          </span>
          <p className="font-body text-xs text-muted-foreground">
            Add all flat & room options in your building (e.g. 1 BHK, 2 BHK, 1 RK, Single / Double sharing).
          </p>
        </div>
        <button
          type="button"
          data-no-intercept="true"
          onClick={handleAddConfiguration}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-xs font-bold px-4 py-3 rounded-xl transition-all duration-300 shadow-sm cursor-pointer border border-primary/20 shrink-0 min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Another Unit / Room Config</span>
        </button>
      </div>

      {roomsValues.length === 0 && (
        <div className="flex items-center gap-3 border border-dashed border-amber-300 bg-amber-500/10 p-5 rounded-2xl">
          <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0" />
          <div className="space-y-0.5">
            <h5 className="font-heading text-xs font-bold text-amber-500">
              At least one room or flat configuration is required
            </h5>
            <p className="font-body text-[11px] text-muted-foreground leading-relaxed">
              Click &quot;+ Add Another Unit / Room Config&quot; above to create choices for your tenants.
            </p>
          </div>
        </div>
      )}

      {/* Repeatable Configuration Cards */}
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {fields.map((field, index) => {
            const isExpanded = expandedIndices[index] !== false;
            const currentRoom = roomsValues[index] || {};
            const currentType = currentRoom.sharingType || currentRoom.roomType || "Unit";
            const currentRent = currentRoom.monthlyRent ?? currentRoom.rent ?? 0;
            const currentTotal = currentRoom.totalRooms ?? 1;
            const currentAvail = currentRoom.availableRooms ?? 1;
            const currentBath = currentRoom.attachedBathroom !== false;
            const currentFurnished = currentRoom.furnished || "Fully Furnished";
            const currentGender = currentRoom.gender || "Boys";

            const availability = calculateRoomAvailability(currentAvail, currentTotal);
            const roomErrors = errors.rooms?.[index] as Record<string, { message?: string }> | undefined;

            return (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                transition={{ duration: 0.25 }}
                className="bg-card/90 border border-border/80 rounded-2xl shadow-sm overflow-hidden text-left transition-all"
              >
                {/* Accordion Header Bar */}
                <div
                  onClick={() => toggleExpand(index)}
                  className="flex items-center justify-between p-4 bg-muted/20 border-b border-border/40 cursor-pointer select-none gap-2"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-heading font-extrabold text-primary">
                      Option #{index + 1}:
                    </span>
                    <span className="bg-primary/10 text-primary text-xs font-extrabold px-2.5 py-1 rounded-lg border border-primary/20 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-secondary" />
                      {currentType}
                    </span>
                    {currentRent > 0 && (
                      <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-extrabold px-2.5 py-1 rounded-lg border border-emerald-500/20">
                        ₹{currentRent.toLocaleString()}/mo
                      </span>
                    )}
                    <span
                      className={cn(
                        "text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border flex items-center gap-1.5",
                        availability.bgColor,
                        availability.textColor,
                        availability.borderColor
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", availability.dotColor)} />
                      <span>
                        {currentAvail}/{currentTotal} Available
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={fields.length <= 1}
                      data-no-intercept="true"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (fields.length > 1) remove(index);
                      }}
                      className={cn(
                        "p-1.5 rounded-lg border transition-all duration-200",
                        fields.length <= 1
                          ? "border-border/30 opacity-40 cursor-not-allowed text-muted-foreground"
                          : "border-border hover:border-rose-500/30 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 cursor-pointer"
                      )}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronDown
                      className={cn("w-4 h-4 text-muted-foreground transition-transform duration-300", isExpanded && "rotate-180")}
                    />
                  </div>
                </div>

                {/* Accordion Body */}
                <div className={cn("transition-all duration-300", isExpanded ? "p-5 block space-y-5" : "hidden")}>
                  {/* 1. Quick Presets Bar */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                      Select Unit / Room Type <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {CONFIG_PRESETS.map((preset) => {
                        const isSelected = (currentType || "").toLowerCase() === preset.value.toLowerCase();
                        return (
                          <button
                            key={preset.value}
                            type="button"
                            onClick={() => {
                              setValue(`rooms.${index}.sharingType` as const, preset.value, { shouldValidate: true });
                              setValue(`rooms.${index}.roomType` as const, preset.value, { shouldValidate: true });
                            }}
                            className={cn(
                              "px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer select-none",
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                : "bg-card border-border/80 text-foreground hover:border-primary/40 hover:bg-muted/30"
                            )}
                          >
                            <span>{preset.icon}</span>
                            <span>{preset.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Custom Title Input */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                      Custom Unit / Room Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1 BHK Deluxe or 2 BHK with Balcony"
                      {...register(`rooms.${index}.sharingType` as const)}
                      className="w-full bg-card border border-border/80 focus:border-primary rounded-xl px-4 py-3 text-xs font-semibold font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>

                  {/* 3. Pricing & Units Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Monthly Rent */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                        Monthly Rent (₹/month) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 12000"
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

                    {/* Security Deposit */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                        Security Deposit (₹) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 12000"
                        {...register(`rooms.${index}.securityDeposit` as const, { valueAsNumber: true })}
                        className={cn(
                          "w-full bg-card border rounded-xl px-4 py-3 text-xs font-semibold font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all",
                          roomErrors?.securityDeposit ? "border-rose-500" : "border-border/80 focus:border-primary"
                        )}
                      />
                    </div>

                    {/* Total Units / Rooms in Building */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                        Total Units / Rooms in Building <span className="text-rose-500">*</span>
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

                    {/* Available Right Now */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                        Available Units / Rooms Right Now <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 2"
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
                    </div>

                    {/* Furnishing Status */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                        Furnishing Status
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {FURNISHED_OPTIONS.map((opt) => {
                          const isSel = currentFurnished === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              data-no-intercept="true"
                              onClick={() => setValue(`rooms.${index}.furnished` as const, opt, { shouldValidate: true })}
                              className={cn(
                                "py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center select-none whitespace-nowrap",
                                isSel
                                  ? "bg-primary/10 border-primary text-primary shadow-xs"
                                  : "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/30"
                              )}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Attached Bathroom Toggle */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                        Bathroom Setup
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {BATHROOM_OPTIONS.map((opt) => {
                          const isSel = currentBath === opt.value;
                          return (
                            <button
                              key={opt.label}
                              type="button"
                              data-no-intercept="true"
                              onClick={() => setValue(`rooms.${index}.attachedBathroom` as const, opt.value, { shouldValidate: true })}
                              className={cn(
                                "py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center select-none whitespace-nowrap",
                                isSel
                                  ? "bg-primary/10 border-primary text-primary shadow-xs"
                                  : "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/30"
                              )}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Target Occupancy / Gender */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                      Target Tenant / Gender
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {GENDER_OPTIONS.map((opt) => {
                        const isSel = currentGender === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            data-no-intercept="true"
                            onClick={() => setValue(`rooms.${index}.gender` as const, opt.value, { shouldValidate: true })}
                            className={cn(
                              "py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center select-none whitespace-nowrap",
                              isSel
                                ? "bg-primary/10 border-primary text-primary shadow-xs"
                                : "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/30"
                            )}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add another configuration CTA */}
      <button
        type="button"
        data-no-intercept="true"
        onClick={handleAddConfiguration}
        className="w-full py-3.5 rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer select-none"
      >
        <Plus className="w-4 h-4" />
        <span>+ Add Another Unit / Flat Configuration (e.g. 1 BHK, 2 BHK, RK, Single)</span>
      </button>

      {/* Expandable Building-wide Features Section */}
      <div className="bg-card/80 border border-border/80 rounded-2xl p-5 space-y-4 text-left shadow-xs">
        <div
          onClick={() => setShowBuildingFeatures(!showBuildingFeatures)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-secondary" />
            <h4 className="font-heading text-xs font-extrabold uppercase tracking-wider text-primary">
              Building Amenities & Parking Options
            </h4>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-300",
              showBuildingFeatures && "rotate-180"
            )}
          />
        </div>

        {showBuildingFeatures && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/40">
            {/* Kitchen Type */}
            <div className="flex flex-col gap-1.5">
              <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                Kitchen Facility
              </label>
              <select
                value={apartmentDetails.kitchenType || "Modular Kitchen"}
                onChange={(e) => setValue("apartmentDetails.kitchenType", e.target.value, { shouldValidate: true })}
                className="w-full bg-card border border-border/80 rounded-xl px-4 py-3 text-xs font-semibold font-body text-foreground focus:outline-none focus:border-primary transition-all cursor-pointer"
              >
                {KITCHEN_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Parking */}
            <div className="flex flex-col gap-1.5">
              <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                Parking Setup
              </label>
              <select
                value={apartmentDetails.parking || "Both"}
                onChange={(e) => setValue("apartmentDetails.parking", e.target.value, { shouldValidate: true })}
                className="w-full bg-card border border-border/80 rounded-xl px-4 py-3 text-xs font-semibold font-body text-foreground focus:outline-none focus:border-primary transition-all cursor-pointer"
              >
                {PARKING_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "Both" ? "Bike & Car Both" : opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Balcony */}
            <div className="flex flex-col gap-1.5">
              <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                Balcony
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Balcony Available", val: true },
                  { label: "No Balcony", val: false },
                ].map((item) => {
                  const isSel = (apartmentDetails.balcony ?? true) === item.val;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      data-no-intercept="true"
                      onClick={() => setValue("apartmentDetails.balcony", item.val, { shouldValidate: true })}
                      className={cn(
                        "py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center select-none truncate",
                        isSel
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lift */}
            <div className="flex flex-col gap-1.5">
              <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                Lift / Elevator
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Lift Available", val: true },
                  { label: "Stairs Only", val: false },
                ].map((item) => {
                  const isSel = (apartmentDetails.liftAvailable ?? true) === item.val;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      data-no-intercept="true"
                      onClick={() => setValue("apartmentDetails.liftAvailable", item.val, { shouldValidate: true })}
                      className={cn(
                        "py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center select-none truncate",
                        isSel
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Maintenance */}
            <div className="flex flex-col gap-1.5">
              <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                Maintenance (₹/month)
              </label>
              <input
                type="number"
                placeholder="e.g. 1000"
                value={apartmentPricing.maintenance ?? 0}
                onChange={(e) => setValue("apartmentPricing.maintenance", Number(e.target.value), { shouldValidate: true })}
                className="w-full bg-card border border-border/80 rounded-xl px-4 py-3 text-xs font-semibold font-body text-foreground focus:outline-none focus:border-primary transition-all"
              />
            </div>

            {/* Brokerage */}
            <div className="flex flex-col gap-1.5">
              <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
                Brokerage
              </label>
              <select
                value={apartmentPricing.brokerage || "Zero Brokerage"}
                onChange={(e) => setValue("apartmentPricing.brokerage", e.target.value, { shouldValidate: true })}
                className="w-full bg-card border border-border/80 rounded-xl px-4 py-3 text-xs font-semibold font-body text-foreground focus:outline-none focus:border-primary transition-all cursor-pointer"
              >
                {BROKERAGE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StepRoomsPricing;
