"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/shared/section";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Plus, Minus, Building, Users, Calendar, BarChart3, ArrowRight, Eye, Trash2, Edit3, ExternalLink, MapPin, AlertTriangle, X, ChevronDown, Sliders, PhoneCall, MessageSquare, Bookmark, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { PropertyService, Property, PropertyWizardDraft } from "@/services/property";
import { UserAPI } from "@/services/user/user.api";
import { ListingsAPI } from "@/services/listings/listings.api";
import { EnquiryService } from "@/services/enquiry";
import { BookingService, BookingReservation } from "@/services/booking";
import { CallbackService } from "@/services/callback/callback.service";
import { calculatePropertyAvailability, calculateRoomAvailability } from "@/lib/availability-utils";
import { OwnerEnquiriesList } from "@/components/owner/enquiries-list";
import { OwnerBookingsList } from "@/components/owner/bookings-list";
import { OwnerCallbackList } from "@/components/owner/callback-list";
import { OwnerReviewsList } from "@/components/owner/reviews-list";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

export function OwnerDashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const { user, role, logout, isLoading } = useAuth();
  const [pathnameKey, setPathnameKey] = React.useState(pathname);

  const currentRole = user?.role || role;

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    } else if (user && currentRole === "buyer") {
      router.replace("/");
    }
  }, [user, currentRole, isLoading, router]);

  const [activeTab, setActiveTab] = React.useState<"PROPERTIES" | "BOOKINGS" | "ENQUIRIES" | "CALLBACKS" | "REVIEWS">("PROPERTIES");

  React.useEffect(() => {
    if (tabParam) {
      const upper = tabParam.toUpperCase();
      if (["PROPERTIES", "BOOKINGS", "ENQUIRIES", "CALLBACKS", "REVIEWS"].includes(upper)) {
        setActiveTab(upper as any);
      }
    }
  }, [tabParam]);
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [activeDraft, setActiveDraft] = React.useState<PropertyWizardDraft | null>(null);
  const [propertyToDelete, setPropertyToDelete] = React.useState<Property | null>(null);

  const refreshDraft = React.useCallback(() => {
    const draft = PropertyService.getDraft();
    if (
      draft &&
      draft.formValues &&
      (draft.formValues.propertyName ||
        draft.formValues.city ||
        (draft.formValues.rooms && (draft.formValues.rooms as any[]).length > 0))
    ) {
      setActiveDraft(draft);
    } else {
      setActiveDraft(null);
    }
  }, []);

  const handleResumeDraft = () => {
    if (activeDraft) {
      router.push(`/owner/property/new?step=${activeDraft.currentStep || 1}`);
    }
  };

  const handleDiscardDraft = () => {
    if (confirm("Are you sure you want to discard this unfinished property listing draft?")) {
      PropertyService.clearDraft();
      setActiveDraft(null);
      toast.success("Draft discarded successfully.");
    }
  };

  const fetchOwnerListings = React.useCallback(() => {
    refreshDraft();
    // Clear legacy mock local storage cache if any
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("roof_on_code_properties");
        if (stored && stored.includes("Elite Residency")) {
          localStorage.removeItem("roof_on_code_properties");
          localStorage.removeItem("roof_on_code_legacy_properties");
        }
      } catch {}
    }

    UserAPI.getMyListings()
      .then((res) => {
        setProperties(res.listings || []);
      })
      .catch(() => {
        // Fall back to PropertyService if offline/unauthenticated
        setProperties(PropertyService.getAllProperties());
      });
  }, [refreshDraft]);

  React.useEffect(() => {
    fetchOwnerListings();
  }, [fetchOwnerListings]);

  // Collapsible availability section state per property
  const [expandedAvailability, setExpandedAvailability] = React.useState<Record<string, boolean>>({});

  const toggleAvailabilityExpand = (id: string) => {
    setExpandedAvailability((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleQuickUpdateAvailability = async (propertyId: string, roomIndex: number, delta: number) => {
    const targetProperty = properties.find((p) => p.id === propertyId || (p as any)._id === propertyId);
    if (!targetProperty || !targetProperty.rooms || !targetProperty.rooms[roomIndex]) return;

    const currentRoom = targetProperty.rooms[roomIndex];
    const total = Math.max(1, Number(currentRoom.totalRooms ?? currentRoom.availableRooms ?? 1));
    const currentAvail = Math.max(0, Number(currentRoom.availableRooms ?? 0));
    const newAvail = Math.max(0, Math.min(total, currentAvail + delta));

    if (newAvail === currentAvail) return;

    const previousRooms = targetProperty.rooms;
    const updatedRooms = targetProperty.rooms.map((rm, idx) => {
      if (idx === roomIndex) {
        return {
          ...rm,
          availableRooms: newAvail,
        };
      }
      return rm;
    });

    // 1. Optimistically update local React state for instantaneous UI responsiveness
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === propertyId || (p as any)._id === propertyId) {
          return {
            ...p,
            rooms: updatedRooms,
          };
        }
        return p;
      })
    );

    // 2. Sync to local PropertyService cache
    PropertyService.updateProperty(propertyId, { rooms: updatedRooms });

    toast.success(
      `Updated ${currentRoom.sharingType || currentRoom.roomType || "Room"}: ${newAvail}/${total} available`,
      { duration: 2000 }
    );

    // 3. Persist change to the MongoDB backend
    try {
      await ListingsAPI.updateRooms(propertyId, updatedRooms);
    } catch (err: any) {
      console.error("[OwnerDashboard] Failed to persist room availability:", err);
      // Rollback optimistic update on error
      setProperties((prev) =>
        prev.map((p) => {
          if (p.id === propertyId || (p as any)._id === propertyId) {
            return {
              ...p,
              rooms: previousRooms,
            };
          }
          return p;
        })
      );
      PropertyService.updateProperty(propertyId, { rooms: previousRooms });
      toast.error("Failed to sync availability with server. Reverted change.");
    }
  };

  // Sync properties when pathname changes during client navigation
  if (pathnameKey !== pathname) {
    setPathnameKey(pathname);
    fetchOwnerListings();
  }

  // Re-sync properties on window focus
  React.useEffect(() => {
    const handleFocus = () => {
      fetchOwnerListings();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchOwnerListings]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleAddProperty = () => {
    PropertyService.clearDraft();
    router.push("/owner/property/new?step=1");
  };

  const [enquiriesList, setEnquiriesList] = React.useState<any[]>([]);
  const [pendingEnquiriesCount, setPendingEnquiriesCount] = React.useState(0);
  const totalEnquiriesCount = enquiriesList.length;

  const [ownerBookings, setOwnerBookings] = React.useState<BookingReservation[]>([]);
  const [pendingBookingsCount, setPendingBookingsCount] = React.useState(0);

  React.useEffect(() => {
    EnquiryService.getAllRequests().then(setEnquiriesList).catch(() => setEnquiriesList([]));
    EnquiryService.fetchPendingCount().then(setPendingEnquiriesCount).catch(() => setPendingEnquiriesCount(0));

    BookingService.fetchOwnerBookings()
      .then((list) => {
        setOwnerBookings(list);
        setPendingBookingsCount(list.filter((b) => b.status === "pending").length);
      })
      .catch(() => setOwnerBookings([]));
  }, []);

  const callbacksList = CallbackService.getAllRequests();
  const totalCallbacksCount = callbacksList.length;
  const pendingCallbacksCount = CallbackService.getPendingCount();

  // Stat computations
  const totalListings = properties.length;
  const totalViews = properties.reduce((acc, p) => acc + Number(p.views || 0), 0);

  // 1. View Property Handler
  const handleView = (prop: Property) => {
    router.push(`/property/${prop.id}?preview=owner&sourceRoute=${encodeURIComponent(pathname)}`);
  };

  // 2. Edit Property Handler
  const handleEdit = (prop: Property) => {
    router.push(`/owner/property/edit/${prop.id}?step=1&sourceRoute=${encodeURIComponent(pathname)}`);
  };

  // 3. Delete Property Handler & Confirmation
  const confirmDelete = async () => {
    if (!propertyToDelete) return;
    const targetId = propertyToDelete.id;
    try {
      await ListingsAPI.deleteListing(targetId);
      toast.success("Your property has been deleted successfully.");
      fetchOwnerListings();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete property.");
    } finally {
      setPropertyToDelete(null);
    }
  };

  return (
    <div className="relative flex flex-col min-h-[100dvh] bg-background">
      <Navbar />

      <main className="flex-1 text-left" data-no-intercept="true">
        <div className="bg-muted/10 pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16 relative overflow-hidden">
          {/* Background glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />

          <Container>
            {/* Header / Welcome Row */}
            <div className="flex flex-col gap-3 border-b border-border/70 pb-5 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary block mb-1">
                    Management Center
                  </span>
                  <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                    Owner Dashboard
                  </h1>
                  <p className="font-body text-sm text-muted-foreground mt-1">
                    Welcome back, <span className="font-semibold text-primary">{user?.name || user?.email || "Partner"}</span>.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    data-no-intercept="true"
                    onClick={handleLogout}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-primary text-xs font-bold transition-all duration-200 cursor-pointer min-h-[44px]"
                  >
                    Logout
                  </button>
                  <button
                    data-no-intercept="true"
                    onClick={handleAddProperty}
                    className="flex-1 sm:flex-none bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground text-xs font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center gap-1.5 min-h-[44px]"
                  >
                    <Plus className="w-4 h-4" />
                    Add Property
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid — 2-col on mobile, 4-col on lg+ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-10">
              {[
                { label: "Listings", value: totalListings.toString(), icon: Building, color: "text-primary bg-primary/10" },
                { label: "Enquiries", value: totalEnquiriesCount.toString(), icon: Users, color: "text-secondary bg-secondary/10" },
                { label: "Pending Bookings", value: pendingBookingsCount.toString(), icon: Calendar, color: "text-amber-500 bg-amber-500/10" },
                { label: "Views", value: totalViews.toString(), icon: BarChart3, color: "text-muted-foreground bg-muted/70" },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.08, ease: PREMIUM_EASE }}
                    className="bg-card border border-border/80 rounded-2xl p-4 sm:p-6 shadow-premium flex items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5 sm:space-y-1 min-w-0">
                      <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground block truncate">{stat.label}</span>
                      <span className="font-heading text-xl sm:text-2xl font-extrabold text-primary">{stat.value}</span>
                    </div>
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${stat.color} shrink-0`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Dashboard Section Switcher Tabs — horizontal scroll on mobile */}
            <div className="flex items-center gap-2 border-b border-border/60 pb-4 mb-6 sm:mb-8 overflow-x-auto scrollbar-none">
              {([
                { id: "PROPERTIES", icon: Building, label: "Properties", count: properties.length, badge: null },
                { id: "BOOKINGS", icon: Calendar, label: "Bookings", count: ownerBookings.length, badge: pendingBookingsCount > 0 ? pendingBookingsCount : null },
                { id: "ENQUIRIES", icon: Users, label: "Enquiries", count: totalEnquiriesCount, badge: pendingEnquiriesCount > 0 ? pendingEnquiriesCount : null },
              ] as const).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    data-no-intercept="true"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "shrink-0 px-3 sm:px-5 py-2.5 rounded-xl font-heading text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 relative min-h-[44px] whitespace-nowrap",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-card border border-border/80 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}{tab.count !== null ? ` (${tab.count})` : ""}</span>
                    {tab.badge !== null && (
                      <span className="bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full animate-pulse">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Properties */}
            {activeTab === "PROPERTIES" && (
              <>
                {/* In-Progress Draft Card / Banner */}
                {activeDraft && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-card to-amber-500/5 border border-amber-500/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left mb-6"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                        <Bookmark className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Autosaved Draft
                          </span>
                          <span className="text-[11px] font-semibold text-muted-foreground">
                            Step {activeDraft.currentStep || 1} of 6 Completed ({Math.round(((activeDraft.currentStep || 1) / 6) * 100)}%)
                          </span>
                        </div>
                        <h3 className="font-heading text-sm sm:text-base font-extrabold text-primary truncate">
                          {(activeDraft.formValues?.propertyName as string) || "Untitled Property Listing"}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {[(activeDraft.formValues?.propertyType as string), (activeDraft.formValues?.area as string), (activeDraft.formValues?.city as string)].filter(Boolean).join(" • ") || "Incomplete details"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={handleDiscardDraft}
                        className="p-2.5 rounded-xl border border-border/70 hover:border-rose-500/40 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        title="Discard this draft"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Discard</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResumeDraft}
                        className="px-4 py-2.5 rounded-xl bg-primary hover:bg-secondary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all cursor-pointer select-none"
                      >
                        <span>Resume Listing</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Empty State vs List grid switcher */}
                {properties.length === 0 ? (
                  <EmptyState
                    emoji="🏢"
                    title="No Properties Listed Yet"
                    description="List your hostel or PG accommodation to start receiving verified buyer leads and digital bookings."
                    primaryAction={{
                      label: "Create First Listing",
                      onClick: handleAddProperty,
                    }}
                    secondaryAction={{
                      label: "Return to Homepage",
                      href: "/",
                    }}
                  />
                ) : (
                  /* Published Listings Section */
                  <div className="space-y-4 sm:space-y-6 text-left">
                    <div className="flex justify-between items-center border-b border-border/60 pb-3 mb-4 sm:mb-6">
                      <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary">
                        Your Properties
                      </h2>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {properties.length} Listings
                      </span>
                    </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <AnimatePresence>
                    {properties.map((prop, idx) => {
                      const availability = calculatePropertyAvailability(prop.rooms || prop.roomConfigurations);

                      return (
                        <motion.div
                          key={prop.id}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ duration: 0.4, ease: PREMIUM_EASE, delay: idx * 0.05 }}
                          className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-premium flex flex-col group"
                        >
                          {/* Image Banner */}
                          <div className="relative aspect-video w-full overflow-hidden bg-muted flex items-center justify-center">
                            {prop.coverPhoto ? (
                              <img
                                src={prop.coverPhoto}
                                alt={prop.propertyName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-muted via-muted/80 to-muted/50 flex flex-col items-center justify-center gap-1.5 text-muted-foreground p-4 text-center">
                                <Building className="w-8 h-8 stroke-1 text-primary/40" />
                                <span className="font-heading text-[11px] font-bold text-foreground/70">{prop.propertyName}</span>
                              </div>
                            )}
                            {/* Availability Badge */}
                            <div className={cn("absolute top-3 left-3 bg-card/90 backdrop-blur-md px-2.5 py-1 rounded-lg border shadow-md flex items-center gap-1.5 z-10", availability.borderColor)}>
                              <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", availability.dotColor)} />
                              <span className={cn("font-heading text-[9px] font-extrabold uppercase tracking-wider", availability.textColor)}>
                                {availability.label}
                              </span>
                            </div>

                            <div
                              className={cn(
                                "absolute top-3 right-3 font-heading text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-md backdrop-blur-md border",
                                prop.status === "Published" || (prop.status as string) === "active"
                                  ? "bg-emerald-500/90 text-white border-emerald-400/30"
                                  : prop.status === "Pending Approval" || (prop.status as string) === "pending"
                                  ? "bg-amber-500/90 text-white border-amber-400/30 animate-pulse"
                                  : prop.status === "Rejected" || (prop.status as string) === "rejected"
                                  ? "bg-rose-500/90 text-white border-rose-400/30"
                                  : "bg-slate-700/90 text-white border-slate-600/30"
                              )}
                            >
                              {prop.status}
                            </div>
                            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white font-heading text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                              {prop.propertyType}
                            </div>
                          </div>

                        {/* Card Info */}
                        <div className="p-5 flex-1 flex flex-col gap-4">
                          <div className="space-y-1">
                            <h3 className="font-heading text-base font-extrabold text-primary break-words leading-tight">
                              {prop.propertyName}
                            </h3>
                            <div className="flex items-center gap-1 text-muted-foreground text-xs">
                              <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                              <span className="font-semibold">{prop.area}, {prop.city}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center border-t border-b border-border/40 py-2.5">
                            <div>
                              <span className="text-[10px] text-muted-foreground font-semibold block">STARTING RENT</span>
                              <span className="font-heading text-sm font-extrabold text-emerald-500">₹{prop.startingRent} / mo</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-muted-foreground font-semibold block">GENDER</span>
                              <span className="font-heading text-xs font-bold text-primary">{prop.gender}</span>
                            </div>
                          </div>

                          {/* Stats and Info Indicators */}
                          <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4 text-secondary shrink-0" />
                              {prop.status === "Published" || (prop.status as string) === "active" ? (prop.views || 0) : 0} views
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-secondary shrink-0" />
                              {prop.status === "Published" || (prop.status as string) === "active" ? (prop.enquiries || 0) : 0} enquiries
                            </span>
                          </div>

                          {/* Quick Availability Management Collapsible */}
                          <div className="space-y-2 border-t border-border/40 pt-3">
                            <button
                              type="button"
                              data-no-intercept="true"
                              onClick={() => toggleAvailabilityExpand(prop.id)}
                              className="w-full py-2 px-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-heading text-xs font-bold flex items-center justify-between transition-all cursor-pointer select-none"
                            >
                              <div className="flex items-center gap-1.5">
                                <Sliders className="w-3.5 h-3.5 text-primary" />
                                <span>Manage Availability</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-extrabold uppercase bg-primary/15 text-primary px-2 py-0.5 rounded-md">
                                  {(prop.rooms || []).reduce((acc, r) => acc + (r.availableRooms || 0), 0)} Left
                                </span>
                                <ChevronDown
                                  className={cn(
                                    "w-3.5 h-3.5 text-primary transition-transform duration-200",
                                    expandedAvailability[prop.id] && "rotate-180"
                                  )}
                                />
                              </div>
                            </button>

                            {/* Expanded Inventory Controls per Room Configuration */}
                            {expandedAvailability[prop.id] && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2 pt-1 pb-1 overflow-hidden"
                              >
                                {(prop.rooms || []).map((room, roomIdx) => {
                                  const total = Math.max(1, Number(room.totalRooms ?? room.availableRooms ?? 1));
                                  const avail = Math.max(0, Number(room.availableRooms ?? 0));
                                  const roomAvailability = calculateRoomAvailability(avail, total);

                                  return (
                                    <div
                                      key={roomIdx}
                                      className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border/50 gap-2 text-left"
                                    >
                                      <div className="space-y-0.5 min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5 truncate">
                                          <span className="font-heading text-xs font-extrabold text-primary truncate">
                                            {room.sharingType || room.roomType || "Single"}
                                          </span>
                                          <span className={cn("text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full border shrink-0", roomAvailability.bgColor, roomAvailability.textColor, roomAvailability.borderColor)}>
                                            {roomAvailability.label}
                                          </span>
                                        </div>
                                        <span className="font-body text-[10px] text-muted-foreground block">
                                          ₹{(room.monthlyRent ?? room.rent ?? 0).toLocaleString()}/mo
                                        </span>
                                      </div>

                                      {/* [-] Available / Total [+] Controls */}
                                      <div className="flex items-center gap-1 bg-card border border-border/60 p-1 rounded-xl shrink-0">
                                        <button
                                          type="button"
                                          data-no-intercept="true"
                                          disabled={avail <= 0}
                                          onClick={() => handleQuickUpdateAvailability(prop.id, roomIdx, -1)}
                                          className={cn(
                                            "w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-all",
                                            avail <= 0
                                              ? "opacity-30 cursor-not-allowed bg-muted text-muted-foreground"
                                              : "bg-primary/10 hover:bg-rose-500 hover:text-white text-primary cursor-pointer border border-primary/20"
                                          )}
                                          title={avail <= 0 ? "Cannot decrease below 0" : "Decrease available rooms"}
                                        >
                                          <Minus className="w-3.5 h-3.5" />
                                        </button>

                                        <span className="font-heading text-xs font-extrabold text-primary px-1 min-w-[36px] text-center">
                                          {avail} / {total}
                                        </span>

                                        <button
                                          type="button"
                                          data-no-intercept="true"
                                          disabled={avail >= total}
                                          onClick={() => handleQuickUpdateAvailability(prop.id, roomIdx, 1)}
                                          className={cn(
                                            "w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-all",
                                            avail >= total
                                              ? "opacity-30 cursor-not-allowed bg-muted text-muted-foreground"
                                              : "bg-primary/10 hover:bg-emerald-600 hover:text-white text-primary cursor-pointer border border-primary/20"
                                          )}
                                          title={avail >= total ? `Cannot exceed total rooms (${total})` : "Increase available rooms"}
                                        >
                                          <Plus className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </motion.div>
                            )}
                          </div>

                          {/* Action Buttons — 44px touch targets */}
                          <div className="grid grid-cols-3 gap-2 border-t border-border/40 pt-3 sm:pt-4 mt-auto">
                            <button
                              data-no-intercept="true"
                              onClick={() => handleView(prop)}
                              className="py-3 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-primary text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer min-h-[44px]"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                            <button
                              data-no-intercept="true"
                              onClick={() => handleEdit(prop)}
                              className="py-3 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-primary text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer min-h-[44px]"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                              data-no-intercept="true"
                              onClick={() => setPropertyToDelete(prop)}
                              className="py-3 rounded-xl border border-border bg-card hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer min-h-[44px]"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  </AnimatePresence>
                </div>
              </div>
            )}
              </>
            )}

            {/* Tab 2: Property Bookings */}
            {activeTab === "BOOKINGS" && (
              <OwnerBookingsList />
            )}

            {/* Tab 3: Enquiries & Visit Requests */}
            {activeTab === "ENQUIRIES" && (
              <OwnerEnquiriesList />
            )}

            {/* Tab 3: Callback Requests */}
            {activeTab === "CALLBACKS" && (
              <OwnerCallbackList />
            )}

            {/* Tab 4: Reviews & Ratings */}
            {activeTab === "REVIEWS" && (
              <OwnerReviewsList />
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
              {propertyToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-premium space-y-6 text-left relative"
                  >
                    <button
                      onClick={() => setPropertyToDelete(null)}
                      className="absolute top-5 right-5 p-1.5 rounded-xl border border-border hover:bg-muted/40 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-extrabold text-primary">
                          Delete Property?
                        </h3>
                        <span className="font-body text-xs text-muted-foreground block truncate max-w-[240px]">
                          {propertyToDelete.propertyName}
                        </span>
                      </div>
                    </div>

                    <p className="font-body text-sm text-muted-foreground leading-relaxed">
                      Are you sure you want to delete this property? This action cannot be undone.
                    </p>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        data-no-intercept="true"
                        onClick={() => setPropertyToDelete(null)}
                        className="px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-primary text-xs font-bold transition-all duration-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        data-no-intercept="true"
                        onClick={confirmDelete}
                        className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md shadow-rose-600/20"
                      >
                        Delete Property
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </Container>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OwnerDashboardPage() {
  return (
    <React.Suspense fallback={null}>
      <OwnerDashboardContent />
    </React.Suspense>
  );
}
