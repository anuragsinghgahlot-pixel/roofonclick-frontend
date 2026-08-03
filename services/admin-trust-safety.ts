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

/* ─── Mock Data ─── */
const MOCK_TICKETS: SupportTicketItem[] = [
  {
    id: "TKT-901",
    buyerName: "Anurag Singh Gahlot",
    ownerName: "Rajesh Kumar",
    category: "Check-in Delay",
    priority: "High",
    assignedStaff: "Rohit (Ops Admin)",
    status: "In Progress",
    createdAt: "2026-08-02 20:00",
    conversation: [
      { sender: "Anurag Singh", message: "Arrived at PG but gate was locked.", date: "2026-08-02 20:00" },
      { sender: "Rohit (Ops Admin)", message: "Contacted owner Rajesh Kumar. Caretaker is arriving in 5 mins.", date: "2026-08-02 20:05", isStaff: true },
    ],
    evidence: [{ title: "Entrance Gate Photo.jpg", url: "#" }],
    timeline: [
      { event: "Ticket Opened", date: "2026-08-02 20:00", by: "Anurag Singh" },
      { event: "Assigned to Rohit", date: "2026-08-02 20:02", by: "System" },
    ],
    notes: [{ author: "Rohit", note: "Caretaker was away buying supplies.", date: "2026-08-02 20:06" }],
  },
  {
    id: "TKT-902",
    buyerName: "Rahul Verma",
    ownerName: "Amitabh Jain",
    category: "Refund Request",
    priority: "Medium",
    assignedStaff: "Priya (Support)",
    status: "Open",
    createdAt: "2026-08-03 09:30",
    conversation: [
      { sender: "Rahul Verma", message: "Requesting full deposit refund due to move-in cancellation.", date: "2026-08-03 09:30" },
    ],
    evidence: [],
    timeline: [{ event: "Ticket Created", date: "2026-08-03 09:30", by: "Rahul Verma" }],
    notes: [],
  },
];

const MOCK_COMPLAINTS: ComplaintItem[] = [
  {
    id: "CMP-401",
    complaintType: "Food Quality",
    buyerName: "Kunal Sharma",
    ownerName: "Deepak Sharma",
    propertyTitle: "Royal Residency",
    status: "Investigating",
    severity: "Critical",
    assignedTo: "Audit Team",
    createdAt: "2026-07-25 11:00",
  },
  {
    id: "CMP-402",
    complaintType: "Fake Photos",
    buyerName: "Sneha Mukherjee",
    ownerName: "Sunita Verma",
    propertyTitle: "Shree Comfort Stay",
    status: "Dismissed",
    severity: "Low",
    assignedTo: "Rohit (Ops Admin)",
    createdAt: "2026-07-20 14:00",
  },
];

const MOCK_REVIEWS: ReviewModerationItem[] = [
  {
    id: "REV-303",
    reviewComment: "This place is terrible, food is toxic and staff are rude!",
    reviewerName: "Kunal Sharma",
    propertyTitle: "Royal Residency",
    rating: 1,
    reasonReported: "Abusive Language",
    status: "Pending",
    createdAt: "2026-07-24 16:30",
  },
  {
    id: "REV-304",
    reviewComment: "Visit http://spam-link.com for cheap rooms!",
    reviewerName: "Bot Account",
    propertyTitle: "Elite Residency PG",
    rating: 5,
    reasonReported: "Spam",
    status: "Pending",
    createdAt: "2026-08-01 10:00",
  },
];

const MOCK_PROPERTIES: ReportedListingItem[] = [
  {
    id: "PROP-1007",
    propertyTitle: "Royal Residency",
    ownerName: "Deepak Sharma",
    reason: "Unsanitary Conditions",
    reportsCount: 14,
    status: "Suspended",
    createdAt: "2026-07-25 11:30",
  },
];

const MOCK_USERS: ReportedUserItem[] = [
  {
    id: "USER-4525",
    userName: "Deepak Sharma",
    userRole: "Owner",
    reason: "Abusive Behaviour",
    reportsCount: 14,
    riskScore: 88,
    status: "Suspended",
    createdAt: "2026-07-25 11:30",
  },
  {
    id: "USER-8004",
    userName: "Kunal Sharma",
    userRole: "Buyer",
    reason: "Payment Fraud",
    reportsCount: 3,
    riskScore: 72,
    status: "Warned",
    createdAt: "2026-07-24 16:30",
  },
];

/* ─── Admin Trust & Safety Service ─── */
export class AdminTrustSafetyService {
  static getQuickStats(): TrustSafetyQuickStats {
    return {
      openTickets: MOCK_TICKETS.filter((t) => t.status === "Open" || t.status === "In Progress").length,
      pendingComplaints: MOCK_COMPLAINTS.filter((c) => c.status === "Pending" || c.status === "Investigating").length,
      reportedReviews: MOCK_REVIEWS.filter((r) => r.status === "Pending").length,
      flaggedProperties: MOCK_PROPERTIES.filter((p) => p.status === "Flagged" || p.status === "Suspended").length,
      flaggedOwners: MOCK_USERS.filter((u) => u.userRole === "Owner" && u.riskScore >= 70).length,
      resolvedToday: 18,
      avgResolutionTime: "4.2 hours",
    };
  }

  static getTickets() { return MOCK_TICKETS; }
  static getComplaints() { return MOCK_COMPLAINTS; }
  static getReviews() { return MOCK_REVIEWS; }
  static getReportedProperties() { return MOCK_PROPERTIES; }
  static getReportedUsers() { return MOCK_USERS; }
}
