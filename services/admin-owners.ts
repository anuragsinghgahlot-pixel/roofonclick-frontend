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
  kycStatus: "verified" | "pending" | "rejected" | "unverified";
  subscriptionPlan: "Gold Tier" | "Silver Tier" | "Free Tier" | "Enterprise";
  accountStatus: StatusType;
  joinedDate: string;
  accountManager?: {
    name: string;
    email: string;
    phone: string;
  };
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

/* ─── Admin Owner Service ─── */
export class AdminOwnerService {
  static getQuickStats(owners: AdminOwner[] = []): AdminOwnerQuickStats {
    const totalOwners = owners.length;
    const verifiedOwners = owners.filter((o) => o.kycStatus === "verified").length;
    const pendingKyc = owners.filter((o) => o.kycStatus === "pending").length;
    const suspendedOwners = owners.filter((o) => o.accountStatus === "suspended" || o.accountStatus === "blocked").length;
    const activeListings = owners.reduce((acc, o) => acc + (o.propertiesCount || 0), 0);
    const totalRevenueGenerated = owners.reduce((acc, o) => acc + (o.totalRevenue || 0), 0);

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
      return list.map((u) => {
        const kycStatus = u.kyc?.status || (u.isVerified ? "verified" : u.requestedOwnerRole ? "pending" : "unverified");
        const accountStatus: StatusType = (u.status === "suspended" || u.status === "inactive" || u.status === "blocked")
          ? u.status
          : "active";

        return {
          id: u._id,
          name: u.name || "Owner User",
          email: u.email || "",
          phone: u.phone || "N/A",
          avatar: u.avatar || `https://api.dicebear.com/8.x/lorelei/svg?seed=${encodeURIComponent(u.name || "Owner")}`,
          city: u.city || "Indore",
          address: u.address || "Indore, MP",
          propertiesCount: u.propertiesCount || 0,
          occupancyRate: u.occupancyRate || 0,
          avgRating: u.avgRating || 5.0,
          totalRevenue: u.totalRevenue || 0,
          kycStatus,
          subscriptionPlan: u.subscriptionPlan || "Gold Tier",
          accountStatus,
          joinedDate: u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "2026-08-15",
          accountManager: u.accountManager,
          properties: u.properties || [],
          bookings: u.bookings || [],
          payments: u.payments || [],
          reviews: u.reviews || [],
          documents: [
            {
              id: "doc-1",
              type: "Aadhaar",
              docNumber: "•••• •••• 8842",
              fileUrl: u.kyc?.documentUrl || "/docs/aadhaar.pdf",
              status: kycStatus === "verified" ? "verified" : kycStatus === "rejected" ? "rejected" : "pending",
              submittedAt: u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "2026-08-15",
            },
          ],
          supportTickets: [],
          timeline: [
            {
              event: "Account Registered",
              description: `Owner signed up with ${u.email}`,
              date: u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "2026-08-15",
            },
          ],
        };
      });
    } catch {
      return [];
    }
  }

  static async updateStatus(id: string, status: "active" | "suspended" | "inactive" | "blocked") {
    return apiClient.put(`/api/admin/users/${id}/status`, { status });
  }

  static async updateKyc(id: string, status: "verified" | "rejected" | "pending", rejectionReason?: string) {
    return apiClient.put(`/api/admin/users/${id}/kyc`, { status, rejectionReason });
  }

  static async deleteOwner(id: string) {
    return apiClient.delete(`/api/admin/users/${id}`);
  }

  static async bulkUpdate(userIds: string[], action: "approve" | "suspend" | "delete", status?: string) {
    return apiClient.post("/api/admin/users/bulk-status", { userIds, action, status });
  }

  static async assignManager(id: string, manager: { name: string; email: string; phone: string }) {
    return apiClient.put(`/api/admin/users/${id}/manager`, manager);
  }
}
