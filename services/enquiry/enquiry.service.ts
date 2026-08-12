/**
 * Enquiry service — replaced with real backend API calls.
 * Removes all localStorage mock data.
 */

import { apiClient } from "@/lib/api-client";

export interface EnquirySubmission {
  name: string;
  phone: string;
  message?: string;
  requestType?: "Visit" | "Enquiry";
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
}

export interface BackendEnquiry {
  _id: string;
  listing: { _id: string; title: string; "address.area"?: string } | string;
  seeker?: { _id: string; name: string; email: string } | null;
  name: string;
  phone: string;
  message?: string;
  requestType?: "Visit" | "Enquiry";
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  status: "new" | "seen" | "closed" | string;
  createdAt: string;
  updatedAt: string;
}

export type EnquiryStatus = "new" | "seen" | "closed";

// Backwards-compat UI status types (old mock statuses kept for existing components)
export type RequestStatus = "Pending" | "Approved" | "Rejected" | "Rescheduled" | "Seen" | "Closed" | "new" | "seen" | "closed";

// Backwards-compat UI enquiry shape (old components use this shape)
export interface EnquiryRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  buyerName: string;
  buyerEmail?: string;
  buyerPhone: string;
  requestType: "Visit" | "Enquiry";
  status: RequestStatus;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export const EnquiryService = {
  /**
   * Backwards-compat: get all enquiries for the owner (async).
   * Old components called getAllRequests() synchronously — wrap in useEffect.
   */
  async getAllRequests(): Promise<BackendEnquiry[]> {
    const { enquiries } = await EnquiryService.getReceivedEnquiries({ limit: 50 });
    return enquiries;
  },

  /**
   * Submit a new enquiry for a listing (public endpoint, optional auth).
   */
  async createRequest(listingId: string, data: EnquirySubmission): Promise<BackendEnquiry> {
    const res = await apiClient.post<{ enquiry: BackendEnquiry }>(
      `/api/enquiries/${listingId}`,
      data
    );
    return res.data!.enquiry;
  },

  /**
   * Owner: get all received enquiries with optional filters.
   */
  async getReceivedEnquiries(params?: {
    listingId?: string;
    status?: EnquiryStatus;
    page?: number;
    limit?: number;
  }): Promise<{ enquiries: BackendEnquiry[]; pagination: any }> {
    const query = new URLSearchParams();
    if (params?.listingId) query.set("listingId", params.listingId);
    if (params?.status) query.set("status", params.status);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const path = `/api/enquiries/received${query.toString() ? `?${query}` : ""}`;
    const res = await apiClient.get<{ enquiries: BackendEnquiry[] }>(path);
    return {
      enquiries: res.data?.enquiries ?? [],
      pagination: res.pagination,
    };
  },

  /**
   * Owner: update enquiry status (new → seen → closed).
   */
  async updateRequestStatus(enquiryId: string, status: string, _extra?: any): Promise<BackendEnquiry> {
    // Map old UI status to backend status
    const statusMap: Record<string, EnquiryStatus> = {
      Approved: "seen",
      Rejected: "closed",
      Rescheduled: "seen",
      Seen: "seen",
      Closed: "closed",
      Pending: "new",
    };
    const backendStatus: EnquiryStatus = (statusMap[status] || status) as EnquiryStatus;
    const res = await apiClient.put<{ enquiry: BackendEnquiry }>(
      `/api/enquiries/${enquiryId}/status`,
      { status: backendStatus }
    );
    return res.data!.enquiry;
  },

  /**
   * Count pending (new) enquiries — synchronous fallback (returns 0).
   * Call fetchPendingCount() for the real async count.
   */
  getPendingCount(): number {
    return 0; // Sync fallback; real count fetched by fetchPendingCount()
  },

  async fetchPendingCount(): Promise<number> {
    try {
      const { pagination } = await EnquiryService.getReceivedEnquiries({ status: "new", limit: 1 });
      return pagination?.total ?? 0;
    } catch {
      return 0;
    }
  },
};
