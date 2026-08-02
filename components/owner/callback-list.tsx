"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PhoneCall,
  Calendar,
  User,
  RotateCw,
  Building,
  Check,
  X,
  HelpCircle,
  Phone,
} from "lucide-react";
import { CallbackService, CALLBACK_UPDATED_EVENT } from "@/services/callback/callback.service";
import { CallbackRequest, CallbackStatus } from "@/services/callback/callback.types";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function OwnerCallbackList() {
  const [requests, setRequests] = React.useState<CallbackRequest[]>(() => {
    return CallbackService.getAllRequests();
  });

  const [activeFilter, setActiveFilter] = React.useState<string>("ALL");
  const [rescheduleRequest, setRescheduleRequest] = React.useState<CallbackRequest | null>(null);
  const [newDate, setNewDate] = React.useState("");
  const [newTime, setNewTime] = React.useState("Morning (9 AM - 12 PM)");

  const refreshRequests = React.useCallback(() => {
    setRequests(CallbackService.getAllRequests());
  }, []);

  React.useEffect(() => {
    window.addEventListener(CALLBACK_UPDATED_EVENT, refreshRequests);
    return () => {
      window.removeEventListener(CALLBACK_UPDATED_EVENT, refreshRequests);
    };
  }, [refreshRequests]);

  const handleStatusChange = (id: string, status: CallbackStatus) => {
    const updated = CallbackService.updateRequestStatus(id, status);
    if (updated) {
      toast.success(`Callback request ${status.toLowerCase()} successfully!`);
      refreshRequests();
    }
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleRequest || !newDate) return;

    const updated = CallbackService.updateRequestStatus(rescheduleRequest.id, "Rescheduled", {
      preferredDate: newDate,
      preferredTime: newTime,
    });

    if (updated) {
      toast.success("Callback rescheduled successfully!");
      setRescheduleRequest(null);
      refreshRequests();
    }
  };

  const filteredRequests = React.useMemo(() => {
    if (activeFilter === "ALL") return requests;
    return requests.filter((r) => r.status.toUpperCase() === activeFilter);
  }, [requests, activeFilter]);

  const statusBadge = (status: CallbackStatus) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Accepted":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Rescheduled":
        return "bg-sky-500/10 text-sky-600 border-sky-500/20";
      case "Declined":
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header & Filter Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/80 p-5 rounded-3xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-lg font-extrabold text-primary">
              Callback Requests
            </h3>
            <span className="bg-primary/10 text-primary font-heading text-xs font-bold px-2.5 py-0.5 rounded-full">
              {requests.length} Total
            </span>
          </div>
          <p className="font-body text-xs text-muted-foreground">
            Manage buyer callback preferences and schedule phone calls.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {["ALL", "PENDING", "ACCEPTED", "RESCHEDULED", "DECLINED"].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-3 py-1.5 rounded-xl font-heading text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap",
                activeFilter === filter
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/40 hover:bg-muted text-muted-foreground"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Request Cards Grid */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={PhoneCall}
          size="sm"
          title="No Callback Requests"
          description={
            activeFilter === "ALL"
              ? "You have not received any tenant callback requests yet."
              : `No callback requests with status "${activeFilter}".`
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredRequests.map((req) => (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                {/* Top Row: Property & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Building className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span className="font-heading text-xs font-bold text-primary truncate">
                        {req.propertyName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-heading text-base font-extrabold text-primary truncate">
                        {req.buyerName}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full font-heading text-[10px] font-extrabold uppercase tracking-wider border shrink-0",
                      statusBadge(req.status)
                    )}
                  >
                    {req.status}
                  </span>
                </div>

                {/* Info Block */}
                <div className="bg-muted/40 border border-border/50 p-3.5 rounded-2xl space-y-2 text-xs font-body">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="font-bold text-foreground truncate">{req.buyerPhone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <HelpCircle className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span className="font-bold text-foreground truncate">{req.purpose}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-muted-foreground pt-1 border-t border-border/40">
                    <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="font-bold text-foreground">
                      {req.preferredDate} ({req.preferredTime})
                    </span>
                  </div>

                  {req.notes && (
                    <div className="text-[11px] text-muted-foreground italic bg-background/60 p-2 rounded-xl border border-border/40 mt-1">
                      &quot;{req.notes}&quot;
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  {req.status !== "Accepted" && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(req.id, "Accepted")}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl font-heading text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setRescheduleRequest(req);
                      setNewDate(req.preferredDate);
                      setNewTime(req.preferredTime);
                    }}
                    className="flex-1 border border-border bg-background hover:bg-muted/40 text-foreground py-2 rounded-xl font-heading text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-secondary" />
                    <span>Reschedule</span>
                  </button>

                  {req.status !== "Declined" && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(req.id, "Declined")}
                      className="px-3 py-2 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 font-heading text-xs font-bold transition-all cursor-pointer flex items-center justify-center"
                      title="Decline Request"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Reschedule Modal Dialog */}
      <AnimatePresence>
        {rescheduleRequest && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border/80 p-6 rounded-3xl max-w-sm w-full shadow-premium text-left space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-base font-extrabold text-primary">
                  Reschedule Callback
                </h4>
                <button
                  type="button"
                  onClick={() => setRescheduleRequest(null)}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmReschedule} className="space-y-3">
                <div className="space-y-1">
                  <label className="font-heading text-[11px] font-bold text-primary uppercase">
                    New Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-background border border-border/80 rounded-xl px-3 py-2 text-xs font-body font-semibold text-foreground focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-heading text-[11px] font-bold text-primary uppercase">
                    New Time Slot
                  </label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-background border border-border/80 rounded-xl px-3 py-2 text-xs font-body font-semibold text-foreground focus:outline-none"
                  >
                    <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                    <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                    <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-accent text-primary-foreground py-2.5 rounded-xl font-heading text-xs font-bold transition-all mt-2 cursor-pointer"
                >
                  Update Schedule
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
