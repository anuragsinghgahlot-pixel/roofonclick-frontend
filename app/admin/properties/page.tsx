"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Building,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  FileEdit,
  Ban,
  Percent,
  Plus,
  RefreshCw,
  Eye,
  Edit,
  Archive,
  Trash2,
  Copy,
  Star,
  ShieldCheck,
  SlidersHorizontal,
  RotateCcw,
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
  AdminPropertyService,
  AdminProperty,
  AdminPropertyQuickStats,
} from "@/services/admin-properties";
import { PropertyDetailDrawer } from "@/components/admin/property-detail-drawer";

export default function AdminPropertiesPage() {
  /* ─── State ─── */
  const [properties, setProperties] = React.useState<AdminProperty[]>(() =>
    AdminPropertyService.getAllProperties()
  );
  const [selectedProperty, setSelectedProperty] = React.useState<AdminProperty | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  /* Advanced Filter state */
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
  const [typeFilter, setTypeFilter] = React.useState<string>("");
  const [genderFilter, setGenderFilter] = React.useState<string>("");
  const [verifiedFilter, setVerifiedFilter] = React.useState<string>("");

  /* Stats calculation */
  const stats: AdminPropertyQuickStats = React.useMemo(
    () => AdminPropertyService.getQuickStats(properties),
    [properties]
  );

  /* ─── Handlers ─── */
  const handleViewProperty = (prop: AdminProperty) => {
    setSelectedProperty(prop);
    setIsDrawerOpen(true);
  };

  const handleApprove = (prop: AdminProperty) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === prop.id ? { ...p, status: "approved", isVerified: true } : p))
    );
    toast.success(`Property ${prop.id} approved successfully.`);
  };

  const handleReject = (prop: AdminProperty) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === prop.id ? { ...p, status: "rejected" } : p))
    );
    toast.error(`Property ${prop.id} rejected.`);
  };

  const handleFeatureToggle = (prop: AdminProperty) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === prop.id ? { ...p, isFeatured: !p.isFeatured } : p))
    );
    toast.info(`Property ${prop.id} featured status toggled.`);
  };

  const handleSuspend = (prop: AdminProperty) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === prop.id ? { ...p, status: "suspended" } : p))
    );
    toast.warning(`Property ${prop.id} suspended.`);
  };

  const handleDelete = (prop: AdminProperty) => {
    setProperties((prev) => prev.filter((p) => p.id !== prop.id));
    toast.success(`Property ${prop.id} deleted.`);
  };

  const handleDuplicate = (prop: AdminProperty) => {
    const copy: AdminProperty = {
      ...prop,
      id: `PROP-${Math.floor(1000 + Math.random() * 9000)}`,
      propertyName: `${prop.propertyName} (Copy)`,
      status: "draft",
      createdAt: new Date().toISOString(),
    };
    setProperties((prev) => [copy, ...prev]);
    toast.success(`Duplicated listing as ${copy.id}`);
  };

  /* ─── Bulk Handlers ─── */
  const handleBulkApprove = (selected: AdminProperty[]) => {
    const ids = new Set(selected.map((s) => s.id));
    setProperties((prev) =>
      prev.map((p) => (ids.has(p.id) ? { ...p, status: "approved", isVerified: true } : p))
    );
    toast.success(`Approved ${selected.length} properties.`);
  };

  const handleBulkReject = (selected: AdminProperty[]) => {
    const ids = new Set(selected.map((s) => s.id));
    setProperties((prev) =>
      prev.map((p) => (ids.has(p.id) ? { ...p, status: "rejected" } : p))
    );
    toast.error(`Rejected ${selected.length} properties.`);
  };

  const handleBulkDelete = (selected: AdminProperty[]) => {
    const ids = new Set(selected.map((s) => s.id));
    setProperties((prev) => prev.filter((p) => !ids.has(p.id)));
    toast.success(`Deleted ${selected.length} properties.`);
  };

  /* ─── Advanced Filtering ─── */
  const filteredProperties = React.useMemo(() => {
    return properties.filter((p) => {
      if (typeFilter && p.propertyType !== typeFilter) return false;
      if (genderFilter && p.gender !== genderFilter) return false;
      if (verifiedFilter === "verified" && !p.isVerified) return false;
      if (verifiedFilter === "unverified" && p.isVerified) return false;
      return true;
    });
  }, [properties, typeFilter, genderFilter, verifiedFilter]);

  /* ─── Table Columns ─── */
  const columns: ColumnDef<AdminProperty>[] = [
    {
      id: "photo",
      header: "Photo",
      minWidth: "70px",
      accessor: (row) => row.coverPhoto,
      cell: (val, row) => (
        <div className="w-11 h-11 rounded-xl overflow-hidden border border-border/60 shrink-0 bg-muted/40">
          {/* eslint-disable-next-html-link, @next/next/no-img-element */}
          <img
            src={String(val)}
            alt={row.propertyName}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      id: "name",
      header: "Property Name",
      sortable: true,
      minWidth: "220px",
      accessor: (row) => row.propertyName,
      cell: (val, row) => (
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={() => handleViewProperty(row)}
            className="font-heading text-xs font-bold text-foreground hover:text-primary transition-colors text-left line-clamp-1 cursor-pointer"
          >
            {String(val)}
          </button>
          <span className="font-body text-[10px] text-muted-foreground block">
            ID: {row.id} • {row.area}
          </span>
        </div>
      ),
    },
    {
      id: "owner",
      header: "Owner",
      sortable: true,
      minWidth: "140px",
      accessor: (row) => row.ownerName,
      cell: (val, row) => (
        <div className="space-y-0.5">
          <span className="font-heading text-xs font-semibold text-foreground block truncate">
            {String(val)}
          </span>
          <span className="font-body text-[10px] text-muted-foreground block truncate">
            {row.ownerPhone}
          </span>
        </div>
      ),
    },
    {
      id: "city",
      header: "City",
      sortable: true,
      minWidth: "100px",
      accessor: (row) => row.city,
    },
    {
      id: "type",
      header: "Type",
      sortable: true,
      minWidth: "110px",
      accessor: (row) => `${row.propertyType} (${row.gender})`,
      cell: (val, row) => (
        <span className="px-2 py-0.5 rounded-lg border border-border/60 bg-muted/30 font-heading text-[10px] font-bold text-foreground whitespace-nowrap">
          {row.propertyType} • {row.gender}
        </span>
      ),
    },
    {
      id: "rent",
      header: "Monthly Rent",
      sortable: true,
      minWidth: "120px",
      accessor: (row) => row.startingRent,
      cell: (val) => (
        <span className="font-heading text-xs font-extrabold text-primary">
          ₹{Number(val).toLocaleString()}
        </span>
      ),
    },
    {
      id: "occupancy",
      header: "Occupancy",
      sortable: true,
      minWidth: "110px",
      accessor: (row) => row.occupancyRate,
      cell: (val, row) => (
        <div className="space-y-1 w-24">
          <div className="flex items-center justify-between text-[10px] font-heading font-bold">
            <span className="text-foreground">{Number(val)}%</span>
            <span className="text-muted-foreground">{row.occupiedBeds}/{row.totalBeds}</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${val}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      id: "rating",
      header: "Rating",
      sortable: true,
      minWidth: "90px",
      accessor: (row) => row.rating,
      cell: (val) => (
        <span className="inline-flex items-center gap-1 font-heading text-xs font-bold text-amber-600">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          {Number(val) > 0 ? Number(val) : "New"}
        </span>
      ),
    },
    {
      id: "health",
      header: "Health Score",
      sortable: true,
      minWidth: "120px",
      accessor: (row) => row.healthScore,
      cell: (val, row) => {
        const score = Number(val);
        const color =
          score >= 85
            ? "text-emerald-700 bg-emerald-500/10 border-emerald-500/20"
            : score >= 70
            ? "text-amber-700 bg-amber-500/10 border-amber-500/20"
            : "text-destructive bg-destructive/10 border-destructive/20";
        return (
          <span className={`px-2 py-0.5 rounded-lg border font-heading text-[10px] font-extrabold ${color}`}>
            {score}/100 • {row.healthLabel}
          </span>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      minWidth: "110px",
      accessor: (row) => row.status,
      cell: (val) => <StatusBadge status={val as any} />,
    },
  ];

  /* ─── Row Actions ─── */
  const rowActions: RowAction<AdminProperty>[] = [
    {
      id: "view",
      label: "View Details",
      icon: Eye,
      onClick: (row) => handleViewProperty(row),
    },
    {
      id: "edit",
      label: "Edit Listing",
      icon: Edit,
      onClick: (row) => toast.info(`Edit ${row.id}`),
    },
    {
      id: "approve",
      label: "Approve",
      icon: CheckCircle,
      variant: "success",
      visible: (row) => row.status === "pending" || row.status === "rejected",
      onClick: (row) => handleApprove(row),
    },
    {
      id: "reject",
      label: "Reject",
      icon: XCircle,
      variant: "destructive",
      visible: (row) => row.status === "pending",
      onClick: (row) => handleReject(row),
    },
    {
      id: "feature",
      label: "Feature Listing",
      icon: Sparkles,
      onClick: (row) => handleFeatureToggle(row),
    },
    {
      id: "suspend",
      label: "Suspend",
      icon: Ban,
      variant: "warning",
      visible: (row) => row.status === "approved" || row.status === "active",
      onClick: (row) => handleSuspend(row),
    },
    {
      id: "duplicate",
      label: "Duplicate Listing",
      icon: Copy,
      separator: true,
      onClick: (row) => handleDuplicate(row),
    },
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      variant: "destructive",
      onClick: (row) => handleDelete(row),
    },
  ];

  /* ─── Bulk Actions ─── */
  const bulkActions: BulkAction<AdminProperty>[] = [
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
        title="Property Management"
        subtitle="Control center for all hostel, PG & co-living listings"
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
              onClick={() => toast.info("Create Property modal initiated")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground font-heading text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Property</span>
            </button>
          </div>
        }
      />

      {/* ═══ Quick Stats (8 Cards Grid) ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <KpiCard
          label="Total"
          value={stats.total}
          formattedValue={String(stats.total)}
          change={12.5}
          changeType="positive"
          comparisonLabel="vs last month"
          icon={Building}
        />
        <KpiCard
          label="Pending"
          value={stats.pending}
          formattedValue={String(stats.pending)}
          change={-8.3}
          changeType="negative"
          comparisonLabel="vs last week"
          icon={Clock}
        />
        <KpiCard
          label="Approved"
          value={stats.approved}
          formattedValue={String(stats.approved)}
          change={15.0}
          changeType="positive"
          comparisonLabel="vs last month"
          icon={CheckCircle}
        />
        <KpiCard
          label="Rejected"
          value={stats.rejected}
          formattedValue={String(stats.rejected)}
          change={0}
          changeType="neutral"
          comparisonLabel="vs last week"
          icon={XCircle}
        />
        <KpiCard
          label="Featured"
          value={stats.featured}
          formattedValue={String(stats.featured)}
          change={25.0}
          changeType="positive"
          comparisonLabel="active"
          icon={Sparkles}
        />
        <KpiCard
          label="Draft"
          value={stats.draft}
          formattedValue={String(stats.draft)}
          change={0}
          changeType="neutral"
          comparisonLabel="in-progress"
          icon={FileEdit}
        />
        <KpiCard
          label="Suspended"
          value={stats.suspended}
          formattedValue={String(stats.suspended)}
          change={0}
          changeType="neutral"
          comparisonLabel="review needed"
          icon={Ban}
        />
        <KpiCard
          label="Avg Occupancy"
          value={stats.avgOccupancy}
          formattedValue={`${stats.avgOccupancy}%`}
          change={5.2}
          changeType="positive"
          comparisonLabel="across platform"
          icon={Percent}
        />
      </div>

      {/* ═══ Advanced Filter Strip (Collapsible) ═══ */}
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
              onClick={() => { setTypeFilter(""); setGenderFilter(""); setVerifiedFilter(""); }}
              className="flex items-center gap-1 font-heading text-xs font-bold text-primary hover:text-accent cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-body text-[11px] font-semibold text-muted-foreground block mb-1">
                Property Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold text-foreground outline-none"
              >
                <option value="">All Types</option>
                <option value="Hostel">Hostel</option>
                <option value="PG">PG</option>
                <option value="Co-living">Co-living</option>
                <option value="Apartment">Apartment</option>
              </select>
            </div>
            <div>
              <label className="font-body text-[11px] font-semibold text-muted-foreground block mb-1">
                Gender
              </label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold text-foreground outline-none"
              >
                <option value="">All Genders</option>
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
                <option value="Co-ed">Co-ed</option>
              </select>
            </div>
            <div>
              <label className="font-body text-[11px] font-semibold text-muted-foreground block mb-1">
                Verification Status
              </label>
              <select
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold text-foreground outline-none"
              >
                <option value="">All Listings</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══ Main Property Data Table ═══ */}
      <DataTable<AdminProperty>
        columns={columns}
        data={filteredProperties}
        getRowId={(p) => p.id}
        searchable={true}
        searchPlaceholder="Search property name, owner, city, ID..."
        selectable={true}
        rowActions={rowActions}
        bulkActions={bulkActions}
        exportConfig={{
          formats: ["csv", "excel", "pdf"],
          onExport: (format) => toast.success(`Exporting properties as ${format.toUpperCase()}...`),
        }}
        statusFilter={[
          { label: "Pending", value: "pending" },
          { label: "Approved", value: "approved" },
          { label: "Rejected", value: "rejected" },
          { label: "Draft", value: "draft" },
          { label: "Suspended", value: "suspended" },
        ]}
        dateFilter={true}
        emptyMessage="No properties match your current criteria."
      />

      {/* ═══ Detail Drawer ═══ */}
      <PropertyDetailDrawer
        property={selectedProperty}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </AdminPageContainer>
  );
}
