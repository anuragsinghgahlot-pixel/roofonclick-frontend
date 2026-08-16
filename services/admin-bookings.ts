"use client";

import type { StatusType } from "@/components/admin/data-table";

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
  // Detail Drawer data
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

/* ─── Data ─── */
const MOCK_ADMIN_BOOKINGS: AdminBooking[] = [];

import { apiClient } from "@/lib/api-client";

/* ─── Admin Booking Service ─── */
export class AdminBookingService {
  static async fetchAdminBookings(): Promise<AdminBooking[]> {
    try {
      const res = await apiClient.get<{ bookings: any[] }>("/api/admin/bookings");
      const bookingsData = res.data?.bookings || [];

      return bookingsData.map((b) => ({
        id: b.reservationId || b._id,
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
        propertyTitle: b.propertyName || b.property?.title || "Listed Property",
        propertyPhoto: b.property?.images?.[0] || "",
        propertyAddress: b.property?.address?.area || "Indore",
        city: b.property?.address?.city || "Indore",
        roomType: b.roomType || "Standard Room",
        moveInDate: b.moveInDate || new Date().toISOString().substring(0, 10),
        monthlyRent: b.pricing?.monthlyRent || 0,
        securityDeposit: b.pricing?.securityDeposit || 0,
        platformFee: b.pricing?.platformFee || 0,
        totalAmount: b.pricing?.totalDueNow || (b.pricing?.monthlyRent || 0),
        paymentStatus: b.status === "confirmed" || b.status === "completed" ? "Paid" : "Pending",
        bookingStatus: b.status === "pending" ? "Requested" : b.status === "confirmed" ? "Confirmed" : b.status === "cancelled" ? "Cancelled" : "Completed",
        createdAt: b.createdAt || new Date().toISOString(),
        paymentDetails: {
          rentPaid: b.pricing?.monthlyRent || 0,
          depositPaid: b.pricing?.securityDeposit || 0,
          feePaid: b.pricing?.platformFee || 0,
          invoiceNo: `INV-${b.reservationId || b._id.substring(0, 6)}`,
          receiptNo: `REC-${b.reservationId || b._id.substring(0, 6)}`,
          refundStatus: "Not Applicable",
        },
        timeline: [
          {
            event: "Booking Created",
            description: "Reservation submitted by tenant",
            date: b.createdAt || new Date().toISOString(),
            by: b.guestDetails?.fullName || b.user?.name || "Tenant",
          },
        ],
        documents: [],
        internalNotes: [],
      }));
    } catch {
      return MOCK_ADMIN_BOOKINGS;
    }
  }

  static getQuickStats(bookings: AdminBooking[] = MOCK_ADMIN_BOOKINGS): AdminBookingQuickStats {
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

  static getAllBookings(): AdminBooking[] {
    return MOCK_ADMIN_BOOKINGS;
  }

  static getBookingById(id: string): AdminBooking | undefined {
    return MOCK_ADMIN_BOOKINGS.find((b) => b.id === id);
  }
}
