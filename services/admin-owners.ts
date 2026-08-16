import { apiClient } from "@/lib/api-client";
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
    date: string;
    ownerReply?: string;
  }[];
  documents: AdminOwnerKycDoc[];
  supportTickets: {
    id: string;
    subject: string;
    status: "Open" | "Resolved" | "Closed";
    createdDate: string;
    channel?: string;
    priority?: string;
    date?: string;
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

/* ─── Data ─── */
const MOCK_ADMIN_OWNERS: AdminOwner[] = [];

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

  static async fetchAdminOwners(): Promise<AdminOwner[]> {
    try {
      const res = await apiClient.get<{ users: any[] }>("/api/admin/users?role=owner");
      const list = res.data?.users || [];
      return list.map((u) => ({
        id: u._id,
        name: u.name || "Owner User",
        email: u.email || "",
        phone: u.phone || "N/A",
        avatar: u.avatar || `https://api.dicebear.com/8.x/lorelei/svg?seed=${encodeURIComponent(u.name || "Owner")}`,
        city: "Indore",
        address: "Indore, MP",
        propertiesCount: 1,
        occupancyRate: 85,
        avgRating: 4.8,
        totalRevenue: 15000,
        kycStatus: u.requestedOwnerRole ? "pending" : "verified",
        subscriptionPlan: "Gold Tier",
        accountStatus: "active",
        joinedDate: u.createdAt || "2026-08-15",
        properties: [],
        bookings: [],
        payments: [],
        reviews: [],
        documents: [],
        supportTickets: [],
        timeline: [{ event: "Account Created", description: "Registered on RoofOnClick", date: u.createdAt || "2026-08-15" }],
      }));
    } catch {
      return [];
    }
  }

  static getAllOwners(): AdminOwner[] {
    return MOCK_ADMIN_OWNERS;
  }

  static getOwnerById(id: string): AdminOwner | undefined {
    return MOCK_ADMIN_OWNERS.find((o) => o.id === id);
  }
}
