import { apiClient } from "@/lib/api-client";
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

/* ─── Admin Buyer Service Class ─── */
export class AdminBuyerService {
  static getQuickStats(buyers: AdminBuyer[] = []): AdminBuyerQuickStats {
    const totalBuyers = buyers.length;
    const activeBuyers = buyers.filter((b) => b.accountStatus === "active").length;
    const verifiedBuyers = buyers.filter((b) => b.verificationStatus === "verified").length;
    const blockedBuyers = buyers.filter((b) => b.accountStatus === "blocked" || b.accountStatus === "suspended").length;
    const totalBookings = buyers.reduce((acc, b) => acc + (b.bookingsCount || 0), 0);
    const ltvSum = buyers.reduce((acc, b) => acc + (b.lifetimeValue || 0), 0);
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

  static async fetchAdminBuyers(): Promise<AdminBuyer[]> {
    try {
      const res = await apiClient.get<{ users: any[] }>("/api/admin/users?role=seeker");
      const list = res.data?.users || [];
      return list.map((u) => {
        const verificationStatus = u.isVerified || u.kyc?.status === "verified" ? "verified" : "unverified";
        const accountStatus: StatusType = (u.status === "blocked" || u.status === "suspended" || u.status === "inactive")
          ? u.status
          : "active";

        return {
          id: u._id,
          name: u.name || "Seeker User",
          email: u.email || "",
          phone: u.phone || "N/A",
          avatar: u.avatar || `https://api.dicebear.com/8.x/lorelei/svg?seed=${encodeURIComponent(u.name || "Seeker")}`,
          city: u.city || "Indore",
          institutionOrCompany: u.institutionOrCompany || "Indore Resident",
          bookingsCount: u.bookingsCount || 0,
          wishlistCount: u.wishlistCount || (u.savedListings || []).length,
          reviewsCount: u.reviewsCount || 0,
          lifetimeValue: u.lifetimeValue || 0,
          verificationStatus,
          accountStatus,
          joinedDate: u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "2026-08-15",
          lastActive: u.updatedAt ? new Date(u.updatedAt).toISOString().split("T")[0] : "2026-08-15",
          bookings: u.bookings || [],
          wishlist: (u.savedListings || []).map((id: string) => ({
            propertyId: id,
            title: "Saved Indore PG",
            rent: 8000,
            addedDate: "2026-08-15",
          })),
          recentlyViewed: (u.recentlyViewed || []).map((rv: any) => ({
            propertyId: rv.listingId || rv._id,
            title: "Viewed PG / Hostel",
            viewedAt: rv.viewedAt ? new Date(rv.viewedAt).toISOString().split("T")[0] : "2026-08-15",
          })),
          savedSearches: (u.searchHistory || []).map((sh: any, idx: number) => ({
            id: `sh-${idx}`,
            name: sh.query || "Indore Search",
            filtersUsed: "Price, WiFi, AC",
            createdDate: sh.searchedAt ? new Date(sh.searchedAt).toISOString().split("T")[0] : "2026-08-15",
          })),
          reviews: u.reviews || [],
          payments: (u.bookings || []).map((b: any, idx: number) => ({
            id: `pay-${idx}`,
            type: "Booking Fee" as const,
            amount: b.rent || 5000,
            invoiceNo: `INV-2026-${1000 + idx}`,
            status: "Paid" as const,
            date: b.moveInDate || "2026-08-01",
          })),
          supportTickets: [],
          timeline: [
            {
              event: "Joined Platform",
              description: `Seeker account created with ${u.email}`,
              date: u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "2026-08-15",
            },
          ],
        };
      });
    } catch {
      return [];
    }
  }

  static async updateStatus(id: string, status: "active" | "blocked" | "suspended" | "inactive") {
    return apiClient.put(`/api/admin/users/${id}/status`, { status });
  }

  static async verifyBuyer(id: string) {
    return apiClient.put(`/api/admin/users/${id}/kyc`, { status: "verified" });
  }

  static async deleteBuyer(id: string) {
    return apiClient.delete(`/api/admin/users/${id}`);
  }

  static async bulkUpdate(userIds: string[], action: "verify" | "block" | "delete", status?: string) {
    const act = action === "verify" ? "approve" : action === "block" ? "block" : "delete";
    return apiClient.post("/api/admin/users/bulk-status", { userIds, action: act, status });
  }

  static async broadcastNotification(data: { userIds?: string[]; role?: string; title: string; message: string }) {
    return apiClient.post("/api/admin/users/broadcast", data);
  }
}
