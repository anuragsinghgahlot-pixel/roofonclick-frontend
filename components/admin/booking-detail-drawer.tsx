"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  X,
  CalendarCheck,
  User,
  Building,
  CreditCard,
  Clock,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  Plus,
  Send,
  Sparkles,
  Download,
  AlertTriangle,
} from "lucide-react";
import type { AdminBooking } from "@/services/admin-bookings";
import { StatusBadge } from "@/components/admin/data-table";

type TabId =
  | "overview"
  | "buyer"
  | "owner"
  | "property"
  | "payment"
  | "timeline"
  | "documents"
  | "notes";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: CalendarCheck },
  { id: "buyer", label: "Buyer", icon: User },
  { id: "owner", label: "Owner", icon: User },
  { id: "property", label: "Property", icon: Building },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "notes", label: "Internal Notes", icon: MessageSquare },
];

export function BookingDetailDrawer({
  booking,
  isOpen,
  onClose,
}: {
  booking: AdminBooking | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = React.useState<TabId>("overview");
  const [notes, setNotes] = React.useState<{ id: string; author: string; note: string; date: string }[]>([]);
  const [newNote, setNewNote] = React.useState("");

  React.useEffect(() => {
    if (booking) {
      setNotes(booking.internalNotes);
      setActiveTab("overview");
    }
  }, [booking]);

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

  if (!booking) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const item = {
      id: `N-${Date.now()}`,
      author: "Super Admin",
      note: newNote.trim(),
      date: new Date().toLocaleString(),
    };
    setNotes((prev) => [item, ...prev]);
    setNewNote("");
    toast.success("Internal note added.");
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
            aria-label={`Booking Details: ${booking.id}`}
            className="fixed top-0 right-0 z-[300] h-screen w-full sm:w-[560px] md:w-[660px] bg-card border-l border-border/60 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* ═══ Header ═══ */}
            <div className="p-5 border-b border-border/40 space-y-3 shrink-0 bg-muted/20">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                      {booking.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg border font-heading text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                      {booking.bookingStatus}
                    </span>
                  </div>
                  <h2 className="font-heading text-base font-extrabold text-foreground truncate">
                    {booking.propertyTitle}
                  </h2>
                  <p className="font-body text-xs text-muted-foreground truncate">
                    Buyer: {booking.buyerName} • Move-in: {booking.moveInDate}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close booking details"
                  className="p-2 rounded-xl text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sub-bar */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <span className="font-body text-[11px] text-muted-foreground font-semibold">Payment:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 font-heading font-extrabold text-[10px] uppercase">
                    {booking.paymentStatus}
                  </span>
                </div>
                <div className="font-body text-xs text-muted-foreground">
                  Total Paid: <strong className="text-primary font-heading">₹{booking.totalAmount.toLocaleString()}</strong>
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
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Monthly Rent</span>
                      <span className="font-heading text-base font-extrabold text-primary">₹{booking.monthlyRent.toLocaleString()}</span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Security Deposit</span>
                      <span className="font-heading text-base font-extrabold text-foreground">₹{booking.securityDeposit.toLocaleString()}</span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Platform Fee</span>
                      <span className="font-heading text-base font-extrabold text-foreground">₹{booking.platformFee.toLocaleString()}</span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Room Type</span>
                      <span className="font-heading text-xs font-bold text-foreground">{booking.roomType}</span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Move-in Date</span>
                      <span className="font-heading text-xs font-bold text-foreground">{booking.moveInDate}</span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Created</span>
                      <span className="font-heading text-xs font-bold text-foreground">{booking.createdAt.substring(0, 10)}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/20 rounded-xl border border-border/40 space-y-2">
                    <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Key Contact Entities
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <span className="font-heading font-bold text-foreground block">Student / Buyer</span>
                        <span className="font-body text-muted-foreground block">{booking.buyerName} ({booking.buyerPhone})</span>
                      </div>
                      <div className="space-y-1">
                        <span className="font-heading font-bold text-foreground block">Property Owner</span>
                        <span className="font-body text-muted-foreground block">{booking.ownerName} ({booking.ownerPhone})</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Buyer */}
              {activeTab === "buyer" && (
                <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/40">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Buyer Profile Details
                  </h3>
                  <div className="space-y-2 text-xs font-body text-foreground">
                    <div>Name: <strong className="font-heading">{booking.buyerName}</strong></div>
                    <div>Phone: <strong className="font-heading">{booking.buyerPhone}</strong></div>
                    <div>Email: <strong className="font-heading">{booking.buyerEmail}</strong></div>
                    <div>Institution: <strong className="font-heading">{booking.buyerInstitution}</strong></div>
                  </div>
                </div>
              )}

              {/* Tab 3: Owner */}
              {activeTab === "owner" && (
                <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/40">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Property Owner Details
                  </h3>
                  <div className="space-y-2 text-xs font-body text-foreground">
                    <div>Owner Name: <strong className="font-heading">{booking.ownerName}</strong></div>
                    <div>Phone: <strong className="font-heading">{booking.ownerPhone}</strong></div>
                    <div>Email: <strong className="font-heading">{booking.ownerEmail}</strong></div>
                  </div>
                </div>
              )}

              {/* Tab 4: Property */}
              {activeTab === "property" && (
                <div className="space-y-3">
                  <div className="rounded-xl overflow-hidden border border-border/60 aspect-video">
                    {/* eslint-disable-next-html-link, @next/next/no-img-element */}
                    <img src={booking.propertyPhoto} alt={booking.propertyTitle} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <h4 className="font-heading font-bold text-foreground">{booking.propertyTitle}</h4>
                    <p className="font-body text-muted-foreground">{booking.propertyAddress}, {booking.city}</p>
                  </div>
                </div>
              )}

              {/* Tab 5: Payment */}
              {activeTab === "payment" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Payment Breakdown & Invoices
                  </h3>
                  <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3 text-xs">
                    <div className="flex justify-between"><span>Monthly Rent:</span><strong className="font-heading">₹{booking.paymentDetails.rentPaid.toLocaleString()}</strong></div>
                    <div className="flex justify-between"><span>Security Deposit:</span><strong className="font-heading">₹{booking.paymentDetails.depositPaid.toLocaleString()}</strong></div>
                    <div className="flex justify-between"><span>Platform Convenience Fee:</span><strong className="font-heading">₹{booking.paymentDetails.feePaid.toLocaleString()}</strong></div>
                    <div className="pt-2 border-t border-border/40 flex justify-between font-heading font-extrabold text-sm text-primary">
                      <span>Total Paid:</span>
                      <span>₹{booking.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/20 rounded-xl border border-border/40 space-y-1 text-xs">
                    <div>Invoice No: <strong className="font-heading text-foreground">{booking.paymentDetails.invoiceNo}</strong></div>
                    <div>Receipt No: <strong className="font-heading text-foreground">{booking.paymentDetails.receiptNo}</strong></div>
                    {booking.paymentDetails.refundStatus && (
                      <div>Refund Status: <strong className="font-heading text-destructive">{booking.paymentDetails.refundStatus}</strong></div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 6: Timeline */}
              {activeTab === "timeline" && (
                <div className="space-y-4 relative pl-4 border-l-2 border-primary/20 ml-2">
                  {booking.timeline.map((event, idx) => (
                    <div key={idx} className="relative space-y-1">
                      <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-card" />
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-heading text-xs font-extrabold text-primary">{event.event}</span>
                        <span className="font-body text-[10px] text-muted-foreground">{event.date}</span>
                      </div>
                      <p className="font-body text-xs text-foreground/90">{event.description}</p>
                      <span className="font-body text-[10px] text-muted-foreground/70 block">By: {event.by}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 7: Documents */}
              {activeTab === "documents" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Booking Documents ({booking.documents.length})
                  </h3>
                  {booking.documents.map((doc) => (
                    <div key={doc.id} className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-heading font-bold text-foreground block">{doc.title}</span>
                        <span className="font-body text-[10px] text-muted-foreground">{doc.type} • Uploaded: {doc.uploadedAt}</span>
                      </div>
                      <button type="button" onClick={() => toast.info(`Downloading ${doc.title}`)} className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors cursor-pointer">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {booking.documents.length === 0 && <p className="font-body text-xs text-muted-foreground italic">No attached documents.</p>}
                </div>
              )}

              {/* Tab 8: Internal Notes */}
              {activeTab === "notes" && (
                <div className="space-y-4">
                  <form onSubmit={handleAddNote} className="space-y-2">
                    <textarea
                      rows={3}
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add private ops note (visible to admins only)..."
                      className="w-full p-3 rounded-xl border border-border/60 bg-muted/20 text-xs font-body text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                    <button
                      type="submit"
                      disabled={!newNote.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-heading text-xs font-bold disabled:opacity-50 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> Add Private Note
                    </button>
                  </form>

                  <div className="space-y-3 pt-2">
                    <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Previous Notes ({notes.length})
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
                    {notes.length === 0 && <p className="font-body text-xs text-muted-foreground italic">No internal notes added yet.</p>}
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
