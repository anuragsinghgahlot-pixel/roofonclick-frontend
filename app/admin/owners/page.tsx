"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Users,
  UserCheck,
  Clock,
  Ban,
  Building,
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
  ShieldCheck,
  UserX,
  UserCog,
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
  AdminOwnerService,
  AdminOwner,
  AdminOwnerQuickStats,
} from "@/services/admin-owners";
import { OwnerProfileDrawer } from "@/components/admin/owner-profile-drawer";

export default function AdminOwnersPage() {
  /* ─── State ─── */
  const [owners, setOwners] = React.useState<AdminOwner[]>(() =>
    AdminOwnerService.getAllOwners()
  );
  const [selectedOwner, setSelectedOwner] = React.useState<AdminOwner | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  /* Advanced Filter state */
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
  const [kycFilter, setKycFilter] = React.useState<string>("");
  const [planFilter, setPlanFilter] = React.useState<string>("");
  const [statusFilter, setStatusFilter] = React.useState<string>("");

  /* Stats calculation */
  const stats: AdminOwnerQuickStats = React.useMemo(
    () => AdminOwnerService.getQuickStats(owners),
    [owners]
  );

  /* ─── Handlers ─── */
  const handleViewOwner = (owner: AdminOwner) => {
    setSelectedOwner(owner);
    setIsDrawerOpen(true);
  };

  const handleApproveKyc = (owner: AdminOwner) => {
    setOwners((prev) =>
      prev.map((o) => (o.id === owner.id ? { ...o, kycStatus: "verified", accountStatus: "active" } : o))
    );
    toast.success(`Owner ${owner.name} KYC verified & account approved.`);
  };

  const handleSuspend = (owner: AdminOwner) => {
    setOwners((prev) =>
      prev.map((o) => (o.id === owner.id ? { ...o, accountStatus: "suspended" } : o))
    );
    toast.warning(`Owner ${owner.name} account suspended.`);
  };

  const handleDeactivate = (owner: AdminOwner) => {
    setOwners((prev) =>
      prev.map((o) => (o.id === owner.id ? { ...o, accountStatus: "inactive" } : o))
    );
    toast.info(`Owner ${owner.name} account deactivated.`);
  };

  const handleDelete = (owner: AdminOwner) => {
    setOwners((prev) => prev.filter((o) => o.id !== owner.id));
    toast.success(`Owner ${owner.name} deleted.`);
  };

  const handleSendNotification = (owner: AdminOwner) => {
    toast.info(`Sent notification prompt to ${owner.name} (${owner.email})`);
  };

  /* ─── Bulk Handlers ─── */
  const handleBulkApprove = (selected: AdminOwner[]) => {
    const ids = new Set(selected.map((s) => s.id));
    setOwners((prev) =>
      prev.map((o) => (ids.has(o.id) ? { ...o, kycStatus: "verified", accountStatus: "active" } : o))
    );
    toast.success(`Approved KYC for ${selected.length} owners.`);
  };

  const handleBulkSuspend = (selected: AdminOwner[]) => {
    const ids = new Set(selected.map((s) => s.id));
    setOwners((prev) =>
      prev.map((o) => (ids.has(o.id) ? { ...o, accountStatus: "suspended" } : o))
    );
    toast.warning(`Suspended ${selected.length} owner accounts.`);
  };

  const handleBulkDelete = (selected: AdminOwner[]) => {
    const ids = new Set(selected.map((s) => s.id));
    setOwners((prev) => prev.filter((o) => !ids.has(o.id)));
    toast.success(`Deleted ${selected.length} owner accounts.`);
  };

  const handleBulkAssignManager = (selected: AdminOwner[]) => {
    toast.info(`Assigned Account Manager for ${selected.length} owners.`);
  };

  /* ─── Advanced Filtering ─── */
  const filteredOwners = React.useMemo(() => {
    return owners.filter((o) => {
      if (kycFilter && o.kycStatus !== kycFilter) return false;
      if (planFilter && o.subscriptionPlan !== planFilter) return false;
      if (statusFilter && o.accountStatus !== statusFilter) return false;
      return true;
    });
  }, [owners, kycFilter, planFilter, statusFilter]);

  /* ─── Table Columns ─── */
  const columns: ColumnDef<AdminOwner>[] = [
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
      header: "Owner Name",
      sortable: true,
      minWidth: "200px",
      accessor: (row) => row.name,
      cell: (val, row) => (
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={() => handleViewOwner(row)}
            className="font-heading text-xs font-bold text-foreground hover:text-primary transition-colors text-left line-clamp-1 cursor-pointer"
          >
            {String(val)}
          </button>
          <span className="font-body text-[10px] text-muted-foreground block">
            ID: {row.id} • {row.city}
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
      id: "properties",
      header: "Properties",
      sortable: true,
      minWidth: "100px",
      accessor: (row) => row.propertiesCount,
      cell: (val) => (
        <span className="font-heading text-xs font-bold text-foreground">
          {Number(val)} {Number(val) === 1 ? "Property" : "Properties"}
        </span>
      ),
    },
    {
      id: "occupancy",
      header: "Occupancy",
      sortable: true,
      minWidth: "110px",
      accessor: (row) => row.occupancyRate,
      cell: (val) => (
        <div className="space-y-1 w-20">
          <span className="font-heading text-xs font-extrabold text-primary block">{Number(val)}%</span>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${val}%` }} />
          </div>
        </div>
      ),
    },
    {
      id: "rating",
      header: "Avg Rating",
      sortable: true,
      minWidth: "100px",
      accessor: (row) => row.avgRating,
      cell: (val) => (
        <span className="inline-flex items-center gap-1 font-heading text-xs font-bold text-amber-600">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          {Number(val) > 0 ? Number(val) : "New"}
        </span>
      ),
    },
    {
      id: "revenue",
      header: "Total Revenue",
      sortable: true,
      minWidth: "130px",
      accessor: (row) => row.totalRevenue,
      cell: (val) => (
        <span className="font-heading text-xs font-extrabold text-emerald-600">
          ₹{Number(val).toLocaleString()}
        </span>
      ),
    },
    {
      id: "kyc",
      header: "KYC Status",
      sortable: true,
      minWidth: "110px",
      accessor: (row) => row.kycStatus,
      cell: (val) => (
        <span
          className={`px-2 py-0.5 rounded-lg border font-heading text-[10px] font-extrabold uppercase ${
            val === "verified"
              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
              : val === "pending"
              ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
              : "bg-destructive/10 text-destructive border-destructive/20"
          }`}
        >
          {String(val)}
        </span>
      ),
    },
    {
      id: "plan",
      header: "Subscription",
      sortable: true,
      minWidth: "110px",
      accessor: (row) => row.subscriptionPlan,
      cell: (val) => (
        <span className="px-2 py-0.5 rounded-lg border border-border/60 bg-muted/30 font-heading text-[10px] font-bold text-primary whitespace-nowrap">
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
  ];

  /* ─── Row Actions ─── */
  const rowActions: RowAction<AdminOwner>[] = [
    {
      id: "view",
      label: "View Profile",
      icon: Eye,
      onClick: (row) => handleViewOwner(row),
    },
    {
      id: "edit",
      label: "Edit Owner",
      icon: Edit,
      onClick: (row) => toast.info(`Edit ${row.id}`),
    },
    {
      id: "approve",
      label: "Verify KYC & Approve",
      icon: CheckCircle,
      variant: "success",
      visible: (row) => row.kycStatus === "pending" || row.accountStatus === "pending",
      onClick: (row) => handleApproveKyc(row),
    },
    {
      id: "notify",
      label: "Send Notification",
      icon: Bell,
      onClick: (row) => handleSendNotification(row),
    },
    {
      id: "suspend",
      label: "Suspend Account",
      icon: Ban,
      variant: "warning",
      visible: (row) => row.accountStatus === "active",
      onClick: (row) => handleSuspend(row),
    },
    {
      id: "deactivate",
      label: "Deactivate",
      icon: UserX,
      variant: "warning",
      visible: (row) => row.accountStatus === "active",
      onClick: (row) => handleDeactivate(row),
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
  const bulkActions: BulkAction<AdminOwner>[] = [
    {
      id: "b-approve",
      label: "Approve Selected KYC",
      icon: CheckCircle,
      variant: "success",
      onClick: (rows) => handleBulkApprove(rows),
    },
    {
      id: "b-suspend",
      label: "Suspend Selected",
      icon: Ban,
      variant: "warning",
      onClick: (rows) => handleBulkSuspend(rows),
    },
    {
      id: "b-assign",
      label: "Assign Manager",
      icon: UserCog,
      onClick: (rows) => handleBulkAssignManager(rows),
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
        title="Owner Management (CRM)"
        subtitle="Central portal to manage property owners, KYC verification & earnings"
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
              onClick={() => toast.info("Add Owner modal initiated")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground font-heading text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Owner</span>
            </button>
          </div>
        }
      />

      {/* ═══ Quick Stats (6 Cards Grid) ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <KpiCard
          label="Total Owners"
          value={stats.totalOwners}
          formattedValue={String(stats.totalOwners)}
          change={8.2}
          changeType="positive"
          comparisonLabel="vs last month"
          icon={Users}
        />
        <KpiCard
          label="Verified Owners"
          value={stats.verifiedOwners}
          formattedValue={String(stats.verifiedOwners)}
          change={12.0}
          changeType="positive"
          comparisonLabel="KYC complete"
          icon={UserCheck}
        />
        <KpiCard
          label="Pending KYC"
          value={stats.pendingKyc}
          formattedValue={String(stats.pendingKyc)}
          change={-5.0}
          changeType="negative"
          comparisonLabel="action needed"
          icon={Clock}
        />
        <KpiCard
          label="Suspended"
          value={stats.suspendedOwners}
          formattedValue={String(stats.suspendedOwners)}
          change={0}
          changeType="neutral"
          comparisonLabel="accounts"
          icon={Ban}
        />
        <KpiCard
          label="Active Listings"
          value={stats.activeListings}
          formattedValue={String(stats.activeListings)}
          change={14.5}
          changeType="positive"
          comparisonLabel="properties"
          icon={Building}
        />
        <KpiCard
          label="Total Revenue"
          value={stats.totalRevenueGenerated}
          formattedValue={`₹${(stats.totalRevenueGenerated / 100000).toFixed(1)}L`}
          change={18.7}
          changeType="positive"
          comparisonLabel="generated"
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
              onClick={() => { setKycFilter(""); setPlanFilter(""); setStatusFilter(""); }}
              className="flex items-center gap-1 font-heading text-xs font-bold text-primary hover:text-accent cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-body text-[11px] font-semibold text-muted-foreground block mb-1">
                KYC Status
              </label>
              <select
                value={kycFilter}
                onChange={(e) => setKycFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold text-foreground outline-none"
              >
                <option value="">All KYC</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="font-body text-[11px] font-semibold text-muted-foreground block mb-1">
                Subscription Plan
              </label>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold text-foreground outline-none"
              >
                <option value="">All Plans</option>
                <option value="Gold Tier">Gold Tier</option>
                <option value="Silver Tier">Silver Tier</option>
                <option value="Free Tier">Free Tier</option>
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
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══ Main Data Table ═══ */}
      <DataTable<AdminOwner>
        columns={columns}
        data={filteredOwners}
        getRowId={(o) => o.id}
        searchable={true}
        searchPlaceholder="Search owner name, email, phone, city, ID..."
        selectable={true}
        rowActions={rowActions}
        bulkActions={bulkActions}
        exportConfig={{
          formats: ["csv", "excel", "pdf"],
          onExport: (format) => toast.success(`Exporting owners as ${format.toUpperCase()}...`),
        }}
        statusFilter={[
          { label: "Active", value: "active" },
          { label: "Pending", value: "pending" },
          { label: "Suspended", value: "suspended" },
          { label: "Inactive", value: "inactive" },
        ]}
        dateFilter={true}
        emptyMessage="No property owners match your current criteria."
      />

      {/* ═══ Owner Profile Drawer ═══ */}
      <OwnerProfileDrawer
        owner={selectedOwner}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </AdminPageContainer>
  );
}
