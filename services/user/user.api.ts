/**
 * User API service — real backend calls for profile, saved listings, history.
 */

import { apiClient } from "@/lib/api-client";
import { User } from "@/providers/auth-provider";
import { adaptListing, BackendListing } from "@/services/listings/listings.api";
import { Property } from "@/services/property/property.types";

// ─── Profile ──────────────────────────────────────────────────────────────────
export const UserAPI = {
  async getProfile(): Promise<User> {
    const res = await apiClient.get<{ user: any }>("/api/users/profile");
    const u = res.data!.user;
    return {
      id: u._id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      avatar: u.avatar,
      avatarUrl: u.avatar,
      role: u.role === "seeker" ? "buyer" : u.role,
      memberSince: u.createdAt,
    };
  },

  async updateProfile(data: { name?: string; phone?: string; avatar?: string }): Promise<User> {
    const res = await apiClient.put<{ user: any }>("/api/users/profile", data);
    const u = res.data!.user;
    return {
      id: u._id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      avatar: u.avatar,
      avatarUrl: u.avatar,
      role: u.role === "seeker" ? "buyer" : u.role,
      memberSince: u.createdAt,
    };
  },

  // ─── Saved Listings (Wishlist) ──────────────────────────────────────────────
  async getSavedListings(): Promise<Property[]> {
    const res = await apiClient.get<{ listings: BackendListing[] }>("/api/users/saved");
    return (res.data?.listings ?? []).map(adaptListing);
  },

  async saveListing(listingId: string): Promise<void> {
    await apiClient.post(`/api/users/saved/${listingId}`);
  },

  async unsaveListing(listingId: string): Promise<void> {
    await apiClient.delete(`/api/users/saved/${listingId}`);
  },

  // ─── Recently Viewed ────────────────────────────────────────────────────────
  async getRecentlyViewed(): Promise<Array<{ listing: Property; viewedAt: string }>> {
    const res = await apiClient.get<{ listings: Array<{ listingId: BackendListing; viewedAt: string }> }>(
      "/api/users/recently-viewed"
    );
    return (res.data?.listings ?? [])
      .filter((rv) => rv.listingId)
      .map((rv) => ({
        listing: adaptListing(rv.listingId),
        viewedAt: rv.viewedAt,
      }));
  },

  // ─── Search History ─────────────────────────────────────────────────────────
  async getSearchHistory(): Promise<any[]> {
    const res = await apiClient.get<{ history: any[] }>("/api/users/search-history");
    return res.data?.history ?? [];
  },

  async clearSearchHistory(): Promise<void> {
    await apiClient.delete("/api/users/search-history");
  },

  // ─── My Listings (Owner) ────────────────────────────────────────────────────
  async getMyListings(params?: { page?: number; limit?: number; status?: string }): Promise<{
    listings: Property[];
    pagination: any;
  }> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.status) query.set("status", params.status);
    const path = `/api/users/my-listings${query.toString() ? `?${query}` : ""}`;
    const res = await apiClient.get<{ listings: BackendListing[] }>(path);
    return {
      listings: (res.data?.listings ?? []).map(adaptListing),
      pagination: res.pagination,
    };
  },
};
