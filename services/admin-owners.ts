"use client";

import type { StatusType } from "@/components/admin/data-table";

/* ─── Owner Admin Types ─── */
export interface AdminOwnerKycDoc {
  id: string;
  type: "Aadhaar" | "PAN" | "Bank Details" | "Property Proof" | "Selfie";
  docNumber: string;
  fileUrl: string;
  status: "verified" | "pending" | "rejected";
  submittedAt: string;
}

export interface AdminOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  city: string;
  address: string;
  propertiesCount: number;
  occupancyRate: number; // percentage
  avgRating: number;
  totalRevenue: number; // in ₹
  kycStatus: "verified" | "pending" | "rejected";
  subscriptionPlan: "Gold Tier" | "Silver Tier" | "Free Tier" | "Enterprise";
  accountStatus: StatusType;
  joinedDate: string;
  // Detail Drawer fields
  properties: {
    id: string;
    title: string;
    type: string;
    rent: number;
    occupancy: number;
    status: string;
  }[];
  bookings: {
    id: string;
    propertyTitle: string;
    guestName: string;
    moveInDate: string;
    rent: number;
    status: "Confirmed" | "Completed" | "Cancelled" | "Upcoming";
  }[];
  payments: {
    id: string;
    type: "Monthly Rent Settlement" | "Platform Fee" | "Security Deposit";
    amount: number;
    commission: number;
    netPayout: number;
    status: "Settled" | "Pending" | "Processing";
    date: string;
  }[];
  reviews: {
    id: string;
    propertyTitle: string;
    reviewerName: string;
    rating: number;
    comment: string;
    ownerReply?: string;
    date: string;
  }[];
  documents: AdminOwnerKycDoc[];
  supportTickets: {
    id: string;
    subject: string;
    channel: "Ticket" | "Call" | "Email";
    priority: "High" | "Medium" | "Low";
    status: "Open" | "Resolved" | "In Progress";
    date: string;
  }[];
  timeline: {
    event: string;
    description: string;
    date: string;
  }[];
}

export interface AdminOwnerQuickStats {
  totalOwners: number;
  verifiedOwners: number;
  pendingKyc: number;
  suspendedOwners: number;
  activeListings: number;
  totalRevenueGenerated: number;
}

