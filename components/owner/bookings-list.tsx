"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  User,
  Building,
  Check,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  ShieldAlert,
} from "lucide-react";
import { BookingService, BookingReservation } from "@/services/booking";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function OwnerBookingsList() {
  const [bookings, setBookings] = React.useState<BookingReservation[]>([]);
  const [filter, setFilter] = React.useState<"ALL" | "pending" | "confirmed" | "rejected" | "cancelled">("ALL");
  const [isLoading, setIsLoading] = React.useState(true);

  const refreshList = React.useCallback(() => {
    setIsLoading(true);
    BookingService.fetchOwnerBookings()
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setIsLoading(false));
  }, []);

  React.useEffect(() => {
    refreshList();
    window.addEventListener("focus", refreshList);
    return () => window.removeEventListener("focus", refreshList);
  }, [refreshList]);

  const handleApprove = async (id: string, name: string) => {
    try {
      await BookingService.updateBookingStatus(id, "confirmed");
      refreshList();
      toast.success(`Approved booking for ${name}! 🎉`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to approve booking.");
    }
  };

  const handleReject = async (id: string, name: string) => {
    try {
      await BookingService.updateBookingStatus(id, "rejected");
      refreshList();
      toast.info(`Rejected booking request for ${name}.`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to reject booking.");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === "ALL") return true;
    return b.status === filter;
  });

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="space-y-6 text-left">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-extrabold text-primary tracking-tight">
              Property Bookings
            </h2>
            {pendingCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                {pendingCount} Pending Approval
              </span>
            )}
          </div>
          <p className="font-body text-xs text-muted-foreground mt-0.5">
            Review, approve or reject incoming room booking requests for your properties.
          </p>
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 bg-muted/40 p-1 rounded-2xl border border-border/60 self-start sm:self-auto">
          {(["ALL", "pending", "confirmed", "rejected", "cancelled"] as const).map((st) => (
            <button
              key={st}
              type="button"
              data-no-intercept="true"
              onClick={() => setFilter(st)}
              className={cn(
                "px-3 py-1.5 rounded-xl font-heading text-xs font-bold transition-all cursor-pointer select-none capitalize",
                filter === st
                  ? "bg-card text-primary shadow-sm border border-border/80"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {st === "ALL" ? "All" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
          Loading bookings...
        </div>
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          size="sm"
          title="No Bookings Found"
          description={
            filter === "ALL"
              ? "You have not received any booking requests yet."
              : `No booking requests with status "${filter}".`
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {filteredBookings.map((b) => {
              const statusColors: Record<string, { bg: string; text: string; border: string; label: string }> = {
                pending: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20", label: "Pending Owner Approval" },
                confirmed: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20", label: "Confirmed" },
                rejected: { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/20", label: "Rejected" },
                cancelled: { bg: "bg-slate-500/10", text: "text-slate-600 dark:text-slate-400", border: "border-slate-500/20", label: "Cancelled" },
              };

              const st = statusColors[b.status] ?? statusColors.pending;
              const guestName = b.guestDetails?.fullName || "Guest";
              const guestPhone = b.guestDetails?.phone;
              const guestEmail = b.guestDetails?.email;

              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-primary/30 transition-all"
                >
                  {/* Left Column Info */}
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border bg-primary/10 text-primary border-primary/20 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {b.reservationId || "Booking Request"}
                      </span>

                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border",
                          st.bg, st.text, st.border
                        )}
                      >
                        {st.label}
                      </span>

                      <span className="text-[10px] font-body text-muted-foreground ml-auto md:ml-0">
                        Requested: {new Date(b.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-heading text-base font-extrabold text-primary flex items-center gap-2">
                        <User className="w-4 h-4 text-secondary shrink-0" />
                        <span>{guestName}</span>
                        {b.guestDetails?.occupation && (
                          <span className="font-body text-xs font-semibold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md border border-border/40">
                            {b.guestDetails.occupation}
                          </span>
                        )}
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">{b.propertyName} ({b.roomType})</span>
                        </div>
                        {guestPhone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-500" />
                            <span>{guestPhone}</span>
                          </div>
                        )}
                        {guestEmail && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-sky-500" />
                            <span>{guestEmail}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Booking Details Pills */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="bg-muted/40 border border-border/60 px-3 py-1 rounded-xl text-xs font-body font-semibold text-foreground flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        Move-in Date: <strong className="text-primary">{b.moveInDate || "Immediate"}</strong>
                      </span>
                      {b.pricing && (
                        <span className="bg-muted/40 border border-border/60 px-3 py-1 rounded-xl text-xs font-body font-semibold text-foreground flex items-center gap-1.5">
                          Monthly Rent: <strong className="text-emerald-600">₹{b.pricing.monthlyRent?.toLocaleString()}</strong>
                        </span>
                      )}
                      {b.pricing?.totalDueNow && (
                        <span className="bg-primary/5 border border-primary/20 px-3 py-1 rounded-xl text-xs font-body font-extrabold text-primary flex items-center gap-1.5">
                          Total Due: ₹{b.pricing.totalDueNow.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Actions Column */}
                  <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-border/50 pt-3 md:pt-0 md:pl-5">
                    {b.status === "pending" ? (
                      <>
                        <button
                          type="button"
                          data-no-intercept="true"
                          onClick={() => handleApprove(b.id, guestName)}
                          className="flex-1 md:w-36 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-xl text-xs font-heading font-extrabold transition-all shadow-sm cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          type="button"
                          data-no-intercept="true"
                          onClick={() => handleReject(b.id, guestName)}
                          className="flex-1 md:w-36 flex items-center justify-center gap-1.5 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-heading font-extrabold transition-all cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 bg-muted/30 rounded-xl border border-border/40">
                        {b.status}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default OwnerBookingsList;
