/* ─── Admin Dashboard Service ─── */
/* Mock data & interfaces. Backend-ready: swap mock implementations with API calls. */

import { LucideIcon } from "lucide-react";

/* ─── KPI Types ─── */
export interface KpiStat {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  change: number; // percentage
  changeType: "positive" | "negative" | "neutral";
  comparisonLabel: string;
  iconName: string;
}

/* ─── Chart Types ─── */
export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartData {
  id: string;
  title: string;
  subtitle: string;
  data: ChartDataPoint[];
  total?: string;
  color: string;
}

/* ─── Activity Types ─── */
export type ActivityType =
  | "property_submitted"
  | "owner_verified"
  | "booking_confirmed"
  | "review_reported"
  | "support_ticket"
  | "payment_received"
  | "user_registered"
  | "property_approved";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: string;
  relativeTime: string;
}

/* ─── Quick Action Types ─── */
export interface QuickAction {
  id: string;
  label: string;
  description: string;
  iconName: string;
  href: string;
  badge?: string;
}

/* ─── Platform Health Types ─── */
export interface HealthMetric {
  id: string;
  label: string;
  count: number;
  severity: "critical" | "warning" | "info";
  href: string;
}

/* ─── Notification Types ─── */
export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: "alert" | "info" | "warning" | "critical";
  timestamp: string;
  relativeTime: string;
  isRead: boolean;
}

/* ─── Mock Data ─── */

const MOCK_KPIS: KpiStat[] = [
  {
    id: "total-properties",
    label: "Total Properties",
    value: 1284,
    formattedValue: "1,284",
    change: 12.5,
    changeType: "positive",
    comparisonLabel: "vs last month",
    iconName: "Building",
  },
  {
    id: "pending-approval",
    label: "Pending Approval",
    value: 23,
    formattedValue: "23",
    change: -8.3,
    changeType: "negative",
    comparisonLabel: "vs last week",
    iconName: "Clock",
  },
  {
    id: "verified-owners",
    label: "Verified Owners",
    value: 856,
    formattedValue: "856",
    change: 8.2,
    changeType: "positive",
    comparisonLabel: "vs last month",
    iconName: "UserCheck",
  },
  {
    id: "registered-buyers",
    label: "Registered Buyers",
    value: 4521,
    formattedValue: "4,521",
    change: 15.7,
    changeType: "positive",
    comparisonLabel: "vs last month",
    iconName: "Users",
  },
  {
    id: "todays-bookings",
    label: "Today's Bookings",
    value: 18,
    formattedValue: "18",
    change: 24.1,
    changeType: "positive",
    comparisonLabel: "vs yesterday",
    iconName: "CalendarCheck",
  },
  {
    id: "monthly-revenue",
    label: "Monthly Revenue",
    value: 1240000,
    formattedValue: "₹12.4L",
    change: 18.7,
    changeType: "positive",
    comparisonLabel: "vs last month",
    iconName: "IndianRupee",
  },
  {
    id: "pending-support",
    label: "Pending Support",
    value: 7,
    formattedValue: "7",
    change: -14.2,
    changeType: "negative",
    comparisonLabel: "vs last week",
    iconName: "HeadphonesIcon",
  },
  {
    id: "pending-reviews",
    label: "Pending Reviews",
    value: 34,
    formattedValue: "34",
    change: 5.1,
    changeType: "positive",
    comparisonLabel: "vs last week",
    iconName: "Star",
  },
];

const MOCK_CHARTS: ChartData[] = [
  {
    id: "revenue",
    title: "Revenue Overview",
    subtitle: "Monthly revenue trend",
    total: "₹12.4L",
    color: "hsl(155, 43%, 21%)",
    data: [
      { label: "Jan", value: 680000 },
      { label: "Feb", value: 720000 },
      { label: "Mar", value: 810000 },
      { label: "Apr", value: 750000 },
      { label: "May", value: 920000 },
      { label: "Jun", value: 880000 },
      { label: "Jul", value: 1050000 },
      { label: "Aug", value: 980000 },
      { label: "Sep", value: 1120000 },
      { label: "Oct", value: 1080000 },
      { label: "Nov", value: 1180000 },
      { label: "Dec", value: 1240000 },
    ],
  },
  {
    id: "bookings",
    title: "Bookings Trend",
    subtitle: "Monthly booking count",
    total: "342",
    color: "hsl(46, 68%, 47%)",
    data: [
      { label: "Jan", value: 145 },
      { label: "Feb", value: 168 },
      { label: "Mar", value: 192 },
      { label: "Apr", value: 175 },
      { label: "May", value: 210 },
      { label: "Jun", value: 238 },
      { label: "Jul", value: 265 },
      { label: "Aug", value: 248 },
      { label: "Sep", value: 290 },
      { label: "Oct", value: 310 },
      { label: "Nov", value: 325 },
      { label: "Dec", value: 342 },
    ],
  },
  {
    id: "users",
    title: "New Users",
    subtitle: "Monthly registration trend",
    total: "4,521",
    color: "hsl(144, 33%, 37%)",
    data: [
      { label: "Jan", value: 220 },
      { label: "Feb", value: 280 },
      { label: "Mar", value: 350 },
      { label: "Apr", value: 310 },
      { label: "May", value: 420 },
      { label: "Jun", value: 380 },
      { label: "Jul", value: 460 },
      { label: "Aug", value: 510 },
      { label: "Sep", value: 490 },
      { label: "Oct", value: 540 },
      { label: "Nov", value: 580 },
      { label: "Dec", value: 620 },
    ],
  },
  {
    id: "properties",
    title: "Property Growth",
    subtitle: "Monthly new listings",
    total: "1,284",
    color: "hsl(0, 64%, 50%)",
    data: [
      { label: "Jan", value: 42 },
      { label: "Feb", value: 58 },
      { label: "Mar", value: 75 },
      { label: "Apr", value: 68 },
      { label: "May", value: 92 },
      { label: "Jun", value: 85 },
      { label: "Jul", value: 110 },
      { label: "Aug", value: 98 },
      { label: "Sep", value: 125 },
      { label: "Oct", value: 118 },
      { label: "Nov", value: 142 },
      { label: "Dec", value: 156 },
    ],
  },
];

