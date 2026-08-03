"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  IndianRupee,
  RefreshCw,
  Eye,
  Phone,
  Mail,
  SlidersHorizontal,
  RotateCcw,
  UserCheck,
  TrendingUp,
  RotateCcw as RefundIcon,
} from "lucide-react";
import {
  AdminPageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  KpiCard,
} from "@/components/admin";
import type { ColumnDef, RowAction, BulkAction } from "@/components/admin/data-table";
import {
  AdminBookingService,
  AdminBooking,
  AdminBookingQuickStats,
  AdminBookingStatus,
} from "@/services/admin-bookings";
import { BookingDetailDrawer } from "@/components/admin/booking-detail-drawer";

export default function AdminBookingsPage() {
  /* ─── State ─── */
  const [bookings, setBookings] = React.useState<AdminBooking[]>(() =>
    AdminBookingService.getAllBookings()
  );
  const [selectedBooking, setSelectedBooking] = React.useState<AdminBooking | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  /* Advanced Filter state */
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
  const [bookingStatusFilter, setBookingStatusFilter] = React.useState<string>("");
  const [paymentStatusFilter, setPaymentStatusFilter] = React.useState<string>("");

  /* Stats calculation */
  const stats: AdminBookingQuickStats = React.useMemo(
    () => AdminBookingService.getQuickStats(bookings),
    [bookings]
  );

  /* ─── Handlers ─── */
  const handleViewBooking = (booking: AdminBooking) => {
    setSelectedBooking(booking);
    setIsDrawerOpen(true);
  };

  const handleApprove = (booking: AdminBooking) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, bookingStatus: "Confirmed" } : b))
    );
    toast.success(`Booking ${booking.id} confirmed.`);
  };

  const handleReject = (booking: AdminBooking) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, bookingStatus: "Cancelled" } : b))
    );
    toast.error(`Booking ${booking.id} rejected.`);
  };

  const handleCancel = (booking: AdminBooking) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, bookingStatus: "Cancelled" } : b))
    );
    toast.warning(`Booking ${booking.id} cancelled.`);
  };

  const handleRefund = (booking: AdminBooking) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id
          ? {
              ...b,
              bookingStatus: "Refunded",
              paymentStatus: "Refunded",
              paymentDetails: { ...b.paymentDetails, refundStatus: "Processed", refundAmount: b.totalAmount },
            }
          : b
      )
    );
    toast.success(`Full refund of ₹${booking.totalAmount.toLocaleString()} processed for ${booking.id}.`);
  };

  const handleContactBuyer = (booking: AdminBooking) => {
    toast.info(`Contacting Student ${booking.buyerName} (${booking.buyerPhone})`);
  };

  const handleContactOwner = (booking: AdminBooking) => {
    toast.info(`Contacting Owner ${booking.ownerName} (${booking.ownerPhone})`);
  };

  /* ─── Bulk Handlers ─── */
  const handleBulkApprove = (selected: AdminBooking[]) => {
    const ids = new Set(selected.map((s) => s.id));
    setBookings((prev) =>
      prev.map((b) => (ids.has(b.id) ? { ...b, bookingStatus: "Confirmed" } : b))
    );
    toast.success(`Confirmed ${selected.length} bookings.`);
  };

  const handleBulkReject = (selected: AdminBooking[]) => {
    const ids = new Set(selected.map((s) => s.id));
    setBookings((prev) =>
      prev.map((b) => (ids.has(b.id) ? { ...b, bookingStatus: "Cancelled" } : b))
    );
    toast.error(`Rejected ${selected.length} bookings.`);
  };

  const handleBulkCancel = (selected: AdminBooking[]) => {
    const ids = new Set(selected.map((s) => s.id));
    setBookings((prev) =>
      prev.map((b) => (ids.has(b.id) ? { ...b, bookingStatus: "Cancelled" } : b))
    );
    toast.warning(`Cancelled ${selected.length} bookings.`);
  };

  const handleBulkAssignExec = (selected: AdminBooking[]) => {
    toast.info(`Assigned Operations Executive to ${selected.length} bookings.`);
  };

  /* ─── Advanced Filtering ─── */
  const filteredBookings = React.useMemo(() => {
    return bookings.filter((b) => {
      if (bookingStatusFilter && b.bookingStatus !== bookingStatusFilter) return false;
      if (paymentStatusFilter && b.paymentStatus !== paymentStatusFilter) return false;
      return true;
    });
  }, [bookings, bookingStatusFilter, paymentStatusFilter]);

  /* ─── Table Columns ─── */
  const columns: ColumnDef<AdminBooking>[] = [
    {
      id: "id",
      header: "Booking ID",
      sortable: true,
      minWidth: "120px",
      accessor: (row) => row.id,
      cell: (val, row) => (
        <button
          type="button"
          onClick={() => handleViewBooking(row)}
          className="font-heading text-xs font-bold text-primary hover:text-accent transition-colors cursor-pointer"
        >
          {String(val)}
        </button>
      ),
    },
    {
      id: "buyer",
      header: "Buyer / Student",
      sortable: true,
      minWidth: "180px",
      accessor: (row) => row.buyerName,
      cell: (val, row) => (
        <div className="space-y-0.5">
          <span className="font-heading text-xs font-bold text-foreground block truncate">{String(val)}</span>
          <span className="font-body text-[10px] text-muted-foreground block truncate">{row.buyerInstitution}</span>
        </div>
      ),
    },
    {
      id: "owner",
      header: "Owner",
      sortable: true,
      minWidth: "160px",
      accessor: (row) => row.ownerName,
      cell: (val, row) => (
        <div className="space-y-0.5">
          <span className="font-heading text-xs font-semibold text-foreground block truncate">{String(val)}</span>
          <span className="font-body text-[10px] text-muted-foreground block truncate">{row.ownerPhone}</span>
        </div>
      ),
    },
    {
      id: "property",
      header: "Property",
      sortable: true,
      minWidth: "200px",
      accessor: (row) => row.propertyTitle,
      cell: (val, row) => (
        <div className="space-y-0.5">
          <span className="font-heading text-xs font-bold text-foreground block line-clamp-1">{String(val)}</span>
          <span className="font-body text-[10px] text-muted-foreground block truncate">{row.city}</span>
        </div>
      ),
    },
    {
      id: "room",
      header: "Room Type",
      sortable: true,
      minWidth: "120px",
      accessor: (row) => row.roomType,
      cell: (val) => (
        <span className="px-2 py-0.5 rounded-lg border border-border/60 bg-muted/30 font-heading text-[10px] font-bold text-foreground whitespace-nowrap">
          {String(val)}
        </span>
      ),
    },
    {
      id: "movein",
      header: "Move-in Date",
      sortable: true,
      minWidth: "110px",
      accessor: (row) => row.moveInDate,
    },
    {
      id: "rent",
      header: "Monthly Rent",
      sortable: true,
      minWidth: "110px",
      accessor: (row) => row.monthlyRent,
      cell: (val) => (
        <span className="font-heading text-xs font-extrabold text-primary">
          ₹{Number(val).toLocaleString()}
        </span>
      ),
    },
    {
      id: "deposit",
      header: "Security Deposit",
      sortable: true,
      minWidth: "120px",
      accessor: (row) => row.securityDeposit,
      cell: (val) => (
        <span className="font-heading text-xs font-bold text-foreground">
          ₹{Number(val).toLocaleString()}
        </span>
      ),
    },
    {
      id: "paymentStatus",
      header: "Payment",
      sortable: true,
      minWidth: "110px",
      accessor: (row) => row.paymentStatus,
      cell: (val) => (
        <span
          className={`px-2 py-0.5 rounded-lg border font-heading text-[10px] font-extrabold uppercase ${
            val === "Paid"
              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
              : val === "Pending"
              ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
              : "bg-destructive/10 text-destructive border-destructive/20"
          }`}
        >
          {String(val)}
        </span>
      ),
    },
    {
      id: "bookingStatus",
      header: "Booking Status",
      sortable: true,
      minWidth: "140px",
      accessor: (row) => row.bookingStatus,
      cell: (val) => (
        <span className="px-2.5 py-0.5 rounded-lg border border-border/60 bg-muted/40 font-heading text-[10px] font-extrabold uppercase text-foreground whitespace-nowrap">
          {String(val)}
        </span>
      ),
    },
    {
      id: "created",
      header: "Created",
      sortable: true,
      minWidth: "110px",
      accessor: (row) => row.createdAt.substring(0, 10),
    },
  ];

  /* ─── Row Actions ─── */
  const rowActions: RowAction<AdminBooking>[] = [
    {
      id: "view",
      label: "View Booking",
      icon: Eye,
      onClick: (row) => handleViewBooking(row),
    },
    {
      id: "approve",
      label: "Approve Booking",
      icon: CheckCircle,
      variant: "success",
      visible: (row) => row.bookingStatus === "Requested",
      onClick: (row) => handleApprove(row),
    },
    {
      id: "reject",
      label: "Reject Booking",
      icon: XCircle,
      variant: "destructive",
      visible: (row) => row.bookingStatus === "Requested",
      onClick: (row) => handleReject(row),
    },
    {
      id: "contactBuyer",
      label: "Contact Student",
      icon: Phone,
      onClick: (row) => handleContactBuyer(row),
    },
    {
      id: "contactOwner",
      label: "Contact Owner",
      icon: Mail,
      onClick: (row) => handleContactOwner(row),
    },
    {
      id: "cancel",
      label: "Cancel Booking",
      icon: Ban,
      variant: "warning",
      visible: (row) => row.bookingStatus === "Confirmed" || row.bookingStatus === "Move-in Scheduled",
      onClick: (row) => handleCancel(row),
    },
    {
      id: "refund",
      label: "Process Refund",
      icon: RefundIcon,
      variant: "destructive",
      separator: true,
      visible: (row) => row.paymentStatus === "Paid" && row.bookingStatus !== "Refunded",
      onClick: (row) => handleRefund(row),
    },
  ];

  /* ─── Bulk Actions ─── */
  const bulkActions: BulkAction<AdminBooking>[] = [
    {
      id: "b-approve",
      label: "Approve Selected",
      icon: CheckCircle,
      variant: "success",
      onClick: (rows) => handleBulkApprove(rows),
    },
    {
      id: "b-reject",
      label: "Reject Selected",
      icon: XCircle,
      variant: "destructive",
      onClick: (rows) => handleBulkReject(rows),
    },
    {
      id: "b-cancel",
      label: "Cancel Selected",
      icon: Ban,
      variant: "warning",
      onClick: (rows) => handleBulkCancel(rows),
    },
    {
      id: "b-assign",
      label: "Assign Ops Exec",
      icon: UserCheck,
      onClick: (rows) => handleBulkAssignExec(rows),
    },
  ];

  return (
    <AdminPageContainer>
      {/* ═══ Header ═══ */}
      <PageHeader
        title="Booking Management (Operations)"
        subtitle="Operations command center to track reservations, move-ins & refunds"
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

      {/* ═══ Quick Stats (8 Cards Grid) ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <KpiCard
          label="Today's Bookings"
          value={stats.todaysBookings}
          formattedValue={String(stats.todaysBookings)}
          change={24.1}
          changeType="positive"
          comparisonLabel="vs yesterday"
          icon={CalendarCheck}
        />
        <KpiCard
          label="Move-ins"
          value={stats.upcomingMoveIns}
          formattedValue={String(stats.upcomingMoveIns)}
          change={12.0}
          changeType="positive"
          comparisonLabel="scheduled"
          icon={Clock}
        />
        <KpiCard
          label="Pending Conf."
          value={stats.pendingConfirmation}
          formattedValue={String(stats.pendingConfirmation)}
          change={-5.0}
          changeType="negative"
          comparisonLabel="action needed"
          icon={Clock}
        />
        <KpiCard
          label="Completed"
          value={stats.completed}
          formattedValue={String(stats.completed)}
          change={18.0}
          changeType="positive"
          comparisonLabel="checked-in"
          icon={CheckCircle}
        />
        <KpiCard
          label="Cancelled"
          value={stats.cancelled}
          formattedValue={String(stats.cancelled)}
          change={0}
          changeType="neutral"
          comparisonLabel="reservations"
          icon={XCircle}
        />
        <KpiCard
          label="Refund Requests"
          value={stats.refundRequests}
          formattedValue={String(stats.refundRequests)}
          change={0}
          changeType="neutral"
          comparisonLabel="claims"
          icon={RefundIcon}
        />
        <KpiCard
          label="Monthly Revenue"
          value={stats.monthlyRevenue}
          formattedValue={`₹${(stats.monthlyRevenue / 1000).toFixed(0)}k`}
          change={18.7}
          changeType="positive"
          comparisonLabel="booking volume"
          icon={IndianRupee}
        />
        <KpiCard
          label="Avg Booking Val"
          value={stats.avgBookingValue}
          formattedValue={`₹${(stats.avgBookingValue / 1000).toFixed(1)}k`}
          change={6.2}
          changeType="positive"
          comparisonLabel="per student"
          icon={TrendingUp}
        />
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
              onClick={() => { setBookingStatusFilter(""); setPaymentStatusFilter(""); }}
              className="flex items-center gap-1 font-heading text-xs font-bold text-primary hover:text-accent cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-body text-[11px] font-semibold text-muted-foreground block mb-1">
                Booking Status
              </label>
              <select
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold text-foreground outline-none"
              >
                <option value="">All Booking Statuses</option>
                <option value="Requested">Requested</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Move-in Scheduled">Move-in Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label className="font-body text-[11px] font-semibold text-muted-foreground block mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold text-foreground outline-none"
              >
                <option value="">All Payment Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══ Main Data Table ═══ */}
      <DataTable<AdminBooking>
        columns={columns}
        data={filteredBookings}
        getRowId={(b) => b.id}
        searchable={true}
        searchPlaceholder="Search booking ID, student, owner, property, city..."
        selectable={true}
        rowActions={rowActions}
        bulkActions={bulkActions}
        exportConfig={{
          formats: ["csv", "excel", "pdf"],
          onExport: (format) => toast.success(`Exporting bookings as ${format.toUpperCase()}...`),
        }}
        dateFilter={true}
        emptyMessage="No operations bookings match your current criteria."
      />

      {/* ═══ Booking Detail Drawer ═══ */}
      <BookingDetailDrawer
        booking={selectedBooking}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </AdminPageContainer>
  );
}
