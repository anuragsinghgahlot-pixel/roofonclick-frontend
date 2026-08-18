"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  CreditCard,
  IndianRupee,
  TrendingUp,
  Landmark,
  CheckCircle,
  RotateCcw,
  AlertCircle,
  Clock,
  Eye,
  Download,
  FileText,
  RefreshCw,
  SlidersHorizontal,
  RotateCcw as ResetIcon,
  ShieldCheck,
} from "lucide-react";
import {
  AdminPageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  KpiCard,
  AreaChart,
  BarChart,
} from "@/components/admin";
import type { ColumnDef, RowAction, BulkAction } from "@/components/admin/data-table";
import {
  AdminPaymentService,
  AdminPayment,
  AdminFinanceQuickStats,
} from "@/services/admin-payments";
import { PaymentDetailDrawer } from "@/components/admin/payment-detail-drawer";

export default function AdminPaymentsPage() {
  /* ─── State ─── */
  const [payments, setPayments] = React.useState<AdminPayment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedPayment, setSelectedPayment] = React.useState<AdminPayment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [financeStats, setFinanceStats] = React.useState<AdminFinanceQuickStats | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    Promise.all([
      AdminPaymentService.fetchAdminPayments(),
      AdminPaymentService.fetchFinanceStats(),
    ]).then(([txns, statsRes]) => {
      if (isMounted) {
        setPayments(txns);
        if (statsRes?.kpis) {
          setFinanceStats(statsRes.kpis);
        }
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  /* Advanced Filter state */
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<string>("");
  const [methodFilter, setMethodFilter] = React.useState<string>("");

  /* Stats calculation */
  const stats: AdminFinanceQuickStats = React.useMemo(
    () => financeStats || AdminPaymentService.getQuickStats(payments),
    [financeStats, payments]
  );

  /* Charts data */
  const charts = React.useMemo(() => {
    const grossVolume = stats.monthlyRevenue;
    const chartMonths = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    const revenueTrendData = chartMonths.map((m, idx) => ({
      label: m,
      value: Math.round(grossVolume * (0.6 + idx * 0.08)),
    }));
    const commissionTrendData = revenueTrendData.map((d) => ({
      label: d.label,
      value: Math.round(d.value * 0.05),
    }));

    return {
      monthlyRevenue: {
        id: "revenue",
        title: "Gross Transaction Volume (GTV)",
        subtitle: "Total booking payments processed across all properties",
        color: "hsl(217, 91%, 60%)",
        data: revenueTrendData,
      },
      platformCommission: {
        id: "commission",
        title: "Platform Revenue (5% Commission)",
        subtitle: "Commission collected from settlements",
        color: "hsl(142, 71%, 45%)",
        data: commissionTrendData,
      },
      refunds: {
        id: "refunds",
        title: "Refunds Processed",
        subtitle: "Total refund volume issued to buyers",
        color: "hsl(0, 84%, 60%)",
        data: [{ label: "Aug", value: 0 }],
      },
      revenueTrend: { id: "revenueTrend", title: "Revenue Trend", subtitle: "Monthly revenue trend", color: "hsl(217, 91%, 60%)", data: revenueTrendData },
      commissionTrend: { id: "commissionTrend", title: "Commission Trend", subtitle: "Monthly commission trend", color: "hsl(142, 71%, 45%)", data: commissionTrendData },
      payoutsTrend: { id: "payoutsTrend", title: "Payouts Trend", subtitle: "Monthly payouts trend", color: "hsl(270, 70%, 60%)", data: revenueTrendData },
      refundTrend: { id: "refundTrend", title: "Refund Trend", subtitle: "Monthly refund trend", color: "hsl(0, 84%, 60%)", data: [{ label: "Aug", value: 0 }] },
    };
  }, [stats]);

  /* ─── Handlers ─── */
  const handleViewPayment = (payment: AdminPayment) => {
    setSelectedPayment(payment);
    setIsDrawerOpen(true);
  };

  const handleSettle = async (payment: AdminPayment) => {
    try {
      const targetId = payment.mongoBookingId || payment.bookingId || payment.id;
      await AdminPaymentService.settleTransaction(targetId);
      const updated: AdminPayment = { ...payment, status: "Settled" };
      setPayments((prev) => prev.map((p) => (p.id === payment.id ? updated : p)));
      setSelectedPayment((prev) => (prev?.id === payment.id ? updated : prev));
      toast.success(`Transaction ${payment.id} settled to owner bank account.`);
    } catch {
      toast.error("Failed to settle transaction.");
    }
  };

  const handleRefund = async (payment: AdminPayment) => {
    try {
      const targetId = payment.mongoBookingId || payment.bookingId || payment.id;
      await AdminPaymentService.refundTransaction(targetId, payment.amount, "Admin finance refund");
      const updated: AdminPayment = {
        ...payment,
        status: "Refunded",
        refundDetails: {
          refundId: `RFND-${Math.floor(100 + Math.random() * 900)}`,
          refundAmount: payment.amount,
          reason: "Refund requested by finance admin",
          requestedAt: new Date().toISOString(),
          status: "Processed",
        },
      };
      setPayments((prev) => prev.map((p) => (p.id === payment.id ? updated : p)));
      setSelectedPayment((prev) => (prev?.id === payment.id ? updated : prev));
      toast.success(`Full refund of ₹${payment.amount.toLocaleString()} issued for ${payment.id}.`);
    } catch {
      toast.error("Failed to issue refund.");
    }
  };

  const handleRetry = async (payment: AdminPayment) => {
    try {
      const targetId = payment.mongoBookingId || payment.bookingId || payment.id;
      await AdminPaymentService.retryPayment(targetId);
      const updated: AdminPayment = { ...payment, status: "Paid" };
      setPayments((prev) => prev.map((p) => (p.id === payment.id ? updated : p)));
      setSelectedPayment((prev) => (prev?.id === payment.id ? updated : prev));
      toast.info(`Payment retry processed for ${payment.id}`);
    } catch {
      toast.error("Failed to retry payment.");
    }
  };

  /* ─── Bulk Handlers ─── */
  const handleBulkSettle = async (selected: AdminPayment[]) => {
    try {
      await Promise.all(
        selected.map((s) => AdminPaymentService.settleTransaction(s.mongoBookingId || s.bookingId || s.id))
      );
      const ids = new Set(selected.map((s) => s.id));
      setPayments((prev) =>
        prev.map((p) => (ids.has(p.id) ? { ...p, status: "Settled" } : p))
      );
      toast.success(`Settled ${selected.length} transactions to owner bank accounts.`);
    } catch {
      toast.error("Bulk settlement failed.");
    }
  };

  const handleBulkRefund = async (selected: AdminPayment[]) => {
    try {
      await Promise.all(
        selected.map((s) => AdminPaymentService.refundTransaction(s.mongoBookingId || s.bookingId || s.id, s.amount))
      );
      const ids = new Set(selected.map((s) => s.id));
      setPayments((prev) =>
        prev.map((p) => (ids.has(p.id) ? { ...p, status: "Refunded" } : p))
      );
      toast.error(`Refunded ${selected.length} transactions.`);
    } catch {
      toast.error("Bulk refund failed.");
    }
  };

  const handleBulkRetry = async (selected: AdminPayment[]) => {
    try {
      await Promise.all(
        selected.map((s) => AdminPaymentService.retryPayment(s.mongoBookingId || s.bookingId || s.id))
      );
      const ids = new Set(selected.map((s) => s.id));
      setPayments((prev) =>
        prev.map((p) => (ids.has(p.id) ? { ...p, status: "Paid" } : p))
      );
      toast.info(`Retried ${selected.length} transactions.`);
    } catch {
      toast.error("Bulk retry failed.");
    }
  };

  /* ─── Advanced Filtering ─── */
  const filteredPayments = React.useMemo(() => {
    return payments.filter((p) => {
      if (statusFilter && p.status !== statusFilter) return false;
      if (methodFilter && p.paymentMethod !== methodFilter) return false;
      return true;
    });
  }, [payments, statusFilter, methodFilter]);

  /* ─── Table Columns ─── */
  const columns: ColumnDef<AdminPayment>[] = [
    {
      id: "id",
      header: "Payment ID",
      sortable: true,
      minWidth: "120px",
      accessor: (row) => row.id,
      cell: (val, row) => (
        <button
          type="button"
          onClick={() => handleViewPayment(row)}
          className="font-heading text-xs font-bold text-primary hover:text-accent transition-colors cursor-pointer"
        >
          {String(val)}
        </button>
      ),
    },
    {
      id: "bookingId",
      header: "Booking ID",
      sortable: true,
      minWidth: "120px",
      accessor: (row) => row.bookingId,
      cell: (val) => (
        <span className="font-heading text-xs font-bold text-foreground">{String(val)}</span>
      ),
    },
    {
      id: "buyer",
      header: "Buyer / Student",
      sortable: true,
      minWidth: "160px",
      accessor: (row) => row.buyerName,
      cell: (val, row) => (
        <div className="space-y-0.5">
          <span className="font-heading text-xs font-bold text-foreground block truncate">{String(val)}</span>
          <span className="font-body text-[10px] text-muted-foreground block truncate">{row.buyerPhone}</span>
        </div>
      ),
    },
    {
      id: "owner",
      header: "Owner",
      sortable: true,
      minWidth: "150px",
      accessor: (row) => row.ownerName,
      cell: (val, row) => (
        <div className="space-y-0.5">
          <span className="font-heading text-xs font-semibold text-foreground block truncate">{String(val)}</span>
          <span className="font-body text-[10px] text-muted-foreground block truncate">{row.bankAccount}</span>
        </div>
      ),
    },
    {
      id: "property",
      header: "Property",
      sortable: true,
      minWidth: "180px",
      accessor: (row) => row.propertyTitle,
      cell: (val, row) => (
        <span className="font-heading text-xs font-bold text-foreground block line-clamp-1">{String(val)}</span>
      ),
    },
    {
      id: "amount",
      header: "Amount (Gross)",
      sortable: true,
      minWidth: "120px",
      accessor: (row) => row.amount,
      cell: (val) => (
        <span className="font-heading text-xs font-extrabold text-primary">
          ₹{Number(val).toLocaleString()}
        </span>
      ),
    },
    {
      id: "fee",
      header: "Platform Fee",
      sortable: true,
      minWidth: "110px",
      accessor: (row) => row.platformFee,
      cell: (val) => (
        <span className="font-heading text-xs font-bold text-foreground">
          ₹{Number(val).toLocaleString()}
        </span>
      ),
    },
    {
      id: "earnings",
      header: "Owner Payout",
      sortable: true,
      minWidth: "120px",
      accessor: (row) => row.ownerEarnings,
      cell: (val) => (
        <span className="font-heading text-xs font-extrabold text-emerald-600">
          ₹{Number(val).toLocaleString()}
        </span>
      ),
    },
    {
      id: "method",
      header: "Method",
      sortable: true,
      minWidth: "110px",
      accessor: (row) => row.paymentMethod,
      cell: (val) => (
        <span className="px-2 py-0.5 rounded-lg border border-border/60 bg-muted/30 font-heading text-[10px] font-bold text-foreground whitespace-nowrap">
          {String(val)}
        </span>
      ),
    },
    {
      id: "gateway",
      header: "Gateway",
      sortable: true,
      minWidth: "100px",
      accessor: (row) => row.gateway,
    },
    {
      id: "status",
      header: "Payment Status",
      sortable: true,
      minWidth: "140px",
      accessor: (row) => row.status,
      cell: (val) => (
        <span
          className={`px-2.5 py-0.5 rounded-lg border font-heading text-[10px] font-extrabold uppercase whitespace-nowrap ${
            val === "Settled" || val === "Paid"
              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
              : val === "Pending" || val === "Settlement Pending"
              ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
              : "bg-destructive/10 text-destructive border-destructive/20"
          }`}
        >
          {String(val)}
        </span>
      ),
    },
    {
      id: "created",
      header: "Created Date",
      sortable: true,
      minWidth: "110px",
      accessor: (row) => row.createdAt.substring(0, 10),
    },
  ];

  /* ─── Row Actions ─── */
  const rowActions: RowAction<AdminPayment>[] = [
    {
      id: "view",
      label: "View Payment",
      icon: Eye,
      onClick: (row) => handleViewPayment(row),
    },
    {
      id: "downloadInvoice",
      label: "Download Invoice",
      icon: Download,
      onClick: (row) => toast.success(`Downloading Invoice for ${row.id}`),
    },
    {
      id: "downloadReceipt",
      label: "Download Receipt",
      icon: FileText,
      onClick: (row) => toast.success(`Downloading Receipt for ${row.id}`),
    },
    {
      id: "retry",
      label: "Retry Transaction",
      icon: RefreshCw,
      visible: (row) => row.status === "Failed",
      onClick: (row) => handleRetry(row),
    },
    {
      id: "refund",
      label: "Process Refund",
      icon: RotateCcw,
      variant: "destructive",
      separator: true,
      visible: (row) => row.status === "Paid" || row.status === "Settled",
      onClick: (row) => handleRefund(row),
    },
  ];

  /* ─── Bulk Actions ─── */
  const bulkActions: BulkAction<AdminPayment>[] = [
    {
      id: "b-settle",
      label: "Settle Selected to Owners",
      icon: Landmark,
      variant: "success",
      onClick: (rows) => handleBulkSettle(rows),
    },
    {
      id: "b-refund",
      label: "Refund Selected",
      icon: RotateCcw,
      variant: "destructive",
      onClick: (rows) => handleBulkRefund(rows),
    },
    {
      id: "b-retry",
      label: "Retry Failed",
      icon: RefreshCw,
      onClick: (rows) => handleBulkRetry(rows),
    },
  ];

  return (
    <AdminPageContainer>
      {/* ═══ Header ═══ */}
      <PageHeader
        title="Payment & Finance Center"
        subtitle="Central portal to manage transactions, settlements, platform commission & refunds"
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/60 bg-card text-muted-foreground hover:text-foreground text-xs font-heading font-bold transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Advanced Filters</span>
            </button>
          </div>
        }
      />

      {/* ═══ Finance Dashboard (8 Cards Grid) ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <KpiCard
          label="Today's Revenue"
          value={stats.todaysRevenue}
          formattedValue={`₹${(stats.todaysRevenue / 1000).toFixed(0)}k`}
          change={14.2}
          changeType="positive"
          comparisonLabel="gross processed"
          icon={IndianRupee}
        />
        <KpiCard
          label="Monthly Revenue"
          value={stats.monthlyRevenue}
          formattedValue={`₹${(stats.monthlyRevenue / 100000).toFixed(1)}L`}
          change={18.7}
          changeType="positive"
          comparisonLabel="vs last month"
          icon={TrendingUp}
        />
        <KpiCard
          label="Commission"
          value={stats.platformCommission}
          formattedValue={`₹${(stats.platformCommission / 1000).toFixed(0)}k`}
          change={18.7}
          changeType="positive"
          comparisonLabel="5% platform fee"
          icon={CreditCard}
        />
        <KpiCard
          label="Pending Settl."
          value={stats.pendingSettlements}
          formattedValue={String(stats.pendingSettlements)}
          change={-2.0}
          changeType="negative"
          comparisonLabel="queued payouts"
          icon={Clock}
        />
        <KpiCard
          label="Completed Settl."
          value={stats.completedSettlements}
          formattedValue={String(stats.completedSettlements)}
          change={15.0}
          changeType="positive"
          comparisonLabel="bank transfers"
          icon={Landmark}
        />
        <KpiCard
          label="Refund Claims"
          value={stats.refundRequests}
          formattedValue={String(stats.refundRequests)}
          change={0}
          changeType="neutral"
          comparisonLabel="active claims"
          icon={RotateCcw}
        />
        <KpiCard
          label="Failed Payments"
          value={stats.failedPayments}
          formattedValue={String(stats.failedPayments)}
          change={0}
          changeType="neutral"
          comparisonLabel="gateway errors"
          icon={AlertCircle}
        />
        <KpiCard
          label="Outstanding"
          value={stats.outstandingPayments}
          formattedValue={String(stats.outstandingPayments)}
          change={0}
          changeType="neutral"
          comparisonLabel="unpaid invoices"
          icon={Clock}
        />
      </div>

      {/* ═══ Revenue Analytics (4 Charts Grid) ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <AreaChart chartData={charts.revenueTrend} />
        <BarChart chartData={charts.commissionTrend} />
        <AreaChart chartData={charts.payoutsTrend} />
        <BarChart chartData={charts.refundTrend} />
      </div>

      {/* ═══ Advanced Filters ═══ */}
      {showAdvancedFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 rounded-2xl bg-card border border-border/60 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Advanced Filters
            </h3>
            <button
              type="button"
              onClick={() => { setStatusFilter(""); setMethodFilter(""); }}
              className="flex items-center gap-1 font-heading text-xs font-bold text-primary hover:text-accent cursor-pointer"
            >
              <ResetIcon className="w-3 h-3" /> Reset Filters
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-body text-[11px] font-semibold text-muted-foreground block mb-1">
                Payment Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold text-foreground outline-none"
              >
                <option value="">All Payment Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Settled">Settled</option>
                <option value="Settlement Pending">Settlement Pending</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label className="font-body text-[11px] font-semibold text-muted-foreground block mb-1">
                Payment Method
              </label>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold text-foreground outline-none"
              >
                <option value="">All Payment Methods</option>
                <option value="UPI">UPI</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══ Main Data Table ═══ */}
      <DataTable<AdminPayment>
        columns={columns}
        data={filteredPayments}
        getRowId={(p) => p.id}
        searchable={true}
        searchPlaceholder="Search payment ID, booking ID, buyer, owner, property, gateway ref..."
        selectable={true}
        rowActions={rowActions}
        bulkActions={bulkActions}
        exportConfig={{
          formats: ["csv", "excel", "pdf"],
          onExport: (format) => toast.success(`Exporting finance transactions as ${format.toUpperCase()}...`),
        }}
        dateFilter={true}
        emptyMessage="No finance transactions match your current criteria."
      />

      {/* ═══ Payment Detail Drawer ═══ */}
      <PaymentDetailDrawer
        payment={selectedPayment}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSettle={handleSettle}
        onRefund={handleRefund}
      />
    </AdminPageContainer>
  );
}
