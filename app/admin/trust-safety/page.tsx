"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ShieldAlert,
  HeadphonesIcon,
  AlertTriangle,
  Star,
  Building,
  Users,
  CheckCircle2,
  Clock,
  Eye,
  SlidersHorizontal,
  RotateCcw,
  Ban,
  Trash2,
  Check,
  EyeOff,
  UserX,
  AlertOctagon,
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
  AdminTrustSafetyService,
  SupportTicketItem,
  ComplaintItem,
  ReviewModerationItem,
  ReportedListingItem,
  ReportedUserItem,
  TrustSafetyQuickStats,
} from "@/services/admin-trust-safety";
import { TrustSafetyDrawer } from "@/components/admin/trust-safety-drawer";

type MainTabId = "support" | "complaints" | "reviews" | "properties" | "users";

export default function AdminTrustSafetyPage() {
  /* ─── State ─── */
  const [activeTab, setActiveTab] = React.useState<MainTabId>("support");
  const [selectedTicket, setSelectedTicket] = React.useState<SupportTicketItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  /* Data state */
  const [tickets, setTickets] = React.useState<SupportTicketItem[]>(() => AdminTrustSafetyService.getTickets());
  const [complaints, setComplaints] = React.useState<ComplaintItem[]>(() => AdminTrustSafetyService.getComplaints());
  const [reviews, setReviews] = React.useState<ReviewModerationItem[]>(() => AdminTrustSafetyService.getReviews());
  const [properties, setProperties] = React.useState<ReportedListingItem[]>(() => AdminTrustSafetyService.getReportedProperties());
  const [users, setUsers] = React.useState<ReportedUserItem[]>(() => AdminTrustSafetyService.getReportedUsers());

  /* Stats calculation */
  const stats: TrustSafetyQuickStats = React.useMemo(
    () => AdminTrustSafetyService.getQuickStats(),
    []
  );

  /* Handlers */
  const handleViewTicket = (t: SupportTicketItem) => {
    setSelectedTicket(t);
    setIsDrawerOpen(true);
  };

  /* ─── Support Columns ─── */
  const ticketColumns: ColumnDef<SupportTicketItem>[] = [
    {
      id: "id",
      header: "Ticket ID",
      sortable: true,
      minWidth: "120px",
      accessor: (r) => r.id,
      cell: (val, row) => (
        <button
          type="button"
          onClick={() => handleViewTicket(row)}
          className="font-heading text-xs font-bold text-primary hover:text-accent cursor-pointer"
        >
          {String(val)}
        </button>
      ),
    },
    { id: "buyer", header: "Buyer", sortable: true, minWidth: "150px", accessor: (r) => r.buyerName },
    { id: "owner", header: "Owner", sortable: true, minWidth: "150px", accessor: (r) => r.ownerName },
    { id: "category", header: "Category", sortable: true, minWidth: "140px", accessor: (r) => r.category },
    {
      id: "priority",
      header: "Priority",
      sortable: true,
      minWidth: "110px",
      accessor: (r) => r.priority,
      cell: (val) => (
        <span className="px-2 py-0.5 rounded font-heading text-[10px] font-extrabold uppercase bg-destructive/10 text-destructive">
          {String(val)}
        </span>
      ),
    },
    { id: "staff", header: "Assigned Staff", sortable: true, minWidth: "140px", accessor: (r) => r.assignedStaff },
    {
      id: "status",
      header: "Status",
      sortable: true,
      minWidth: "120px",
      accessor: (r) => r.status,
      cell: (val) => (
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 font-heading text-[10px] font-extrabold uppercase">
          {String(val)}
        </span>
      ),
    },
    { id: "created", header: "Created Date", sortable: true, minWidth: "130px", accessor: (r) => r.createdAt },
  ];

  /* ─── Complaints Columns ─── */
  const complaintColumns: ColumnDef<ComplaintItem>[] = [
    { id: "id", header: "Complaint ID", sortable: true, minWidth: "120px", accessor: (r) => r.id },
    { id: "type", header: "Complaint Type", sortable: true, minWidth: "140px", accessor: (r) => r.complaintType },
    { id: "buyer", header: "Buyer", sortable: true, minWidth: "150px", accessor: (r) => r.buyerName },
    { id: "owner", header: "Owner", sortable: true, minWidth: "150px", accessor: (r) => r.ownerName },
    { id: "property", header: "Property", sortable: true, minWidth: "180px", accessor: (r) => r.propertyTitle },
    {
      id: "severity",
      header: "Severity",
      sortable: true,
      minWidth: "110px",
      accessor: (r) => r.severity,
      cell: (val) => (
        <span className="px-2 py-0.5 rounded font-heading text-[10px] font-extrabold uppercase bg-destructive/10 text-destructive">
          {String(val)}
        </span>
      ),
    },
    { id: "assignedTo", header: "Assigned To", sortable: true, minWidth: "130px", accessor: (r) => r.assignedTo },
    { id: "status", header: "Status", sortable: true, minWidth: "120px", accessor: (r) => r.status },
  ];

  /* ─── Review Moderation Columns ─── */
  const reviewColumns: ColumnDef<ReviewModerationItem>[] = [
    {
      id: "review",
      header: "Review Comment",
      minWidth: "240px",
      accessor: (r) => r.reviewComment,
      cell: (val) => <span className="font-body text-xs text-foreground line-clamp-2">&quot;{String(val)}&quot;</span>,
    },
    { id: "reviewer", header: "Reviewer", sortable: true, minWidth: "140px", accessor: (r) => r.reviewerName },
    { id: "property", header: "Property", sortable: true, minWidth: "160px", accessor: (r) => r.propertyTitle },
    {
      id: "rating",
      header: "Rating",
      sortable: true,
      minWidth: "90px",
      accessor: (r) => r.rating,
      cell: (val) => (
        <span className="font-heading text-xs font-bold text-amber-600 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {Number(val)}
        </span>
      ),
    },
    { id: "reason", header: "Reason Reported", sortable: true, minWidth: "150px", accessor: (r) => r.reasonReported },
    { id: "status", header: "Status", sortable: true, minWidth: "110px", accessor: (r) => r.status },
  ];

  /* ─── Reported Properties Columns ─── */
  const propertyColumns: ColumnDef<ReportedListingItem>[] = [
    { id: "title", header: "Property Title", sortable: true, minWidth: "200px", accessor: (r) => r.propertyTitle },
    { id: "owner", header: "Owner", sortable: true, minWidth: "150px", accessor: (r) => r.ownerName },
    { id: "reason", header: "Reason", sortable: true, minWidth: "160px", accessor: (r) => r.reason },
    { id: "reports", header: "Reports Count", sortable: true, minWidth: "120px", accessor: (r) => r.reportsCount },
    { id: "status", header: "Status", sortable: true, minWidth: "120px", accessor: (r) => r.status },
  ];

  /* ─── Reported Users Columns ─── */
  const userColumns: ColumnDef<ReportedUserItem>[] = [
    { id: "name", header: "User Name", sortable: true, minWidth: "160px", accessor: (r) => r.userName },
    { id: "role", header: "Role", sortable: true, minWidth: "90px", accessor: (r) => r.userRole },
    { id: "reason", header: "Reason", sortable: true, minWidth: "160px", accessor: (r) => r.reason },
    { id: "reports", header: "Reports", sortable: true, minWidth: "90px", accessor: (r) => r.reportsCount },
    {
      id: "risk",
      header: "Risk Score",
      sortable: true,
      minWidth: "120px",
      accessor: (r) => r.riskScore,
      cell: (val) => (
        <span className="px-2.5 py-0.5 rounded font-heading text-[10px] font-extrabold bg-destructive/10 text-destructive border border-destructive/20">
          {Number(val)}/100 Risk
        </span>
      ),
    },
    { id: "status", header: "Status", sortable: true, minWidth: "110px", accessor: (r) => r.status },
  ];

  return (
    <AdminPageContainer>
      {/* ═══ Header ═══ */}
      <PageHeader
        title="Trust & Safety Center"
        subtitle="Centralized command for support tickets, complaints, review moderation & user bans"
      />

      {/* ═══ Quick Stats (7 Cards Grid) ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <KpiCard label="Open Tickets" value={stats.openTickets} formattedValue={String(stats.openTickets)} change={-2.0} changeType="negative" comparisonLabel="active cases" icon={HeadphonesIcon} />
        <KpiCard label="Complaints" value={stats.pendingComplaints} formattedValue={String(stats.pendingComplaints)} change={0} changeType="neutral" comparisonLabel="investigating" icon={AlertTriangle} />
        <KpiCard label="Reported Reviews" value={stats.reportedReviews} formattedValue={String(stats.reportedReviews)} change={0} changeType="neutral" comparisonLabel="moderation" icon={Star} />
        <KpiCard label="Flagged Props" value={stats.flaggedProperties} formattedValue={String(stats.flaggedProperties)} change={0} changeType="neutral" comparisonLabel="safety audits" icon={Building} />
        <KpiCard label="Flagged Owners" value={stats.flaggedOwners} formattedValue={String(stats.flaggedOwners)} change={0} changeType="neutral" comparisonLabel="risk > 70" icon={Users} />
        <KpiCard label="Resolved Today" value={stats.resolvedToday} formattedValue={String(stats.resolvedToday)} change={12.0} changeType="positive" comparisonLabel="cases closed" icon={CheckCircle2} />
        <KpiCard label="Avg Res Time" value={0} formattedValue={stats.avgResolutionTime} change={0} changeType="neutral" comparisonLabel="SLA target < 6h" icon={Clock} />
      </div>

      {/* ═══ Main Navigation Tabs ═══ */}
      <div className="flex items-center gap-2 border-b border-border/40 pb-2 overflow-x-auto scrollbar-none">
        {(["support", "complaints", "reviews", "properties", "users"] as MainTabId[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 rounded-xl font-heading text-xs font-bold transition-all cursor-pointer capitalize whitespace-nowrap ${
              activeTab === tab
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ═══ Dynamic Tab Content ═══ */}
      {activeTab === "support" && (
        <DataTable<SupportTicketItem>
          columns={ticketColumns}
          data={tickets}
          getRowId={(t) => t.id}
          searchable={true}
          searchPlaceholder="Search ticket ID, buyer, owner, category..."
          rowActions={[
            { id: "view", label: "Inspect Case", icon: Eye, onClick: (r) => handleViewTicket(r) },
            { id: "resolve", label: "Mark Resolved", icon: CheckCircle2, variant: "success", onClick: (r) => toast.success(`Ticket ${r.id} resolved`) },
          ]}
        />
      )}

      {activeTab === "complaints" && (
        <DataTable<ComplaintItem>
          columns={complaintColumns}
          data={complaints}
          getRowId={(c) => c.id}
          searchable={true}
          searchPlaceholder="Search complaint type, buyer, owner..."
        />
      )}

      {activeTab === "reviews" && (
        <DataTable<ReviewModerationItem>
          columns={reviewColumns}
          data={reviews}
          getRowId={(r) => r.id}
          searchable={true}
          searchPlaceholder="Search review comment, reviewer, property..."
          rowActions={[
            { id: "approve", label: "Approve Review", icon: Check, variant: "success", onClick: (r) => toast.success("Review approved") },
            { id: "hide", label: "Hide Review", icon: EyeOff, variant: "warning", onClick: (r) => toast.info("Review hidden") },
            { id: "delete", label: "Delete Review", icon: Trash2, variant: "destructive", onClick: (r) => toast.error("Review deleted") },
          ]}
        />
      )}

      {activeTab === "properties" && (
        <DataTable<ReportedListingItem>
          columns={propertyColumns}
          data={properties}
          getRowId={(p) => p.id}
          searchable={true}
          searchPlaceholder="Search reported property..."
        />
      )}

      {activeTab === "users" && (
        <DataTable<ReportedUserItem>
          columns={userColumns}
          data={users}
          getRowId={(u) => u.id}
          searchable={true}
          searchPlaceholder="Search reported user..."
          rowActions={[
            { id: "warn", label: "Issue Warning", icon: AlertTriangle, onClick: (r) => toast.warning(`Warning sent to ${r.userName}`) },
            { id: "suspend", label: "Suspend Account", icon: Ban, variant: "warning", onClick: (r) => toast.warning(`Suspended ${r.userName}`) },
            { id: "ban", label: "Permanent Ban", icon: UserX, variant: "destructive", onClick: (r) => toast.error(`Banned ${r.userName}`) },
          ]}
        />
      )}

      {/* ═══ Trust & Safety Drawer ═══ */}
      <TrustSafetyDrawer
        ticket={selectedTicket}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </AdminPageContainer>
  );
}
