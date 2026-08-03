"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  HeadphonesIcon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  X,
  Send,
  User,
  Building,
  FileText,
  ShieldCheck,
} from "lucide-react";
import {
  AdminPageContainer,
  PageHeader,
  DataTable,
  KpiCard,
} from "@/components/admin";
import type { ColumnDef, RowAction, BulkAction } from "@/components/admin/data-table";

interface TicketItem {
  id: string;
  buyerName: string;
  ownerName: string;
  category: string;
  priority: "High" | "Medium" | "Low" | "Urgent";
  assignedStaff: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdAt: string;
}

const MOCK_TICKETS: TicketItem[] = [
  { id: "TKT-901", buyerName: "Anurag Singh", ownerName: "Rajesh Kumar", category: "Check-in Delay", priority: "Urgent", assignedStaff: "Rohit (Ops)", status: "In Progress", createdAt: "2026-08-02 20:00" },
  { id: "TKT-902", buyerName: "Rahul Verma", ownerName: "Amitabh Jain", category: "Refund Dispute", priority: "High", assignedStaff: "Priya (Support)", status: "Open", createdAt: "2026-08-03 09:30" },
  { id: "TKT-903", buyerName: "Sneha Mukherjee", ownerName: "Sunita Verma", category: "WiFi Issue", priority: "Low", assignedStaff: "Unassigned", status: "Open", createdAt: "2026-08-03 10:15" },
];

export default function AdminSupportPage() {
  const [tickets, setTickets] = React.useState<TicketItem[]>(MOCK_TICKETS);
  const [selectedTicket, setSelectedTicket] = React.useState<TicketItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleResolve = (ticket: TicketItem) => {
    setTickets((prev) => prev.map((t) => (t.id === ticket.id ? { ...t, status: "Resolved" } : t)));
    toast.success(`Ticket ${ticket.id} marked as resolved.`);
  };

  const columns: ColumnDef<TicketItem>[] = [
    {
      id: "id",
      header: "Ticket ID",
      sortable: true,
      minWidth: "120px",
      accessor: (t) => t.id,
      cell: (val, row) => (
        <button type="button" onClick={() => { setSelectedTicket(row); setIsDrawerOpen(true); }} className="font-heading text-xs font-bold text-primary hover:text-accent cursor-pointer">
          {String(val)}
        </button>
      ),
    },
    { id: "buyer", header: "Buyer", sortable: true, minWidth: "140px", accessor: (t) => t.buyerName },
    { id: "owner", header: "Owner", sortable: true, minWidth: "140px", accessor: (t) => t.ownerName },
    { id: "category", header: "Category", sortable: true, minWidth: "140px", accessor: (t) => t.category },
    {
      id: "priority",
      header: "Priority",
      sortable: true,
      minWidth: "110px",
      accessor: (t) => t.priority,
      cell: (val) => (
        <span className="px-2 py-0.5 rounded font-heading text-[10px] font-extrabold uppercase bg-destructive/10 text-destructive">
          {String(val)}
        </span>
      ),
    },
    { id: "staff", header: "Assigned Staff", sortable: true, minWidth: "140px", accessor: (t) => t.assignedStaff },
    {
      id: "status",
      header: "Status",
      sortable: true,
      minWidth: "120px",
      accessor: (t) => t.status,
      cell: (val) => (
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 font-heading text-[10px] font-extrabold uppercase">
          {String(val)}
        </span>
      ),
    },
    { id: "date", header: "Created Date", sortable: true, minWidth: "130px", accessor: (t) => t.createdAt },
  ];

  return (
    <AdminPageContainer>
      <PageHeader title="Support & Helpdesk Center" subtitle="Centralized ticket resolution, SLA timers & customer dispute management" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Open Tickets" value={tickets.filter(t => t.status !== "Resolved").length} formattedValue={String(tickets.filter(t => t.status !== "Resolved").length)} change={-2} changeType="negative" comparisonLabel="active cases" icon={HeadphonesIcon} />
        <KpiCard label="Urgent SLA" value={1} formattedValue="1 Case" change={0} changeType="neutral" comparisonLabel="requires action" icon={AlertTriangle} />
        <KpiCard label="Avg Res Time" value={4.2} formattedValue="4.2 Hours" change={12} changeType="positive" comparisonLabel="SLA compliance" icon={Clock} />
        <KpiCard label="Resolved Today" value={18} formattedValue="18 Tickets" change={15} changeType="positive" comparisonLabel="cases closed" icon={CheckCircle2} />
      </div>

      <DataTable<TicketItem>
        columns={columns}
        data={tickets}
        getRowId={(t) => t.id}
        searchable={true}
        searchPlaceholder="Search ticket ID, buyer, owner, or category..."
        rowActions={[
          { id: "inspect", label: "Inspect Ticket", icon: Eye, onClick: (t) => { setSelectedTicket(t); setIsDrawerOpen(true); } },
          { id: "resolve", label: "Mark Resolved", icon: CheckCircle2, variant: "success", onClick: (t) => handleResolve(t) },
        ]}
      />

      <AnimatePresence>
        {isDrawerOpen && selectedTicket && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 z-[299] bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.3 }} className="fixed top-0 right-0 z-[300] h-screen w-full sm:w-[500px] bg-card border-l border-border/60 p-5 flex flex-col justify-between shadow-2xl overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div>
                    <span className="font-heading text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">{selectedTicket.id}</span>
                    <h2 className="font-heading text-base font-extrabold text-foreground mt-1">{selectedTicket.category}</h2>
                  </div>
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-2 text-xs font-body">
                  <div>Buyer: <strong className="font-heading text-foreground">{selectedTicket.buyerName}</strong></div>
                  <div>Owner: <strong className="font-heading text-foreground">{selectedTicket.ownerName}</strong></div>
                  <div>Assigned: <strong className="font-heading text-primary">{selectedTicket.assignedStaff}</strong></div>
                  <div>Priority: <strong className="font-heading text-destructive">{selectedTicket.priority}</strong></div>
                </div>
              </div>
              <button type="button" onClick={() => { handleResolve(selectedTicket); setIsDrawerOpen(false); }} className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-heading text-xs font-bold cursor-pointer">Mark Resolved</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminPageContainer>
  );
}
