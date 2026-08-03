"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ScrollText,
  ShieldAlert,
  CheckCircle2,
  Eye,
  X,
  Lock,
  Globe,
  Terminal,
} from "lucide-react";
import {
  AdminPageContainer,
  PageHeader,
  DataTable,
  KpiCard,
} from "@/components/admin";
import type { ColumnDef, RowAction } from "@/components/admin/data-table";

interface AuditLogRecord {
  id: string;
  action: string;
  performedBy: string;
  module: string;
  ipAddress: string;
  device: string;
  timestamp: string;
}

const MOCK_AUDIT_LOGS: AuditLogRecord[] = [
  { id: "LOG-901", action: "Updated Feature Flag: Coupons (Set to Beta 50%)", performedBy: "Super Admin", module: "Feature Flags", ipAddress: "103.21.12.44", device: "Chrome 127 (Windows 11)", timestamp: "2026-08-03 12:45" },
  { id: "LOG-902", action: "Approved Property ID: PROP-1001", performedBy: "Rohit Sharma", module: "Properties", ipAddress: "103.21.12.48", device: "Chrome 127 (macOS)", timestamp: "2026-08-03 11:20" },
  { id: "LOG-903", action: "Verified KYC for Owner ID: OWN-4521", performedBy: "Priya Verma", module: "Owners CRM", ipAddress: "103.21.12.50", device: "Safari (iOS)", timestamp: "2026-08-03 10:15" },
  { id: "LOG-904", action: "Dispatched WhatsApp Broadcast to 1,420 Buyers", performedBy: "Super Admin", module: "Growth Center", ipAddress: "103.21.12.44", device: "Chrome 127 (Windows 11)", timestamp: "2026-08-02 18:30" },
];

export default function AdminAuditLogsPage() {
  const [logs] = React.useState<AuditLogRecord[]>(MOCK_AUDIT_LOGS);
  const [selectedLog, setSelectedLog] = React.useState<AuditLogRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const columns: ColumnDef<AuditLogRecord>[] = [
    {
      id: "id",
      header: "Log ID",
      sortable: true,
      minWidth: "110px",
      accessor: (l) => l.id,
      cell: (val, row) => (
        <button type="button" onClick={() => { setSelectedLog(row); setIsDrawerOpen(true); }} className="font-heading text-xs font-bold text-primary hover:text-accent cursor-pointer">
          {String(val)}
        </button>
      ),
    },
    {
      id: "action",
      header: "Action Description",
      minWidth: "260px",
      accessor: (l) => l.action,
      cell: (val) => <span className="font-body text-xs font-bold text-foreground">{String(val)}</span>,
    },
    { id: "admin", header: "Performed By", sortable: true, minWidth: "140px", accessor: (l) => l.performedBy },
    { id: "module", header: "Module", sortable: true, minWidth: "130px", accessor: (l) => l.module },
    { id: "ip", header: "IP Address", sortable: true, minWidth: "130px", accessor: (l) => l.ipAddress },
    { id: "timestamp", header: "Timestamp", sortable: true, minWidth: "140px", accessor: (l) => l.timestamp },
  ];

  return (
    <AdminPageContainer>
      <PageHeader title="Security & Admin Audit Logs" subtitle="Immutable activity trail recording administrative actions, logins & system changes" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Events Today" value={logs.length} formattedValue={String(logs.length)} change={8} changeType="positive" comparisonLabel="audit events" icon={ScrollText} />
        <KpiCard label="Security Alerts" value={0} formattedValue="0 Alerts" change={0} changeType="neutral" comparisonLabel="no threats" icon={ShieldAlert} />
        <KpiCard label="Login Success" value={99.8} formattedValue="99.8%" change={0} changeType="neutral" comparisonLabel="authenticated" icon={Lock} />
        <KpiCard label="Blocked IPs" value={2} formattedValue="2 IPs" change={0} changeType="neutral" comparisonLabel="firewalled" icon={Globe} />
      </div>

      <DataTable<AuditLogRecord>
        columns={columns}
        data={logs}
        getRowId={(l) => l.id}
        searchable={true}
        searchPlaceholder="Search action, admin name, module, or IP address..."
        rowActions={[
          { id: "inspect", label: "Inspect Event Log", icon: Eye, onClick: (l) => { setSelectedLog(l); setIsDrawerOpen(true); } },
        ]}
      />

      <AnimatePresence>
        {isDrawerOpen && selectedLog && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 z-[299] bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.3 }} className="fixed top-0 right-0 z-[300] h-screen w-full sm:w-[500px] bg-card border-l border-border/60 p-5 flex flex-col justify-between shadow-2xl overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div>
                    <span className="font-heading text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">{selectedLog.id}</span>
                    <h2 className="font-heading text-base font-extrabold text-foreground mt-1">Audit Event Detail</h2>
                  </div>
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-2 text-xs font-body">
                  <div>Action: <strong className="font-heading text-foreground">{selectedLog.action}</strong></div>
                  <div>Admin User: <strong className="font-heading text-primary">{selectedLog.performedBy}</strong></div>
                  <div>Module: <strong className="font-heading text-foreground">{selectedLog.module}</strong></div>
                  <div>IP Address: <strong className="font-heading text-foreground font-mono">{selectedLog.ipAddress}</strong></div>
                  <div>Device: <strong className="font-heading text-foreground">{selectedLog.device}</strong></div>
                  <div>Timestamp: <strong className="font-heading text-foreground">{selectedLog.timestamp}</strong></div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminPageContainer>
  );
}
