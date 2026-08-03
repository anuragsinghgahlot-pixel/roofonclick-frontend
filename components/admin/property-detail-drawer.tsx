"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  X,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Star,
  Bed,
  CalendarCheck,
  CreditCard,
  Camera,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import type { AdminProperty } from "@/services/admin-properties";
import { StatusBadge } from "@/components/admin/data-table";

type TabId =
  | "overview"
  | "rooms"
  | "amenities"
  | "photos"
  | "reviews"
  | "bookings"
  | "payments"
  | "owner"
  | "verification"
  | "timeline";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: Building },
  { id: "rooms", label: "Rooms", icon: Bed },
  { id: "amenities", label: "Amenities", icon: Layers },
  { id: "photos", label: "Photos", icon: Camera },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "bookings", label: "Bookings", icon: CalendarCheck },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "owner", label: "Owner", icon: User },
  { id: "verification", label: "Verification", icon: ShieldCheck },
  { id: "timeline", label: "Timeline", icon: Clock },
];

export function PropertyDetailDrawer({
  property,
  isOpen,
  onClose,
}: {
  property: AdminProperty | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = React.useState<TabId>("overview");

  // Reset tab when property changes
  React.useEffect(() => {
    if (isOpen) setActiveTab("overview");
  }, [isOpen, property]);

  // Body scroll lock & ESC key close
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

  if (!property) return null;

  const healthColor =
    property.healthScore >= 85
      ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
      : property.healthScore >= 70
      ? "text-amber-600 bg-amber-500/10 border-amber-500/20"
      : "text-destructive bg-destructive/10 border-destructive/20";

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
            aria-label={`Property details: ${property.propertyName}`}
            className="fixed top-0 right-0 z-[300] h-screen w-full sm:w-[540px] md:w-[640px] bg-card border-l border-border/60 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* ═══ Header ═══ */}
            <div className="p-5 border-b border-border/40 space-y-3 shrink-0 bg-muted/20">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                      {property.id}
                    </span>
                    <StatusBadge status={property.status} />
                    {property.isFeatured && (
                      <span className="inline-flex items-center gap-1 font-heading text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-secondary/20 text-secondary-foreground">
                        <Sparkles className="w-3 h-3 text-secondary" /> Featured
                      </span>
                    )}
                  </div>
                  <h2 className="font-heading text-lg font-extrabold text-foreground truncate">
                    {property.propertyName}
                  </h2>
                  <p className="font-body text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                    {property.address}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close drawer"
                  className="p-2 rounded-xl text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Health Score Pill */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-body text-[11px] text-muted-foreground font-semibold">Health Score:</span>
                  <span className={cn("px-2.5 py-0.5 rounded-lg border font-heading text-xs font-extrabold", healthColor)}>
                    {property.healthScore}/100 — {property.healthLabel}
                  </span>
                </div>
                <div className="font-body text-xs text-muted-foreground">
                  Rent: <strong className="text-primary font-heading">₹{property.startingRent.toLocaleString()}</strong>/mo
                </div>
              </div>
            </div>

            {/* ═══ Scrollable Tabs Header ═══ */}
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

            {/* ═══ Tab Content Area ═══ */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin">
              {/* Tab 1: Overview */}
              {activeTab === "overview" && (
                <div className="space-y-5">
                  <div className="rounded-2xl overflow-hidden border border-border/60 aspect-video relative">
                    {/* eslint-disable-next-html-link, @next/next/no-img-element */}
                    <img
                      src={property.coverPhoto}
                      alt={property.propertyName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Description
                    </h3>
                    <p className="font-body text-xs text-foreground/90 leading-relaxed bg-muted/20 p-4 rounded-xl border border-border/40">
                      {property.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40 space-y-0.5">
                      <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">Property Type</span>
                      <span className="font-heading text-xs font-bold text-foreground">{property.propertyType}</span>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40 space-y-0.5">
                      <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">Target Gender</span>
                      <span className="font-heading text-xs font-bold text-foreground">{property.gender}</span>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40 space-y-0.5">
                      <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">Occupancy Rate</span>
                      <span className="font-heading text-xs font-bold text-primary">{property.occupancyRate}% ({property.occupiedBeds}/{property.totalBeds} beds)</span>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40 space-y-0.5">
                      <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">Rating</span>
                      <span className="font-heading text-xs font-bold text-amber-600 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {property.rating > 0 ? property.rating : "New"} ({property.reviewCount})
                      </span>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40 space-y-0.5">
                      <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">Area</span>
                      <span className="font-heading text-xs font-bold text-foreground">{property.area}, {property.city}</span>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40 space-y-0.5">
                      <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">Verification</span>
                      <span className="font-heading text-xs font-bold text-emerald-600">
                        {property.isVerified ? "Verified Listing" : "Unverified"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Rooms */}
              {activeTab === "rooms" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Available Configurations ({property.rooms.length})
                  </h3>
                  {property.rooms.map((room, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <h4 className="font-heading text-xs font-bold text-foreground">{room.roomType}</h4>
                        <span className="font-body text-[11px] text-muted-foreground block">
                          Total: {room.total} • Available: <strong className="text-emerald-600">{room.available} left</strong>
                        </span>
                      </div>
                      <span className="font-heading text-sm font-extrabold text-primary shrink-0">
                        ₹{room.rent.toLocaleString()}/mo
                      </span>
                    </div>
                  ))}
                  {property.rooms.length === 0 && (
                    <p className="font-body text-xs text-muted-foreground italic">No room configurations added yet.</p>
                  )}
                </div>
              )}

              {/* Tab 3: Amenities */}
              {activeTab === "amenities" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Included Amenities ({property.amenities.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((am, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl border border-border/60 bg-muted/30 text-xs font-heading font-semibold text-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> {am}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Photos */}
              {activeTab === "photos" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Property Gallery ({property.photos.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {property.photos.map((photo, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-border/60 aspect-video">
                        {/* eslint-disable-next-html-link, @next/next/no-img-element */}
                        <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  {property.photos.length === 0 && (
                    <p className="font-body text-xs text-muted-foreground italic">No gallery photos uploaded.</p>
                  )}
                </div>
              )}

              {/* Tab 5: Reviews */}
              {activeTab === "reviews" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
                    <div>
                      <span className="font-heading text-2xl font-extrabold text-primary block">
                        {property.rating > 0 ? property.rating : "N/A"}
                      </span>
                      <span className="font-body text-xs text-muted-foreground">Overall Rating from {property.reviewCount} reviews</span>
                    </div>
                    <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
                  </div>
                  <p className="font-body text-xs text-muted-foreground">Detailed user review management available in Reviews Module.</p>
                </div>
              )}

              {/* Tab 6: Bookings */}
              {activeTab === "bookings" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent Bookings</h3>
                  <div className="p-3 bg-muted/20 rounded-xl border border-border/40 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-heading font-bold text-foreground block">#ROC-1087 — Anurag S.</span>
                      <span className="font-body text-[10px] text-muted-foreground">Move-in: 05 Aug 2026 • Double Sharing</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 font-heading font-extrabold text-[10px] uppercase">Confirmed</span>
                  </div>
                </div>
              )}

              {/* Tab 7: Payments */}
              {activeTab === "payments" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">Transaction History</h3>
                  <div className="p-3 bg-muted/20 rounded-xl border border-border/40 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-heading font-bold text-foreground block">₹15,000 — Booking Deposit</span>
                      <span className="font-body text-[10px] text-muted-foreground">Txn ID: TXN-88219 • 02 Aug 2026</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 font-heading font-extrabold text-[10px] uppercase">Success</span>
                  </div>
                </div>
              )}

              {/* Tab 8: Owner */}
              {activeTab === "owner" && (
                <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-heading text-sm font-extrabold">
                      {property.ownerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-heading text-sm font-bold text-foreground">{property.ownerName}</h4>
                      <span className="font-body text-xs text-muted-foreground">Property Owner</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-border/40 text-xs font-body">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-3.5 h-3.5 text-primary" /> {property.ownerPhone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-3.5 h-3.5 text-primary" /> {property.ownerEmail}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 9: Verification */}
              {activeTab === "verification" && (
                <div className="space-y-2.5">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">Verification Checklist</h3>
                  {Object.entries(property.verificationDetails).map(([key, isDone]) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/20 text-xs font-heading font-semibold">
                      <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      {isDone ? (
                        <span className="flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle2 className="w-4 h-4" /> Verified</span>
                      ) : (
                        <span className="flex items-center gap-1 text-destructive font-bold"><XCircle className="w-4 h-4" /> Pending</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 10: Timeline */}
              {activeTab === "timeline" && (
                <div className="space-y-4 relative pl-4 border-l-2 border-primary/20 ml-2">
                  {property.timeline.map((event, idx) => (
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
