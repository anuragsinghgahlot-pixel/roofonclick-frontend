import { apiClient } from "@/lib/api-client";

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
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Trigger API call asynchronously to save in DB if connected
    apiClient
      .post<{ booking: any }>("/api/bookings", request)
      .catch((err) => console.log("[BookingService] Offline fallback:", err.message));

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

  async createBookingReservationAsync(request: BookingReservationRequest): Promise<BookingReservation> {
    try {
      const res = await apiClient.post<{ booking: any }>("/api/bookings", request);
      const b = res.data!.booking;
      return {
        id: b._id,
        reservationId: b.reservationId,
        propertyId: b.property?._id || b.property,
        propertyName: b.propertyName,
        roomType: b.roomType,
        moveInDate: b.moveInDate,
        pricing: b.pricing,
        guestDetails: b.guestDetails,
        status: b.status,
        createdAt: b.createdAt,
      };
    } catch {
      const res = BookingService.createBookingReservation(request);
      return {
        ...request,
        id: `booking-${Date.now()}`,
        reservationId: res.reservationId,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
    }
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

  async fetchMyBookings(): Promise<BookingReservation[]> {
    try {
      const res = await apiClient.get<{ bookings: any[] }>("/api/bookings/my-bookings");
      return (res.data?.bookings ?? []).map((b) => ({
        id: b._id,
        reservationId: b.reservationId,
        propertyId: b.property?._id || b.property,
        propertyName: b.propertyName || b.property?.title,
        roomType: b.roomType,
        moveInDate: b.moveInDate,
        pricing: b.pricing,
        guestDetails: b.guestDetails,
        status: b.status,
        createdAt: b.createdAt,
      }));
    } catch {
      return BookingService.getAllBookings();
    }
  },

  async fetchOwnerBookings(): Promise<BookingReservation[]> {
    try {
      const res = await apiClient.get<{ bookings: any[] }>("/api/bookings/received");
      return (res.data?.bookings ?? []).map((b) => ({
        id: b._id,
        reservationId: b.reservationId,
        propertyId: b.property?._id || b.property,
        propertyName: b.propertyName || b.property?.title,
        roomType: b.roomType,
        moveInDate: b.moveInDate,
        pricing: b.pricing,
        guestDetails: b.guestDetails,
        status: b.status,
        createdAt: b.createdAt,
      }));
    } catch {
      return BookingService.getAllBookings();
    }
  },

  async updateBookingStatus(bookingId: string, status: string): Promise<BookingReservation> {
    const res = await apiClient.put<{ booking: any }>(`/api/bookings/${bookingId}/status`, { status });
    const b = res.data!.booking;
    return {
      id: b._id,
      reservationId: b.reservationId,
      propertyId: b.property?._id || b.property,
      propertyName: b.propertyName,
      roomType: b.roomType,
      moveInDate: b.moveInDate,
      pricing: b.pricing,
      guestDetails: b.guestDetails,
      status: b.status,
      createdAt: b.createdAt,
    };
  },
};
