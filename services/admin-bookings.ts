"use client";

import { apiClient } from "@/lib/api-client";

export type AdminBookingStatus =
  | "Requested"
  | "Confirmed"
  | "Pending Payment"
  | "Payment Received"
  | "Move-in Scheduled"
  | "Checked In"
  | "Completed"
  | "Cancelled"
  | "Refunded";

export type AdminPaymentStatus = "Paid" | "Pending" | "Refunded" | "Partially Paid";

/* ─── Booking Admin Types ─── */
export interface AdminBooking {
  id: string;
  mongoId: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerInstitution: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  propertyId: string;
  propertyTitle: string;
  propertyPhoto: string;
  propertyAddress: string;
  city: string;
  roomType: string;
  moveInDate: string;
  monthlyRent: number;
  securityDeposit: number;
  platformFee: number;
  totalAmount: number;
  paymentStatus: AdminPaymentStatus;
  bookingStatus: AdminBookingStatus;
  createdAt: string;
  assignedExecutive?: {
    name: string;
    phone: string;
    email: string;
  };
  paymentDetails: {
    rentPaid: number;
    depositPaid: number;
    feePaid: number;
    invoiceNo: string;
    receiptNo: string;
    refundStatus?: "Not Applicable" | "Requested" | "Processed" | "Rejected";
    refundAmount?: number;
  };
  timeline: {
    event: string;
    description: string;
    date: string;
    by: string;
  }[];
  documents: {
    id: string;
    title: string;
    type: string;
    url: string;
    uploadedAt: string;
  }[];
  internalNotes: {
    id: string;
    author: string;
    note: string;
    date: string;
  }[];
}

export interface AdminBookingQuickStats {
  todaysBookings: number;
  upcomingMoveIns: number;
  pendingConfirmation: number;
  completed: number;
  cancelled: number;
  refundRequests: number;
  monthlyRevenue: number;
  avgBookingValue: number;
}

/* ─── Admin Booking Service ─── */
export class AdminBookingService {
  static async fetchAdminBookings(): Promise<AdminBooking[]> {
    try {
      const res = await apiClient.get<{ bookings: any[] }>("/api/admin/bookings");
      const bookingsData = res.data?.bookings || [];

      return bookingsData.map((b) => {
        const rawStatus = b.status || "pending";
        const bookingStatus: AdminBookingStatus =
          rawStatus === "pending"
            ? "Requested"
            : rawStatus === "confirmed"
            ? "Confirmed"
            : rawStatus === "cancelled"
            ? "Cancelled"
            : rawStatus === "refunded"
            ? "Refunded"
            : "Completed";

        const paymentStatus: AdminPaymentStatus =
          b.paymentStatus === "refunded"
            ? "Refunded"
            : b.paymentStatus === "paid" || rawStatus === "confirmed" || rawStatus === "completed"
            ? "Paid"
            : "Pending";

        return {
          id: b.reservationId || b._id,
          mongoId: b._id,
          buyerId: b.user?._id || "",
          buyerName: b.guestDetails?.fullName || b.user?.name || "Seeker Guest",
          buyerPhone: b.guestDetails?.phone || b.user?.phone || "N/A",
          buyerEmail: b.guestDetails?.email || b.user?.email || "N/A",
          buyerInstitution: b.guestDetails?.occupation || "Student",
          ownerId: b.property?.owner?._id || "",
          ownerName: b.property?.owner?.name || "Property Owner",
          ownerPhone: b.property?.owner?.phone || "N/A",
          ownerEmail: b.property?.owner?.email || "N/A",
          propertyId: b.property?._id || "",
          propertyTitle: b.propertyName || b.property?.title || "Indore Property",
          propertyPhoto: b.property?.images?.[0] || "",
          propertyAddress: b.property?.address?.area || "Indore",
          city: b.property?.address?.city || "Indore",
          roomType: b.roomType || "Standard Room",
          moveInDate: b.moveInDate || new Date().toISOString().substring(0, 10),
          monthlyRent: b.pricing?.monthlyRent || 0,
          securityDeposit: b.pricing?.securityDeposit || 0,
          platformFee: b.pricing?.platformFee || 0,
          totalAmount: b.pricing?.totalDueNow || (b.pricing?.monthlyRent || 0),
          paymentStatus,
          bookingStatus,
          createdAt: b.createdAt || new Date().toISOString(),
          assignedExecutive: b.assignedExecutive || {
            name: "Rajat Verma",
            phone: "+91 98260 11442",
            email: "rajat@roofonclick.com",
          },
          paymentDetails: {
            rentPaid: b.pricing?.monthlyRent || 0,
            depositPaid: b.pricing?.securityDeposit || 0,
            feePaid: b.pricing?.platformFee || 0,
            invoiceNo: `INV-${b.reservationId || b._id.substring(0, 6)}`,
            receiptNo: `REC-${b.reservationId || b._id.substring(0, 6)}`,
            refundStatus: b.refund?.status === "refunded" ? "Processed" : "Not Applicable",
            refundAmount: b.refund?.amount || 0,
          },
          timeline: [
            {
              event: "Booking Created",
              description: `Reservation ${b.reservationId || b._id} received`,
              date: b.createdAt ? new Date(b.createdAt).toISOString().split("T")[0] : "2026-08-15",
              by: b.guestDetails?.fullName || b.user?.name || "Tenant",
            },
          ],
          documents: [],
          internalNotes: [],
        };
      });
    } catch {
      return [];
    }
  }

  static getQuickStats(bookings: AdminBooking[] = []): AdminBookingQuickStats {
    const todaysBookings = bookings.length;
    const upcomingMoveIns = bookings.filter((b) => b.bookingStatus === "Move-in Scheduled" || b.bookingStatus === "Confirmed").length;
    const pendingConfirmation = bookings.filter((b) => b.bookingStatus === "Requested" || b.bookingStatus === "Pending Payment").length;
    const completed = bookings.filter((b) => b.bookingStatus === "Completed" || b.bookingStatus === "Checked In").length;
    const cancelled = bookings.filter((b) => b.bookingStatus === "Cancelled").length;
    const refundRequests = bookings.filter((b) => b.bookingStatus === "Refunded" || b.paymentDetails.refundStatus === "Requested").length;

    const paidBookings = bookings.filter((b) => b.paymentStatus === "Paid");
    const monthlyRevenue = paidBookings.reduce((acc, b) => acc + b.totalAmount, 0);
    const avgBookingValue = paidBookings.length > 0 ? Math.round(monthlyRevenue / paidBookings.length) : 0;

    return {
      todaysBookings,
      upcomingMoveIns,
      pendingConfirmation,
      completed,
      cancelled,
      refundRequests,
      monthlyRevenue,
      avgBookingValue,
    };
  }

  static async updateStatus(id: string, status: "pending" | "confirmed" | "cancelled" | "completed" | "refunded") {
    return apiClient.put(`/api/admin/bookings/${id}/status`, { status });
  }

  static async processRefund(id: string, amount?: number, reason?: string) {
    return apiClient.post(`/api/admin/bookings/${id}/refund`, { amount, reason });
  }

  static async bulkUpdate(bookingIds: string[], action: "approve" | "cancel", status?: string) {
    return apiClient.post("/api/admin/bookings/bulk-status", { bookingIds, action, status });
  }

  static async assignExecutive(id: string, executive: { name: string; phone: string; email: string }) {
    return apiClient.put(`/api/admin/bookings/${id}/executive`, executive);
  }
}
