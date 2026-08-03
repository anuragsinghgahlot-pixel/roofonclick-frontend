"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Bell,
  Send,
  CheckCircle2,
  AlertTriangle,
  Eye,
  X,
  MessageSquare,
  Mail,
  Smartphone,
  Users,
  Calendar,
} from "lucide-react";
import {
  AdminPageContainer,
  PageHeader,
  DataTable,
  KpiCard,
  SectionCard,
} from "@/components/admin";
import type { ColumnDef, RowAction } from "@/components/admin/data-table";

interface NotificationRecord {
  id: string;
  channel: "WhatsApp" | "Push Notification" | "Email" | "SMS";
  recipientGroup: "Buyers / Students" | "Property Owners" | "All Users";
  title: string;
  snippet: string;
  status: "Delivered" | "Scheduled" | "Failed";
  sentAt: string;
}

const MOCK_NOTIFICATIONS: NotificationRecord[] = [
  { id: "NOTIF-801", channel: "WhatsApp", recipientGroup: "Buyers / Students", title: "Move-in Reminder", snippet: "Your move-in date at Elite Residency PG is scheduled for tomorrow at 10 AM.", status: "Delivered", sentAt: "2026-08-02 18:30" },
  { id: "NOTIF-802", channel: "Push Notification", recipientGroup: "Property Owners", title: "Monthly Settlement Credited", snippet: "₹22,800 payout has been transferred to your HDFC bank account.", status: "Delivered", sentAt: "2026-08-03 04:00" },
  { id: "NOTIF-803", channel: "Email", recipientGroup: "Buyers / Students", title: "Indore Student Admission Special", snippet: "Get ₹500 off on your first month rent with code WELCOME500.", status: "Scheduled", sentAt: "2026-08-05 10:00" },
];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = React.useState<NotificationRecord[]>(MOCK_NOTIFICATIONS);
  const [selectedNotif, setSelectedNotif] = React.useState<NotificationRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  /* Form State */
  const [targetGroup, setTargetGroup] = React.useState<NotificationRecord["recipientGroup"]>("Buyers / Students");
  const [channel, setChannel] = React.useState<NotificationRecord["channel"]>("WhatsApp");
  const [titleText, setTitleText] = React.useState("");
  const [bodyText, setBodyText] = React.useState("");

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleText.trim() || !bodyText.trim()) return;

    const newRecord: NotificationRecord = {
      id: `NOTIF-${Date.now()}`,
      channel,
      recipientGroup: targetGroup,
      title: titleText.trim(),
      snippet: bodyText.trim(),
      status: "Delivered",
      sentAt: new Date().toLocaleString(),
    };
    setNotifications((prev) => [newRecord, ...prev]);
    setTitleText("");
    setBodyText("");
    toast.success(`Broadcast dispatched via ${channel} to ${targetGroup}!`);
  };

  const columns: ColumnDef<NotificationRecord>[] = [
    {
      id: "id",
      header: "Notif ID",
      sortable: true,
      minWidth: "120px",
      accessor: (n) => n.id,
      cell: (val, row) => (
        <button type="button" onClick={() => { setSelectedNotif(row); setIsDrawerOpen(true); }} className="font-heading text-xs font-bold text-primary hover:text-accent cursor-pointer">
          {String(val)}
        </button>
      ),
    },
    { id: "channel", header: "Channel", sortable: true, minWidth: "130px", accessor: (n) => n.channel },
    { id: "group", header: "Target Group", sortable: true, minWidth: "160px", accessor: (n) => n.recipientGroup },
    { id: "title", header: "Notification Title", sortable: true, minWidth: "180px", accessor: (n) => n.title },
    { id: "snippet", header: "Message Snippet", minWidth: "220px", accessor: (n) => n.snippet, cell: (v) => <span className="font-body text-xs text-foreground line-clamp-1">{String(v)}</span> },
    {
      id: "status",
      header: "Delivery Status",
      sortable: true,
      minWidth: "120px",
      accessor: (n) => n.status,
      cell: (v) => (
        <span className={`px-2 py-0.5 rounded font-heading text-[10px] font-extrabold uppercase ${v === "Delivered" ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700"}`}>
          {String(v)}
        </span>
      ),
    },
    { id: "sentAt", header: "Sent Timestamp", sortable: true, minWidth: "130px", accessor: (n) => n.sentAt },
  ];

  return (
    <AdminPageContainer>
      <PageHeader title="Notification & Multi-Channel Broadcast Center" subtitle="Dispatch instant Push, WhatsApp & Email updates to buyers & property owners" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Total Sent" value={4850} formattedValue="4,850" change={18} changeType="positive" comparisonLabel="this month" icon={Bell} />
        <KpiCard label="WhatsApp Sent" value={2140} formattedValue="2,140" change={22} changeType="positive" comparisonLabel="API messages" icon={MessageSquare} />
        <KpiCard label="Push Delivered" value={1980} formattedValue="1,980" change={14} changeType="positive" comparisonLabel="app push" icon={Smartphone} />
        <KpiCard label="Delivery Rate" value={99.8} formattedValue="99.8%" change={0} changeType="neutral" comparisonLabel="success rate" icon={CheckCircle2} />
      </div>

      <SectionCard title="Dispatch Multi-Channel Broadcast" subtitle="Send immediate system alert or scheduled notification">
        <form onSubmit={handleSendBroadcast} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-body text-xs font-semibold text-foreground block mb-1">Target Group</label>
              <select value={targetGroup} onChange={(e) => setTargetGroup(e.target.value as any)} className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold">
                <option value="Buyers / Students">Buyers / Students</option>
                <option value="Property Owners">Property Owners</option>
                <option value="All Users">All Registered Users</option>
              </select>
            </div>
            <div>
              <label className="font-body text-xs font-semibold text-foreground block mb-1">Broadcast Channel</label>
              <select value={channel} onChange={(e) => setChannel(e.target.value as any)} className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold">
                <option value="WhatsApp">WhatsApp Business API</option>
                <option value="Push Notification">Push Notification</option>
                <option value="Email">Email Broadcast</option>
                <option value="SMS">SMS Gateway</option>
              </select>
            </div>
            <div>
              <label className="font-body text-xs font-semibold text-foreground block mb-1">Notification Title</label>
              <input type="text" value={titleText} onChange={(e) => setTitleText(e.target.value)} placeholder="e.g. Move-in Alert" className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold" />
            </div>
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-foreground block mb-1">Message Body</label>
            <textarea rows={3} value={bodyText} onChange={(e) => setBodyText(e.target.value)} placeholder="Type notification message..." className="w-full p-3 rounded-xl border border-border/60 bg-muted/20 text-xs font-body text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/40" />
          </div>
          <button type="submit" disabled={!titleText.trim() || !bodyText.trim()} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-heading text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5" /> Dispatch Broadcast Now
          </button>
        </form>
      </SectionCard>

      <DataTable<NotificationRecord>
        columns={columns}
        data={notifications}
        getRowId={(n) => n.id}
        searchable={true}
        searchPlaceholder="Search notification ID, title, or message snippet..."
        rowActions={[
          { id: "inspect", label: "Inspect Record", icon: Eye, onClick: (n) => { setSelectedNotif(n); setIsDrawerOpen(true); } },
        ]}
      />

      <AnimatePresence>
        {isDrawerOpen && selectedNotif && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 z-[299] bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.3 }} className="fixed top-0 right-0 z-[300] h-screen w-full sm:w-[500px] bg-card border-l border-border/60 p-5 flex flex-col justify-between shadow-2xl overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div>
                    <span className="font-heading text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">{selectedNotif.id}</span>
                    <h2 className="font-heading text-base font-extrabold text-foreground mt-1">{selectedNotif.title}</h2>
                  </div>
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-2 text-xs font-body">
                  <div>Channel: <strong className="font-heading text-foreground">{selectedNotif.channel}</strong></div>
                  <div>Target Group: <strong className="font-heading text-foreground">{selectedNotif.recipientGroup}</strong></div>
                  <div>Status: <strong className="font-heading text-emerald-600">{selectedNotif.status}</strong></div>
                  <div>Sent: <strong className="font-heading text-foreground">{selectedNotif.sentAt}</strong></div>
                  <div className="p-3 rounded-xl bg-muted/20 border border-border/40 mt-2">
                    <span className="font-heading text-xs font-bold text-muted-foreground block uppercase mb-1">Full Message</span>
                    <p className="font-body text-xs text-foreground leading-relaxed">{selectedNotif.snippet}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminPageContainer>
  );
}
