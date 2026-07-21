"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Calendar,
  User,
  Clock,
  RotateCw,
  Building,
  Check,
  X,
} from "lucide-react";
import { EnquiryService, EnquiryRequest, RequestStatus } from "@/services/enquiry";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function OwnerEnquiriesList() {
  const [requests, setRequests] = React.useState<EnquiryRequest[]>(() => {
    return EnquiryService.getAllRequests();
  });
  const [filter, setFilter] = React.useState<"ALL" | RequestStatus>("ALL");
  const [rescheduleTarget, setRescheduleTarget] = React.useState<EnquiryRequest | null>(null);

  // Reschedule form state
  const [newDate, setNewDate] = React.useState("");
  const [newTime, setNewTime] = React.useState("11:00 AM");

  const todayISO = React.useMemo(() => new Date().toISOString().split("T")[0], []);

  const refreshList = () => {
    setRequests(EnquiryService.getAllRequests());
  };

  React.useEffect(() => {
    window.addEventListener("focus", refreshList);
    return () => window.removeEventListener("focus", refreshList);
  }, []);

  const handleApprove = (id: string, name: string) => {
    EnquiryService.updateRequestStatus(id, "Approved");
    refreshList();
    toast.success(`Approved request from ${name}`);
  };

  const handleReject = (id: string, name: string) => {
    EnquiryService.updateRequestStatus(id, "Rejected");
    refreshList();
    toast.info(`Rejected request from ${name}`);
  };

  const handleOpenReschedule = (req: EnquiryRequest) => {
    setRescheduleTarget(req);
    setNewDate(req.preferredDate || todayISO);
    setNewTime(req.preferredTime || "11:00 AM");
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleTarget) return;

    if (!newDate || newDate < todayISO) {
      toast.error("Please pick a valid future date for rescheduling.");
      return;
    }

    EnquiryService.updateRequestStatus(rescheduleTarget.id, "Rescheduled", {
      preferredDate: newDate,
      preferredTime: newTime,
    });

    refreshList();
    toast.success(`Rescheduled visit with ${rescheduleTarget.buyerName} to ${newDate} at ${newTime}`);
    setRescheduleTarget(null);
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === "ALL") return true;
    return r.status === filter;
  });

  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  return (
    <div className="space-y-6 text-left">
      {/* Top Section Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-extrabold text-primary tracking-tight">
              Property Enquiries & Visit Requests
            </h2>
            {pendingCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                {pendingCount} Pending
              </span>
            )}
          </div>
          <p className="font-body text-xs text-muted-foreground mt-0.5">
            Manage inspection visit schedules and direct message enquiries from potential tenants.
          </p>
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 bg-muted/40 p-1 rounded-2xl border border-border/60 self-start sm:self-auto">
          {(["ALL", "Pending", "Approved", "Rescheduled", "Rejected"] as const).map((st) => (
            <button
              key={st}
              type="button"
              data-no-intercept="true"
              onClick={() => setFilter(st)}
              className={cn(
                "px-3 py-1.5 rounded-xl font-heading text-xs font-bold transition-all cursor-pointer select-none",
                filter === st
                  ? "bg-card text-primary shadow-sm border border-border/80"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-card border border-dashed border-border p-10 rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-heading text-sm font-bold text-primary">No Enquiries Found</h4>
            <p className="font-body text-xs text-muted-foreground">
              {filter === "ALL"
                ? "You have not received any enquiries or visit requests yet."
                : `No requests with status "${filter}".`}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {filteredRequests.map((req) => {
              const isVisit = req.requestType === "Visit";

              const statusColors: Record<RequestStatus, { bg: string; text: string; border: string }> = {
                Pending: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20" },
                Approved: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20" },
                Rescheduled: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/20" },
                Rejected: { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/20" },
              };

              const st = statusColors[req.status];

              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-primary/30 transition-all"
                >
                  {/* Left Info Column */}
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Request Type Badge */}
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border flex items-center gap-1.5",
                          isVisit
                            ? "bg-secondary/10 text-secondary border-secondary/20"
                            : "bg-primary/10 text-primary border-primary/20"
                        )}
                      >
                        {isVisit ? <Calendar className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                        {req.requestType}
                      </span>

                      {/* Status Badge */}
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border",
                          st.bg,
                          st.text,
                          st.border
                        )}
                      >
                        {req.status}
                      </span>

                      <span className="text-[10px] font-body text-muted-foreground ml-auto md:ml-0">
                        {new Date(req.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-heading text-base font-extrabold text-primary flex items-center gap-2">
                        <User className="w-4 h-4 text-secondary shrink-0" />
                        <span>{req.buyerName}</span>
                        {req.buyerPhone && (
                          <span className="font-body text-xs font-semibold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md border border-border/40">
                            {req.buyerPhone}
                          </span>
                        )}
                      </h4>

                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                        <Building className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{req.propertyName}</span>
                      </div>
                    </div>

                    {/* Details content */}
                    {isVisit ? (
                      <div className="bg-muted/30 border border-border/60 p-3 rounded-xl space-y-1 text-xs font-body">
                        <div className="flex items-center gap-2 font-bold text-primary">
                          <Clock className="w-3.5 h-3.5 text-secondary" />
                          <span>Scheduled Visit: {req.preferredDate} at {req.preferredTime}</span>
                        </div>
                        {req.notes && (
                          <p className="text-muted-foreground text-[11px] italic pl-5">
                            &quot;{req.notes}&quot;
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-muted/30 border border-border/60 p-3 rounded-xl text-xs font-body text-foreground leading-relaxed">
                        <p className="font-semibold text-primary/90">&quot;{req.message}&quot;</p>
                      </div>
                    )}
                  </div>

                  {/* Right Actions Column */}
                  <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-border/50 pt-3 md:pt-0 md:pl-5">
                    {req.status !== "Approved" && (
                      <button
                        type="button"
                        data-no-intercept="true"
                        onClick={() => handleApprove(req.id, req.buyerName)}
                        className="flex-1 md:w-32 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {isVisit && req.status !== "Rescheduled" && (
                      <button
                        type="button"
                        data-no-intercept="true"
                        onClick={() => handleOpenReschedule(req)}
                        className="flex-1 md:w-32 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Reschedule</span>
                      </button>
                    )}

                    {req.status !== "Rejected" && (
                      <button
                        type="button"
                        data-no-intercept="true"
                        onClick={() => handleReject(req.id, req.buyerName)}
                        className="flex-1 md:w-32 flex items-center justify-center gap-1.5 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border/80 p-6 rounded-3xl max-w-md w-full shadow-premium text-left space-y-5"
          >
            <div className="space-y-1">
              <span className="font-heading text-xs font-bold text-secondary uppercase tracking-wider block">
                Update Schedule
              </span>
              <h3 className="font-heading text-lg font-extrabold text-primary">
                Reschedule Visit with {rescheduleTarget.buyerName}
              </h3>
            </div>

            <form onSubmit={handleConfirmReschedule} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary">
                  New Visit Date
                </label>
                <input
                  type="date"
                  required
                  min={todayISO}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2 text-xs font-body text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary">
                  New Visit Time
                </label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2 text-xs font-body text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="10:00 AM">10:00 AM (Morning)</option>
                  <option value="11:30 AM">11:30 AM (Morning)</option>
                  <option value="02:00 PM">02:00 PM (Afternoon)</option>
                  <option value="04:30 PM">04:30 PM (Evening)</option>
                  <option value="06:00 PM">06:00 PM (Evening)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={() => setRescheduleTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground font-heading text-xs font-bold hover:bg-muted/40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  data-no-intercept="true"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-heading text-xs font-bold shadow-md cursor-pointer"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
