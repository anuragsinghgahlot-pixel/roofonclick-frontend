"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  CalendarCheck,
  CreditCard,
  Star,
  FileCheck,
  HeadphonesIcon,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  IndianRupee,
  ExternalLink,
  Plus,
} from "lucide-react";
import type { AdminOwner, AdminOwnerKycDoc } from "@/services/admin-owners";
import { StatusBadge } from "@/components/admin/data-table";

type TabId =
  | "overview"
  | "properties"
  | "bookings"
  | "payments"
  | "reviews"
  | "documents"
  | "support"
  | "timeline";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: User },
  { id: "properties", label: "Properties", icon: Building },
  { id: "bookings", label: "Bookings", icon: CalendarCheck },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "documents", label: "KYC Docs", icon: FileCheck },
  { id: "support", label: "Support", icon: HeadphonesIcon },
  { id: "timeline", label: "Timeline", icon: Clock },
];

export function OwnerProfileDrawer({
  owner,
  isOpen,
  onClose,
  onApproveKyc,
  onSuspend,
  onActivate,
  onUpdateKycStatus,
}: {
  owner: AdminOwner | null;
  isOpen: boolean;
  onClose: () => void;
  onApproveKyc?: (owner: AdminOwner) => void;
  onSuspend?: (owner: AdminOwner) => void;
  onActivate?: (owner: AdminOwner) => void;
  onUpdateKycStatus?: (ownerId: string, docId: string, status: "verified" | "rejected") => void;
}) {
  const [activeTab, setActiveTab] = React.useState<TabId>("overview");
  const [docList, setDocList] = React.useState<AdminOwnerKycDoc[]>([]);

  React.useEffect(() => {
    if (owner) {
      setDocList(owner.documents);
      setActiveTab("overview");
    }
  }, [owner]);

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

  if (!owner) return null;

  const handleDocAction = (docId: string, newStatus: "verified" | "rejected") => {
    setDocList((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status: newStatus } : d))
    );
    if (onUpdateKycStatus) onUpdateKycStatus(owner.id, docId, newStatus);
    toast.success(`Document ${docId} ${newStatus === "verified" ? "Approved" : "Rejected"}`);
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
            aria-label={`Owner Profile: ${owner.name}`}
            className="fixed top-0 right-0 z-[300] h-screen w-full sm:w-[560px] md:w-[660px] bg-card border-l border-border/60 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* ═══ Header ═══ */}
            <div className="p-5 border-b border-border/40 space-y-4 shrink-0 bg-muted/20">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-border/60 shrink-0 bg-muted">
                    {/* eslint-disable-next-html-link, @next/next/no-img-element */}
                    <img
                      src={owner.avatar}
                      alt={owner.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-heading text-lg font-extrabold text-foreground truncate">
                        {owner.name}
                      </h2>
                      <StatusBadge status={owner.accountStatus} />
                    </div>
                    <p className="font-body text-xs text-muted-foreground truncate">
                      {owner.email} • {owner.phone}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close owner profile"
                  className="p-2 rounded-xl text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sub-bar */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <span className="font-body text-[11px] text-muted-foreground font-semibold">KYC:</span>
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-lg border font-heading text-[10px] font-extrabold uppercase",
                      owner.kycStatus === "verified"
                        ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                        : owner.kycStatus === "pending"
                        ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    )}
                  >
                    {owner.kycStatus}
                  </span>
                </div>
                <span className="font-heading text-xs font-bold text-primary">
                  {owner.subscriptionPlan}
                </span>
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
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Total Revenue</span>
                      <span className="font-heading text-base font-extrabold text-primary">₹{owner.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Listings</span>
                      <span className="font-heading text-base font-extrabold text-foreground">{owner.propertiesCount} Properties</span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Occupancy</span>
                      <span className="font-heading text-base font-extrabold text-primary">{owner.occupancyRate}%</span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Avg Rating</span>
                      <span className="font-heading text-base font-extrabold text-amber-600 flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {owner.avgRating}
                      </span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">City</span>
                      <span className="font-heading text-xs font-bold text-foreground">{owner.city}</span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Joined</span>
                      <span className="font-heading text-xs font-bold text-foreground">{owner.joinedDate}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/20 rounded-xl border border-border/40 space-y-2">
                    <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Contact Information
                    </h3>
                    <div className="space-y-1.5 text-xs font-body text-foreground/90">
                      <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-primary" /> {owner.phone}</div>
                      <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-primary" /> {owner.email}</div>
                      <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary" /> {owner.address}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Properties */}
              {activeTab === "properties" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Owner Properties ({owner.properties.length})
                  </h3>
                  {owner.properties.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <h4 className="font-heading text-xs font-bold text-foreground truncate">{p.title}</h4>
                        <span className="font-body text-[10px] text-muted-foreground block">
                          ID: {p.id} • {p.type} • Occupancy: <strong className="text-primary">{p.occupancy}%</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-heading text-xs font-extrabold text-primary">₹{p.rent.toLocaleString()}/mo</span>
                        <StatusBadge status={p.status as any} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Bookings */}
              {activeTab === "bookings" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Booking History ({owner.bookings.length})
                  </h3>
                  {owner.bookings.map((b) => (
                    <div key={b.id} className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-heading font-bold text-foreground block">{b.guestName} ({b.id})</span>
                        <span className="font-body text-[10px] text-muted-foreground">{b.propertyTitle} • Move-in: {b.moveInDate}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 font-heading font-extrabold text-[10px] uppercase">
                        {b.status}
                      </span>
                    </div>
                  ))}
                  {owner.bookings.length === 0 && <p className="font-body text-xs text-muted-foreground italic">No booking history.</p>}
                </div>
              )}

              {/* Tab 4: Payments */}
              {activeTab === "payments" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Earnings & Payout Settlements
                  </h3>
                  {owner.payments.map((pay) => (
                    <div key={pay.id} className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-xs font-bold text-foreground">{pay.type} ({pay.id})</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 font-heading font-extrabold text-[10px] uppercase">
                          {pay.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[11px] font-body text-muted-foreground pt-1 border-t border-border/40">
                        <div>Gross: <strong className="text-foreground font-heading">₹{pay.amount.toLocaleString()}</strong></div>
                        <div>Commission: <strong className="text-destructive font-heading">₹{pay.commission.toLocaleString()}</strong></div>
                        <div>Net Payout: <strong className="text-emerald-600 font-heading">₹{pay.netPayout.toLocaleString()}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 5: Reviews */}
              {activeTab === "reviews" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Property Reviews
                  </h3>
                  {owner.reviews.map((r) => (
                    <div key={r.id} className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-foreground">{r.reviewerName} on {r.propertyTitle}</span>
                        <span className="font-heading font-bold text-amber-600 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {r.rating}
                        </span>
                      </div>
                      <p className="font-body text-xs text-foreground/90">&quot;{r.comment}&quot;</p>
                      {r.ownerReply && (
                        <div className="pl-3 border-l-2 border-primary/40 text-[11px] font-body text-muted-foreground pt-1">
                          Owner Reply: &quot;{r.ownerReply}&quot;
                        </div>
                      )}
                    </div>
                  ))}
                  {owner.reviews.length === 0 && <p className="font-body text-xs text-muted-foreground italic">No reviews yet.</p>}
                </div>
              )}

              {/* Tab 6: KYC Documents */}
              {activeTab === "documents" && (
                <div className="space-y-4">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Uploaded Verification Documents ({docList.length})
                  </h3>
                  {docList.map((doc) => (
                    <div key={doc.id} className="p-4 rounded-xl border border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading text-xs font-bold text-foreground">{doc.type}</h4>
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[9px] font-heading font-extrabold uppercase border",
                              doc.status === "verified"
                                ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                                : doc.status === "pending"
                                ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
                                : "bg-destructive/10 text-destructive border-destructive/20"
                            )}
                          >
                            {doc.status}
                          </span>
                        </div>
                        <span className="font-body text-[11px] text-muted-foreground block">
                          Doc #: {doc.docNumber} • Submitted: {doc.submittedAt}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {doc.status !== "verified" && (
                          <button
                            type="button"
                            onClick={() => handleDocAction(doc.id, "verified")}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-heading text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                        )}
                        {doc.status !== "rejected" && (
                          <button
                            type="button"
                            onClick={() => handleDocAction(doc.id, "rejected")}
                            className="px-3 py-1.5 rounded-lg border border-destructive/40 text-destructive hover:bg-destructive/10 font-heading text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {docList.length === 0 && <p className="font-body text-xs text-muted-foreground italic">No KYC documents uploaded.</p>}
                </div>
              )}

              {/* Tab 7: Support History */}
              {activeTab === "support" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Support Interactions
                  </h3>
                  {owner.supportTickets.map((t) => (
                    <div key={t.id} className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-heading font-bold text-foreground block">{t.subject} ({t.id})</span>
                        <span className="font-body text-[10px] text-muted-foreground">Channel: {t.channel} • Priority: {t.priority} • {t.date}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-heading font-extrabold text-[10px] uppercase">{t.status}</span>
                    </div>
                  ))}
                  {owner.supportTickets.length === 0 && <p className="font-body text-xs text-muted-foreground italic">No support tickets found.</p>}
                </div>
              )}

              {/* Tab 8: Timeline */}
              {activeTab === "timeline" && (
                <div className="space-y-4 relative pl-4 border-l-2 border-primary/20 ml-2">
                  {owner.timeline.map((event, idx) => (
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
            </div>

            {/* ═══ Action Footer ═══ */}
            <div className="p-4 border-t border-border/60 bg-muted/20 shrink-0 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-[11px] font-bold text-muted-foreground">
                  Status: <strong className="text-foreground uppercase">{owner.accountStatus}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {onSuspend && owner.accountStatus === "active" && (
                  <button
                    type="button"
                    onClick={() => onSuspend(owner)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 active:scale-95 text-amber-700 dark:text-amber-400 text-xs font-heading font-bold transition-all cursor-pointer"
                  >
                    Suspend Owner
                  </button>
                )}
                {onActivate && (owner.accountStatus === "suspended" || owner.accountStatus === "inactive" || owner.accountStatus === "blocked") && (
                  <button
                    type="button"
                    onClick={() => onActivate(owner)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 active:scale-95 text-emerald-700 dark:text-emerald-400 text-xs font-heading font-bold transition-all cursor-pointer"
                  >
                    Reactivate Account
                  </button>
                )}
                {onApproveKyc && owner.kycStatus !== "verified" && (
                  <button
                    type="button"
                    onClick={() => onApproveKyc(owner)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-heading font-extrabold shadow-sm transition-all cursor-pointer"
                  >
                    Approve KYC
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
