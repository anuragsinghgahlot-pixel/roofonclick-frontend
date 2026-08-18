"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  CalendarCheck,
  Heart,
  Eye,
  Bookmark,
  Star,
  CreditCard,
  HeadphonesIcon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import type { AdminBuyer } from "@/services/admin-buyers";
import { StatusBadge } from "@/components/admin/data-table";

type TabId =
  | "overview"
  | "bookings"
  | "wishlist"
  | "recentlyViewed"
  | "savedSearches"
  | "reviews"
  | "payments"
  | "support"
  | "timeline";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: User },
  { id: "bookings", label: "Bookings", icon: CalendarCheck },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "recentlyViewed", label: "Recently Viewed", icon: Eye },
  { id: "savedSearches", label: "Saved Searches", icon: Bookmark },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "support", label: "Support", icon: HeadphonesIcon },
  { id: "timeline", label: "Timeline", icon: Clock },
];

export function BuyerProfileDrawer({
  buyer,
  isOpen,
  onClose,
  onVerify,
  onBlock,
  onUnblock,
}: {
  buyer: AdminBuyer | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify?: (buyer: AdminBuyer) => void;
  onBlock?: (buyer: AdminBuyer) => void;
  onUnblock?: (buyer: AdminBuyer) => void;
}) {
  const [activeTab, setActiveTab] = React.useState<TabId>("overview");

  React.useEffect(() => {
    if (isOpen) setActiveTab("overview");
  }, [isOpen, buyer]);

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

  if (!buyer) return null;

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
            aria-label={`Buyer Profile: ${buyer.name}`}
            className="fixed top-0 right-0 z-[300] h-screen w-full sm:w-[560px] md:w-[660px] bg-card border-l border-border/60 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* ═══ Header ═══ */}
            <div className="p-5 border-b border-border/40 space-y-4 shrink-0 bg-muted/20">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-border/60 shrink-0 bg-muted">
                    {/* eslint-disable-next-html-link, @next/next/no-img-element */}
                    <img
                      src={buyer.avatar}
                      alt={buyer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-heading text-lg font-extrabold text-foreground truncate">
                        {buyer.name}
                      </h2>
                      <StatusBadge status={buyer.accountStatus} />
                    </div>
                    <p className="font-body text-xs text-muted-foreground truncate">
                      {buyer.email} • {buyer.phone}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close buyer profile"
                  className="p-2 rounded-xl text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sub-bar */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <span className="font-body text-[11px] text-muted-foreground font-semibold">Verification:</span>
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-lg border font-heading text-[10px] font-extrabold uppercase",
                      buyer.verificationStatus === "verified"
                        ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                        : buyer.verificationStatus === "pending"
                        ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
                        : "bg-muted/60 text-muted-foreground border-border/60"
                    )}
                  >
                    {buyer.verificationStatus}
                  </span>
                </div>
                <div className="font-body text-xs text-muted-foreground">
                  Lifetime Value: <strong className="text-primary font-heading">₹{buyer.lifetimeValue.toLocaleString()}</strong>
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
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Total Spend</span>
                      <span className="font-heading text-base font-extrabold text-primary">₹{buyer.lifetimeValue.toLocaleString()}</span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Bookings</span>
                      <span className="font-heading text-base font-extrabold text-foreground">{buyer.bookingsCount}</span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Wishlist</span>
                      <span className="font-heading text-base font-extrabold text-foreground">{buyer.wishlistCount} Saved</span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Institution</span>
                      <span className="font-heading text-xs font-bold text-foreground">{buyer.institutionOrCompany}</span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">City</span>
                      <span className="font-heading text-xs font-bold text-foreground">{buyer.city}</span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Last Active</span>
                      <span className="font-heading text-xs font-bold text-foreground">{buyer.lastActive}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/20 rounded-xl border border-border/40 space-y-2">
                    <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Contact Info & Identification
                    </h3>
                    <div className="space-y-1.5 text-xs font-body text-foreground/90">
                      <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-primary" /> {buyer.phone}</div>
                      <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-primary" /> {buyer.email}</div>
                      <div className="flex items-center gap-2"><GraduationCap className="w-3.5 h-3.5 text-primary" /> {buyer.institutionOrCompany}</div>
                      <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary" /> {buyer.city}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Bookings */}
              {activeTab === "bookings" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Booking History ({buyer.bookings.length})
                  </h3>
                  {buyer.bookings.map((b) => (
                    <div key={b.id} className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-xs font-bold text-foreground">{b.propertyTitle} ({b.id})</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 font-heading font-extrabold text-[10px] uppercase">
                          {b.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[11px] font-body text-muted-foreground pt-1 border-t border-border/40">
                        <div>Room: <strong className="text-foreground font-heading">{b.roomType}</strong></div>
                        <div>Move-in: <strong className="text-foreground font-heading">{b.moveInDate}</strong></div>
                        <div>Rent: <strong className="text-primary font-heading">₹{b.rent.toLocaleString()}/mo</strong></div>
                      </div>
                    </div>
                  ))}
                  {buyer.bookings.length === 0 && <p className="font-body text-xs text-muted-foreground italic">No booking records found.</p>}
                </div>
              )}

              {/* Tab 3: Wishlist */}
              {activeTab === "wishlist" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Saved Properties ({buyer.wishlist.length})
                  </h3>
                  {buyer.wishlist.map((item, i) => (
                    <div key={i} className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-heading font-bold text-foreground block">{item.title}</span>
                        <span className="font-body text-[10px] text-muted-foreground">Saved on: {item.addedDate}</span>
                      </div>
                      <span className="font-heading font-extrabold text-primary">₹{item.rent.toLocaleString()}/mo</span>
                    </div>
                  ))}
                  {buyer.wishlist.length === 0 && <p className="font-body text-xs text-muted-foreground italic">Wishlist is empty.</p>}
                </div>
              )}

              {/* Tab 4: Recently Viewed */}
              {activeTab === "recentlyViewed" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Browsing History ({buyer.recentlyViewed.length})
                  </h3>
                  {buyer.recentlyViewed.map((rv, i) => (
                    <div key={i} className="p-3 rounded-xl border border-border/40 bg-muted/20 flex items-center justify-between text-xs">
                      <span className="font-heading font-bold text-foreground">{rv.title}</span>
                      <span className="font-body text-[10px] text-muted-foreground">{rv.viewedAt}</span>
                    </div>
                  ))}
                  {buyer.recentlyViewed.length === 0 && <p className="font-body text-xs text-muted-foreground italic">No browsing history.</p>}
                </div>
              )}

              {/* Tab 5: Saved Searches */}
              {activeTab === "savedSearches" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Saved Search Alerts ({buyer.savedSearches.length})
                  </h3>
                  {buyer.savedSearches.map((ss) => (
                    <div key={ss.id} className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-1 text-xs">
                      <span className="font-heading font-bold text-foreground block">{ss.name}</span>
                      <span className="font-body text-[11px] text-muted-foreground block">{ss.filtersUsed}</span>
                      <span className="font-body text-[10px] text-muted-foreground/70 block">Created: {ss.createdDate}</span>
                    </div>
                  ))}
                  {buyer.savedSearches.length === 0 && <p className="font-body text-xs text-muted-foreground italic">No saved searches.</p>}
                </div>
              )}

              {/* Tab 6: Reviews */}
              {activeTab === "reviews" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Submitted Reviews ({buyer.reviews.length})
                  </h3>
                  {buyer.reviews.map((r) => (
                    <div key={r.id} className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-foreground">{r.propertyTitle}</span>
                        <span className="font-heading font-bold text-amber-600 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {r.rating}
                        </span>
                      </div>
                      <p className="font-body text-xs text-foreground/90">&quot;{r.comment}&quot;</p>
                      {r.isReported && (
                        <span className="inline-flex items-center gap-1 font-heading text-[10px] font-bold text-destructive">
                          <AlertTriangle className="w-3 h-3" /> Reported for review
                        </span>
                      )}
                    </div>
                  ))}
                  {buyer.reviews.length === 0 && <p className="font-body text-xs text-muted-foreground italic">No reviews written.</p>}
                </div>
              )}

              {/* Tab 7: Payments */}
              {activeTab === "payments" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Payments & Invoices ({buyer.payments.length})
                  </h3>
                  {buyer.payments.map((p) => (
                    <div key={p.id} className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-heading font-bold text-foreground block">{p.type} ({p.invoiceNo})</span>
                        <span className="font-body text-[10px] text-muted-foreground">Paid on: {p.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-heading font-extrabold text-primary block">₹{p.amount.toLocaleString()}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 font-heading font-extrabold text-[9px] uppercase">{p.status}</span>
                      </div>
                    </div>
                  ))}
                  {buyer.payments.length === 0 && <p className="font-body text-xs text-muted-foreground italic">No payment transactions.</p>}
                </div>
              )}

              {/* Tab 8: Support */}
              {activeTab === "support" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Support Requests ({buyer.supportTickets.length})
                  </h3>
                  {buyer.supportTickets.map((t) => (
                    <div key={t.id} className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-heading font-bold text-foreground block">{t.subject} ({t.id})</span>
                        <span className="font-body text-[10px] text-muted-foreground">Channel: {t.channel} • {t.date}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-heading font-extrabold text-[10px] uppercase">{t.status}</span>
                    </div>
                  ))}
                  {buyer.supportTickets.length === 0 && <p className="font-body text-xs text-muted-foreground italic">No support tickets found.</p>}
                </div>
              )}

              {/* Tab 9: Timeline */}
              {activeTab === "timeline" && (
                <div className="space-y-4 relative pl-4 border-l-2 border-primary/20 ml-2">
                  {buyer.timeline.map((event, idx) => (
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
                  Status: <strong className="text-foreground uppercase">{buyer.accountStatus}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {onBlock && buyer.accountStatus !== "blocked" && (
                  <button
                    type="button"
                    onClick={() => onBlock(buyer)}
                    className="px-3.5 py-2 rounded-xl bg-destructive/15 hover:bg-destructive/25 active:scale-95 text-destructive text-xs font-heading font-bold transition-all cursor-pointer"
                  >
                    Block Resident
                  </button>
                )}
                {onUnblock && buyer.accountStatus === "blocked" && (
                  <button
                    type="button"
                    onClick={() => onUnblock(buyer)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 active:scale-95 text-emerald-700 dark:text-emerald-400 text-xs font-heading font-bold transition-all cursor-pointer"
                  >
                    Unblock Account
                  </button>
                )}
                {onVerify && buyer.verificationStatus !== "verified" && (
                  <button
                    type="button"
                    onClick={() => onVerify(buyer)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-heading font-extrabold shadow-sm transition-all cursor-pointer"
                  >
                    Verify Resident ID
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
