"use client";

import type { StatusType } from "@/components/admin/data-table";

/* ─── Buyer Admin Types ─── */
export interface AdminBuyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  city: string;
  institutionOrCompany: string; // e.g. "IIM Indore" or "TCS"
  bookingsCount: number;
  wishlistCount: number;
  reviewsCount: number;
  lifetimeValue: number; // in ₹
  verificationStatus: "verified" | "pending" | "unverified";
  accountStatus: StatusType;
  joinedDate: string;
  lastActive: string;
  // Detail Drawer fields
  bookings: {
    id: string;
    propertyTitle: string;
    roomType: string;
    moveInDate: string;
    rent: number;
    deposit: number;
    status: "Active" | "Completed" | "Cancelled";
  }[];
  wishlist: {
    propertyId: string;
    title: string;
    rent: number;
    addedDate: string;
  }[];
  recentlyViewed: {
    propertyId: string;
    title: string;
    viewedAt: string;
  }[];
  savedSearches: {
    id: string;
    name: string;
    filtersUsed: string;
    createdDate: string;
  }[];
  reviews: {
    id: string;
    propertyTitle: string;
    rating: number;
    comment: string;
    date: string;
    isReported?: boolean;
  }[];
  payments: {
    id: string;
    type: "Booking Fee" | "Security Deposit" | "Refund";
    amount: number;
    invoiceNo: string;
    status: "Paid" | "Pending" | "Refunded";
    date: string;
  }[];
  supportTickets: {
    id: string;
    subject: string;
    status: "Open" | "Resolved" | "Closed";
    createdDate: string;
    channel?: string;
    date?: string;
    priority?: string;
  }[];
  timeline: {
    event: string;
    description: string;
    date: string;
  }[];
}

export interface AdminBuyerQuickStats {
  totalBuyers: number;
  activeBuyers: number;
  verifiedBuyers: number;
  blockedBuyers: number;
  totalBookings: number;
  avgLifetimeValue: number;
}

/* ─── Data ─── */
const MOCK_ADMIN_BUYERS: AdminBuyer[] = [];

/* ─── Admin Buyer Service Class ─── */
export class AdminBuyerService {
  static getQuickStats(buyers: AdminBuyer[] = MOCK_ADMIN_BUYERS): AdminBuyerQuickStats {
    const totalBuyers = buyers.length;
    const activeBuyers = buyers.filter((b) => b.accountStatus === "active").length;
    const verifiedBuyers = buyers.filter((b) => b.verificationStatus === "verified").length;
    const blockedBuyers = buyers.filter((b) => b.accountStatus === "blocked").length;
    const totalBookings = buyers.reduce((acc, b) => acc + b.bookingsCount, 0);
    const ltvSum = buyers.reduce((acc, b) => acc + b.lifetimeValue, 0);
    const avgLifetimeValue = totalBuyers > 0 ? Math.round(ltvSum / totalBuyers) : 0;

    return {
      totalBuyers,
      activeBuyers,
      verifiedBuyers,
      blockedBuyers,
      totalBookings,
      avgLifetimeValue,
    };
  }

  static getAllBuyers(): AdminBuyer[] {
    return MOCK_ADMIN_BUYERS;
  }

  static getBuyerById(id: string): AdminBuyer | undefined {
    return MOCK_ADMIN_BUYERS.find((b) => b.id === id);
  }
}
