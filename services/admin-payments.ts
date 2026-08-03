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

/* ─── Mock Data ─── */
const MOCK_ADMIN_PAYMENTS: AdminPayment[] = [
  {
    id: "PAY-9001",
    bookingId: "ROC-1087",
    buyerName: "Anurag Singh Gahlot",
    buyerEmail: "anurag.singh@email.com",
    buyerPhone: "+91 98765 43210",
    ownerName: "Rajesh Kumar",
    ownerPhone: "+91 98260 12345",
    bankAccount: "HDFC Bank (A/C 9876)",
    propertyTitle: "Elite Residency PG & Hostel",
    city: "Indore",
    amount: 24000,
    platformFee: 1200,
    ownerEarnings: 22800,
    paymentMethod: "UPI",
    gateway: "Razorpay",
    gatewayRef: "pay_Rzp982109823",
    status: "Settled",
    createdAt: "2026-08-02T19:15:00Z",
    settlementDetails: {
      settlementId: "SET-4401",
      settlementStatus: "Settled",
      settlementDate: "2026-08-03 04:00",
      bankName: "HDFC Bank",
      accountNo: "XXXX-XXXX-9876",
      ifscCode: "HDFC0001234",
    },
    timeline: [
      { event: "Payment Initiated", description: "UPI checkout initiated via Razorpay", date: "2026-08-02 19:14" },
      { event: "Payment Captured", description: "₹24,000 captured successfully", date: "2026-08-02 19:15" },
      { event: "Commission Calculated", description: "5% platform commission (₹1,200) reserved", date: "2026-08-02 19:15" },
      { event: "Settled to Owner", description: "₹22,800 transferred to HDFC Bank A/C", date: "2026-08-03 04:00" },
    ],
    documents: [
      { id: "DOC-P1", title: "Tax Invoice #INV-081", type: "Invoice", url: "#" },
      { id: "DOC-P2", title: "Payment Receipt #REC-991", type: "Receipt", url: "#" },
    ],
    internalNotes: [
      { id: "N-101", author: "Finance Admin", note: "Automated T+1 settlement processed via Razorpay Route.", date: "2026-08-03 04:05" },
    ],
  },
  {
    id: "PAY-9002",
    bookingId: "ROC-1088",
    buyerName: "Sneha Mukherjee",
    buyerEmail: "sneha.m@email.com",
    buyerPhone: "+91 94251 12233",
    ownerName: "Sunita Verma",
    ownerPhone: "+91 94250 98765",
    bankAccount: "ICICI Bank (A/C 5432)",
    propertyTitle: "Shree Comfort Stay Girls PG",
    city: "Indore",
    amount: 18000,
    platformFee: 900,
    ownerEarnings: 17100,
    paymentMethod: "Credit Card",
    gateway: "Razorpay",
    gatewayRef: "pay_Rzp776101112",
    status: "Settlement Pending",
    createdAt: "2026-08-01T12:15:00Z",
    settlementDetails: {
      settlementId: "SET-4402",
      settlementStatus: "Pending",
      bankName: "ICICI Bank",
      accountNo: "XXXX-XXXX-5432",
      ifscCode: "ICIC0005432",
    },
    timeline: [
      { event: "Payment Captured", description: "Credit Card payment captured", date: "2026-08-01 12:15" },
      { event: "Queued for Settlement", description: "Scheduled for next payout cycle", date: "2026-08-01 12:16" },
    ],
    documents: [
      { id: "DOC-P3", title: "Tax Invoice #INV-090", type: "Invoice", url: "#" },
    ],
    internalNotes: [],
  },
  {
    id: "PAY-9003",
    bookingId: "ROC-1089",
    buyerName: "Rahul Verma",
    buyerEmail: "rahul.verma@email.com",
    buyerPhone: "+91 91112 33445",
    ownerName: "Amitabh Jain",
    ownerPhone: "+91 97520 54321",
    bankAccount: "SBI Bank (A/C 1122)",
    propertyTitle: "Sunshine Co-Living",
    city: "Indore",
    amount: 26500,
    platformFee: 1325,
    ownerEarnings: 25175,
    paymentMethod: "Net Banking",
    gateway: "Razorpay",
    gatewayRef: "pay_Rzp001199221",
    status: "Pending",
    createdAt: "2026-08-03T09:05:00Z",
    settlementDetails: {
      settlementId: "SET-4403",
      settlementStatus: "Pending",
      bankName: "SBI Bank",
      accountNo: "XXXX-XXXX-1122",
      ifscCode: "SBIN0001122",
    },
    timeline: [
      { event: "Payment Initiated", description: "Net banking session active", date: "2026-08-03 09:05" },
    ],
    documents: [],
    internalNotes: [],
  },
  {
    id: "PAY-9004",
    bookingId: "ROC-1090",
    buyerName: "Kunal Sharma",
    buyerEmail: "kunal.s@email.com",
    buyerPhone: "+91 93001 99887",
    ownerName: "Deepak Sharma",
    ownerPhone: "+91 98270 44556",
    bankAccount: "Axis Bank (A/C 3344)",
    propertyTitle: "Royal Residency",
    city: "Indore",
    amount: 14500,
    platformFee: 725,
    ownerEarnings: 13775,
    paymentMethod: "UPI",
    gateway: "Razorpay",
    gatewayRef: "pay_Rzp554433221",
    status: "Refunded",
    createdAt: "2026-07-18T10:15:00Z",
    settlementDetails: {
      settlementId: "SET-4404",
      settlementStatus: "Failed",
      bankName: "Axis Bank",
      accountNo: "XXXX-XXXX-3344",
      ifscCode: "UTIB0003344",
    },
    refundDetails: {
      refundId: "RFND-771",
      refundAmount: 14500,
      reason: "Property suspended due to food quality complaint audit",
      requestedAt: "2026-07-25 12:00",
      processedAt: "2026-07-26 15:00",
      status: "Processed",
    },
    timeline: [
      { event: "Payment Captured", description: "Captured via UPI", date: "2026-07-18 10:15" },
      { event: "Refund Initiated", description: "Full refund requested by ops", date: "2026-07-25 12:00" },
      { event: "Refund Processed", description: "₹14,500 refunded to original source", date: "2026-07-26 15:00" },
    ],
    documents: [
      { id: "DOC-P4", title: "Refund Voucher #RF-104", type: "Receipt", url: "#" },
    ],
    internalNotes: [
      { id: "N-102", author: "Finance Admin", note: "Full refund issued. Owner settlement cancelled.", date: "2026-07-26 15:05" },
    ],
  },
  {
    id: "PAY-9005",
    bookingId: "ROC-1070",
    buyerName: "Pooja Patel",
    buyerEmail: "pooja.p@email.com",
    buyerPhone: "+91 99887 66554",
    ownerName: "Vikram Rathore",
    ownerPhone: "+91 98930 76543",
    bankAccount: "Kotak Bank (A/C 7788)",
    propertyTitle: "Green Meadows Student Hostel",
    city: "Indore",
    amount: 14500,
    platformFee: 725,
    ownerEarnings: 13775,
    paymentMethod: "UPI",
    gateway: "Razorpay",
    gatewayRef: "pay_Rzp11009988",
    status: "Failed",
    createdAt: "2026-08-02T18:30:00Z",
    settlementDetails: {
      settlementId: "NONE",
      settlementStatus: "Failed",
      bankName: "Kotak Bank",
      accountNo: "XXXX-XXXX-7788",
      ifscCode: "KKBK0007788",
    },
    timeline: [
      { event: "Payment Failed", description: "Bank server timeout (503 response)", date: "2026-08-02 18:30" },
    ],
    documents: [],
    internalNotes: [],
  },
];

