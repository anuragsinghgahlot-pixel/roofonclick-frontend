"use client";

import type { StatusType } from "@/components/admin/data-table";

export type AdminPaymentStatusType =
  | "Pending"
  | "Paid"
  | "Failed"
  | "Refunded"
  | "Partially Refunded"
  | "Settlement Pending"
  | "Settled";

/* ─── Payment Admin Types ─── */
export interface AdminPayment {
  id: string;
  bookingId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  ownerName: string;
  ownerPhone: string;
  bankAccount: string;
  propertyTitle: string;
  city: string;
  amount: number; // Gross amount in ₹
  platformFee: number; // Commission in ₹
  ownerEarnings: number; // Net payout in ₹
  paymentMethod: "UPI" | "Credit Card" | "Debit Card" | "Net Banking" | "Wallet";
  gateway: "Razorpay" | "Stripe" | "Paytm Gateway";
  gatewayRef: string;
  status: AdminPaymentStatusType;
  createdAt: string;
  // Detail Drawer data
  settlementDetails: {
    settlementId: string;
    settlementStatus: "Settled" | "Pending" | "Failed";
    settlementDate?: string;
    bankName: string;
    accountNo: string;
    ifscCode: string;
  };
  refundDetails?: {
    refundId: string;
    refundAmount: number;
    reason: string;
    requestedAt: string;
    processedAt?: string;
    status: "Requested" | "Approved" | "Processed" | "Rejected";
  };
  timeline: {
    event: string;
    description: string;
    date: string;
  }[];
  documents: {
    id: string;
    title: string;
    type: "Invoice" | "Receipt" | "Gateway Log";
    url: string;
  }[];
  internalNotes: {
    id: string;
    author: string;
    note: string;
    date: string;
  }[];
}

export interface AdminFinanceQuickStats {
  todaysRevenue: number;
  monthlyRevenue: number;
  platformCommission: number;
  pendingSettlements: number;
  completedSettlements: number;
  refundRequests: number;
  failedPayments: number;
  outstandingPayments: number;
}

/* ─── Data ─── */
const MOCK_ADMIN_PAYMENTS: AdminPayment[] = [];

const MOCK_FINANCE_CHARTS = {
  monthlyRevenue: {
    id: "revenue",
    title: "Gross Transaction Volume (GTV)",
    subtitle: "Total booking payments processed across all properties",
    color: "hsl(217, 91%, 60%)",
    data: [],
  },
  platformCommission: {
    id: "commission",
    title: "Platform Revenue (5% Commission)",
    subtitle: "Commission collected from settlements",
    color: "hsl(142, 71%, 45%)",
    data: [],
  },
  refunds: {
    id: "refunds",
    title: "Refunds Processed",
    subtitle: "Total refund volume issued to buyers",
    color: "hsl(0, 84%, 60%)",
    data: [],
  },
  revenueTrend: { id: "revenueTrend", title: "Revenue Trend", subtitle: "Monthly revenue trend", color: "hsl(217, 91%, 60%)", data: [] },
  commissionTrend: { id: "commissionTrend", title: "Commission Trend", subtitle: "Monthly commission trend", color: "hsl(142, 71%, 45%)", data: [] },
  payoutsTrend: { id: "payoutsTrend", title: "Payouts Trend", subtitle: "Monthly payouts trend", color: "hsl(270, 70%, 60%)", data: [] },
  refundTrend: { id: "refundTrend", title: "Refund Trend", subtitle: "Monthly refund trend", color: "hsl(0, 84%, 60%)", data: [] },
};

/* ─── Admin Payment Service ─── */
export class AdminPaymentService {
  static getQuickStats(payments: AdminPayment[] = MOCK_ADMIN_PAYMENTS): AdminFinanceQuickStats {
    const todaysRevenue = payments
      .filter((p) => p.status === "Paid" || p.status === "Settled")
      .reduce((acc, p) => acc + p.amount, 0);

    const monthlyRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
    const platformCommission = Math.round(monthlyRevenue * 0.05);
    const pendingSettlements = payments.filter((p) => p.status === "Settlement Pending" || p.status === "Pending").length;
    const completedSettlements = payments.filter((p) => p.status === "Settled").length;
    const refundRequests = payments.filter((p) => p.status === "Refunded" || p.refundDetails?.status === "Requested").length;
    const failedPayments = payments.filter((p) => p.status === "Failed").length;
    const outstandingPayments = payments.filter((p) => p.status === "Pending").length;

    return {
      todaysRevenue,
      monthlyRevenue,
      platformCommission,
      pendingSettlements,
      completedSettlements,
      refundRequests,
      failedPayments,
      outstandingPayments,
    };
  }

  static getAllPayments(): AdminPayment[] {
    return MOCK_ADMIN_PAYMENTS;
  }

  static getFinanceCharts() {
    return MOCK_FINANCE_CHARTS;
  }
}
