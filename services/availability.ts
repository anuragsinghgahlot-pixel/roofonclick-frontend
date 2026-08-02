export type PropertyAvailabilityState = "AVAILABLE_NOW" | "AVAILABLE_SOON" | "FULLY_OCCUPIED";

export interface PropertyAvailabilityInfo {
  state: PropertyAvailabilityState;
  label: string;
  badgeColorClass: string;
  dotColorClass: string;
  availableDate?: string;
  totalAvailableRooms: number;
}

export type RoomStatus = "Available" | "Limited" | "Sold Out";

export interface RoomAvailabilityInfo {
  sharingType: string;
  status: RoomStatus;
  availableRooms: number;
  badgeClass: string;
}

export const AvailabilityService = {
  getPropertyAvailability: (availableRooms = 3, totalRooms = 5, moveInDate?: string): PropertyAvailabilityInfo => {
    if (availableRooms <= 0) {
      return {
        state: "FULLY_OCCUPIED",
        label: "Fully Occupied",
        badgeColorClass: "bg-rose-500/10 text-rose-600 border-rose-500/20",
        dotColorClass: "bg-rose-500",
        totalAvailableRooms: 0,
      };
    }

    if (availableRooms <= 2) {
      const futureDate = moveInDate || "15 August";
      return {
        state: "AVAILABLE_SOON",
        label: `Available from ${futureDate}`,
        badgeColorClass: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        dotColorClass: "bg-amber-500",
        availableDate: futureDate,
        totalAvailableRooms: availableRooms,
      };
    }

    return {
      state: "AVAILABLE_NOW",
      label: "Available Now",
      badgeColorClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      dotColorClass: "bg-emerald-500",
      totalAvailableRooms: availableRooms,
    };
  },

  getRoomStatus: (available: number): RoomAvailabilityInfo => {
    if (available <= 0) {
      return {
        sharingType: "Sold Out",
        status: "Sold Out",
        availableRooms: 0,
        badgeClass: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      };
    }
    if (available <= 2) {
      return {
        sharingType: "Limited",
        status: "Limited",
        availableRooms: available,
        badgeClass: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      };
    }
    return {
      sharingType: "Available",
      status: "Available",
      availableRooms: available,
      badgeClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    };
  },
};
