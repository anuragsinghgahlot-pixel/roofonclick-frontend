import * as React from "react";
import { useWizard } from "./wizard-context";
import { Check, Info, Shield, Utensils, Zap, Car, Home, Compass, ClipboardList, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { HouseRules } from "@/services/property";

const AMENITY_CATEGORIES = [
  {
    id: "basic",
    title: "Basic Amenities",
    icon: Zap,
    items: ["Wi-Fi", "Power Backup", "RO Water", "Geyser", "Washing Machine", "Refrigerator", "Water Cooler"],
  },
  {
    id: "room",
    title: "Room Features",
    icon: Home,
    items: ["Air Conditioner", "Attached Bathroom", "Balcony", "Study Table", "Wardrobe", "Mattress", "Fan", "Bed", "Pillow", "Bedsheet"],
  },
  {
    id: "kitchen",
    title: "Food & Kitchen",
    icon: Utensils,
    items: ["Breakfast", "Lunch", "Dinner", "Evening Snacks", "Kitchen Access", "Induction Allowed", "Refrigerator Access", "Microwave"],
  },
  {
    id: "security",
    title: "Safety & Security",
    icon: Shield,
    items: ["CCTV", "Biometric Entry", "Security Guard", "Fire Extinguisher", "First Aid Kit", "Visitor Register"],
  },
  {
    id: "services",
    title: "Services",
    icon: ClipboardList,
    items: ["Daily Cleaning", "Laundry", "Housekeeping", "Garbage Collection"],
  },
  {
    id: "parking",
    title: "Parking",
    icon: Car,
    items: ["Bike Parking", "Car Parking"],
  },
  {
    id: "common",
    title: "Common Areas",
    icon: Compass,
    items: ["Common Hall", "TV Lounge", "Gym", "Rooftop", "Garden", "Indoor Games", "Outdoor Games"],
  },
];

const NEARBY_FACILITIES = [
  "Metro", "Bus Stop", "Hospital", "College", "Market", "ATM", "Pharmacy", "Restaurant", "Mall"
];



export function StepAmenities() {
  const { form } = useWizard();
  const { watch, setValue } = form;

  const selectedAmenities = watch("amenities") || [];
  const selectedNearby = watch("nearby") || [];
  
  const smokingAllowed = watch("rules.smokingAllowed") || false;
  const drinkingAllowed = watch("rules.drinkingAllowed") || false;
  const visitorsAllowed = watch("rules.visitorsAllowed") || false;
  const petsAllowed = watch("rules.petsAllowed") || false;
  const loudMusicAllowed = watch("rules.loudMusicAllowed") || false;
  const gateClosingEnabled = watch("rules.gateClosingEnabled") || false;
  const gateClosingTime = watch("rules.gateClosingTime") || "22:00";

  // Toggle selected amenities list
  const handleToggleAmenity = (item: string) => {
    const next = selectedAmenities.includes(item)
      ? selectedAmenities.filter((x: string) => x !== item)
      : [...selectedAmenities, item];
    setValue("amenities", next, { shouldValidate: true });
  };

  // Toggle selected nearby list
  const handleToggleNearby = (item: string) => {
    const next = selectedNearby.includes(item)
      ? selectedNearby.filter((x: string) => x !== item)
      : [...selectedNearby, item];
    setValue("nearby", next, { shouldValidate: true });
  };

  // Toggle boolean house rule
  const handleToggleRule = (key: keyof HouseRules | string, currentVal: boolean) => {
    setValue(`rules.${key as keyof HouseRules}`, !currentVal, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      
      {/* Property Structure Type */}
      <div className="space-y-3 bg-card border border-border/80 p-5 rounded-2xl shadow-xs">
        <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider block text-left">
          Property Structure & Ownership Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setValue("propertyManagementType", "Independent Property", { shouldValidate: true })}
            className={cn(
              "flex flex-col items-start p-4 rounded-xl border transition-all text-left cursor-pointer",
              watch("propertyManagementType") === "Independent Property"
                ? "bg-primary/10 border-primary text-primary font-bold shadow-xs"
                : "bg-muted/30 border-border/80 text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              <Check className={cn("w-4 h-4", watch("propertyManagementType") === "Independent Property" ? "text-primary" : "opacity-0")} />
              <span className="font-heading text-xs font-bold">Independent Property</span>
            </div>
            <span className="font-body text-[10px] text-muted-foreground mt-1">
              Separate entrance, independent management, full privacy for residents.
            </span>
          </button>

          <button
            type="button"
            onClick={() => setValue("propertyManagementType", "Non-Independent Property", { shouldValidate: true })}
            className={cn(
              "flex flex-col items-start p-4 rounded-xl border transition-all text-left cursor-pointer",
              watch("propertyManagementType") === "Non-Independent Property"
                ? "bg-primary/10 border-primary text-primary font-bold shadow-xs"
                : "bg-muted/30 border-border/80 text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              <Check className={cn("w-4 h-4", watch("propertyManagementType") === "Non-Independent Property" ? "text-primary" : "opacity-0")} />
              <span className="font-heading text-xs font-bold">Non-Independent Property</span>
            </div>
            <span className="font-body text-[10px] text-muted-foreground mt-1">
              Shared premises, owner residing on property or warden supervised.
            </span>
          </button>
        </div>
      </div>

      {/* Categorized Amenities */}
      <div className="space-y-6">
        {AMENITY_CATEGORIES.map((cat) => {
          const CategoryIcon = cat.icon;
          return (
            <div key={cat.id} className="space-y-3">
              <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                <CategoryIcon className="w-4.5 h-4.5 text-secondary shrink-0" />
                <h3 className="font-heading text-xs font-extrabold uppercase tracking-wider text-primary">
                  {cat.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {cat.items.map((item) => {
                  const isSelected = selectedAmenities.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleToggleAmenity(item)}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-sm select-none",
                        isSelected
                          ? "bg-primary/10 border-primary text-primary font-bold shadow-[0_3px_10px_rgba(34,197,94,0.06)]"
                          : "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:border-primary"
                      )}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* House Rules */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/40 pb-2">
          <ClipboardList className="w-4.5 h-4.5 text-secondary shrink-0" />
          <h3 className="font-heading text-xs font-extrabold uppercase tracking-wider text-primary">
            House Rules / Allowances
          </h3>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {[
            { key: "smokingAllowed", label: "Smoking Allowed", emoji: "🚬", val: smokingAllowed },
            { key: "drinkingAllowed", label: "Drinking Allowed", emoji: "🍺", val: drinkingAllowed },
            { key: "visitorsAllowed", label: "Visitors Allowed", emoji: "👥", val: visitorsAllowed },
            { key: "petsAllowed", label: "Pets Allowed", emoji: "🐾", val: petsAllowed },
            { key: "loudMusicAllowed", label: "Loud Music Allowed", emoji: "🔊", val: loudMusicAllowed },
          ].map((rule) => {
            const isSelected = rule.val;
            return (
              <button
                key={rule.key}
                type="button"
                onClick={() => handleToggleRule(rule.key, rule.val)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[11px] font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-sm select-none min-h-[44px]",
                  isSelected
                    ? "bg-primary/10 border-primary text-primary shadow-[0_3px_10px_rgba(34,197,94,0.06)]"
                    : "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:border-primary"
                )}
              >
                <span>{rule.emoji}</span>
                <span>{rule.label}</span>
              </button>
            );
          })}
        </div>

        {/* Gate Closing Rule Section */}
        <div className="bg-card/75 border border-border/80 rounded-2xl p-4.5 sm:p-6 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5 text-left">
            <h4 className="font-heading text-xs font-bold text-primary">
              🔒 Gate Closing Schedule
            </h4>
            <p className="font-body text-[11px] text-muted-foreground leading-relaxed">
              Enable this if your PG/Hostel has strict evening gate lockout timings.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setValue("rules.gateClosingEnabled", !gateClosingEnabled, { shouldValidate: true })}
              className={cn(
                "px-4 py-2.5 rounded-xl border text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer select-none",
                gateClosingEnabled
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-card border-border/80 text-muted-foreground"
              )}
            >
              {gateClosingEnabled ? "Enabled" : "Disabled"}
            </button>

            {gateClosingEnabled && (
              <input
                type="time"
                value={gateClosingTime}
                onChange={(e) => setValue("rules.gateClosingTime", e.target.value, { shouldValidate: true })}
                className="bg-card border border-border/85 rounded-xl px-3 py-2 text-xs font-bold text-primary focus:outline-none focus:border-primary"
              />
            )}
          </div>
        </div>
      </div>

      {/* Nearby Facilities */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-border/40 pb-2">
          <MapPin className="w-4.5 h-4.5 text-secondary shrink-0" />
          <h3 className="font-heading text-xs font-extrabold uppercase tracking-wider text-primary">
            Nearby Facilities <span className="text-muted-foreground/50 font-normal normal-case">(Optional)</span>
          </h3>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {NEARBY_FACILITIES.map((item) => {
            const isSelected = selectedNearby.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => handleToggleNearby(item)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-sm select-none",
                  isSelected
                    ? "bg-primary/10 border-primary text-primary font-bold shadow-[0_3px_10px_rgba(34,197,94,0.06)]"
                    : "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:border-primary"
                )}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
export default StepAmenities;