/* ─── Mock Data ─── */
const MOCK_ADMIN_OWNERS: AdminOwner[] = [
  {
    id: "OWN-4521",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98260 12345",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    city: "Indore",
    address: "Scheme 54, Vijay Nagar, Indore",
    propertiesCount: 3,
    occupancyRate: 92,
    avgRating: 4.8,
    totalRevenue: 345000,
    kycStatus: "verified",
    subscriptionPlan: "Gold Tier",
    accountStatus: "active",
    joinedDate: "2025-11-10",
    properties: [
      { id: "PROP-1001", title: "Elite Residency PG", type: "Hostel", rent: 8500, occupancy: 92, status: "approved" },
      { id: "PROP-1008", title: "Vijay Nagar Boys PG", type: "PG", rent: 7500, occupancy: 85, status: "approved" },
    ],
    bookings: [
      { id: "BK-8821", propertyTitle: "Elite Residency PG", guestName: "Anurag Singh", moveInDate: "2026-08-05", rent: 8500, status: "Confirmed" },
      { id: "BK-7654", propertyTitle: "Elite Residency PG", guestName: "Rahul Sharma", moveInDate: "2026-07-01", rent: 8500, status: "Completed" },
    ],
    payments: [
      { id: "PAY-901", type: "Monthly Rent Settlement", amount: 125000, commission: 6250, netPayout: 118750, status: "Settled", date: "2026-08-01" },
      { id: "PAY-842", type: "Monthly Rent Settlement", amount: 110000, commission: 5500, netPayout: 104500, status: "Settled", date: "2026-07-01" },
    ],
    reviews: [
      { id: "REV-101", propertyTitle: "Elite Residency PG", reviewerName: "Aman V.", rating: 5, comment: "Great food and high-speed Wi-Fi!", ownerReply: "Thank you Aman!", date: "2026-07-28" },
    ],
    documents: [
      { id: "DOC-1", type: "Aadhaar", docNumber: "XXXX-XXXX-4521", fileUrl: "#", status: "verified", submittedAt: "2025-11-10" },
      { id: "DOC-2", type: "PAN", docNumber: "ABCDE1234F", fileUrl: "#", status: "verified", submittedAt: "2025-11-10" },
      { id: "DOC-3", type: "Bank Details", docNumber: "HDFC0001234 - A/C 9876", fileUrl: "#", status: "verified", submittedAt: "2025-11-11" },
      { id: "DOC-4", type: "Property Proof", docNumber: "Reg No: IND-54-99", fileUrl: "#", status: "verified", submittedAt: "2025-11-12" },
      { id: "DOC-5", type: "Selfie", docNumber: "Selfie Match 99%", fileUrl: "#", status: "verified", submittedAt: "2025-11-10" },
    ],
    supportTickets: [
      { id: "TKT-301", subject: "Payout delay query", channel: "Ticket", priority: "Medium", status: "Resolved", date: "2026-07-15" },
    ],
    timeline: [
      { event: "Account Created", description: "Registered as Property Owner", date: "2025-11-10" },
      { event: "KYC Verified", description: "Aadhaar & PAN approved by Admin", date: "2025-11-11" },
      { event: "Property Added", description: "Listed Elite Residency PG", date: "2026-06-15" },
      { event: "Subscription Renewed", description: "Upgraded to Gold Tier", date: "2026-07-01" },
    ],
  },
  {
    id: "OWN-4522",
    name: "Sunita Verma",
    email: "sunita.v@email.com",
    phone: "+91 94250 98765",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    city: "Indore",
    address: "Palasia, Indore",
    propertiesCount: 2,
    occupancyRate: 88,
    avgRating: 4.6,
    totalRevenue: 210000,
    kycStatus: "verified",
    subscriptionPlan: "Silver Tier",
    accountStatus: "active",
    joinedDate: "2026-01-15",
    properties: [
      { id: "PROP-1002", title: "Shree Comfort Stay Girls PG", type: "PG", rent: 7500, occupancy: 88, status: "approved" },
    ],
    bookings: [
      { id: "BK-6512", propertyTitle: "Shree Comfort Stay Girls PG", guestName: "Priya Das", moveInDate: "2026-08-10", rent: 7500, status: "Upcoming" },
    ],
    payments: [
      { id: "PAY-780", type: "Monthly Rent Settlement", amount: 75000, commission: 3750, netPayout: 71250, status: "Settled", date: "2026-08-01" },
    ],
    reviews: [
      { id: "REV-202", propertyTitle: "Shree Comfort Stay Girls PG", reviewerName: "Sneha M.", rating: 4, comment: "Very safe for girls.", date: "2026-07-20" },
    ],
    documents: [
      { id: "DOC-10", type: "Aadhaar", docNumber: "XXXX-XXXX-9876", fileUrl: "#", status: "verified", submittedAt: "2026-01-15" },
      { id: "DOC-11", type: "PAN", docNumber: "XYZPS9876K", fileUrl: "#", status: "verified", submittedAt: "2026-01-15" },
    ],
    supportTickets: [],
    timeline: [
      { event: "Account Created", description: "Registered on RoofOnClick", date: "2026-01-15" },
      { event: "KYC Submitted", description: "Submitted Aadhaar and Bank Details", date: "2026-01-16" },
    ],
  },
  {
    id: "OWN-4523",
    name: "Amitabh Jain",
    email: "amitabh.jain@email.com",
    phone: "+91 97520 54321",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    city: "Indore",
    address: "Bhawarkua, Indore",
    propertiesCount: 1,
    occupancyRate: 45,
    avgRating: 4.2,
    totalRevenue: 95000,
    kycStatus: "pending",
    subscriptionPlan: "Free Tier",
    accountStatus: "pending",
    joinedDate: "2026-07-20",
    properties: [
      { id: "PROP-1003", title: "Sunshine Co-Living", type: "Co-living", rent: 11000, occupancy: 45, status: "pending" },
    ],
    bookings: [],
    payments: [
      { id: "PAY-612", type: "Monthly Rent Settlement", amount: 45000, commission: 2250, netPayout: 42750, status: "Pending", date: "2026-08-02" },
    ],
    reviews: [],
    documents: [
      { id: "DOC-20", type: "Aadhaar", docNumber: "XXXX-XXXX-5432", fileUrl: "#", status: "pending", submittedAt: "2026-07-22" },
      { id: "DOC-21", type: "PAN", docNumber: "AMTPJ5432L", fileUrl: "#", status: "pending", submittedAt: "2026-07-22" },
      { id: "DOC-22", type: "Bank Details", docNumber: "SBI000456 - A/C 4532", fileUrl: "#", status: "pending", submittedAt: "2026-07-23" },
    ],
    supportTickets: [
      { id: "TKT-410", subject: "KYC verification time", channel: "Call", priority: "High", status: "Open", date: "2026-07-26" },
    ],
    timeline: [
      { event: "Account Created", description: "Registered", date: "2026-07-20" },
      { event: "KYC Submitted", description: "Uploaded documents for review", date: "2026-07-22" },
    ],
  },
  {
    id: "OWN-4524",
    name: "Vikram Rathore",
    email: "vikram.r@email.com",
    phone: "+91 98930 76543",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    city: "Indore",
    address: "Rau, Indore",
    propertiesCount: 2,
    occupancyRate: 76,
    avgRating: 4.4,
    totalRevenue: 280000,
    kycStatus: "verified",
    subscriptionPlan: "Gold Tier",
    accountStatus: "active",
    joinedDate: "2026-03-01",
    properties: [
      { id: "PROP-1004", title: "Green Meadows Student Hostel", type: "Hostel", rent: 6500, occupancy: 76, status: "approved" },
    ],
    bookings: [
      { id: "BK-4410", propertyTitle: "Green Meadows", guestName: "Devendra K.", moveInDate: "2026-07-15", rent: 6500, status: "Completed" },
    ],
    payments: [
      { id: "PAY-501", type: "Monthly Rent Settlement", amount: 98000, commission: 4900, netPayout: 93100, status: "Settled", date: "2026-08-01" },
    ],
    reviews: [],
    documents: [
      { id: "DOC-30", type: "Aadhaar", docNumber: "XXXX-XXXX-7654", fileUrl: "#", status: "verified", submittedAt: "2026-03-01" },
    ],
    supportTickets: [],
    timeline: [
      { event: "Account Created", description: "Registered", date: "2026-03-01" },
    ],
  },
  {
    id: "OWN-4525",
    name: "Deepak Sharma",
    email: "deepak.s@email.com",
    phone: "+91 98270 44556",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    city: "Indore",
    address: "LIG Square, Indore",
    propertiesCount: 1,
    occupancyRate: 60,
    avgRating: 2.8,
    totalRevenue: 65000,
    kycStatus: "rejected",
    subscriptionPlan: "Free Tier",
    accountStatus: "suspended",
    joinedDate: "2026-02-14",
    properties: [
      { id: "PROP-1007", title: "Royal Residency", type: "Hostel", rent: 7000, occupancy: 60, status: "suspended" },
    ],
    bookings: [],
    payments: [],
    reviews: [
      { id: "REV-303", propertyTitle: "Royal Residency", reviewerName: "Kunal S.", rating: 2, comment: "Poor food quality and no water backup.", date: "2026-07-24" },
    ],
    documents: [
      { id: "DOC-40", type: "Aadhaar", docNumber: "XXXX-XXXX-4455", fileUrl: "#", status: "rejected", submittedAt: "2026-02-14" },
    ],
    supportTickets: [],
    timeline: [
      { event: "Account Suspended", description: "Suspended due to food quality complaints", date: "2026-07-25" },
    ],
  },
];

/* ─── Admin Owner Service ─── */
export class AdminOwnerService {
  static getQuickStats(owners: AdminOwner[] = MOCK_ADMIN_OWNERS): AdminOwnerQuickStats {
    const totalOwners = owners.length;
    const verifiedOwners = owners.filter((o) => o.kycStatus === "verified").length;
    const pendingKyc = owners.filter((o) => o.kycStatus === "pending").length;
    const suspendedOwners = owners.filter((o) => o.accountStatus === "suspended" || o.accountStatus === "blocked").length;
    const activeListings = owners.reduce((acc, o) => acc + o.propertiesCount, 0);
    const totalRevenueGenerated = owners.reduce((acc, o) => acc + o.totalRevenue, 0);

    return {
      totalOwners,
      verifiedOwners,
      pendingKyc,
      suspendedOwners,
      activeListings,
      totalRevenueGenerated,
    };
  }

  static getAllOwners(): AdminOwner[] {
    return MOCK_ADMIN_OWNERS;
  }

  static getOwnerById(id: string): AdminOwner | undefined {
    return MOCK_ADMIN_OWNERS.find((o) => o.id === id);
  }
}
