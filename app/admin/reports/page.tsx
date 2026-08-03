"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  BarChart3,
  FileText,
  FileSpreadsheet,
  Download,
  Calendar,
  IndianRupee,
  Building,
  Users,
  CalendarCheck,
  CreditCard,
  HeadphonesIcon,
  Star,
  CheckCircle2,
} from "lucide-react";
import {
  AdminPageContainer,
  PageHeader,
  SectionCard,
  KpiCard,
} from "@/components/admin";

interface ReportType {
  id: string;
  name: string;
  category: "Finance" | "Operations" | "Growth" | "Support";
  description: string;
  lastGenerated: string;
  fileSize: string;
  icon: React.ElementType;
}

const REPORTS: ReportType[] = [
  { id: "REP-1", name: "Monthly Gross Revenue & Payout Report", category: "Finance", description: "Breakdown of gross transaction volume, platform commission, and owner payouts.", lastGenerated: "2026-08-01", fileSize: "2.4 MB", icon: IndianRupee },
  { id: "REP-2", name: "Property Occupancy & Health Audit", category: "Operations", description: "Occupancy rates, health scores, and physical inspection statuses across all cities.", lastGenerated: "2026-08-02", fileSize: "1.8 MB", icon: Building },
  { id: "REP-3", name: "Owner & Student CRM Growth Ledger", category: "Growth", description: "User onboarding numbers, verified KYC statuses, and lifetime value analytics.", lastGenerated: "2026-08-03", fileSize: "3.1 MB", icon: Users },
  { id: "REP-4", name: "Booking Operations & Move-in Log", category: "Operations", description: "Completed bookings, move-in dates, refund requests, and cancellation stats.", lastGenerated: "2026-08-02", fileSize: "1.5 MB", icon: CalendarCheck },
  { id: "REP-5", name: "Trust & Support SLA Compliance Report", category: "Support", description: "Ticket resolution times, dispute logs, review moderation scores, and customer CSAT.", lastGenerated: "2026-08-03", fileSize: "920 KB", icon: HeadphonesIcon },
];

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = React.useState("01 Jan 2026 – 03 Aug 2026");

  const handleDownload = (name: string, format: string) => {
    toast.success(`Exporting "${name}" as ${format.toUpperCase()}...`);
  };

  return (
    <AdminPageContainer maxWidth="1600px">
      <PageHeader
        title="Executive Reporting & Export Center"
        subtitle="Generate, schedule, and export platform financial, operational & CRM intelligence reports"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Generated Reports" value={REPORTS.length} formattedValue={String(REPORTS.length)} change={12} changeType="positive" comparisonLabel="this month" icon={BarChart3} />
        <KpiCard label="Scheduled Delivery" value={4} formattedValue="4 Active" change={0} changeType="neutral" comparisonLabel="automated emails" icon={Calendar} />
        <KpiCard label="Total Downloads" value={342} formattedValue="342 Exports" change={18} changeType="positive" comparisonLabel="admin downloads" icon={Download} />
        <KpiCard label="Report Accuracy" value={100} formattedValue="100%" change={0} changeType="neutral" comparisonLabel="reconciled data" icon={CheckCircle2} />
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border/60 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-heading font-bold text-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          <span>Date Range:</span>
          <span className="px-3 py-1.5 rounded-xl border border-border/60 bg-muted/20">{dateRange}</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => toast.info("Filter applied")} className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-heading text-xs font-bold cursor-pointer">
            Apply Date Filter
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-heading text-base font-extrabold text-foreground">Available Executive Reports ({REPORTS.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REPORTS.map((rep) => {
            const Icon = rep.icon;
            return (
              <div key={rep.id} className="p-4 rounded-xl border border-border/60 bg-card space-y-3 shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-heading text-xs font-bold text-foreground">{rep.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-heading font-extrabold uppercase bg-primary/10 text-primary">
                      {rep.category}
                    </span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">{rep.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs">
                  <span className="font-body text-[10px] text-muted-foreground">Generated: {rep.lastGenerated} ({rep.fileSize})</span>
                  <div className="flex items-center gap-1.5">
                    <button type="button" onClick={() => handleDownload(rep.name, "pdf")} className="p-1.5 rounded-lg border border-border/60 hover:bg-muted/40 text-rose-600 font-heading text-xs font-bold flex items-center gap-1 cursor-pointer">
                      <FileText className="w-3.5 h-3.5" /> PDF
                    </button>
                    <button type="button" onClick={() => handleDownload(rep.name, "excel")} className="p-1.5 rounded-lg border border-border/60 hover:bg-muted/40 text-emerald-600 font-heading text-xs font-bold flex items-center gap-1 cursor-pointer">
                      <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
                    </button>
                    <button type="button" onClick={() => handleDownload(rep.name, "csv")} className="p-1.5 rounded-lg border border-border/60 hover:bg-muted/40 text-primary font-heading text-xs font-bold flex items-center gap-1 cursor-pointer">
                      <Download className="w-3.5 h-3.5" /> CSV
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminPageContainer>
  );
}
