"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  TrendingUp,
  IndianRupee,
  Building,
  Percent,
  Star,
  Activity,
  Calendar,
  SlidersHorizontal,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Users,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  AdminPageContainer,
  PageHeader,
  SectionCard,
  KpiCard,
  AreaChart,
  BarChart,
} from "@/components/admin";
import {
  AdminAnalyticsService,
  AdminExecutiveSummary,
  FunnelStep,
  CityMetric,
} from "@/services/admin-analytics";

export default function AdminAnalyticsPage() {
  /* ─── State ─── */
  const [timeframe, setTimeframe] = React.useState<"daily" | "monthly">("monthly");
  const [comparePrevious, setComparePrevious] = React.useState(true);
  const [reportModule, setReportModule] = React.useState("all");

  const kpis: AdminExecutiveSummary = React.useMemo(
    () => AdminAnalyticsService.getExecutiveSummary(),
    []
  );

  const revenueTrends = React.useMemo(
    () => AdminAnalyticsService.getRevenueTrends(),
    []
  );

  const funnelSteps: FunnelStep[] = React.useMemo(
    () => AdminAnalyticsService.getFunnelSteps(),
    []
  );

  const topCities: CityMetric[] = React.useMemo(
    () => AdminAnalyticsService.getTopCities(),
    []
  );

  const activeTrendData = timeframe === "daily" ? revenueTrends.daily : revenueTrends.monthly;

  const chartDataConfig = {
    id: "revenue-bi-chart",
    title: `Gross Transaction Revenue (${timeframe === "daily" ? "Daily" : "Monthly"})`,
    subtitle: comparePrevious ? "Compared to previous period (+18.4% growth)" : "Gross transaction volume",
    total: `₹${(kpis.totalRevenue / 10000000).toFixed(2)} Cr`,
    color: "hsl(155, 43%, 21%)",
    data: activeTrendData,
  };

  const handleExport = (format: string) => {
    toast.success(`Exporting ${reportModule.toUpperCase()} analytics report as ${format.toUpperCase()}...`);
  };

  return (
    <AdminPageContainer maxWidth="1600px">
      {/* ═══ Header ═══ */}
      <PageHeader
        title="Business Intelligence & Analytics"
        subtitle="Executive command center for revenue, conversion funnels, property performance & city growth"
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleExport("pdf")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/60 bg-card hover:bg-muted/40 text-foreground text-xs font-heading font-bold transition-all cursor-pointer shadow-sm"
            >
              <FileText className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
            <button
              type="button"
              onClick={() => handleExport("excel")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/60 bg-card hover:bg-muted/40 text-foreground text-xs font-heading font-bold transition-all cursor-pointer shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Excel</span>
            </button>
            <button
              type="button"
              onClick={() => handleExport("csv")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/60 bg-card hover:bg-muted/40 text-foreground text-xs font-heading font-bold transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">CSV</span>
            </button>
          </div>
        }
      />

      {/* ═══ Mock Report Builder Bar ═══ */}
      <div className="p-4 rounded-2xl bg-card border border-border/60 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-bold text-foreground">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>01 Jan 2026 – 03 Aug 2026</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={reportModule}
              onChange={(e) => setReportModule(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-bold text-foreground outline-none cursor-pointer"
            >
              <option value="all">All Modules (Full Executive Report)</option>
              <option value="revenue">Revenue & Payouts</option>
              <option value="conversion">Conversion Funnel</option>
              <option value="properties">Property & Cities</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-xs font-heading font-bold text-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={comparePrevious}
              onChange={(e) => setComparePrevious(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary/40"
            />
            <span>Compare vs Previous Period</span>
          </label>
        </div>

        <div className="flex items-center gap-1">
          {(["daily", "monthly"] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-xl font-heading text-xs font-bold transition-all cursor-pointer capitalize ${
                timeframe === tf
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ Executive Summary (8 Cards Grid) ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <KpiCard
          label="Total Revenue"
          value={kpis.totalRevenue}
          formattedValue={`₹${(kpis.totalRevenue / 10000000).toFixed(2)}Cr`}
          change={18.4}
          changeType="positive"
          comparisonLabel="vs last period"
          icon={IndianRupee}
        />
        <KpiCard
          label="Net Revenue"
          value={kpis.netRevenue}
          formattedValue={`₹${(kpis.netRevenue / 100000).toFixed(1)}L`}
          change={18.4}
          changeType="positive"
          comparisonLabel="5% commission"
          icon={TrendingUp}
        />
        <KpiCard
          label="MRR"
          value={kpis.mrr}
          formattedValue={`₹${(kpis.mrr / 100000).toFixed(1)}L`}
          change={12.0}
          changeType="positive"
          comparisonLabel="recurring"
          icon={Activity}
        />
        <KpiCard
          label="Active Props"
          value={kpis.activeProperties}
          formattedValue={String(kpis.activeProperties)}
          change={8.5}
          changeType="positive"
          comparisonLabel="listings"
          icon={Building}
        />
        <KpiCard
          label="Occupancy"
          value={kpis.occupancyRate}
          formattedValue={`${kpis.occupancyRate}%`}
          change={4.2}
          changeType="positive"
          comparisonLabel="platform avg"
          icon={Percent}
        />
        <KpiCard
          label="CSAT Rating"
          value={kpis.customerSatisfaction}
          formattedValue={`${kpis.customerSatisfaction}/5`}
          change={2.1}
          changeType="positive"
          comparisonLabel="satisfaction"
          icon={Star}
        />
        <KpiCard
          label="Monthly Growth"
          value={kpis.monthlyGrowth}
          formattedValue={`+${kpis.monthlyGrowth}%`}
          change={18.4}
          changeType="positive"
          comparisonLabel="MoM expansion"
          icon={Sparkles}
        />
        <KpiCard
          label="Health Score"
          value={kpis.platformHealthScore}
          formattedValue={`${kpis.platformHealthScore}/100`}
          change={1.0}
          changeType="positive"
          comparisonLabel="excellent"
          icon={CheckCircle2}
        />
      </div>

      {/* ═══ Revenue Trend Chart (Large) ═══ */}
      <AreaChart chartData={chartDataConfig} />

      {/* ═══ 2-Column Row: Conversion Funnel & Booking Metrics ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Conversion Funnel Widget */}
        <SectionCard title="Platform Conversion Funnel" subtitle="Visitor to Move-in conversion breakdown">
          <div className="space-y-3">
            {funnelSteps.map((step, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-heading font-bold">
                  <span className="text-foreground">{step.stage}</span>
                  <span className="text-primary">{step.count.toLocaleString()} ({step.conversion} conv)</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${100 - idx * 15}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Booking & Operational Metrics */}
        <SectionCard title="Operational & Booking Metrics" subtitle="Booking performance & peak activity">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-muted/20 rounded-xl border border-border/40 space-y-1">
              <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Conversion Rate</span>
              <span className="font-heading text-xl font-extrabold text-emerald-600">1.5%</span>
              <span className="font-body text-[10px] text-muted-foreground block">Visitor → Move-in</span>
            </div>
            <div className="p-4 bg-muted/20 rounded-xl border border-border/40 space-y-1">
              <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Cancellation Rate</span>
              <span className="font-heading text-xl font-extrabold text-foreground">4.2%</span>
              <span className="font-body text-[10px] text-muted-foreground block">Low risk</span>
            </div>
            <div className="p-4 bg-muted/20 rounded-xl border border-border/40 space-y-1">
              <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Avg Booking Value</span>
              <span className="font-heading text-xl font-extrabold text-primary">₹18,500</span>
              <span className="font-body text-[10px] text-muted-foreground block">Rent + Deposit</span>
            </div>
            <div className="p-4 bg-muted/20 rounded-xl border border-border/40 space-y-1">
              <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Peak Hours</span>
              <span className="font-heading text-xl font-extrabold text-foreground">6 PM – 9 PM</span>
              <span className="font-body text-[10px] text-muted-foreground block">Highest traffic</span>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ═══ City Breakdown & Top Properties ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Cities Metrics */}
        <SectionCard title="City Breakdown Analytics" subtitle="Occupancy & revenue by city">
          <div className="space-y-3">
            {topCities.map((c, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-border/40 bg-muted/20 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <span className="font-heading font-bold text-foreground block">{c.city}</span>
                    <span className="font-body text-[10px] text-muted-foreground">{c.bookings} Bookings • {c.occupancy}% Occupancy</span>
                  </div>
                </div>
                <span className="font-heading font-extrabold text-emerald-600">₹{(c.revenue / 100000).toFixed(1)}L</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Top Performing Properties */}
        <SectionCard title="Top Performing Properties" subtitle="Highest revenue & occupancy listings">
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-border/40 bg-muted/20 flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-heading font-bold text-foreground block">Elite Residency PG & Hostel</span>
                <span className="font-body text-[10px] text-muted-foreground">Vijay Nagar, Indore • 92% Occupancy</span>
              </div>
              <span className="font-heading font-extrabold text-primary">₹3.45L Rev</span>
            </div>
            <div className="p-3.5 rounded-xl border border-border/40 bg-muted/20 flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-heading font-bold text-foreground block">Shree Comfort Stay Girls PG</span>
                <span className="font-body text-[10px] text-muted-foreground">Palasia, Indore • 88% Occupancy</span>
              </div>
              <span className="font-heading font-extrabold text-primary">₹2.10L Rev</span>
            </div>
            <div className="p-3.5 rounded-xl border border-border/40 bg-muted/20 flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-heading font-bold text-foreground block">Green Meadows Student Hostel</span>
                <span className="font-body text-[10px] text-muted-foreground">Rau, Indore • 76% Occupancy</span>
              </div>
              <span className="font-heading font-extrabold text-primary">₹2.80L Rev</span>
            </div>
          </div>
        </SectionCard>
      </div>
    </AdminPageContainer>
  );
}
