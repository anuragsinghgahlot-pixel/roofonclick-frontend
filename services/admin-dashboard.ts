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

import { apiClient } from "@/lib/api-client";

export interface AdminStatsResponse {
  kpis: {
    totalProperties: number;
    pendingProperties: number;
    activeProperties: number;
    rejectedProperties: number;
    totalUsers: number;
    totalOwners: number;
    totalSeekers: number;
    totalBookings: number;
    pendingBookings: number;
    totalReviews: number;
  };
}

/* ─── Service Class ─── */
export class AdminDashboardService {
  static async getKpis(): Promise<KpiStat[]> {
    try {
      const res = await apiClient.get<AdminStatsResponse>("/api/admin/stats");

      const kpis = res.data?.kpis || {
        totalProperties: 0,
        pendingProperties: 0,
        activeProperties: 0,
        rejectedProperties: 0,
        totalUsers: 0,
        totalOwners: 0,
        totalSeekers: 0,
        totalBookings: 0,
        pendingBookings: 0,
        totalReviews: 0,
      };

      return [
        {
          id: "total-properties",
          label: "Total Properties",
          value: kpis.totalProperties,
          formattedValue: String(kpis.totalProperties),
          change: 100,
          changeType: "positive",
          comparisonLabel: "live database count",
          iconName: "Building",
        },
        {
          id: "pending-approval",
          label: "Pending Approval",
          value: kpis.pendingProperties,
          formattedValue: String(kpis.pendingProperties),
          change: kpis.pendingProperties > 0 ? 100 : 0,
          changeType: kpis.pendingProperties > 0 ? "negative" : "neutral",
          comparisonLabel: "requires admin review",
          iconName: "Clock",
        },
        {
          id: "active-listings",
          label: "Published Listings",
          value: kpis.activeProperties,
          formattedValue: String(kpis.activeProperties),
          change: 100,
          changeType: "positive",
          comparisonLabel: "active on site",
          iconName: "CheckCircle",
        },
        {
          id: "verified-owners",
          label: "Registered Owners",
          value: kpis.totalOwners,
          formattedValue: String(kpis.totalOwners),
          change: 100,
          changeType: "positive",
          comparisonLabel: "registered owners",
          iconName: "UserCheck",
        },
        {
          id: "registered-buyers",
          label: "Registered Seekers",
          value: kpis.totalSeekers,
          formattedValue: String(kpis.totalSeekers),
          change: 100,
          changeType: "positive",
          comparisonLabel: "registered seekers",
          iconName: "Users",
        },
        {
          id: "total-bookings",
          label: "Tenant Bookings",
          value: kpis.totalBookings,
          formattedValue: String(kpis.totalBookings),
          change: kpis.pendingBookings > 0 ? 100 : 0,
          changeType: "neutral",
          comparisonLabel: `${kpis.pendingBookings} pending`,
          iconName: "CalendarCheck",
        },
      ];
    } catch {
      return MOCK_KPIS;
    }
  }

  static async getCharts(): Promise<ChartData[]> {
    try {
      const res = await apiClient.get<AdminStatsResponse>("/api/admin/stats");

      const kpis = res.data?.kpis;
      if (!kpis) return MOCK_CHARTS;

      return [
        {
          id: "properties",
          title: "Listings Overview",
          subtitle: "Properties by status",
          total: String(kpis.totalProperties),
          color: "hsl(155, 43%, 21%)",
          data: [
            { label: "Active", value: kpis.activeProperties },
            { label: "Pending", value: kpis.pendingProperties },
            { label: "Rejected", value: kpis.rejectedProperties },
          ],
        },
        {
          id: "users",
          title: "User Demographics",
          subtitle: "Registered users by role",
          total: String(kpis.totalUsers),
          color: "hsl(144, 33%, 37%)",
          data: [
            { label: "Seekers", value: kpis.totalSeekers },
            { label: "Owners", value: kpis.totalOwners },
            { label: "Admins", value: Math.max(1, kpis.totalUsers - kpis.totalSeekers - kpis.totalOwners) },
          ],
        },
        {
          id: "bookings",
          title: "Bookings Activity",
          subtitle: "Reservation volume",
          total: String(kpis.totalBookings),
          color: "hsl(46, 68%, 47%)",
          data: [
            { label: "Total", value: kpis.totalBookings },
            { label: "Pending", value: kpis.pendingBookings },
            { label: "Confirmed", value: Math.max(0, kpis.totalBookings - kpis.pendingBookings) },
          ],
        },
        {
          id: "reviews",
          title: "Reviews Moderation",
          subtitle: "User feedback volume",
          total: String(kpis.totalReviews),
          color: "hsl(215, 80%, 55%)",
          data: [
            { label: "Total", value: kpis.totalReviews },
            { label: "Approved", value: kpis.totalReviews },
            { label: "Pending", value: 0 },
          ],
        },
      ];
    } catch {
      return MOCK_CHARTS;
    }
  }

