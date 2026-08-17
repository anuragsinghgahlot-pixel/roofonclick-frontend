import { apiClient } from "@/lib/api-client";
import type { StatusType } from "@/components/admin/data-table";

/* ─── Property Admin Types ─── */
export interface AdminProperty {
  id: string;
  propertyName: string;
  coverPhoto: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  city: string;
  area: string;
  address: string;
  propertyType: "Hostel" | "PG" | "Co-living" | "Apartment";
  gender: "Boys" | "Girls" | "Co-ed";
  startingRent: number;
  occupancyRate: number; // percentage e.g. 85
  totalBeds: number;
  occupiedBeds: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  healthScore: number; // 0-100
  healthLabel: "Excellent" | "Good" | "Needs Attention";
  status: StatusType;
  createdAt: string;
  updatedAt: string;
  // Detail drawer attributes
  description: string;
  amenities: string[];
  rooms: {
    roomType: string;
    rent: number;
    total: number;
    available: number;
  }[];
  photos: string[];
  verificationDetails: {
    propertyDocVerified: boolean;
    ownerIdVerified: boolean;
    locationVerified: boolean;
    inspectionCompleted: boolean;
  };
  timeline: {
    event: string;
    description: string;
    date: string;
    by: string;
  }[];
}

export interface AdminPropertyQuickStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  featured: number;
  draft: number;
  suspended: number;
  avgOccupancy: number;
}

/* ─── Data ─── */
const MOCK_ADMIN_PROPERTIES: AdminProperty[] = [];

/* ─── Admin Property Service Class ─── */
export class AdminPropertyService {
  static getQuickStats(properties: AdminProperty[] = MOCK_ADMIN_PROPERTIES): AdminPropertyQuickStats {
    const total = properties.length;
    const pending = properties.filter((p) => p.status === "pending").length;
    const approved = properties.filter((p) => p.status === "approved" || p.status === "active").length;
    const rejected = properties.filter((p) => p.status === "rejected").length;
    const featured = properties.filter((p) => p.isFeatured).length;
    const draft = properties.filter((p) => p.status === "draft").length;
    const suspended = properties.filter((p) => p.status === "suspended").length;

    const occupiedSum = properties.reduce((acc, p) => acc + p.occupiedBeds, 0);
    const totalSum = properties.reduce((acc, p) => acc + p.totalBeds, 0);
    const avgOccupancy = totalSum > 0 ? Math.round((occupiedSum / totalSum) * 100) : 0;

    return {
      total,
      pending,
      approved,
      rejected,
      featured,
      draft,
      suspended,
      avgOccupancy,
    };
  }

  static async fetchAdminListings(): Promise<AdminProperty[]> {
    try {
      const res = await apiClient.get<{ listings: any[] }>("/api/admin/listings");
      const list = res.data?.listings || [];
      return list.map((bl) => ({
        id: bl._id,
        propertyName: bl.title || "Untitled Property",
        coverPhoto: bl.photos?.[0]?.url || "",
        ownerName: bl.owner?.name || "Owner",
        ownerEmail: bl.owner?.email || "owner@roofonclick.com",
        ownerPhone: bl.owner?.phone || "N/A",
        city: bl.address?.city || "Indore",
        area: bl.address?.area || "Vijay Nagar",
        address: bl.address?.full || `${bl.address?.area || ""}, ${bl.address?.city || ""}`,
        propertyType: (bl.type === "pg" ? "PG" : bl.type === "hostel" ? "Hostel" : bl.type === "apartment" ? "Apartment" : "Co-living") as any,
        gender: (bl.gender === "boys" ? "Boys" : bl.gender === "girls" ? "Girls" : "Co-ed") as any,
        startingRent: bl.rent?.monthly || 0,
        occupancyRate: 80,
        totalBeds: 10,
        occupiedBeds: 8,
        rating: 4.8,
        reviewCount: 12,
        isVerified: !!bl.isVerified,
        isFeatured: false,
        healthScore: 92,
        healthLabel: "Excellent",
        status: (bl.status === "active" ? "approved" : bl.status === "pending" ? "pending" : bl.status === "rejected" ? "rejected" : "draft") as any,
        createdAt: bl.createdAt || new Date().toISOString(),
        updatedAt: bl.updatedAt || new Date().toISOString(),
        description: bl.description || "",
        amenities: bl.amenities || [],
        rooms: (bl.rooms || []).map((r: any) => ({
          roomType: r.roomType || r.sharingType || "Single",
          rent: r.monthlyRent || 0,
          total: r.totalRooms || 1,
          available: r.availableRooms || 1,
        })),
        photos: (bl.photos || []).map((p: any) => p.url),
        verificationDetails: {
          propertyDocVerified: true,
          ownerIdVerified: true,
          locationVerified: true,
          inspectionCompleted: bl.isVerified,
        },
        timeline: [
          { event: "Created", description: "Submitted by owner for admin examination", date: bl.createdAt || "2026-08-15", by: bl.owner?.name || "Owner" },
        ],
      }));
    } catch {
      return [];
    }
  }

  static async approveListing(id: string): Promise<void> {
    await apiClient.put(`/api/admin/listings/${id}/status`, { status: "active" });
  }

  static async rejectListing(id: string): Promise<void> {
    await apiClient.put(`/api/admin/listings/${id}/status`, { status: "rejected" });
  }

  static async suspendListing(id: string): Promise<void> {
    await apiClient.put(`/api/admin/listings/${id}/status`, { status: "inactive" });
  }

  static async deleteListing(id: string): Promise<void> {
    await apiClient.put(`/api/admin/listings/${id}/status`, { status: "deleted" });
  }

  static async toggleVerifyListing(id: string): Promise<void> {
    await apiClient.put(`/api/admin/listings/${id}/verify`);
  }

  static getAllProperties(): AdminProperty[] {
    return MOCK_ADMIN_PROPERTIES;
  }

  static getPropertyById(id: string): AdminProperty | undefined {
    return MOCK_ADMIN_PROPERTIES.find((p) => p.id === id);
  }
}
