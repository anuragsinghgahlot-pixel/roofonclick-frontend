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

      <div className="space-y-5 max-h-[50vh] sm:max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
        {/* Property Structure & Basic Details Summary */}
        <div className="bg-muted/30 border border-border/60 rounded-2xl p-4 sm:p-5 space-y-3">
          <h4 className="font-heading text-xs font-extrabold uppercase tracking-wider text-secondary flex items-center gap-1.5 border-b border-border/40 pb-2">
            <Building className="w-4.5 h-4.5" />
            Basic Summary & Structure
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
            {values.propertyManagementType && (
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground block">Ownership Structure</span>
                <span className="font-body text-xs font-bold text-secondary">
                  {values.propertyManagementType}
                </span>
              </div>
            )}
            {values.foodType && (
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground block">Food / Mess Facility</span>
                <span className="font-body text-xs font-bold text-primary">
                  {values.foodType}
                </span>
              </div>
            )}
            {values.description && (
              <div className="sm:col-span-2">
                <span className="text-[10px] font-semibold text-muted-foreground block">Short Description</span>
                <span className="font-body text-xs text-muted-foreground leading-relaxed italic block">
                  &quot;{values.description}&quot;
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Location Summary */}
        <div className="bg-muted/30 border border-border/60 rounded-2xl p-4 sm:p-5 space-y-3">
          <h4 className="font-heading text-xs font-extrabold uppercase tracking-wider text-secondary flex items-center gap-1.5 border-b border-border/40 pb-2">
            <MapPin className="w-4.5 h-4.5" />
            Location Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <span className="text-[10px] font-semibold text-muted-foreground block">Area / City</span>
              <span className="font-body text-xs font-bold text-primary">{values.area || "—"}, {values.city || "—"}</span>
            </div>
            {values.landmark && (
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground block">Landmark</span>
                <span className="font-body text-xs font-bold text-primary">{values.landmark}</span>
              </div>
            )}
            <div className="sm:col-span-2">
              <span className="text-[10px] font-semibold text-muted-foreground block">Complete Address</span>
              <span className="font-body text-xs text-primary leading-relaxed block">{values.address || "—"}</span>
            </div>
          </div>
        </div>

        {/* Selected Amenities Summary */}
        <div className="bg-muted/30 border border-border/60 rounded-2xl p-4 sm:p-5 space-y-3">
          <h4 className="font-heading text-xs font-extrabold uppercase tracking-wider text-secondary flex items-center gap-1.5 border-b border-border/40 pb-2">
            ✨ Selected Amenities ({(values.amenities || []).length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {(values.amenities || []).length > 0 ? (
              (values.amenities || []).map((amenity: string) => (
                <span
                  key={amenity}
                  className="px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold"
                >
                  ✓ {amenity}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground italic">No amenities selected.</span>
            )}
          </div>
        </div>

        {/* Nearby Facilities Summary */}
        {(values.nearby || []).length > 0 && (
          <div className="bg-muted/30 border border-border/60 rounded-2xl p-4 sm:p-5 space-y-3">
            <h4 className="font-heading text-xs font-extrabold uppercase tracking-wider text-secondary flex items-center gap-1.5 border-b border-border/40 pb-2">
              📍 Nearby Facilities
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(values.nearby || []).map((place: string) => (
                <span
                  key={place}
                  className="px-2.5 py-1 rounded-md bg-muted border border-border text-muted-foreground text-[11px] font-semibold"
                >
                  📍 {place}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Room Configurations / Apartment Summary */}
        <div className="bg-muted/30 border border-border/60 rounded-2xl p-4 sm:p-5 space-y-3">
          <h4 className="font-heading text-xs font-extrabold uppercase tracking-wider text-secondary flex items-center gap-1.5 border-b border-border/40 pb-2">
            ₹ Pricing & Property Configuration
          </h4>

          {values.apartmentPricing?.monthlyRent || (values.propertyType && ["Studio Apartment", "RK", "1 BHK", "2 BHK", "3 BHK", "4+ BHK"].includes(values.propertyType)) ? (
            <div className="space-y-3 font-body text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-card border border-border/45 p-3.5 rounded-xl">
                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground block">Monthly Rent</span>
                  <span className="font-heading text-sm font-extrabold text-emerald-600 block">
                    ₹{(values.apartmentPricing?.monthlyRent || values.rooms?.[0]?.monthlyRent || 0).toLocaleString()} / month
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground block">Security Deposit</span>
                  <span className="font-heading text-xs font-bold text-primary block">
                    ₹{(values.apartmentPricing?.securityDeposit || values.rooms?.[0]?.securityDeposit || 0).toLocaleString()}
                  </span>
                </div>
                {(values.apartmentDetails?.furnished || values.rooms?.[0]?.furnished) && (
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground block">Furnishing</span>
                    <span className="font-bold text-primary block">
                      {values.apartmentDetails?.furnished || values.rooms?.[0]?.furnished}
                    </span>
                  </div>
                )}
                {(values.apartmentDetails?.kitchenType || values.apartmentDetails?.bathroomType) && (
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground block">Kitchen & Bathroom</span>
                    <span className="font-bold text-primary block">
                      {[values.apartmentDetails?.kitchenType, values.apartmentDetails?.bathroomType ? `${values.apartmentDetails.bathroomType} Bath` : null].filter(Boolean).join(" • ")}
                    </span>
                  </div>
                )}
                {values.apartmentDetails?.balcony !== undefined && (
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground block">Balcony</span>
                    <span className="font-bold text-primary block">
                      {values.apartmentDetails.balcony ? "Balcony Available" : "No Balcony"}
                    </span>
                  </div>
                )}
                {values.apartmentDetails?.parking && (
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground block">Parking</span>
                    <span className="font-bold text-primary block">
                      {values.apartmentDetails.parking}
                    </span>
                  </div>
                )}
                {(values.apartmentDetails?.floorNumber !== undefined || values.apartmentDetails?.totalFloors !== undefined) && (
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground block">Floor Details</span>
                    <span className="font-bold text-primary block">
                      {values.apartmentDetails?.floorNumber !== undefined ? `Floor ${values.apartmentDetails.floorNumber}` : ""}
                      {values.apartmentDetails?.totalFloors !== undefined ? ` of ${values.apartmentDetails.totalFloors}` : ""}
                    </span>
                  </div>
                )}
                {values.apartmentPricing?.maintenance !== undefined && (
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground block">Maintenance</span>
                    <span className="font-bold text-secondary block">
                      ₹{values.apartmentPricing.maintenance}/mo
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {(values.rooms || []).map((room: RoomConfiguration, idx: number) => {
                const sharing = room.sharingType || room.roomType || "Single";
                const rent = room.monthlyRent ?? room.rent ?? 0;
                const deposit = room.securityDeposit ?? 0;
                const total = room.totalRooms ?? 1;
                const avail = room.availableRooms ?? 1;
                const roomGender = room.gender || "Boys";
                const bath = room.attachedBathroom ? "Attached Bath" : "Shared Bath";
                const furnished = room.furnished || "Fully Furnished";

                return (
                  <div key={idx} className="flex flex-col gap-2 bg-card border border-border/45 p-3 rounded-xl text-left">
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-heading text-xs font-bold text-primary">{sharing}</span>
                        <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                          {roomGender}
                        </span>
                        <span className="text-[10px] font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-md">
                          {bath}
                        </span>
                      </div>
                      <span className="font-body text-[10px] text-muted-foreground block">
                        {avail}/{total} Rooms Available • {furnished}
                      </span>
                    </div>
                    <div>
                      <span className="font-heading text-xs font-extrabold text-emerald-500 block">₹{rent.toLocaleString()} / month</span>
                      <span className="font-body text-[9px] text-muted-foreground block">
                        Security Deposit: ₹{deposit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Photo Gallery Summary */}
        <div className="bg-muted/30 border border-border/60 rounded-2xl p-4 sm:p-5 space-y-3">
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
