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
    type: "Agreement" | "Receipt" | "Invoice" | "ID Proof";
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

/* ─── Mock Data ─── */
const MOCK_ADMIN_BOOKINGS: AdminBooking[] = [
  {
    id: "ROC-1087",
    buyerId: "BUY-8001",
    buyerName: "Anurag Singh Gahlot",
    buyerPhone: "+91 98765 43210",
    buyerEmail: "anurag.singh@email.com",
    buyerInstitution: "IIM Indore",
    ownerId: "OWN-4521",
    ownerName: "Rajesh Kumar",
    ownerPhone: "+91 98260 12345",
    ownerEmail: "rajesh.kumar@email.com",
    propertyId: "PROP-1001",
    propertyTitle: "Elite Residency PG & Hostel",
    propertyPhoto: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    propertyAddress: "Scheme 54, Vijay Nagar, Indore",
    city: "Indore",
    roomType: "Double Sharing",
    moveInDate: "2026-08-05",
    monthlyRent: 8500,
    securityDeposit: 15000,
    platformFee: 500,
    totalAmount: 24000,
    paymentStatus: "Paid",
    bookingStatus: "Move-in Scheduled",
    createdAt: "2026-08-02T18:45:00Z",
    paymentDetails: {
      rentPaid: 8500,
      depositPaid: 15000,
      feePaid: 500,
      invoiceNo: "INV-2026-081",
      receiptNo: "REC-2026-991",
      refundStatus: "Not Applicable",
    },
    timeline: [
      { event: "Booking Created", description: "Student selected Double Sharing Room", date: "2026-08-02 18:45", by: "Anurag Singh" },
      { event: "Owner Accepted", description: "Owner accepted booking request", date: "2026-08-02 19:10", by: "Rajesh Kumar" },
      { event: "Payment Received", description: "Payment of ₹24,000 processed via Razorpay", date: "2026-08-02 19:15", by: "System" },
      { event: "Move-in Scheduled", description: "Move-in scheduled for 05 Aug 2026", date: "2026-08-02 19:20", by: "Ops Executive" },
    ],
    documents: [
      { id: "DOC-B1", title: "Rental Agreement Draft", type: "Agreement", url: "#", uploadedAt: "2026-08-02" },
      { id: "DOC-B2", title: "Payment Receipt #REC-991", type: "Receipt", url: "#", uploadedAt: "2026-08-02" },
      { id: "DOC-B3", title: "Tax Invoice #INV-081", type: "Invoice", url: "#", uploadedAt: "2026-08-02" },
      { id: "DOC-B4", title: "Student College ID Proof", type: "ID Proof", url: "#", uploadedAt: "2026-08-02" },
    ],
    internalNotes: [
      { id: "N-1", author: "Ops Rohit", note: "Student requested early morning check-in at 8 AM. Owner informed.", date: "2026-08-02 20:00" },
    ],
  },
  {
    id: "ROC-1088",
    buyerId: "BUY-8002",
    buyerName: "Sneha Mukherjee",
    buyerPhone: "+91 94251 12233",
    buyerEmail: "sneha.m@email.com",
    buyerInstitution: "TCS Indore",
    ownerId: "OWN-4522",
    ownerName: "Sunita Verma",
    ownerPhone: "+91 94250 98765",
    ownerEmail: "sunita.v@email.com",
    propertyId: "PROP-1002",
    propertyTitle: "Shree Comfort Stay Girls PG",
    propertyPhoto: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
    propertyAddress: "Palasia, Indore",
    city: "Indore",
    roomType: "Double Sharing",
    moveInDate: "2026-08-10",
    monthlyRent: 7500,
    securityDeposit: 10000,
    platformFee: 500,
    totalAmount: 18000,
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
    createdAt: "2026-08-01T11:20:00Z",
    paymentDetails: {
      rentPaid: 7500,
      depositPaid: 10000,
      feePaid: 500,
      invoiceNo: "INV-2026-090",
      receiptNo: "REC-2026-995",
      refundStatus: "Not Applicable",
    },
    timeline: [
      { event: "Booking Created", description: "Created by student", date: "2026-08-01 11:20", by: "Sneha M." },
      { event: "Owner Accepted", description: "Accepted by Sunita Verma", date: "2026-08-01 12:00", by: "Sunita Verma" },
      { event: "Payment Received", description: "Payment completed", date: "2026-08-01 12:15", by: "System" },
    ],
    documents: [
      { id: "DOC-B5", title: "Tax Invoice #INV-090", type: "Invoice", url: "#", uploadedAt: "2026-08-01" },
    ],
    internalNotes: [],
  },
  {
    id: "ROC-1089",
    buyerId: "BUY-8003",
    buyerName: "Rahul Verma",
    buyerPhone: "+91 91112 33445",
    buyerEmail: "rahul.verma@email.com",
    buyerInstitution: "DAVV Indore",
    ownerId: "OWN-4523",
    ownerName: "Amitabh Jain",
    ownerPhone: "+91 97520 54321",
    ownerEmail: "amitabh.jain@email.com",
    propertyId: "PROP-1003",
    propertyTitle: "Sunshine Co-Living",
    propertyPhoto: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    propertyAddress: "Bhawarkua, Indore",
    city: "Indore",
    roomType: "Single Studio",
    moveInDate: "2026-08-15",
    monthlyRent: 11000,
    securityDeposit: 15000,
    platformFee: 500,
    totalAmount: 26500,
    paymentStatus: "Pending",
    bookingStatus: "Requested",
    createdAt: "2026-08-03T09:00:00Z",
    paymentDetails: {
      rentPaid: 0,
      depositPaid: 0,
      feePaid: 0,
      invoiceNo: "INV-DRAFT",
      receiptNo: "NONE",
      refundStatus: "Not Applicable",
    },
    timeline: [
      { event: "Booking Created", description: "Booking request submitted", date: "2026-08-03 09:00", by: "Rahul Verma" },
    ],
    documents: [],
    internalNotes: [],
  },
  {
    id: "ROC-1090",
    buyerId: "BUY-8004",
    buyerName: "Kunal Sharma",
    buyerPhone: "+91 93001 99887",
    buyerEmail: "kunal.s@email.com",
    buyerInstitution: "Medi-Caps",
    ownerId: "OWN-4525",
    ownerName: "Deepak Sharma",
    ownerPhone: "+91 98270 44556",
    ownerEmail: "deepak.s@email.com",
    propertyId: "PROP-1007",
    propertyTitle: "Royal Residency",
    propertyPhoto: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    propertyAddress: "LIG Square, Indore",
    city: "Indore",
    roomType: "Double Sharing",
    moveInDate: "2026-07-20",
    monthlyRent: 7000,
    securityDeposit: 7000,
    platformFee: 500,
    totalAmount: 14500,
    paymentStatus: "Refunded",
    bookingStatus: "Refunded",
    createdAt: "2026-07-18T10:00:00Z",
    paymentDetails: {
      rentPaid: 7000,
      depositPaid: 7000,
      feePaid: 500,
      invoiceNo: "INV-2026-044",
      receiptNo: "REC-2026-444",
      refundStatus: "Processed",
      refundAmount: 14500,
    },
    timeline: [
      { event: "Booking Created", description: "Requested", date: "2026-07-18 10:00", by: "Kunal S." },
      { event: "Cancelled", description: "Cancelled due to property suspension", date: "2026-07-25 12:00", by: "Ops Team" },
      { event: "Refund Processed", description: "Full refund of ₹14,500 issued", date: "2026-07-26 15:00", by: "Finance" },
    ],
    documents: [
      { id: "DOC-B6", title: "Refund Receipt #RF-104", type: "Receipt", url: "#", uploadedAt: "2026-07-26" },
    ],
    internalNotes: [
      { id: "N-2", author: "Super Admin", note: "Refund processed due to food safety audit failure at Royal Residency.", date: "2026-07-26 15:10" },
    ],
  },
];

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
