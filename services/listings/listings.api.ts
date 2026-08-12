/**
 * Listings API service — real backend calls.
 * Maps between backend Listing model and frontend Property type.
 */

import { apiClient } from "@/lib/api-client";
import { Property } from "@/services/property/property.types";

// ─── Backend types (from Listing.model.js) ───────────────────────────────────
export interface BackendListing {
  _id: string;
  title: string;
  type: string;
  gender: string;
  description?: string;
  rent: {
    monthly: number;
    deposit?: number;
    maintenance?: number;
    foodIncluded?: boolean;
  };
  address: {
    area: string;
    city: string;
    full?: string;
    landmark?: string;
    mapsLink?: string;
    street?: string;
    pincode?: string;
  };
  amenities: string[];
  nearby?: string[];
  sharingOptions?: number[];
  rooms?: Array<{
    id?: string;
    roomType?: string;
    sharingType?: string;
    monthlyRent?: number;
    securityDeposit?: number;
    totalRooms?: number;
    availableRooms?: number;
    attachedBathroom?: boolean;
    furnished?: string;
  }>;
  rules?: Record<string, boolean | string>;
  photos?: Array<{ url: string; key: string }>;
  video?: { url: string; name?: string };
  apartmentDetails?: Record<string, unknown>;
  ownerWhatsapp?: string;
  isVerified?: boolean;
  status?: "active" | "paused" | "deleted" | string;
  viewCount?: number;
  owner?: {
    _id: string;
    name: string;
    avatar?: string;
    phone?: string;
    email?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ListingsFilters {
  city?: string;
  area?: string;
  type?: string;
  gender?: string;
  minRent?: number;
  maxRent?: number;
  amenities?: string;
  sharing?: string;
  verified?: boolean;
  page?: number;
  limit?: number;
  sort?: "newest" | "rent_asc" | "rent_desc";
  q?: string;
}

export interface PaginatedListings {
  listings: Property[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Type adapter: backend → frontend ────────────────────────────────────────
export function adaptListing(bl: BackendListing): Property {
  const typeMap: Record<string, string> = {
    hostel: "Hostel",
    pg: "PG",
    "shared-room": "Co-living",
    "private-room": "PG",
    apartment: "Apartment",
    studio: "Studio Apartment",
    "1-bhk": "1 BHK",
    "2-bhk": "2 BHK",
    "3-bhk": "3 BHK",
    "4-bhk": "4+ BHK",
  };
  const genderMap: Record<string, string> = {
    boys: "Boys",
    girls: "Girls",
    "co-ed": "Unisex",
  };

  const photos = bl.photos ?? [];
  const coverPhoto =
    photos[0]?.url ||
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80";

  // Use backend stored rooms if present, or fallback to sharingOptions synthesis
  const rooms = (bl.rooms && bl.rooms.length > 0)
    ? bl.rooms.map((r, idx) => ({
        id: r.id || `room-${idx}`,
        sharingType: r.sharingType || r.roomType || "Single Sharing",
        monthlyRent: r.monthlyRent || bl.rent.monthly,
        securityDeposit: r.securityDeposit ?? bl.rent.deposit ?? bl.rent.monthly,
        totalRooms: r.totalRooms || 1,
        availableRooms: r.availableRooms || 1,
        gender: (genderMap[bl.gender] || bl.gender) as any,
        attachedBathroom: r.attachedBathroom ?? true,
        furnished: r.furnished || "Fully Furnished",
        rent: r.monthlyRent || bl.rent.monthly,
      }))
    : (bl.sharingOptions ?? []).map((sharing, idx) => ({
        id: `room-${idx}`,
        sharingType: `${sharing} Sharing`,
        monthlyRent: bl.rent.monthly,
        securityDeposit: bl.rent.deposit ?? bl.rent.monthly,
        totalRooms: sharing,
        availableRooms: sharing,
        gender: genderMap[bl.gender] || bl.gender,
        attachedBathroom: true,
        furnished: "Fully Furnished",
        rent: bl.rent.monthly,
      }));

  return {
    id: bl._id,
    propertyName: bl.title,
    propertyType: (typeMap[bl.type] || bl.type) as Property["propertyType"],
    gender: (genderMap[bl.gender] || bl.gender) as Property["gender"],
    description: bl.description,
    city: bl.address.city,
    area: bl.address.area,
    address: bl.address.full || `${bl.address.area}, ${bl.address.city}`,
    landmark: bl.address.landmark,
    mapsLink: bl.address.mapsLink,
    rooms,
    roomConfigurations: rooms,
    amenities: bl.amenities ?? [],
    rules: (bl.rules as any) ?? {},
    nearby: bl.nearby ?? [],
    images: photos.map((p, i) => ({
      id: p.key || `photo-${i}`,
      url: p.url,
      name: `Photo ${i + 1}`,
      isCover: i === 0,
    })),
    coverPhoto,
    startingRent: bl.rent.monthly,
    startingPrice: bl.rent.monthly,
    status: bl.status === "active" ? "Published" : "Archived",
    views: bl.viewCount ?? 0,
    enquiries: 0,
    ownerId: bl.owner?._id,
    ownerEmail: bl.owner?.email,
    createdAt: bl.createdAt,
    updatedAt: bl.updatedAt,
  };
}

// ─── Type adapter: frontend → backend (for create/update) ────────────────────
export function adaptPropertyToListing(p: Partial<Property>): Record<string, unknown> {
  const typeMap: Record<string, string> = {
    PG: "pg",
    Hostel: "hostel",
    "Co-living": "shared-room",
    Apartment: "apartment",
    "Studio Apartment": "studio",
    "1 BHK": "1-bhk",
    "2 BHK": "2-bhk",
    "3 BHK": "3-bhk",
    "4+ BHK": "4-bhk",
  };
  const genderMap: Record<string, string> = {
    Boys: "boys",
    Girls: "girls",
    Unisex: "co-ed",
    "Co-living": "co-ed",
  };

  const formattedRooms = (p.rooms || p.roomConfigurations || []).map((r) => ({
    id: r.id,
    roomType: r.sharingType || r.roomType,
    sharingType: r.sharingType || r.roomType,
    monthlyRent: r.monthlyRent || r.rent || 0,
    securityDeposit: r.securityDeposit || 0,
    totalRooms: r.totalRooms || 1,
    availableRooms: r.availableRooms || 1,
    attachedBathroom: r.attachedBathroom ?? true,
    furnished: r.furnished || "Fully Furnished",
  }));

  const photos = (p.images || []).map((img, i) => ({
    url: img.url,
    key: img.id || `photo-${Date.now()}-${i}`,
  }));

  return {
    title: p.propertyName,
    type: typeMap[p.propertyType ?? ""] || (p.propertyType?.toLowerCase() || "pg"),
    gender: genderMap[p.gender ?? ""] || "co-ed",
    description: p.description,
    rent: {
      monthly: p.startingRent ?? p.rooms?.[0]?.monthlyRent ?? 0,
      deposit: p.rooms?.[0]?.securityDeposit || 0,
      maintenance: p.apartmentPricing?.maintenance || 0,
    },
    address: {
      area: p.area,
      city: p.city,
      full: p.address,
      landmark: p.landmark,
      mapsLink: p.mapsLink,
    },
    amenities: p.amenities ?? [],
    nearby: p.nearby ?? [],
    rooms: formattedRooms,
    rules: p.rules ?? {},
    sharingOptions: p.rooms?.map((r) => Number(r.sharingType?.split(" ")[0]) || 1) ?? [],
    photos: photos.length > 0 ? photos : undefined,
  };
}

// ─── API calls ────────────────────────────────────────────────────────────────
export const ListingsAPI = {
  async getListings(filters: ListingsFilters = {}): Promise<PaginatedListings> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.set(k, String(v));
    });
    const path = `/api/listings${params.toString() ? `?${params}` : ""}`;
    const res = await apiClient.get<{ listings: BackendListing[] }>(path);
    return {
      listings: (res.data?.listings ?? []).map(adaptListing),
      pagination: res.pagination ?? { total: 0, page: 1, limit: 12, totalPages: 1 },
    };
  },

  async getListingById(id: string): Promise<Property | null> {
    try {
      const res = await apiClient.get<{ listing: BackendListing }>(`/api/listings/${id}`);
      return res.data?.listing ? adaptListing(res.data.listing) : null;
    } catch {
      return null;
    }
  },

  async getWhatsAppLink(id: string): Promise<string | null> {
    try {
      const res = await apiClient.get<{ url: string }>(`/api/listings/${id}/whatsapp-link`);
      return res.data?.url ?? null;
    } catch {
      return null;
    }
  },

  async createListing(data: Partial<Property>): Promise<Property> {
    const payload = adaptPropertyToListing(data);
    const res = await apiClient.post<{ listing: BackendListing }>("/api/listings", payload);
    return adaptListing(res.data!.listing);
  },

  async updateListing(id: string, data: Partial<Property>): Promise<Property> {
    const payload = adaptPropertyToListing(data);
    const res = await apiClient.put<{ listing: BackendListing }>(`/api/listings/${id}`, payload);
    return adaptListing(res.data!.listing);
  },

  async deleteListing(id: string): Promise<void> {
    await apiClient.delete(`/api/listings/${id}`);
  },
};
