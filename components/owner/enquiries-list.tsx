"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  User,
  Building,
  Check,
  X,
} from "lucide-react";
import { EnquiryService, BackendEnquiry } from "@/services/enquiry";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function OwnerEnquiriesList() {
  const [requests, setRequests] = React.useState<BackendEnquiry[]>([]);
  const [filter, setFilter] = React.useState<"ALL" | "new" | "seen" | "closed">("ALL");
  const [isLoading, setIsLoading] = React.useState(true);

  const refreshList = React.useCallback(() => {
    setIsLoading(true);
    EnquiryService.getAllRequests()
      .then(setRequests)
      .catch(() => setRequests([]))
      .finally(() => setIsLoading(false));
  }, []);

  React.useEffect(() => {
    refreshList();
    window.addEventListener("focus", refreshList);
    return () => window.removeEventListener("focus", refreshList);
  }, [refreshList]);

  const handleMarkSeen = async (id: string, name: string) => {
    await EnquiryService.updateRequestStatus(id, "Approved");
    refreshList();
    toast.success(`Marked enquiry from ${name} as seen`);
  };

  const handleClose = async (id: string, name: string) => {
    await EnquiryService.updateRequestStatus(id, "Rejected");
    refreshList();
    toast.info(`Closed enquiry from ${name}`);
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === "ALL") return true;
    return r.status === filter;
  });

  const pendingCount = requests.filter((r) => r.status === "new").length;

  return (
    <div className="space-y-6 text-left">
      {/* Top Section Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-extrabold text-primary tracking-tight">
              Property Enquiries
            </h2>
            {pendingCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                {pendingCount} New
              </span>
            )}
          </div>
          <p className="font-body text-xs text-muted-foreground mt-0.5">
            Manage enquiries and direct messages from potential tenants.
          </p>
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 bg-muted/40 p-1 rounded-2xl border border-border/60 self-start sm:self-auto">
          {(["ALL", "new", "seen", "closed"] as const).map((st) => (
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

      {/* Requests List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
          Loading enquiries...
        </div>
      ) : filteredRequests.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          size="sm"
          title="No Enquiries Found"
          description={
            filter === "ALL"
              ? "You have not received any enquiries yet."
              : `No requests with status "${filter}".`
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {filteredRequests.map((req) => {
              const statusColors: Record<string, { bg: string; text: string; border: string }> = {
                new: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20" },
                seen: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20" },
                closed: { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/20" },
              };

              const st = statusColors[req.status] ?? statusColors.new;
              const listingTitle =
                typeof req.listing === "string"
                  ? req.listing
                  : (req.listing as any)?.title ?? "Unknown listing";

              return (
                <motion.div
                  key={req._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-primary/30 transition-all"
                >
                  {/* Left Info Column */}
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border bg-primary/10 text-primary border-primary/20 flex items-center gap-1.5">
                        <MessageSquare className="w-3 h-3" />
                        Enquiry
                      </span>

                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border capitalize",
                          st.bg, st.text, st.border
                        )}
                      >
                        {req.status}
                      </span>

                      <span className="text-[10px] font-body text-muted-foreground ml-auto md:ml-0">
                        {new Date(req.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-heading text-base font-extrabold text-primary flex items-center gap-2">
                        <User className="w-4 h-4 text-secondary shrink-0" />
                        <span>{req.name}</span>
                        {req.phone && (
                          <span className="font-body text-xs font-semibold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md border border-border/40">
                            {req.phone}
                          </span>
                        )}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                        <Building className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{listingTitle}</span>
                      </div>
                    </div>

                    {req.message && (
                      <div className="bg-muted/30 border border-border/60 p-3 rounded-xl text-xs font-body text-foreground leading-relaxed">
                        <p className="font-semibold text-primary/90">&quot;{req.message}&quot;</p>
                      </div>
                    )}
                  </div>

                  {/* Right Actions Column */}
                  <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-border/50 pt-3 md:pt-0 md:pl-5">
                    {req.status === "new" && (
                      <button
                        type="button"
                        data-no-intercept="true"
                        onClick={() => handleMarkSeen(req._id, req.name)}
                        className="flex-1 md:w-32 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Seen</span>
                      </button>
                    )}

                    {req.status !== "closed" && (
                      <button
                        type="button"
                        data-no-intercept="true"
                        onClick={() => handleClose(req._id, req.name)}
                        className="flex-1 md:w-32 flex items-center justify-center gap-1.5 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Close</span>
                      </button>
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
