export interface PriceBreakdown {
  monthlyRent: number;
  securityDeposit: number;
  platformFee: number;
  totalDueNow: number;
}

export interface BookingCalculationParams {
  monthlyRent: number;
  securityDeposit?: number;
}

export interface GuestDetails {
  fullName?: string;
  email?: string;
  phone?: string;
  occupation?: string;
}

export interface BookingReservationRequest {
  propertyId: string;
  propertyName: string;
  roomType: string;
  moveInDate: string;
  pricing: PriceBreakdown;
  guestDetails?: GuestDetails;
}

export interface BookingReservation extends BookingReservationRequest {
  id: string;
  reservationId: string;
  status: string;
  createdAt: string;
}

export const BookingService = {
  calculatePricing: (params: BookingCalculationParams): PriceBreakdown => {
    const rent = params.monthlyRent || 7500;
    const deposit = params.securityDeposit ?? rent; // Default 1 month rent
    const platformFee = 0; // Waived platform fee

    const totalDueNow = rent + deposit + platformFee;

    return {
      monthlyRent: rent,
      securityDeposit: deposit,
      platformFee: platformFee,
      totalDueNow: totalDueNow,
    };
  },

  createBookingReservation: (request: BookingReservationRequest): { success: boolean; reservationId: string } => {
    const reservationId = `RES-${Math.floor(100000 + Math.random() * 900000)}`;
    const newReservation: BookingReservation = {
      ...request,
      id: `booking-${Date.now()}`,
      reservationId,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("stayynest_booking_reservations") || "[]";
        const list = JSON.parse(stored);
        list.unshift(newReservation);
        localStorage.setItem("stayynest_booking_reservations", JSON.stringify(list));
      } catch {
        // Handle quota
      }
    }
    return { success: true, reservationId };
  },

  getAllBookings: (): BookingReservation[] => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("stayynest_booking_reservations");
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {
        // Fallback
      }
    }
    return [
      {
        id: "demo-1",
        reservationId: "RN-2026-8942",
        propertyId: "serene-oasis",
        propertyName: "Serene Oasis PG & Co-Living",
        roomType: "Single Room",
        moveInDate: "15 Aug 2026",
        status: "confirmed",
        createdAt: new Date().toISOString(),
        pricing: {
          monthlyRent: 8500,
          securityDeposit: 8500,
          platformFee: 0,
          totalDueNow: 17000,
        },
      },
    ];
  },
};