/* ─── Mock Revenue Charts ─── */
const MOCK_FINANCE_CHARTS = {
  revenueTrend: {
    id: "rev-trend",
    title: "Gross Revenue Trend",
    subtitle: "Monthly gross transaction volume (₹)",
    total: "₹12.4L",
    color: "hsl(155, 43%, 21%)",
    data: [
      { label: "Jan", value: 680000 },
      { label: "Feb", value: 720000 },
      { label: "Mar", value: 810000 },
      { label: "Apr", value: 750000 },
      { label: "May", value: 920000 },
      { label: "Jun", value: 880000 },
      { label: "Jul", value: 1050000 },
      { label: "Aug", value: 1240000 },
    ],
  },
  commissionTrend: {
    id: "comm-trend",
    title: "Platform Commission",
    subtitle: "5% platform fee collected (₹)",
    total: "₹62,000",
    color: "hsl(46, 68%, 47%)",
    data: [
      { label: "Jan", value: 34000 },
      { label: "Feb", value: 36000 },
      { label: "Mar", value: 40500 },
      { label: "Apr", value: 37500 },
      { label: "May", value: 46000 },
      { label: "Jun", value: 44000 },
      { label: "Jul", value: 52500 },
      { label: "Aug", value: 62000 },
    ],
  },
  payoutsTrend: {
    id: "payout-trend",
    title: "Owner Payouts",
    subtitle: "Net settlements transferred to owners (₹)",
    total: "₹11.78L",
    color: "hsl(144, 33%, 37%)",
    data: [
      { label: "Jan", value: 646000 },
      { label: "Feb", value: 684000 },
      { label: "Mar", value: 769500 },
      { label: "Apr", value: 712500 },
      { label: "May", value: 874000 },
      { label: "Jun", value: 836000 },
      { label: "Jul", value: 997500 },
      { label: "Aug", value: 1178000 },
    ],
  },
  refundTrend: {
    id: "refund-trend",
    title: "Refund Volume",
    subtitle: "Monthly customer refund claims (₹)",
    total: "₹14,500",
    color: "hsl(0, 64%, 50%)",
    data: [
      { label: "Jan", value: 0 },
      { label: "Feb", value: 5000 },
      { label: "Mar", value: 0 },
      { label: "Apr", value: 7500 },
      { label: "May", value: 0 },
      { label: "Jun", value: 0 },
      { label: "Jul", value: 14500 },
      { label: "Aug", value: 0 },
    ],
  },
};

/* ─── Admin Payment Service ─── */
export class AdminPaymentService {
  static getQuickStats(payments: AdminPayment[] = MOCK_ADMIN_PAYMENTS): AdminFinanceQuickStats {
    const todaysRevenue = payments
      .filter((p) => p.status === "Paid" || p.status === "Settled")
      .reduce((acc, p) => acc + p.amount, 0);

    const monthlyRevenue = 1240000;
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
