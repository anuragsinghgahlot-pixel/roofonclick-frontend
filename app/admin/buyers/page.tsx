"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Users,
  UserCheck,
  ShieldCheck,
  Ban,
  CalendarCheck,
  IndianRupee,
  UserPlus,
  RefreshCw,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Trash2,
  Bell,
  SlidersHorizontal,
  RotateCcw,
  Star,
  UserX,
  Heart,
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
  AdminBuyerService,
  AdminBuyer,
  AdminBuyerQuickStats,
} from "@/services/admin-buyers";
import { BuyerProfileDrawer } from "@/components/admin/buyer-profile-drawer";

export default function AdminBuyersPage() {
  /* ─── State ─── */
  const [buyers, setBuyers] = React.useState<AdminBuyer[]>(() =>
    AdminBuyerService.getAllBuyers()
  );
  const [selectedBuyer, setSelectedBuyer] = React.useState<AdminBuyer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  /* Advanced Filter state */
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
  const [verificationFilter, setVerificationFilter] = React.useState<string>("");
  const [statusFilter, setStatusFilter] = React.useState<string>("");

  /* Stats calculation */
  const stats: AdminBuyerQuickStats = React.useMemo(
    () => AdminBuyerService.getQuickStats(buyers),
    [buyers]
  );

  /* ─── Handlers ─── */
  const handleViewBuyer = (buyer: AdminBuyer) => {
    setSelectedBuyer(buyer);
    setIsDrawerOpen(true);
  };

  const handleVerify = (buyer: AdminBuyer) => {
    setBuyers((prev) =>
      prev.map((b) => (b.id === buyer.id ? { ...b, verificationStatus: "verified", accountStatus: "active" } : b))
    );
    toast.success(`Buyer ${buyer.name} verified.`);
  };

  const handleBlock = (buyer: AdminBuyer) => {
    setBuyers((prev) =>
      prev.map((b) => (b.id === buyer.id ? { ...b, accountStatus: "blocked" } : b))
    );
    toast.error(`Buyer ${buyer.name} account blocked.`);
  };

  const handleUnblock = (buyer: AdminBuyer) => {
    setBuyers((prev) =>
      prev.map((b) => (b.id === buyer.id ? { ...b, accountStatus: "active" } : b))
    );
    toast.success(`Buyer ${buyer.name} account unblocked.`);
  };

  const handleDelete = (buyer: AdminBuyer) => {
    setBuyers((prev) => prev.filter((b) => b.id !== buyer.id));
    toast.success(`Buyer ${buyer.name} deleted.`);
  };

  const handleSendNotification = (buyer: AdminBuyer) => {
    toast.info(`Notification sent to ${buyer.name} (${buyer.email})`);
  };

  /* ─── Bulk Handlers ─── */
  const handleBulkVerify = (selected: AdminBuyer[]) => {
    const ids = new Set(selected.map((s) => s.id));
    setBuyers((prev) =>
      prev.map((b) => (ids.has(b.id) ? { ...b, verificationStatus: "verified", accountStatus: "active" } : b))
    );
    toast.success(`Verified ${selected.length} buyers.`);
  };

  const handleBulkBlock = (selected: AdminBuyer[]) => {
    const ids = new Set(selected.map((s) => s.id));
    setBuyers((prev) =>
      prev.map((b) => (ids.has(b.id) ? { ...b, accountStatus: "blocked" } : b))
    );
    toast.error(`Blocked ${selected.length} buyers.`);
  };

  const handleBulkDelete = (selected: AdminBuyer[]) => {
    const ids = new Set(selected.map((s) => s.id));
    setBuyers((prev) => prev.filter((b) => !ids.has(b.id)));
    toast.success(`Deleted ${selected.length} buyer accounts.`);
  };

  const handleBulkNotify = (selected: AdminBuyer[]) => {
    toast.info(`Broadcast notification sent to ${selected.length} buyers.`);
  };

  /* ─── Advanced Filtering ─── */
  const filteredBuyers = React.useMemo(() => {
    return buyers.filter((b) => {
      if (verificationFilter && b.verificationStatus !== verificationFilter) return false;
      if (statusFilter && b.accountStatus !== statusFilter) return false;
      return true;
    });
  }, [buyers, verificationFilter, statusFilter]);

  /* ─── Table Columns ─── */
  const columns: ColumnDef<AdminBuyer>[] = [
    {
      id: "avatar",
      header: "Avatar",
      minWidth: "60px",
      accessor: (row) => row.avatar,
      cell: (val, row) => (
        <div className="w-10 h-10 rounded-full overflow-hidden border border-border/60 shrink-0 bg-muted">
          {/* eslint-disable-next-html-link, @next/next/no-img-element */}
          <img
            src={String(val)}
            alt={row.name}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      id: "name",
      header: "Buyer Name",
      sortable: true,
      minWidth: "200px",
      accessor: (row) => row.name,
      cell: (val, row) => (
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={() => handleViewBuyer(row)}
            className="font-heading text-xs font-bold text-foreground hover:text-primary transition-colors text-left line-clamp-1 cursor-pointer"
          >
            {String(val)}
          </button>
          <span className="font-body text-[10px] text-muted-foreground block truncate">
            {row.institutionOrCompany} • {row.city}
          </span>
        </div>
      ),
    },
    {
      id: "email",
      header: "Email",
      sortable: true,
      minWidth: "180px",
      accessor: (row) => row.email,
    },
    {
      id: "phone",
      header: "Phone",
      sortable: true,
      minWidth: "130px",
      accessor: (row) => row.phone,
    },
    {
      id: "city",
      header: "City",
      sortable: true,
      minWidth: "100px",
      accessor: (row) => row.city,
    },
    {
      id: "bookings",
      header: "Bookings",
      sortable: true,
      minWidth: "100px",
      accessor: (row) => row.bookingsCount,
      cell: (val) => (
        <span className="font-heading text-xs font-bold text-foreground">
          {Number(val)} {Number(val) === 1 ? "Booking" : "Bookings"}
        </span>
      ),
    },
    {
      id: "wishlist",
      header: "Wishlist",
      sortable: true,
      minWidth: "90px",
      accessor: (row) => row.wishlistCount,
      cell: (val) => (
        <span className="inline-flex items-center gap-1 font-heading text-xs font-bold text-rose-600">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          {Number(val)}
        </span>
      ),
    },
    {
      id: "reviews",
      header: "Reviews",
      sortable: true,
      minWidth: "90px",
      accessor: (row) => row.reviewsCount,
    },
    {
      id: "verification",
      header: "Verification",
      sortable: true,
      minWidth: "110px",
      accessor: (row) => row.verificationStatus,
      cell: (val) => (
        <span
          className={`px-2 py-0.5 rounded-lg border font-heading text-[10px] font-extrabold uppercase ${
            val === "verified"
              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
              : val === "pending"
              ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
              : "bg-muted/60 text-muted-foreground border-border/60"
          }`}
        >
          {String(val)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Account Status",
      sortable: true,
      minWidth: "120px",
      accessor: (row) => row.accountStatus,
      cell: (val) => <StatusBadge status={val as any} />,
    },
    {
      id: "joined",
      header: "Joined Date",
      sortable: true,
      minWidth: "110px",
      accessor: (row) => row.joinedDate,
    },
    {
      id: "active",
      header: "Last Active",
      sortable: true,
      minWidth: "110px",
      accessor: (row) => row.lastActive,
    },
  ];

  /* ─── Row Actions ─── */
  const rowActions: RowAction<AdminBuyer>[] = [
    {
      id: "view",
      label: "View Profile",
      icon: Eye,
      onClick: (row) => handleViewBuyer(row),
    },
    {
      id: "edit",
      label: "Edit Buyer",
      icon: Edit,
      onClick: (row) => toast.info(`Edit ${row.id}`),
    },
    {
      id: "verify",
      label: "Verify Student ID",
      icon: CheckCircle,
      variant: "success",
      visible: (row) => row.verificationStatus !== "verified",
      onClick: (row) => handleVerify(row),
    },
    {
      id: "notify",
      label: "Send Notification",
      icon: Bell,
      onClick: (row) => handleSendNotification(row),
    },
    {
      id: "block",
      label: "Block Account",
      icon: Ban,
      variant: "destructive",
      visible: (row) => row.accountStatus !== "blocked",
      onClick: (row) => handleBlock(row),
    },
    {
      id: "unblock",
      label: "Unblock Account",
      icon: CheckCircle,
      variant: "success",
      visible: (row) => row.accountStatus === "blocked",
      onClick: (row) => handleUnblock(row),
    },
    {
      id: "delete",
      label: "Delete Account",
      icon: Trash2,
      variant: "destructive",
      separator: true,
      onClick: (row) => handleDelete(row),
    },
  ];

  /* ─── Bulk Actions ─── */
  const bulkActions: BulkAction<AdminBuyer>[] = [
    {
      id: "b-verify",
      label: "Verify Selected",
      icon: CheckCircle,
      variant: "success",
      onClick: (rows) => handleBulkVerify(rows),
    },
    {
      id: "b-block",
      label: "Block Selected",
      icon: Ban,
      variant: "destructive",
      onClick: (rows) => handleBulkBlock(rows),
    },
    {
      id: "b-notify",
      label: "Send Notification",
      icon: Bell,
      onClick: (rows) => handleBulkNotify(rows),
    },
    {
      id: "b-delete",
      label: "Delete Selected",
      icon: Trash2,
      variant: "destructive",
      onClick: (rows) => handleBulkDelete(rows),
    },
  ];

  return (
    <AdminPageContainer>
      {/* ═══ Header ═══ */}
      <PageHeader
        title="Buyer Management (Student CRM)"
        subtitle="Central portal to manage registered buyers, students & booking activity"
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
            <button
              type="button"
              onClick={() => toast.info("Add Buyer modal initiated")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground font-heading text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Buyer</span>
            </button>
          </div>
        }
      />

      {/* ═══ Quick Stats (6 Cards Grid) ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <KpiCard
          label="Total Buyers"
          value={stats.totalBuyers}
          formattedValue={String(stats.totalBuyers)}
          change={15.7}
          changeType="positive"
          comparisonLabel="vs last month"
          icon={Users}
        />
        <KpiCard
          label="Active Buyers"
          value={stats.activeBuyers}
          formattedValue={String(stats.activeBuyers)}
          change={18.2}
          changeType="positive"
          comparisonLabel="engaged"
          icon={UserCheck}
        />
        <KpiCard
          label="Verified"
          value={stats.verifiedBuyers}
          formattedValue={String(stats.verifiedBuyers)}
          change={10.0}
          changeType="positive"
          comparisonLabel="student ID verified"
          icon={ShieldCheck}
        />
        <KpiCard
          label="Blocked"
          value={stats.blockedBuyers}
          formattedValue={String(stats.blockedBuyers)}
          change={0}
          changeType="neutral"
          comparisonLabel="restricted"
          icon={Ban}
        />
        <KpiCard
          label="Bookings"
          value={stats.totalBookings}
          formattedValue={String(stats.totalBookings)}
          change={24.1}
          changeType="positive"
          comparisonLabel="completed/active"
          icon={CalendarCheck}
        />
        <KpiCard
          label="Avg Lifetime Value"
          value={stats.avgLifetimeValue}
          formattedValue={`₹${stats.avgLifetimeValue.toLocaleString()}`}
          change={12.4}
          changeType="positive"
          comparisonLabel="per student"
          icon={IndianRupee}
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
              onClick={() => { setVerificationFilter(""); setStatusFilter(""); }}
              className="flex items-center gap-1 font-heading text-xs font-bold text-primary hover:text-accent cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-body text-[11px] font-semibold text-muted-foreground block mb-1">
                Verification Status
              </label>
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold text-foreground outline-none"
              >
                <option value="">All Verification Statuses</option>
                <option value="verified">Verified Only</option>
                <option value="pending">Pending</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
            <div>
              <label className="font-body text-[11px] font-semibold text-muted-foreground block mb-1">
                Account Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold text-foreground outline-none"
              >
                <option value="">All Account Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══ Main Data Table ═══ */}
      <DataTable<AdminBuyer>
        columns={columns}
        data={filteredBuyers}
        getRowId={(b) => b.id}
        searchable={true}
        searchPlaceholder="Search buyer name, email, phone, institution, city..."
        selectable={true}
        rowActions={rowActions}
        bulkActions={bulkActions}
        exportConfig={{
          formats: ["csv", "excel", "pdf"],
          onExport: (format) => toast.success(`Exporting buyers as ${format.toUpperCase()}...`),
        }}
        statusFilter={[
          { label: "Active", value: "active" },
          { label: "Pending", value: "pending" },
          { label: "Blocked", value: "blocked" },
        ]}
        dateFilter={true}
        emptyMessage="No buyers match your current criteria."
      />

      {/* ═══ Buyer Profile Drawer ═══ */}
      <BuyerProfileDrawer
        buyer={selectedBuyer}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </AdminPageContainer>
  );
}
