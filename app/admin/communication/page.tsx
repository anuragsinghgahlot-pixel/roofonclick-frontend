"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Bot,
  User,
  Building,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Pin,
  Lock,
  Sparkles,
  FileText,
  ChevronRight,
  Filter,
  Check,
  Zap,
} from "lucide-react";
import {
  AdminPageContainer,
  PageHeader,
  KpiCard,
} from "@/components/admin";
import {
  AdminCommunicationService,
  ConversationThread,
  ChatMessage,
  ChannelType,
} from "@/services/admin-communication";

export default function AdminCommunicationPage() {
  /* ─── State ─── */
  const [conversations, setConversations] = React.useState<ConversationThread[]>(() =>
    AdminCommunicationService.getConversations()
  );
  const [activeThreadId, setActiveThreadId] = React.useState<string>(conversations[0]?.id || "");
  const [filterTab, setFilterTab] = React.useState<"All" | "Unread" | "Priority" | "Resolved">("All");
  const [searchQuery, setSearchQuery] = React.useState("");

  /* Message Input State */
  const [inputChannel, setInputChannel] = React.useState<ChannelType>("WhatsApp");
  const [messageText, setMessageText] = React.useState("");
  const [showRightPanelMobile, setShowRightPanelMobile] = React.useState(false);

  /* Stats calculation */
  const stats = React.useMemo(() => AdminCommunicationService.getQuickStats(), []);

  /* Active Thread */
  const activeThread = React.useMemo(
    () => conversations.find((c) => c.id === activeThreadId) || conversations[0],
    [conversations, activeThreadId]
  );

  /* Filtered Conversations */
  const filteredThreads = React.useMemo(() => {
    return conversations.filter((c) => {
      if (filterTab === "Unread" && c.status !== "Unread") return false;
      if (filterTab === "Priority" && c.priority !== "High") return false;
      if (filterTab === "Resolved" && c.status !== "Resolved") return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.customerName.toLowerCase().includes(q) ||
          c.customerPhone.includes(q) ||
          c.lastMessageSnippet.toLowerCase().includes(q) ||
          (c.associatedBookingId && c.associatedBookingId.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [conversations, filterTab, searchQuery]);

  /* Handlers */
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeThread) return;

    const isInternal = inputChannel === "Internal Note";

    const newMsg: ChatMessage = {
      id: `M-${Date.now()}`,
      sender: isInternal ? "Admin Note" : "Support Admin",
      senderRole: "Admin",
      channel: inputChannel,
      content: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isInternalNote: isInternal,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeThread.id) return c;
        return {
          ...c,
          status: "Open",
          unreadCount: 0,
          lastMessageSnippet: isInternal ? `[Internal Note] ${newMsg.content}` : newMsg.content,
          lastMessageTime: "Just now",
          messages: [...c.messages, newMsg],
        };
      })
    );

    setMessageText("");
    toast.success(isInternal ? "Private internal note saved." : `Message dispatched via ${inputChannel}`);
  };

  const handleResolveThread = () => {
    if (!activeThread) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === activeThread.id ? { ...c, status: "Resolved", unreadCount: 0 } : c))
    );
    toast.success(`Conversation ${activeThread.id} marked as resolved.`);
  };

  const handleAISuggestReply = () => {
    if (!activeThread) return;
    const aiSuggestion = `Hi ${activeThread.customerName.split(" ")[0]}! I've checked with the property owner and caretaker. Everything is set for your assistance. Let me know if you need anything else!`;
    setMessageText(aiSuggestion);
    toast.info("AI suggested reply inserted.");
  };

  return (
    <AdminPageContainer maxWidth="1600px">
      {/* ═══ Header ═══ */}
      <PageHeader
        title="Customer Communication Hub"
        subtitle="Unified cross-channel inbox for Buyers, Owners, WhatsApp, Email, SMS & Admin Internal Notes"
      />

      {/* ═══ Top Summary Cards ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <KpiCard label="Open Threads" value={stats.openConversations} formattedValue={String(stats.openConversations)} change={-1} changeType="negative" comparisonLabel="active inbox" icon={MessageSquare} />
        <KpiCard label="Messages Today" value={stats.messagesSentToday} formattedValue={stats.messagesSentToday.toLocaleString()} change={14} changeType="positive" comparisonLabel="dispatched" icon={Send} />
        <KpiCard label="Avg Response" value={0} formattedValue={stats.avgResponseTime} change={12} changeType="positive" comparisonLabel="SLA compliance" icon={Clock} />
        <KpiCard label="WhatsApp Active" value={stats.activeWhatsappThreads} formattedValue={String(stats.activeWhatsappThreads)} change={22} changeType="positive" comparisonLabel="live chats" icon={Zap} />
        <KpiCard label="CSAT Score" value={stats.customerSatisfaction} formattedValue={`${stats.customerSatisfaction}/5`} change={2} changeType="positive" comparisonLabel="satisfaction" icon={CheckCircle2} />
      </div>

      {/* ═══ Main Three-Column Split View ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-280px)] min-h-[580px]">
        {/* LEFT PANEL: Conversation List (3.5 cols) */}
        <div className="lg:col-span-3 bg-card border border-border/60 rounded-2xl flex flex-col overflow-hidden shadow-sm">
          {/* Search & Filter Controls */}
          <div className="p-3 border-b border-border/40 space-y-2 shrink-0 bg-muted/20">
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, booking ID..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-border/60 bg-card text-xs font-body text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center justify-between text-[11px] font-heading font-bold text-muted-foreground gap-1">
              {(["All", "Unread", "Priority", "Resolved"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilterTab(tab)}
                  className={`flex-1 py-1 rounded-lg text-center transition-all cursor-pointer ${
                    filterTab === tab
                      ? "bg-primary text-primary-foreground font-extrabold shadow-xs"
                      : "hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/40 scrollbar-thin">
            {filteredThreads.map((c) => {
              const isActive = c.id === activeThread?.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveThreadId(c.id)}
                  className={`w-full p-3.5 text-left transition-colors cursor-pointer flex items-start gap-3 ${
                    isActive ? "bg-primary/10 border-l-4 border-primary" : "hover:bg-muted/30"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-heading font-extrabold text-xs flex items-center justify-center shrink-0">
                    {c.customerName.charAt(0)}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-heading text-xs font-bold text-foreground truncate">{c.customerName}</span>
                      <span className="font-body text-[10px] text-muted-foreground shrink-0">{c.lastMessageTime}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-heading font-bold uppercase bg-muted/60 text-foreground">
                        {c.customerRole}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-heading font-extrabold uppercase bg-primary/10 text-primary">
                        {c.channel}
                      </span>
                      {c.priority === "High" && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-heading font-extrabold uppercase bg-destructive/10 text-destructive">
                          High
                        </span>
                      )}
                    </div>

                    <p className="font-body text-xs text-muted-foreground truncate">{c.lastMessageSnippet}</p>
                  </div>

                  {c.unreadCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground font-heading text-[10px] font-extrabold flex items-center justify-center shrink-0">
                      {c.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}

            {filteredThreads.length === 0 && (
              <div className="p-8 text-center text-xs font-body text-muted-foreground italic">
                No conversations match criteria.
              </div>
            )}
          </div>
        </div>

        {/* CENTER PANEL: Active Conversation Window (5.5 cols) */}
        <div className="lg:col-span-6 bg-card border border-border/60 rounded-2xl flex flex-col overflow-hidden shadow-sm">
          {activeThread ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 border-b border-border/40 bg-muted/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-heading font-extrabold text-sm flex items-center justify-center shrink-0">
                    {activeThread.customerName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-sm font-extrabold text-foreground truncate">{activeThread.customerName}</h3>
                      <span className="px-2 py-0.5 rounded text-[9px] font-heading font-extrabold uppercase bg-emerald-500/10 text-emerald-700">
                        {activeThread.status}
                      </span>
                    </div>
                    <p className="font-body text-xs text-muted-foreground truncate">
                      {activeThread.customerPhone} • {activeThread.customerEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResolveThread}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-heading text-xs font-bold transition-all cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Resolve</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRightPanelMobile(!showRightPanelMobile)}
                    className="p-1.5 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground lg:hidden cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Bubble Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin bg-card/50">
                {activeThread.messages.map((m) => {
                  const isUser = m.senderRole === "Buyer" || m.senderRole === "Owner";
                  const isInternal = m.isInternalNote;

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${
                        isInternal
                          ? "items-center my-2"
                          : isUser
                          ? "items-start"
                          : "items-end"
                      }`}
                    >
                      {/* Private Admin Internal Note */}
                      {isInternal ? (
                        <div className="w-full max-w-md p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 text-xs font-body space-y-1">
                          <div className="flex items-center justify-between font-heading font-bold text-[10px] text-amber-700">
                            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> PRIVATE ADMIN NOTE ({m.sender})</span>
                            <span>{m.timestamp}</span>
                          </div>
                          <p>{m.content}</p>
                        </div>
                      ) : (
                        /* Standard Chat Bubble */
                        <div
                          className={`max-w-[80%] p-3.5 rounded-2xl text-xs font-body space-y-1 ${
                            isUser
                              ? "bg-muted/40 text-foreground border border-border/40 rounded-tl-xs"
                              : "bg-primary text-primary-foreground rounded-tr-xs"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 font-heading text-[10px] opacity-80">
                            <strong>{m.sender} ({m.channel})</strong>
                            <span>{m.timestamp}</span>
                          </div>
                          <p className="leading-relaxed">{m.content}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Message Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-border/40 bg-muted/20 space-y-2 shrink-0">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    {(["WhatsApp", "Email", "SMS", "Internal Note"] as ChannelType[]).map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => setInputChannel(ch)}
                        className={`px-2.5 py-1 rounded-lg font-heading text-[10px] font-bold transition-all cursor-pointer ${
                          inputChannel === ch
                            ? ch === "Internal Note"
                              ? "bg-amber-500 text-white"
                              : "bg-primary text-primary-foreground"
                            : "bg-card border border-border/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAISuggestReply}
                    className="flex items-center gap-1 text-[11px] font-heading font-bold text-primary hover:text-accent cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> AI Suggest
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <textarea
                    rows={2}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={
                      inputChannel === "Internal Note"
                        ? "Write confidential note (visible to admins only)..."
                        : `Reply via ${inputChannel}...`
                    }
                    className="flex-1 p-2.5 rounded-xl border border-border/60 bg-card text-xs font-body text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/40 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="h-10 px-4 rounded-xl bg-primary text-primary-foreground font-heading text-xs font-bold disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-xs font-body text-muted-foreground italic">
              Select a conversation to begin.
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Customer Details & CRM Context (3 cols) */}
        <div className={`lg:col-span-3 bg-card border border-border/60 rounded-2xl p-4 space-y-4 overflow-y-auto scrollbar-thin shadow-sm ${showRightPanelMobile ? "block" : "hidden lg:block"}`}>
          {activeThread && (
            <>
              {/* Customer Profile Card */}
              <div className="space-y-3 pb-3 border-b border-border/40 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/20 text-primary font-heading font-extrabold text-xl flex items-center justify-center mx-auto">
                  {activeThread.customerName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-heading text-sm font-extrabold text-foreground">{activeThread.customerName}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-heading font-extrabold uppercase bg-primary/10 text-primary">
                    {activeThread.customerRole}
                  </span>
                </div>
                <div className="text-xs font-body text-muted-foreground space-y-0.5">
                  <div className="flex items-center justify-center gap-1"><Phone className="w-3 h-3" /> {activeThread.customerPhone}</div>
                  <div className="flex items-center justify-center gap-1"><Mail className="w-3 h-3" /> {activeThread.customerEmail}</div>
                </div>
              </div>

              {/* Trust & Risk Score */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-3 bg-muted/20 rounded-xl border border-border/40">
                  <span className="font-body text-[10px] text-muted-foreground uppercase font-bold block">Trust Score</span>
                  <span className="font-heading text-base font-extrabold text-emerald-600">{activeThread.trustScore}/100</span>
                </div>
                <div className="p-3 bg-muted/20 rounded-xl border border-border/40">
                  <span className="font-body text-[10px] text-muted-foreground uppercase font-bold block">Risk Level</span>
                  <span className="font-heading text-base font-extrabold text-foreground">{activeThread.riskScore}</span>
                </div>
              </div>

              {/* Booking Context */}
              {activeThread.associatedBookingId && (
                <div className="p-3.5 bg-muted/20 rounded-xl border border-border/40 space-y-1.5 text-xs font-body">
                  <span className="font-heading text-[10px] font-extrabold uppercase text-muted-foreground block">Associated Booking</span>
                  <div className="font-heading font-bold text-primary">{activeThread.associatedBookingId}</div>
                  <div className="text-foreground font-semibold">{activeThread.associatedPropertyTitle}</div>
                </div>
              )}

              {/* AI Communication Insights */}
              <div className="p-3.5 bg-primary/5 rounded-xl border border-primary/20 space-y-2 text-xs font-body">
                <span className="font-heading text-xs font-bold uppercase text-primary flex items-center gap-1.5">
                  <Bot className="w-4 h-4" /> AI Sentiment & Priority
                </span>
                <div className="space-y-1 text-foreground">
                  <div>Sentiment: <strong className="font-heading text-emerald-700">Positive / Urgent Request</strong></div>
                  <div>Priority Detection: <strong className="font-heading text-destructive">High Priority SLA</strong></div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminPageContainer>
  );
}
