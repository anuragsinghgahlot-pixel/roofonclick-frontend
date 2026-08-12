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

/* ─── Admin Booking Service ─── */
export class AdminBookingService {
  static getQuickStats(bookings: AdminBooking[] = MOCK_ADMIN_BOOKINGS): AdminBookingQuickStats {
    const todaysBookings = bookings.filter((b) => b.createdAt.startsWith("2026-08-03") || b.createdAt.startsWith("2026-08-02")).length;
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
