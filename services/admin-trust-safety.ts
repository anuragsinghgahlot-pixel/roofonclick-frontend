"use client";

import type { StatusType } from "@/components/admin/data-table";

/* ─── Trust & Safety Admin Types ─── */
export interface SupportTicketItem {
  id: string;
  buyerName: string;
  ownerName: string;
  category: "Booking Issue" | "Refund Request" | "Amenities Dispute" | "Check-in Delay" | "General Query";
  priority: "High" | "Medium" | "Low" | "Urgent";
  assignedStaff: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdAt: string;
  // Drawer details
  conversation: { sender: string; message: string; date: string; isStaff?: boolean }[];
  evidence: { title: string; url: string }[];
  timeline: { event: string; date: string; by: string }[];
  notes: { author: string; note: string; date: string }[];
}

export interface ComplaintItem {
  id: string;
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

/* ─── Data ─── */
const MOCK_TICKETS: SupportTicketItem[] = [];
const MOCK_COMPLAINTS: ComplaintItem[] = [];
const MOCK_REVIEWS: ReviewModerationItem[] = [];
const MOCK_PROPERTIES: ReportedListingItem[] = [];
const MOCK_USERS: ReportedUserItem[] = [];

/* ─── Admin Trust & Safety Service ─── */
export class AdminTrustSafetyService {
  static getQuickStats(): TrustSafetyQuickStats {
    return {
      openTickets: MOCK_TICKETS.filter((t) => t.status === "Open" || t.status === "In Progress").length,
      pendingComplaints: MOCK_COMPLAINTS.filter((c) => c.status === "Pending" || c.status === "Investigating").length,
      reportedReviews: MOCK_REVIEWS.filter((r) => r.status === "Pending").length,
      flaggedProperties: MOCK_PROPERTIES.filter((p) => p.status === "Flagged" || p.status === "Suspended").length,
      flaggedOwners: MOCK_USERS.filter((u) => u.userRole === "Owner" && u.riskScore >= 70).length,
      resolvedToday: 0,
      avgResolutionTime: "0 hours",
    };
  }

  static getTickets() { return MOCK_TICKETS; }
  static getComplaints() { return MOCK_COMPLAINTS; }
  static getReviews() { return MOCK_REVIEWS; }
  static getReportedProperties() { return MOCK_PROPERTIES; }
  static getReportedUsers() { return MOCK_USERS; }
}
