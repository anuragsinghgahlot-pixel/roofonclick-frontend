"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  X,
  CreditCard,
  Building,
  User,
  ShieldCheck,
  Clock,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  Send,
  Download,
  IndianRupee,
  Receipt,
  RotateCcw,
  Landmark,
} from "lucide-react";
import type { AdminPayment } from "@/services/admin-payments";
import { StatusBadge } from "@/components/admin/data-table";

type TabId =
  | "overview"
  | "booking"
  | "buyer"
  | "owner"
  | "gateway"
  | "settlement"
  | "timeline"
  | "documents"
  | "notes";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: CreditCard },
  { id: "booking", label: "Booking", icon: Building },
  { id: "buyer", label: "Buyer", icon: User },
  { id: "owner", label: "Owner", icon: User },
  { id: "gateway", label: "Gateway", icon: ShieldCheck },
  { id: "settlement", label: "Settlement", icon: Landmark },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "notes", label: "Internal Notes", icon: MessageSquare },
];

export function PaymentDetailDrawer({
  payment,
  isOpen,
  onClose,
}: {
  payment: AdminPayment | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = React.useState<TabId>("overview");
  const [notes, setNotes] = React.useState<{ id: string; author: string; note: string; date: string }[]>([]);
  const [newNote, setNewNote] = React.useState("");

  React.useEffect(() => {
    if (payment) {
      setNotes(payment.internalNotes);
      setActiveTab("overview");
    }
  }, [payment]);

  // Body scroll lock & ESC key
  React.useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  if (!payment) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const item = {
      id: `N-${Date.now()}`,
      author: "Finance Admin",
      note: newNote.trim(),
      date: new Date().toLocaleString(),
    };
    setNotes((prev) => [item, ...prev]);
    setNewNote("");
    toast.success("Finance note added.");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[299] bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
            role="dialog"
            aria-modal="true"
            aria-label={`Payment Details: ${payment.id}`}
            className="fixed top-0 right-0 z-[300] h-screen w-full sm:w-[560px] md:w-[660px] bg-card border-l border-border/60 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* ═══ Header ═══ */}
            <div className="p-5 border-b border-border/40 space-y-3 shrink-0 bg-muted/20">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                      {payment.id}
                    </span>
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-lg border font-heading text-[10px] font-extrabold uppercase",
                        payment.status === "Settled" || payment.status === "Paid"
                          ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                          : payment.status === "Pending" || payment.status === "Settlement Pending"
                          ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
                          : "bg-destructive/10 text-destructive border-destructive/20"
                      )}
                    >
                      {payment.status}
                    </span>
                  </div>
                  <h2 className="font-heading text-lg font-extrabold text-foreground truncate">
                    ₹{payment.amount.toLocaleString()} ({payment.paymentMethod})
                  </h2>
                  <p className="font-body text-xs text-muted-foreground truncate">
                    Booking: {payment.bookingId} • Property: {payment.propertyTitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close payment details"
                  className="p-2 rounded-xl text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sub-bar */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <span className="font-body text-[11px] text-muted-foreground font-semibold">Gateway:</span>
                  <span className="font-heading font-bold text-foreground">{payment.gateway}</span>
                </div>
                <div className="font-body text-xs text-muted-foreground">
                  Commission: <strong className="text-primary font-heading">₹{payment.platformFee.toLocaleString()}</strong> (5%)
                </div>
              </div>
            </div>

            {/* ═══ Scrollable Tabs ═══ */}
            <div className="border-b border-border/40 bg-card px-4 shrink-0 overflow-x-auto scrollbar-none flex items-center gap-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-3 font-heading text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer outline-none select-none",
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ═══ Tab Contents ═══ */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin">
              {/* Tab 1: Overview */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Gross Amount</span>
                      <span className="font-heading text-base font-extrabold text-primary">₹{payment.amount.toLocaleString()}</span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Platform Fee</span>
                      <span className="font-heading text-base font-extrabold text-foreground">₹{payment.platformFee.toLocaleString()}</span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Owner Earnings</span>
                      <span className="font-heading text-base font-extrabold text-emerald-600">₹{payment.ownerEarnings.toLocaleString()}</span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Payment Method</span>
                      <span className="font-heading text-xs font-bold text-foreground">{payment.paymentMethod}</span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Gateway</span>
                      <span className="font-heading text-xs font-bold text-foreground">{payment.gateway}</span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Created Date</span>
                      <span className="font-heading text-xs font-bold text-foreground">{payment.createdAt.substring(0, 10)}</span>
                    </div>
                  </div>

                  {payment.refundDetails && (
                    <div className="p-4 bg-destructive/10 rounded-xl border border-destructive/20 space-y-2">
                      <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-destructive flex items-center gap-1.5">
                        <RotateCcw className="w-4 h-4" /> Refund Center Summary
                      </h3>
                      <div className="space-y-1 text-xs font-body">
                        <div>Refund ID: <strong className="font-heading">{payment.refundDetails.refundId}</strong></div>
                        <div>Amount: <strong className="font-heading text-destructive">₹{payment.refundDetails.refundAmount.toLocaleString()}</strong></div>
                        <div>Reason: <strong className="font-heading">{payment.refundDetails.reason}</strong></div>
                        <div>Status: <strong className="font-heading text-emerald-700">{payment.refundDetails.status}</strong></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Booking */}
              {activeTab === "booking" && (
                <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/40">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Associated Booking Info
                  </h3>
                  <div className="space-y-2 text-xs font-body text-foreground">
                    <div>Booking ID: <strong className="font-heading text-primary">{payment.bookingId}</strong></div>
                    <div>Property: <strong className="font-heading">{payment.propertyTitle}</strong></div>
                    <div>Location: <strong className="font-heading">{payment.city}</strong></div>
                  </div>
                </div>
              )}

              {/* Tab 3: Buyer */}
              {activeTab === "buyer" && (
                <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/40">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Student / Buyer Entity
                  </h3>
                  <div className="space-y-1.5 text-xs font-body text-foreground">
                    <div>Name: <strong className="font-heading">{payment.buyerName}</strong></div>
                    <div>Email: <strong className="font-heading">{payment.buyerEmail}</strong></div>
                    <div>Phone: <strong className="font-heading">{payment.buyerPhone}</strong></div>
                  </div>
                </div>
              )}

              {/* Tab 4: Owner */}
              {activeTab === "owner" && (
                <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/40">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Property Owner & Bank Account
                  </h3>
                  <div className="space-y-1.5 text-xs font-body text-foreground">
                    <div>Owner Name: <strong className="font-heading">{payment.ownerName}</strong></div>
                    <div>Phone: <strong className="font-heading">{payment.ownerPhone}</strong></div>
                    <div>Bank Account: <strong className="font-heading text-primary">{payment.bankAccount}</strong></div>
                  </div>
                </div>
              )}

              {/* Tab 5: Gateway */}
              {activeTab === "gateway" && (
                <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/40">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Gateway & Reference Logs
                  </h3>
                  <div className="space-y-1.5 text-xs font-body text-foreground">
                    <div>Gateway Partner: <strong className="font-heading">{payment.gateway}</strong></div>
                    <div>Gateway Ref ID: <strong className="font-heading font-mono text-primary">{payment.gatewayRef}</strong></div>
                    <div>Method: <strong className="font-heading">{payment.paymentMethod}</strong></div>
                  </div>
                </div>
              )}

              {/* Tab 6: Settlement */}
              {activeTab === "settlement" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Settlement Status & Bank Details
                  </h3>
                  <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-2 text-xs font-body">
                    <div className="flex justify-between"><span>Settlement ID:</span><strong className="font-heading">{payment.settlementDetails.settlementId}</strong></div>
                    <div className="flex justify-between"><span>Bank Name:</span><strong className="font-heading">{payment.settlementDetails.bankName}</strong></div>
                    <div className="flex justify-between"><span>Account Number:</span><strong className="font-heading">{payment.settlementDetails.accountNo}</strong></div>
                    <div className="flex justify-between"><span>IFSC Code:</span><strong className="font-heading">{payment.settlementDetails.ifscCode}</strong></div>
                    <div className="flex justify-between"><span>Status:</span><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 font-heading font-extrabold uppercase text-[10px]">{payment.settlementDetails.settlementStatus}</span></div>
                    {payment.settlementDetails.settlementDate && (
                      <div className="flex justify-between"><span>Settled Date:</span><strong className="font-heading">{payment.settlementDetails.settlementDate}</strong></div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 7: Timeline */}
              {activeTab === "timeline" && (
                <div className="space-y-4 relative pl-4 border-l-2 border-primary/20 ml-2">
                  {payment.timeline.map((event, idx) => (
                    <div key={idx} className="relative space-y-1">
                      <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-card" />
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-heading text-xs font-extrabold text-primary">{event.event}</span>
                        <span className="font-body text-[10px] text-muted-foreground">{event.date}</span>
                      </div>
                      <p className="font-body text-xs text-foreground/90">{event.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 8: Documents */}
              {activeTab === "documents" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Invoices & Receipts ({payment.documents.length})
                  </h3>
                  {payment.documents.map((doc) => (
                    <div key={doc.id} className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-heading font-bold text-foreground block">{doc.title}</span>
                        <span className="font-body text-[10px] text-muted-foreground">{doc.type}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast.info(`Downloading ${doc.title}`)}
                        className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {payment.documents.length === 0 && <p className="font-body text-xs text-muted-foreground italic">No attached documents.</p>}
                </div>
              )}

              {/* Tab 9: Internal Notes */}
              {activeTab === "notes" && (
                <div className="space-y-4">
                  <form onSubmit={handleAddNote} className="space-y-2">
                    <textarea
                      rows={3}
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add confidential finance note..."
                      className="w-full p-3 rounded-xl border border-border/60 bg-muted/20 text-xs font-body text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                    <button
                      type="submit"
                      disabled={!newNote.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-heading text-xs font-bold disabled:opacity-50 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> Add Note
                    </button>
                  </form>

                  <div className="space-y-3 pt-2">
                    <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Finance Audit Notes ({notes.length})
                    </h3>
                    {notes.map((n) => (
                      <div key={n.id} className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-amber-700">{n.author}</span>
                          <span className="font-body text-[10px] text-muted-foreground">{n.date}</span>
                        </div>
                        <p className="font-body text-xs text-foreground/90">{n.note}</p>
                      </div>
                    ))}
                    {notes.length === 0 && <p className="font-body text-xs text-muted-foreground italic">No finance notes.</p>}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
