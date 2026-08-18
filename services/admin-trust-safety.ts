"use client";

import { apiClient } from "@/lib/api-client";

/* ─── Trust & Safety Admin Types ─── */
export interface SupportTicketItem {
  id: string;
  mongoId?: string;
  buyerName: string;
  buyerEmail?: string;
  buyerPhone?: string;
  ownerName: string;
  category: "Booking Issue" | "Refund Request" | "Amenities Dispute" | "Check-in Delay" | "General Query";
  priority: "High" | "Medium" | "Low" | "Urgent";
  assignedStaff: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdAt: string;
  subject?: string;
  // Drawer details
  conversation: { sender: string; message: string; date: string; isStaff?: boolean }[];
  evidence: { title: string; url: string }[];
  timeline: { event: string; date: string; by: string }[];
  notes: { author: string; note: string; date: string }[];
}

export interface ComplaintItem {
  id: string;
  mongoId?: string;
  complaintType: "Fake Photos" | "Food Quality" | "Security Issue" | "Deposit Dispute" | "Harassment";
  buyerName: string;
  ownerName: string;
  propertyTitle: string;
  status: "Pending" | "Investigating" | "Resolved" | "Dismissed";
  severity: "Critical" | "High" | "Medium" | "Low";
  assignedTo: string;
  createdAt: string;
}

export interface ReviewModerationItem {
  id: string;
  mongoId?: string;
  reviewComment: string;
  reviewerName: string;
  propertyTitle: string;
  rating: number;
  reasonReported: "Abusive Language" | "Spam" | "Fake Review" | "Competitor Attack";
  status: "Pending" | "Approved" | "Hidden" | "Deleted";
  createdAt: string;
}

export interface ReportedListingItem {
  id: string;
  propertyTitle: string;
  ownerName: string;
  reason: "Unregistered Property" | "Misleading Pricing" | "Safety Violation" | "Unsanitary Conditions";
  reportsCount: number;
  status: "Flagged" | "Under Review" | "Cleared" | "Suspended";
  createdAt: string;
}

export interface ReportedUserItem {
  id: string;
  userName: string;
  userRole: "Buyer" | "Owner";
  reason: "Repeated Cancellation" | "Abusive Behaviour" | "Payment Fraud" | "Fake ID";
  reportsCount: number;
  riskScore: number; // 0-100
  status: "Active" | "Warned" | "Suspended" | "Banned";
  createdAt: string;
}

export interface TrustSafetyQuickStats {
  openTickets: number;
  pendingComplaints: number;
  reportedReviews: number;
  flaggedProperties: number;
  flaggedOwners: number;
  resolvedToday: number;
  avgResolutionTime: string;
}

/* ─── Admin Trust & Safety Service ─── */
export class AdminTrustSafetyService {
  static getQuickStats(
    tickets: SupportTicketItem[] = [],
    complaints: ComplaintItem[] = [],
    reviews: ReviewModerationItem[] = []
  ): TrustSafetyQuickStats {
    return {
      openTickets: tickets.filter((t) => t.status === "Open" || t.status === "In Progress").length,
      pendingComplaints: complaints.filter((c) => c.status === "Pending" || c.status === "Investigating").length,
      reportedReviews: reviews.filter((r) => r.status === "Pending").length,
      flaggedProperties: 0,
      flaggedOwners: 0,
      resolvedToday: tickets.filter((t) => t.status === "Resolved").length,
      avgResolutionTime: "2.4 hours",
    };
  }