const MOCK_ACTIVITIES: ActivityItem[] = [];

const MOCK_QUICK_ACTIONS: QuickAction[] = [
  {
    id: "qa1",
    label: "Approve Properties",
    description: "Review pending submissions",
    iconName: "CheckCircle",
    href: "/admin/properties",
    badge: "23",
  },
  {
    id: "qa2",
    label: "Verify Owners",
    description: "Pending KYC verifications",
    iconName: "UserCheck",
    href: "/admin/owners",
    badge: "8",
  },
  {
    id: "qa3",
    label: "Broadcast Notification",
    description: "Send to all users",
    iconName: "Megaphone",
    href: "/admin/notifications",
  },
  {
    id: "qa4",
    label: "Create Coupon",
    description: "Promotional discounts",
    iconName: "Ticket",
    href: "/admin/marketing",
  },
  {
    id: "qa5",
    label: "Generate Report",
    description: "Export platform analytics",
    iconName: "FileBarChart",
    href: "/admin/reports",
  },
  {
    id: "qa6",
    label: "Add Admin",
    description: "Invite team members",
    iconName: "ShieldPlus",
    href: "/admin/admins",
  },
];

const MOCK_HEALTH_METRICS: HealthMetric[] = [
  { id: "h1", label: "Pending KYC", count: 12, severity: "warning", href: "/admin/owners" },
  { id: "h2", label: "Low Occupancy (<30%)", count: 8, severity: "info", href: "/admin/properties" },
  { id: "h3", label: "Payment Failures", count: 3, severity: "critical", href: "/admin/payments" },
  { id: "h4", label: "Reported Reviews", count: 5, severity: "warning", href: "/admin/reviews" },
  { id: "h5", label: "Expired Listings", count: 14, severity: "info", href: "/admin/properties" },
];

const MOCK_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "n1",
    title: "Critical: Payment Gateway Down",
    message: "Razorpay API returning 503 errors since 18:30 IST",
    type: "critical",
    timestamp: "2026-08-02T18:35:00Z",
    relativeTime: "42 min ago",
    isRead: false,
  },
  {
    id: "n2",
    title: "Owner Subscription Expiring",
    message: "3 owners have subscriptions expiring in the next 7 days",
    type: "warning",
    timestamp: "2026-08-02T17:00:00Z",
    relativeTime: "2 hours ago",
    isRead: false,
  },
  {
    id: "n3",
    title: "New Admin Login",
    message: "Admin Rohit logged in from new device (Mumbai)",
    type: "alert",
    timestamp: "2026-08-02T16:20:00Z",
    relativeTime: "2.5 hours ago",
    isRead: true,
  },
  {
    id: "n4",
    title: "Daily Backup Completed",
    message: "Database backup completed successfully at 04:00 IST",
    type: "info",
    timestamp: "2026-08-02T04:02:00Z",
    relativeTime: "15 hours ago",
    isRead: true,
  },
  {
    id: "n5",
    title: "High Traffic Alert",
    message: "Platform traffic 40% above normal — no action required",
    type: "info",
    timestamp: "2026-08-02T14:00:00Z",
    relativeTime: "5 hours ago",
    isRead: true,
  },
];

/* ─── Service Class ─── */
export class AdminDashboardService {
  static async getKpis(): Promise<KpiStat[]> {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    return MOCK_KPIS;
  }

  static async getCharts(): Promise<ChartData[]> {
    await new Promise((r) => setTimeout(r, 1200));
    return MOCK_CHARTS;
  }

  static async getActivities(): Promise<ActivityItem[]> {
    await new Promise((r) => setTimeout(r, 600));
    return MOCK_ACTIVITIES;
  }

  static async getQuickActions(): Promise<QuickAction[]> {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_QUICK_ACTIONS;
  }

  static async getHealthMetrics(): Promise<HealthMetric[]> {
    await new Promise((r) => setTimeout(r, 500));
    return MOCK_HEALTH_METRICS;
  }

  static async getNotifications(): Promise<AdminNotification[]> {
    await new Promise((r) => setTimeout(r, 700));
    return MOCK_NOTIFICATIONS;
  }

  /* Synchronous getters for SSR / initial load */
  static getKpisSync(): KpiStat[] {
    return MOCK_KPIS;
  }

  static getChartsSync(): ChartData[] {
    return MOCK_CHARTS;
  }

  static getActivitiesSync(): ActivityItem[] {
    return MOCK_ACTIVITIES;
  }

  static getQuickActionsSync(): QuickAction[] {
    return MOCK_QUICK_ACTIONS;
  }

  static getHealthMetricsSync(): HealthMetric[] {
    return MOCK_HEALTH_METRICS;
  }

  static getNotificationsSync(): AdminNotification[] {
    return MOCK_NOTIFICATIONS;
  }
}
