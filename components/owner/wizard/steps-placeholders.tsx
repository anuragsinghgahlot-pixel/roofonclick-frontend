import * as React from "react";
import { useWizard } from "./wizard-context";
import { Sparkles, Image as ImageIcon, CheckCircle, MapPin, Building } from "lucide-react";
import { RoomConfiguration, MediaImage } from "@/services/property";

// Step 4 Placeholder: Amenities
export function StepAmenities() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm text-3xl select-none">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>
      <div className="space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary block">
          Step 4 Configuration
        </span>
        <h3 className="font-heading text-lg font-extrabold text-primary">
          Facilities & Conveniences
        </h3>
        <p className="font-body text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Select property facilities like high-speed Wi-Fi, air conditioning, laundry amenities, daily mess options, and security services.
        </p>
      </div>
    </div>
  );
}

// Step 5 Placeholder: Photos
export function StepPhotos() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shadow-sm text-3xl select-none">
        <ImageIcon className="w-8 h-8 text-accent" />
      </div>
      <div className="space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent block">
          Step 5 Configuration
        </span>
        <h3 className="font-heading text-lg font-extrabold text-primary">
          Media Uploads
        </h3>
        <p className="font-body text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Upload premium high-resolution images of rooms, bathrooms, building exterior, and communal dining/study zones.
        </p>
      </div>
    </div>
  );
}

// Step 6: Complete Review & Publish Step
export function StepReview() {
  const { form, handlePublish, isEditMode } = useWizard();
  const values = form.getValues();

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/25 p-4.5 rounded-2xl">
        <CheckCircle className="w-5.5 h-5.5 text-emerald-600 shrink-0" />
        <p className="font-body text-xs font-semibold text-emerald-700">
          Your listing draft is fully validated! Please review the details below before publishing your stay on RoofOnClick.
        </p>
      </div>

      <div className="space-y-6 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
        {/* Basic Details Summary */}
        <div className="bg-muted/30 border border-border/60 rounded-2xl p-5 space-y-3">
          <h4 className="font-heading text-xs font-extrabold uppercase tracking-wider text-secondary flex items-center gap-1.5 border-b border-border/40 pb-2">
            <Building className="w-4.5 h-4.5" />
            Basic Summary
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-semibold text-muted-foreground block">Property Name</span>
              <span className="font-body text-xs font-bold text-primary">{values.propertyName || "—"}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-muted-foreground block">Type & Gender</span>
              <span className="font-body text-xs font-bold text-primary">
                {values.propertyType || "—"} ({values.gender || "—"})
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] font-semibold text-muted-foreground block">Short Description</span>
              <span className="font-body text-xs text-muted-foreground leading-relaxed italic block">
                &quot;{values.description || "No description provided."}&quot;
              </span>
            </div>
          </div>
        </div>

        {/* Location Summary */}
        <div className="bg-muted/30 border border-border/60 rounded-2xl p-5 space-y-3">
          <h4 className="font-heading text-xs font-extrabold uppercase tracking-wider text-secondary flex items-center gap-1.5 border-b border-border/40 pb-2">
            <MapPin className="w-4.5 h-4.5" />
            Location Details
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-semibold text-muted-foreground block">Area / City</span>
              <span className="font-body text-xs font-bold text-primary">{values.area || "—"}, {values.city || "—"}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-muted-foreground block">Landmark</span>
              <span className="font-body text-xs font-bold text-primary">{values.landmark || "—"}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] font-semibold text-muted-foreground block">Complete Address</span>
              <span className="font-body text-xs text-primary leading-relaxed block">{values.address || "—"}</span>
            </div>
          </div>
        </div>

        {/* Room Configurations Summary */}
        <div className="bg-muted/30 border border-border/60 rounded-2xl p-5 space-y-3">
          <h4 className="font-heading text-xs font-extrabold uppercase tracking-wider text-secondary flex items-center gap-1.5 border-b border-border/40 pb-2">
            ₹ Pricing & Rooms
          </h4>
          <div className="space-y-3">
            {(values.rooms || []).map((room: RoomConfiguration, idx: number) => (
              <div key={idx} className="flex justify-between items-center bg-card border border-border/45 p-3 rounded-xl">
                <div>
                  <span className="font-heading text-xs font-bold text-primary block">{room.roomType}</span>
                  <span className="font-body text-[10px] text-muted-foreground block">
                    {room.availableRooms} rooms • {room.availability}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-heading text-xs font-extrabold text-emerald-500 block">₹{room.rent} / month</span>
                  <span className="font-body text-[9px] text-muted-foreground block">
                    Deposit: ₹{room.securityDeposit || "0"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Gallery Summary */}
        <div className="bg-muted/30 border border-border/60 rounded-2xl p-5 space-y-3">
          <h4 className="font-heading text-xs font-extrabold uppercase tracking-wider text-secondary flex items-center gap-1.5 border-b border-border/40 pb-2">
            📷 Media Summary
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {(values.images || []).map((img: MediaImage) => (
              <div key={img.id} className="relative w-16 h-12 rounded-lg overflow-hidden border border-border">
                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                {img.isCover && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground p-0.5 rounded-bl-md">
                    <Sparkles className="w-2.5 h-2.5 fill-current" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Trigger Publish Button */}
      <div className="mt-4 pt-2">
        <button
          type="button"
          onClick={handlePublish}
          className="w-full bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground text-xs font-bold uppercase tracking-wider py-4 rounded-xl shadow-md transition-all duration-300 cursor-pointer text-center select-none"
        >
          {isEditMode ? "Save Changes" : "Publish Property"}
        </button>
      </div>
    </div>
  );
}
