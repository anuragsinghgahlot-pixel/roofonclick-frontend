"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  X,
  ShieldAlert,
  MessageSquare,
  FileText,
  Clock,
  Send,
  Download,
  AlertTriangle,
  History,
  CheckCircle2,
  XCircle,
  User,
  Building,
} from "lucide-react";
import type { SupportTicketItem } from "@/services/admin-trust-safety";

type TabId = "overview" | "conversation" | "evidence" | "timeline" | "notes" | "history";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: ShieldAlert },
  { id: "conversation", label: "Conversation", icon: MessageSquare },
  { id: "evidence", label: "Evidence", icon: FileText },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "notes", label: "Admin Notes", icon: MessageSquare },
  { id: "history", label: "Prior History", icon: History },
];

export function TrustSafetyDrawer({
  ticket,
  isOpen,
  onClose,
}: {
  ticket: SupportTicketItem | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = React.useState<TabId>("overview");
  const [messages, setMessages] = React.useState<{ sender: string; message: string; date: string; isStaff?: boolean }[]>([]);
  const [notes, setNotes] = React.useState<{ author: string; note: string; date: string }[]>([]);
  const [reply, setReply] = React.useState("");
  const [newNote, setNewNote] = React.useState("");

  React.useEffect(() => {
    if (ticket) {
      setMessages(ticket.conversation);
      setNotes(ticket.notes);
      setActiveTab("overview");
    }
  }, [ticket]);

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

  if (!ticket) return null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;

    const item = {
      sender: "Trust & Safety Admin",
      message: reply.trim(),
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isStaff: true,
    };
    setMessages((prev) => [...prev, item]);
    setReply("");
    toast.success("Reply sent to user.");
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const item = {
      author: "Mod Admin",
      note: newNote.trim(),
      date: new Date().toLocaleString(),
    };
    setNotes((prev) => [item, ...prev]);
    setNewNote("");
    toast.success("Investigation note saved.");
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
            aria-label={`Case Details: ${ticket.id}`}
            className="fixed top-0 right-0 z-[300] h-screen w-full sm:w-[560px] md:w-[660px] bg-card border-l border-border/60 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* ═══ Header ═══ */}
            <div className="p-5 border-b border-border/40 space-y-3 shrink-0 bg-muted/20">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-destructive/10 text-destructive">
                      {ticket.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg border font-heading text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-700 border-amber-500/20">
                      {ticket.priority} Priority
                    </span>
                  </div>
                  <h2 className="font-heading text-base font-extrabold text-foreground truncate">
                    {ticket.category} — {ticket.buyerName}
                  </h2>
                  <p className="font-body text-xs text-muted-foreground truncate">
                    Assigned: {ticket.assignedStaff} • Created: {ticket.createdAt}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close case details"
                  className="p-2 rounded-xl text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <X className="w-5 h-5" />
                </button>
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
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Category</span>
                      <span className="font-heading text-xs font-bold text-foreground">{ticket.category}</span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Priority</span>
                      <span className="font-heading text-xs font-bold text-destructive">{ticket.priority}</span>
                    </div>
                    <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                      <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Status</span>
                      <span className="font-heading text-xs font-bold text-emerald-600">{ticket.status}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/20 rounded-xl border border-border/40 space-y-2">
                    <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Involved Parties
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <span className="font-heading font-bold text-foreground block">Reporting Buyer</span>
                        <span className="font-body text-muted-foreground block">{ticket.buyerName}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="font-heading font-bold text-foreground block">Respondent Owner</span>
                        <span className="font-body text-muted-foreground block">{ticket.ownerName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Conversation Thread */}
              {activeTab === "conversation" && (
                <div className="space-y-4 flex flex-col h-full">
                  <div className="flex-1 space-y-3">
                    {messages.map((m, i) => (
                      <div
                        key={i}
                        className={cn(
                          "p-3.5 rounded-2xl max-w-[85%] space-y-1 text-xs",
                          m.isStaff
                            ? "ml-auto bg-primary text-primary-foreground font-body"
                            : "bg-muted/40 text-foreground border border-border/40"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2 font-heading text-[10px] opacity-80">
                          <strong>{m.sender}</strong>
                          <span>{m.date}</span>
                        </div>
                        <p className="leading-relaxed">{m.message}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendReply} className="flex gap-2 pt-2 border-t border-border/40">
                    <input
                      type="text"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Type staff response..."
                      className="flex-1 px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-body text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                    <button
                      type="submit"
                      disabled={!reply.trim()}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-heading text-xs font-bold disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" /> Send
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 3: Evidence */}
              {activeTab === "evidence" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Uploaded Case Attachments ({ticket.evidence.length})
                  </h3>
                  {ticket.evidence.map((ev, i) => (
                    <div key={i} className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between gap-3 text-xs">
                      <span className="font-heading font-bold text-foreground">{ev.title}</span>
                      <button type="button" onClick={() => toast.info(`Downloading ${ev.title}`)} className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors cursor-pointer">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {ticket.evidence.length === 0 && <p className="font-body text-xs text-muted-foreground italic">No evidence uploaded.</p>}
                </div>
              )}

              {/* Tab 4: Timeline */}
              {activeTab === "timeline" && (
                <div className="space-y-4 relative pl-4 border-l-2 border-primary/20 ml-2">
                  {ticket.timeline.map((event, idx) => (
                    <div key={idx} className="relative space-y-1">
                      <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-card" />
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-heading text-xs font-extrabold text-primary">{event.event}</span>
                        <span className="font-body text-[10px] text-muted-foreground">{event.date}</span>
                      </div>
                      <span className="font-body text-[10px] text-muted-foreground/70 block">By: {event.by}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 5: Admin Notes */}
              {activeTab === "notes" && (
                <div className="space-y-4">
                  <form onSubmit={handleAddNote} className="space-y-2">
                    <textarea
                      rows={3}
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add investigation note (private to mods only)..."
                      className="w-full p-3 rounded-xl border border-border/60 bg-muted/20 text-xs font-body text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                    <button
                      type="submit"
                      disabled={!newNote.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-heading text-xs font-bold disabled:opacity-50 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> Save Note
                    </button>
                  </form>

                  <div className="space-y-3 pt-2">
                    <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Mod Investigation Log ({notes.length})
                    </h3>
                    {notes.map((n, i) => (
                      <div key={i} className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-amber-700">{n.author}</span>
                          <span className="font-body text-[10px] text-muted-foreground">{n.date}</span>
                        </div>
                        <p className="font-body text-xs text-foreground/90">{n.note}</p>
                      </div>
                    ))}
                    {notes.length === 0 && <p className="font-body text-xs text-muted-foreground italic">No investigation notes saved.</p>}
                  </div>
                </div>
              )}

              {/* Tab 6: History */}
              {activeTab === "history" && (
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Prior Violation Records
                  </h3>
                  <div className="p-3.5 rounded-xl border border-border/40 bg-muted/20 space-y-1 text-xs">
                    <span className="font-heading font-bold text-foreground block">0 Previous Strikes</span>
                    <p className="font-body text-muted-foreground">Clean history across platform.</p>
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