  static async fetchTickets(): Promise<SupportTicketItem[]> {
    try {
      const res = await apiClient.get<{ tickets: any[] }>("/api/admin/support/tickets");
      const list = res.data?.tickets || [];
      return list.map((t) => ({
        id: t.ticketId || t._id,
        mongoId: t._id,
        buyerName: t.userName || t.user?.name || "Resident",
        buyerEmail: t.userEmail || t.user?.email || "N/A",
        buyerPhone: t.userPhone || t.user?.phone || "N/A",
        ownerName: t.property?.owner?.name || "RoofOnClick Admin",
        category: (t.category === "Payment" ? "Refund Request" : "Booking Issue") as any,
        priority: (t.priority === "urgent" ? "Urgent" : t.priority === "high" ? "High" : "Medium") as any,
        assignedStaff: t.assignedAgent?.name || "Support Executive",
        status: (t.status === "open" ? "Open" : t.status === "in_progress" ? "In Progress" : t.status === "resolved" ? "Resolved" : "Closed") as any,
        createdAt: t.createdAt ? new Date(t.createdAt).toISOString().split("T")[0] : "2026-08-15",
        subject: t.subject,
        conversation: (t.messages || []).map((m: any) => ({
          sender: m.sender || "User",
          message: m.message,
          date: m.timestamp ? new Date(m.timestamp).toISOString().split("T")[0] : "2026-08-15",
          isStaff: m.senderRole === "Admin",
        })),
        evidence: [],
        timeline: [
          {
            event: "Ticket Submitted",
            date: t.createdAt ? new Date(t.createdAt).toISOString().split("T")[0] : "2026-08-15",
            by: t.userName || "User",
          },
        ],
        notes: t.resolutionNotes ? [{ author: "Ops Team", note: t.resolutionNotes, date: "2026-08-15" }] : [],
      }));
    } catch {
      return [];
    }
  }

  static async updateTicket(id: string, update: { status?: string; priority?: string; resolutionNotes?: string; replyMessage?: string }) {
    return apiClient.put(`/api/admin/support/tickets/${id}`, update);
  }

  static async createTicket(data: { subject: string; message?: string; category?: string; priority?: string }) {
    return apiClient.post("/api/admin/support/tickets", data);
  }

  static async bulkUpdateTickets(ticketIds: string[], status: string) {
    return apiClient.post("/api/admin/support/tickets/bulk-status", { ticketIds, status });
  }

  static async fetchReviews(): Promise<ReviewModerationItem[]> {
    try {
      const res = await apiClient.get<{ reviews: any[] }>("/api/admin/reviews");
      const list = res.data?.reviews || [];
      return list.map((r) => ({
        id: r._id,
        mongoId: r._id,
        reviewComment: r.content || r.title || "Stay experience review",
        reviewerName: r.userName || r.user?.name || "Verified Resident",
        propertyTitle: r.property?.title || "Indore Property",
        rating: r.rating || 5,
        reasonReported: (r.flagReason || "Spam") as any,
        status: (r.status === "published" ? "Approved" : r.status === "flagged" ? "Pending" : r.status === "hidden" ? "Hidden" : "Approved") as any,
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString().split("T")[0] : "2026-08-15",
      }));
    } catch {
      return [];
    }
  }

  static async updateReviewStatus(id: string, status: "published" | "pending" | "flagged" | "hidden" | "deleted") {
    return apiClient.put(`/api/admin/reviews/${id}/status`, { status });
  }

  static async deleteReview(id: string) {
    return apiClient.delete(`/api/admin/reviews/${id}`);
  }

  static async fetchReports(): Promise<ComplaintItem[]> {
    try {
      const res = await apiClient.get<{ reports: any[] }>("/api/admin/trust-safety/reports");
      const list = res.data?.reports || [];
      return list.map((c) => ({
        id: c.ticketId || c._id,
        mongoId: c._id,
        complaintType: "Deposit Dispute",
        buyerName: c.userName || "Resident",
        ownerName: c.property?.owner?.name || "Owner",
        propertyTitle: c.property?.title || "Property",
        status: (c.status === "open" ? "Pending" : c.status === "in_progress" ? "Investigating" : "Resolved") as any,
        severity: (c.priority === "urgent" ? "Critical" : "High") as any,
        assignedTo: c.assignedAgent?.name || "Trust & Safety Officer",
        createdAt: c.createdAt ? new Date(c.createdAt).toISOString().split("T")[0] : "2026-08-15",
      }));
    } catch {
      return [];
    }
  }
}
