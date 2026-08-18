"use client";

import { apiClient } from "@/lib/api-client";
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
  mongoBookingId?: string;
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

/* ─── Admin Payment Service ─── */
export class AdminPaymentService {
  static getQuickStats(payments: AdminPayment[] = []): AdminFinanceQuickStats {
    const todaysRevenue = payments
      .filter((p) => p.status === "Paid" || p.status === "Settled")
      .reduce((acc, p) => acc + (p.amount || 0), 0);

    const monthlyRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
    const platformCommission = Math.round(monthlyRevenue * 0.05);
    const pendingSettlements = payments.filter((p) => p.status === "Settlement Pending" || p.status === "Pending").length;
    const completedSettlements = payments.filter((p) => p.status === "Settled" || p.status === "Paid").length;
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

  static async fetchFinanceStats() {
    try {
      const res = await apiClient.get<{ kpis: AdminFinanceQuickStats; charts: any }>("/api/admin/finance/stats");
      return res.data;
    } catch {
      return null;
    }
  }

  static async fetchAdminPayments(): Promise<AdminPayment[]> {
    try {
      const res = await apiClient.get<{ transactions: any[] }>("/api/admin/finance/transactions");
      const txns = res.data?.transactions || [];
      return txns.map((t) => ({
        id: t.id,
        bookingId: t.bookingId,
        mongoBookingId: t.mongoBookingId,
        buyerName: t.buyerName || "Resident Guest",
        buyerEmail: t.buyerEmail || "N/A",
        buyerPhone: t.buyerPhone || "N/A",
        ownerName: t.ownerName || "Property Owner",
        ownerPhone: t.ownerPhone || "N/A",
        bankAccount: t.bankAccount || "•••• •••• 8842",
        propertyTitle: t.propertyTitle || "Indore Property",
        city: t.city || "Indore",
        amount: t.amount || 0,
        platformFee: t.platformFee || 0,
        ownerEarnings: t.ownerEarnings || 0,
        paymentMethod: t.paymentMethod || "UPI",
        gateway: t.gateway || "Razorpay",
        gatewayRef: t.gatewayRef || "pay_mock",
        status: t.status as AdminPaymentStatusType,
        createdAt: t.createdAt || "2026-08-15",
        settlementDetails: t.settlementDetails || {
          settlementId: "SET-1001",
          settlementStatus: "Settled",
          bankName: "HDFC Bank",
          accountNo: "•••• •••• 8842",
          ifscCode: "HDFC0001234",
        },
        refundDetails: t.refundDetails,
        timeline: t.timeline || [],
        documents: [],
        internalNotes: [],
      }));
    } catch {
      return [];
    }
  }

  static async settleTransaction(id: string) {
    return apiClient.put(`/api/admin/finance/transactions/${id}/settle`);
  }

  static async refundTransaction(id: string, amount?: number, reason?: string) {
    return apiClient.post(`/api/admin/finance/transactions/${id}/refund`, { amount, reason });
  }

  static async retryPayment(id: string) {
    return apiClient.put(`/api/admin/finance/transactions/${id}/settle`);
  }
}
