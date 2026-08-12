"use client";

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

  static getAllProperties(): AdminProperty[] {
    return MOCK_ADMIN_PROPERTIES;
  }

  static getPropertyById(id: string): AdminProperty | undefined {
    return MOCK_ADMIN_PROPERTIES.find((p) => p.id === id);
  }
}
