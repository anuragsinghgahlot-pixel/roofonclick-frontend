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
import {
  AdminTrustSafetyService,
  SupportTicketItem,
} from "@/services/admin-trust-safety";

export default function AdminSupportPage() {
  const [tickets, setTickets] = React.useState<SupportTicketItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedTicket, setSelectedTicket] = React.useState<SupportTicketItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [replyMessage, setReplyMessage] = React.useState("");

  React.useEffect(() => {
    let isMounted = true;
    AdminTrustSafetyService.fetchTickets()
      .then((data) => {
        if (isMounted) {
          setTickets(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleResolve = async (ticket: SupportTicketItem) => {
    try {
      const targetId = ticket.mongoId || ticket.id;
      await AdminTrustSafetyService.updateTicket(targetId, { status: "resolved" });
      const updated: SupportTicketItem = { ...ticket, status: "Resolved" };
      setTickets((prev) => prev.map((t) => (t.id === ticket.id ? updated : t)));
      if (selectedTicket?.id === ticket.id) {
        setSelectedTicket(updated);
      }
      toast.success(`Ticket ${ticket.id} marked as resolved.`);
    } catch {
      toast.error("Failed to update ticket status.");
    }
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;
    try {
      const targetId = selectedTicket.mongoId || selectedTicket.id;
      await AdminTrustSafetyService.updateTicket(targetId, {
        replyMessage: replyMessage.trim(),
        status: "in_progress",
      });
      const newMsg = {
        sender: "Admin Support",
        message: replyMessage.trim(),
        date: new Date().toISOString().split("T")[0],
        isStaff: true,
      };
      const updated: SupportTicketItem = {
        ...selectedTicket,
        status: "In Progress",
        conversation: [...(selectedTicket.conversation || []), newMsg],
      };
      setTickets((prev) => prev.map((t) => (t.id === selectedTicket.id ? updated : t)));
      setSelectedTicket(updated);
      setReplyMessage("");
      toast.success("Support reply sent to resident/owner.");
    } catch {
      toast.error("Failed to send reply.");
    }
  };

  const columns: ColumnDef<SupportTicketItem>[] = [
    {
      id: "id",
      header: "Ticket ID",
      sortable: true,
      minWidth: "120px",
      accessor: (t) => t.id,
      cell: (val, row) => (
        <button
          type="button"
          onClick={() => {
            setSelectedTicket(row);
            setIsDrawerOpen(true);
          }}
          className="font-heading text-xs font-bold text-primary hover:text-accent cursor-pointer"
        >
          {String(val)}
        </button>
      ),
    },
    { id: "buyer", header: "Resident / Guest", sortable: true, minWidth: "140px", accessor: (t) => t.buyerName },
    { id: "owner", header: "Property / Owner", sortable: true, minWidth: "140px", accessor: (t) => t.ownerName },
    { id: "category", header: "Category", sortable: true, minWidth: "140px", accessor: (t) => t.category },
    {
      id: "priority",
      header: "Priority",
      sortable: true,
      minWidth: "110px",
      accessor: (t) => t.priority,
      cell: (val) => (
        <span
          className={`px-2 py-0.5 rounded font-heading text-[10px] font-extrabold uppercase ${
            val === "Urgent" || val === "High"
              ? "bg-destructive/10 text-destructive"
              : "bg-amber-500/10 text-amber-700"
          }`}
        >
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
        <span
          className={`px-2 py-0.5 rounded font-heading text-[10px] font-extrabold uppercase ${
            val === "Resolved"
              ? "bg-emerald-500/10 text-emerald-700"
              : val === "In Progress"
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {String(val)}
        </span>
      ),
    },
    { id: "date", header: "Created Date", sortable: true, minWidth: "130px", accessor: (t) => t.createdAt },
  ];

  const rowActions: RowAction<SupportTicketItem>[] = [
    {
      id: "inspect",
      label: "Inspect Ticket",
      icon: Eye,
      onClick: (t) => {
        setSelectedTicket(t);
        setIsDrawerOpen(true);
      },
    },
    {
      id: "resolve",
      label: "Mark Resolved",
      icon: CheckCircle2,
      variant: "success",
      onClick: (t) => handleResolve(t),
    },
  ];

  const bulkActions: BulkAction<SupportTicketItem>[] = [
    {
      id: "b-resolve",
      label: "Resolve Selected",
      icon: CheckCircle2,
      variant: "success",
      onClick: async (rows) => {
        try {
          const ids = rows.map((r) => r.mongoId || r.id);
          await AdminTrustSafetyService.bulkUpdateTickets(ids, "resolved");
          const idsSet = new Set(rows.map((r) => r.id));
          setTickets((prev) =>
            prev.map((t) => (idsSet.has(t.id) ? { ...t, status: "Resolved" } : t))
          );
          toast.success(`Resolved ${rows.length} support ticket(s).`);
        } catch {
          toast.error("Failed to bulk resolve tickets.");
        }
      },
    },
  ];

  return (
    <AdminPageContainer>
      <PageHeader
        title="Support & Helpdesk Center"
        subtitle="Centralized ticket resolution, SLA timers & customer dispute management"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard
          label="Open Tickets"
          value={tickets.filter((t) => t.status !== "Resolved" && t.status !== "Closed").length}
          formattedValue={String(tickets.filter((t) => t.status !== "Resolved" && t.status !== "Closed").length)}
          change={0}
          changeType="neutral"
          comparisonLabel="active cases"
          icon={HeadphonesIcon}
        />
        <KpiCard
          label="Urgent SLA"
          value={tickets.filter((t) => t.priority === "Urgent" && t.status !== "Resolved").length}
          formattedValue={`${tickets.filter((t) => t.priority === "Urgent" && t.status !== "Resolved").length} Case(s)`}
          change={0}
          changeType="neutral"
          comparisonLabel="requires action"
          icon={AlertTriangle}
        />
        <KpiCard
          label="Avg Res Time"
          value={2.4}
          formattedValue="2.4 Hours"
          change={12}
          changeType="positive"
          comparisonLabel="SLA compliance"
          icon={Clock}
        />
        <KpiCard
          label="Resolved Cases"
          value={tickets.filter((t) => t.status === "Resolved").length}
          formattedValue={`${tickets.filter((t) => t.status === "Resolved").length} Tickets`}
          change={15}
          changeType="positive"
          comparisonLabel="cases closed"
          icon={CheckCircle2}
        />
      </div>

      <DataTable<SupportTicketItem>
        columns={columns}
        data={tickets}
        isLoading={isLoading}
        getRowId={(t) => t.id}
        searchable={true}
        searchPlaceholder="Search ticket ID, resident, property, or category..."
        selectable={true}
        rowActions={rowActions}
        bulkActions={bulkActions}
        dateFilter={true}
        emptyMessage="No open support tickets matching criteria."
      />

      <AnimatePresence>
        {isDrawerOpen && selectedTicket && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 z-[299] bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 z-[300] h-screen w-full sm:w-[540px] bg-card border-l border-border/60 p-5 flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div>
                    <span className="font-heading text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {selectedTicket.id}
                    </span>
                    <h2 className="font-heading text-base font-extrabold text-foreground mt-1">
                      {selectedTicket.category}
                    </h2>
                    {selectedTicket.subject && (
                      <p className="font-body text-xs text-muted-foreground mt-0.5">{selectedTicket.subject}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-2 text-xs font-body">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resident:</span>
                    <strong className="font-heading text-foreground">{selectedTicket.buyerName} ({selectedTicket.buyerPhone || selectedTicket.buyerEmail || "N/A"})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property:</span>
                    <strong className="font-heading text-foreground">{selectedTicket.ownerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assigned Agent:</span>
                    <strong className="font-heading text-primary">{selectedTicket.assignedStaff}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-heading font-extrabold text-[10px] uppercase">
                      {selectedTicket.status}
                    </span>
                  </div>
                </div>

                {/* Conversation Trail */}
                <div className="space-y-2 pt-2">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Communication Thread
                  </h3>
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {(selectedTicket.conversation || []).map((m, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl text-xs space-y-1 ${
                          m.isStaff
                            ? "bg-primary/10 border border-primary/20 ml-4"
                            : "bg-muted/40 border border-border/60 mr-4"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-foreground">{m.sender}</span>
                          <span className="font-body text-[10px] text-muted-foreground">{m.date}</span>
                        </div>
                        <p className="font-body text-foreground/90">{m.message}</p>
                      </div>
                    ))}
                    {(!selectedTicket.conversation || selectedTicket.conversation.length === 0) && (
                      <p className="font-body text-xs text-muted-foreground italic">No message thread.</p>
                    )}
                  </div>
                </div>

                {/* Reply Form */}
                <div className="space-y-2 pt-2">
                  <textarea
                    rows={2}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type official support reply to resident..."
                    className="w-full p-2.5 rounded-xl border border-border/60 bg-muted/20 text-xs font-body text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                  <button
                    type="button"
                    disabled={!replyMessage.trim()}
                    onClick={handleSendReply}
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-primary text-primary-foreground font-heading text-xs font-bold disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Send Official Response
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-border/40">
                {selectedTicket.status !== "Resolved" ? (
                  <button
                    type="button"
                    onClick={() => handleResolve(selectedTicket)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-heading text-xs font-bold transition-all cursor-pointer"
                  >
                    Mark Case as Resolved
                  </button>
                ) : (
                  <div className="w-full py-2.5 rounded-xl bg-muted text-muted-foreground font-heading text-xs font-bold text-center">
                    Case Resolved & Closed
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminPageContainer>
  );
}
