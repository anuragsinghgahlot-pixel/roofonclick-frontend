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
    status: "Paid" | "Refunded" | "Pending";
    date: string;
  }[];
  supportTickets: {
    id: string;
    subject: string;
    channel: "Ticket" | "Chat" | "Call";
    status: "Open" | "Resolved";
    date: string;
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

/* ─── Mock Data ─── */
const MOCK_ADMIN_BUYERS: AdminBuyer[] = [
  {
    id: "BUY-8001",
    name: "Anurag Singh Gahlot",
    email: "anurag.singh@email.com",
    phone: "+91 98765 43210",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    city: "Indore",
    institutionOrCompany: "IIM Indore",
    bookingsCount: 2,
    wishlistCount: 5,
    reviewsCount: 3,
    lifetimeValue: 42000,
    verificationStatus: "verified",
    accountStatus: "active",
    joinedDate: "2026-02-10",
    lastActive: "2 min ago",
    bookings: [
      { id: "BK-8821", propertyTitle: "Elite Residency PG", roomType: "Double Sharing", moveInDate: "2026-08-05", rent: 8500, deposit: 15000, status: "Active" },
      { id: "BK-5412", propertyTitle: "Comfort Stay Hostel", roomType: "Single Room", moveInDate: "2026-02-15", rent: 11000, deposit: 15000, status: "Completed" },
    ],
    wishlist: [
      { propertyId: "PROP-1001", title: "Elite Residency PG", rent: 8500, addedDate: "2026-07-20" },
      { propertyId: "PROP-1002", title: "Shree Comfort Stay", rent: 7500, addedDate: "2026-07-22" },
      { propertyId: "PROP-1004", title: "Green Meadows Hostel", rent: 6500, addedDate: "2026-07-25" },
    ],
    recentlyViewed: [
      { propertyId: "PROP-1001", title: "Elite Residency PG", viewedAt: "Today, 10:15 AM" },
      { propertyId: "PROP-1003", title: "Sunshine Co-Living", viewedAt: "Yesterday, 4:30 PM" },
    ],
    savedSearches: [
      { id: "SS-1", name: "Vijay Nagar PG for Boys", filtersUsed: "Area: Vijay Nagar, Rent: < ₹10,000", createdDate: "2026-07-10" },
    ],
    reviews: [
      { id: "REV-101", propertyTitle: "Comfort Stay Hostel", rating: 5, comment: "Clean rooms and great food quality!", date: "2026-06-01" },
    ],
    payments: [
      { id: "PAY-1001", type: "Booking Fee", amount: 8500, invoiceNo: "INV-2026-081", status: "Paid", date: "2026-08-02" },
      { id: "PAY-1002", type: "Security Deposit", amount: 15000, invoiceNo: "INV-2026-082", status: "Paid", date: "2026-08-02" },
    ],
    supportTickets: [
      { id: "TKT-501", subject: "Move-in date modification request", channel: "Ticket", status: "Resolved", date: "2026-08-01" },
    ],
    timeline: [
      { event: "Account Created", description: "Registered via Student Verification portal", date: "2026-02-10" },
      { event: "Wishlist Added", description: "Saved Elite Residency PG to wishlist", date: "2026-07-20" },
      { event: "Booking Made", description: "Confirmed booking for Elite Residency PG (#BK-8821)", date: "2026-08-02" },
      { event: "Payment Completed", description: "Paid ₹23,500 (Rent + Deposit)", date: "2026-08-02" },
    ],
  },
  {
    id: "BUY-8002",
    name: "Sneha Mukherjee",
    email: "sneha.m@email.com",
    phone: "+91 94251 12233",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    city: "Indore",
    institutionOrCompany: "TCS Indore",
    bookingsCount: 1,
    wishlistCount: 8,
    reviewsCount: 2,
    lifetimeValue: 24000,
    verificationStatus: "verified",
    accountStatus: "active",
    joinedDate: "2026-03-15",
    lastActive: "1 hour ago",
    bookings: [
      { id: "BK-6512", propertyTitle: "Shree Comfort Stay Girls PG", roomType: "Double Sharing", moveInDate: "2026-08-10", rent: 7500, deposit: 10000, status: "Active" },
    ],
    wishlist: [
      { propertyId: "PROP-1002", title: "Shree Comfort Stay Girls PG", rent: 7500, addedDate: "2026-07-15" },
    ],
    recentlyViewed: [
      { propertyId: "PROP-1002", title: "Shree Comfort Stay Girls PG", viewedAt: "Today, 09:00 AM" },
    ],
    savedSearches: [
      { id: "SS-2", name: "Palasia Girls PG under 8k", filtersUsed: "Area: Palasia, Gender: Girls, Rent: < 8000", createdDate: "2026-07-01" },
    ],
    reviews: [
      { id: "REV-202", propertyTitle: "Shree Comfort Stay Girls PG", rating: 4, comment: "Very safe for working women.", date: "2026-07-20" },
    ],
    payments: [
      { id: "PAY-2001", type: "Booking Fee", amount: 7500, invoiceNo: "INV-2026-090", status: "Paid", date: "2026-08-01" },
    ],
    supportTickets: [],
    timeline: [
      { event: "Account Created", description: "Registered via Mobile OTP", date: "2026-03-15" },
      { event: "Booking Made", description: "Booked Shree Comfort Stay Girls PG", date: "2026-08-01" },
    ],
  },
  {
    id: "BUY-8003",
    name: "Rahul Verma",
    email: "rahul.verma@email.com",
    phone: "+91 91112 33445",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    city: "Indore",
    institutionOrCompany: "DAVV Indore",
    bookingsCount: 0,
    wishlistCount: 2,
    reviewsCount: 0,
    lifetimeValue: 0,
    verificationStatus: "pending",
    accountStatus: "pending",
    joinedDate: "2026-07-28",
    lastActive: "3 hours ago",
    bookings: [],
    wishlist: [],
    recentlyViewed: [
      { propertyId: "PROP-1003", title: "Sunshine Co-Living", viewedAt: "Yesterday" },
    ],
    savedSearches: [],
    reviews: [],
    payments: [],
    supportTickets: [],
    timeline: [
      { event: "Account Created", description: "Registered account", date: "2026-07-28" },
    ],
  },
  {
    id: "BUY-8004",
    name: "Kunal Sharma (Blocked)",
    email: "kunal.s@email.com",
    phone: "+91 93001 99887",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    city: "Indore",
    institutionOrCompany: "Medi-Caps University",
    bookingsCount: 1,
    wishlistCount: 0,
    reviewsCount: 1,
    lifetimeValue: 12000,
    verificationStatus: "unverified",
    accountStatus: "blocked",
    joinedDate: "2026-01-10",
    lastActive: "5 days ago",
    bookings: [
      { id: "BK-3001", propertyTitle: "Royal Residency", roomType: "Double Sharing", moveInDate: "2026-04-01", rent: 7000, deposit: 7000, status: "Cancelled" },
    ],
    wishlist: [],
    recentlyViewed: [],
    savedSearches: [],
    reviews: [
      { id: "REV-303", propertyTitle: "Royal Residency", rating: 1, comment: "Spam comment with abusive words.", date: "2026-07-24", isReported: true },
    ],
    payments: [],
    supportTickets: [],
    timeline: [
      { event: "Account Blocked", description: "Blocked due to abusive review reports", date: "2026-07-25" },
    ],
  },
];

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