  static async getActivities(): Promise<ActivityItem[]> {
    try {
      const res = await apiClient.get<{ listings: any[] }>("/api/admin/listings?limit=5");
      const listings = res.data?.listings || [];

      return listings.map((item, idx) => ({
        id: item._id || `act-${idx}`,
        type: item.status === "pending" ? "property_submitted" : "property_approved",
        message: item.status === "pending" 
          ? `New property "${item.title}" submitted for approval in ${item.address?.area || 'Indore'}`
          : `Property "${item.title}" active in ${item.address?.area || 'Indore'}`,
        timestamp: item.createdAt || new Date().toISOString(),
        relativeTime: "Recently",
      }));
    } catch {
      return MOCK_ACTIVITIES;
    }
  }

  static async getQuickActions(): Promise<QuickAction[]> {
    try {
      const res = await apiClient.get<AdminStatsResponse>("/api/admin/stats");
      const pendingCount = res.data?.kpis?.pendingProperties || 0;

      return [
        {
          id: "qa1",
          label: "Property Approvals",
          description: "Review pending submissions",
          iconName: "CheckCircle",
          href: "/admin/properties",
          badge: pendingCount > 0 ? String(pendingCount) : undefined,
        },
        {
          id: "qa2",
          label: "Manage Owners",
          description: "View registered property owners",
          iconName: "UserCheck",
          href: "/admin/owners",
        },
        {
          id: "qa3",
          label: "Manage Seekers",
          description: "View registered property seekers",
          iconName: "Users",
          href: "/admin/buyers",
        },
        {
          id: "qa4",
          label: "Bookings Overview",
          description: "View tenant reservation requests",
          iconName: "CalendarCheck",
          href: "/admin/bookings",
        },
        {
          id: "qa5",
          label: "Reviews Moderation",
          description: "Moderate user reviews",
          iconName: "Star",
          href: "/admin/reviews",
        },
      ];
    } catch {
      return MOCK_QUICK_ACTIONS;
    }
  }

  static async getHealthMetrics(): Promise<HealthMetric[]> {
    try {
      const res = await apiClient.get<AdminStatsResponse>("/api/admin/stats");
      const kpis = res.data?.kpis || { pendingProperties: 0, pendingBookings: 0, totalReviews: 0 };

      return [
        { id: "h1", label: "Properties Pending Approval", count: kpis.pendingProperties, severity: kpis.pendingProperties > 0 ? "warning" : "info", href: "/admin/properties" },
        { id: "h2", label: "Pending Bookings", count: kpis.pendingBookings, severity: kpis.pendingBookings > 0 ? "warning" : "info", href: "/admin/bookings" },
        { id: "h3", label: "Total Reviews", count: kpis.totalReviews, severity: "info", href: "/admin/reviews" },
      ];
    } catch {
      return MOCK_HEALTH_METRICS;
    }
  }

  static async getNotifications(): Promise<AdminNotification[]> {
    return MOCK_NOTIFICATIONS;
  }

  /* Synchronous getters for initial state */
  static getKpisSync(): KpiStat[] {
    return [];
  }

  static getChartsSync(): ChartData[] {
    return [];
  }

  static getActivitiesSync(): ActivityItem[] {
    return [];
  }

  static getQuickActionsSync(): QuickAction[] {
    return MOCK_QUICK_ACTIONS;
  }

  static getHealthMetricsSync(): HealthMetric[] {
    return [];
  }

  static getNotificationsSync(): AdminNotification[] {
    return [];
  }
}
