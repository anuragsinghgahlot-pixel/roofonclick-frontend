"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Building,
  Clock,
  UserCheck,
  Users,
  CalendarCheck,
  IndianRupee,
  HeadphonesIcon,
  Star,
  RefreshCw,
} from "lucide-react";
import {
  PageHeader,
  AdminPageContainer,
  KpiCard,
  KpiSkeleton,
  BarChart,
  AreaChart,
  ChartSkeleton,
  SectionSkeleton,
} from "@/components/admin";
import {
  RecentActivities,
  QuickActionsWidget,
  PlatformHealth,
  AdminNotificationsWidget,
} from "@/components/admin/dashboard-widgets";
import { AdminDashboardService } from "@/services/admin-dashboard";
import type {
  KpiStat,
  ChartData,
  ActivityItem,
  QuickAction,
  HealthMetric,
  AdminNotification,
} from "@/services/admin-dashboard";

/* ─── Icon Map ─── */
const ICON_MAP: Record<string, React.ElementType> = {
  Building,
  Clock,
  UserCheck,
  Users,
  CalendarCheck,
  IndianRupee,
  HeadphonesIcon,
  Star,
};

/* ─── Sparkline mock data per KPI ─── */
const SPARKLINE_DATA: Record<string, number[]> = {
  "total-properties": [980, 1010, 1050, 1080, 1120, 1160, 1200, 1240, 1284],
  "pending-approval": [35, 30, 28, 32, 25, 22, 27, 20, 23],
  "verified-owners": [650, 690, 720, 740, 770, 800, 820, 840, 856],
  "registered-buyers": [2800, 3100, 3400, 3600, 3800, 4000, 4200, 4400, 4521],
  "todays-bookings": [12, 15, 10, 18, 14, 20, 16, 22, 18],
  "monthly-revenue": [680, 720, 810, 750, 920, 880, 1050, 980, 1240],
  "pending-support": [12, 10, 8, 11, 9, 7, 10, 8, 7],
  "pending-reviews": [20, 25, 28, 22, 30, 26, 32, 28, 34],
};

const SPARKLINE_COLORS: Record<string, string> = {
  "total-properties": "hsl(155, 43%, 21%)",
  "pending-approval": "hsl(0, 64%, 50%)",
  "verified-owners": "hsl(144, 33%, 37%)",
  "registered-buyers": "hsl(210, 60%, 50%)",
  "todays-bookings": "hsl(46, 68%, 47%)",
  "monthly-revenue": "hsl(155, 43%, 21%)",
  "pending-support": "hsl(0, 64%, 50%)",
  "pending-reviews": "hsl(46, 68%, 47%)",
};

/* ─── Staggered animation container ─── */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function AdminDashboardPage() {
  /* ─── Data States ─── */
  const [kpis, setKpis] = React.useState<KpiStat[] | null>(null);
  const [charts, setCharts] = React.useState<ChartData[] | null>(null);
  const [activities, setActivities] = React.useState<ActivityItem[] | null>(null);
  const [quickActions, setQuickActions] = React.useState<QuickAction[] | null>(null);
  const [healthMetrics, setHealthMetrics] = React.useState<HealthMetric[] | null>(null);
  const [notifications, setNotifications] = React.useState<AdminNotification[] | null>(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  /* ─── Fetch Data ─── */
  const loadAll = React.useCallback(async () => {
    const [k, c, a, q, h, n] = await Promise.all([
      AdminDashboardService.getKpis(),
      AdminDashboardService.getCharts(),
      AdminDashboardService.getActivities(),
      AdminDashboardService.getQuickActions(),
      AdminDashboardService.getHealthMetrics(),
      AdminDashboardService.getNotifications(),
    ]);
    setKpis(k);
    setCharts(c);
    setActivities(a);
    setQuickActions(q);
    setHealthMetrics(h);
    setNotifications(n);
  }, []);

  React.useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setKpis(null);
    setCharts(null);
    setActivities(null);
    setQuickActions(null);
    setHealthMetrics(null);
    setNotifications(null);
    await loadAll();
    setIsRefreshing(false);
  };

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good Morning" : now.getHours() < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <AdminPageContainer>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="space-y-6 sm:space-y-8"
      >
      {/* ═══ Page Header ═══ */}
      <motion.div variants={fadeUp}>
        <PageHeader
          title="Dashboard"
          subtitle={`${greeting}, Super Admin. Here's your platform overview.`}
          actions={
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              aria-label="Refresh dashboard data"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground font-heading text-xs font-bold transition-all cursor-pointer disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          }
        />
      </motion.div>

      {/* ═══ KPI Cards (Row 1) ═══ */}
      <motion.div variants={fadeUp}>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {kpis && kpis.length > 0
            ? kpis.map((kpi) => (
                <KpiCard
                  key={kpi.id}
                  label={kpi.label}
                  value={kpi.value}
                  formattedValue={kpi.formattedValue}
                  change={kpi.change}
                  changeType={kpi.changeType}
                  comparisonLabel={kpi.comparisonLabel}
                  icon={ICON_MAP[kpi.iconName] || Building}
                  sparklineData={SPARKLINE_DATA[kpi.id]}
                  sparklineColor={SPARKLINE_COLORS[kpi.id]}
                />
              ))
            : Array.from({ length: 8 }).map((_, i) => <KpiSkeleton key={i} />)}
        </div>
      </motion.div>

      {/* ═══ Charts (Row 2) ═══ */}
      <motion.div variants={fadeUp}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {charts && charts.length >= 4
            ? <>
                <AreaChart chartData={charts[0]} />
                <BarChart chartData={charts[1]} />
                <BarChart chartData={charts[2]} />
                <BarChart chartData={charts[3]} />
              </>
            : Array.from({ length: 4 }).map((_, i) => <ChartSkeleton key={i} />)}
        </div>
      </motion.div>

      {/* ═══ Activities + Quick Actions (Row 3 + 4) ═══ */}
      <motion.div variants={fadeUp}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {activities ? (
            <RecentActivities activities={activities} />
          ) : (
            <SectionSkeleton rows={6} />
          )}
          {quickActions ? (
            <QuickActionsWidget actions={quickActions} />
          ) : (
            <SectionSkeleton rows={4} />
          )}
        </div>
      </motion.div>

      {/* ═══ Platform Health + Notifications (Row 5 + Right) ═══ */}
      <motion.div variants={fadeUp}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {healthMetrics ? (
            <PlatformHealth metrics={healthMetrics} />
          ) : (
            <SectionSkeleton rows={5} />
          )}
          {notifications ? (
            <AdminNotificationsWidget notifications={notifications} />
          ) : (
            <SectionSkeleton rows={5} />
          )}
        </div>
      </motion.div>
    </motion.div>
  </AdminPageContainer>
);
}
