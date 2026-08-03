"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionCard } from "@/components/admin/shared";
import {
  Building,
  UserCheck,
  CalendarCheck,
  Star,
  HeadphonesIcon,
  CreditCard,
  Users,
  CheckCircle,
  Megaphone,
  Ticket,
  FileBarChart,
  ShieldPlus,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
  AlertCircle,
  Info,
  Bell,
  Clock,
  ExternalLink,
} from "lucide-react";
import type {
  ActivityItem,
  ActivityType,
  QuickAction,
  HealthMetric,
  AdminNotification,
} from "@/services/admin-dashboard";

/* ─── Activity Icon Map ─── */
const ACTIVITY_ICONS: Record<ActivityType, { icon: React.ElementType; color: string }> = {
  property_submitted: { icon: Building, color: "bg-blue-500/10 text-blue-600" },
  owner_verified: { icon: UserCheck, color: "bg-emerald-500/10 text-emerald-600" },
  booking_confirmed: { icon: CalendarCheck, color: "bg-primary/10 text-primary" },
  review_reported: { icon: Star, color: "bg-amber-500/10 text-amber-600" },
  support_ticket: { icon: HeadphonesIcon, color: "bg-purple-500/10 text-purple-600" },
  payment_received: { icon: CreditCard, color: "bg-emerald-500/10 text-emerald-600" },
  user_registered: { icon: Users, color: "bg-blue-500/10 text-blue-600" },
  property_approved: { icon: CheckCircle, color: "bg-primary/10 text-primary" },
};

/* ─── Quick Action Icon Map ─── */
const QA_ICONS: Record<string, React.ElementType> = {
  CheckCircle,
  UserCheck,
  Megaphone,
  Ticket,
  FileBarChart,
  ShieldPlus,
};

/* ─── Recent Activities Widget ─── */
export function RecentActivities({
  activities,
  className,
}: {
  activities: ActivityItem[];
  className?: string;
}) {
  return (
    <SectionCard
      title="Recent Activities"
      subtitle="Latest platform events"
      icon={TrendingUp}
      actions={
        <button
          type="button"
          className="flex items-center gap-1 font-heading text-[11px] font-bold text-primary hover:text-accent transition-colors cursor-pointer"
        >
          View All <ArrowRight className="w-3 h-3" />
        </button>
      }
      className={className}
    >
      <div className="space-y-0.5 max-h-[360px] overflow-y-auto scrollbar-thin">
        {activities.map((activity) => {
          const config = ACTIVITY_ICONS[activity.type];
          const Icon = config.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors group cursor-pointer"
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform",
                  config.color
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-xs text-foreground/90 leading-relaxed line-clamp-2">
                  {activity.message}
                </p>
                <span className="font-body text-[10px] text-muted-foreground mt-0.5 block">
                  {activity.relativeTime}
                </span>
              </div>
            </div>
          );
        })}

        {activities.length === 0 && (
          <EmptyState message="No recent activities" />
        )}
      </div>
    </SectionCard>
  );
}

/* ─── Quick Actions Widget ─── */
export function QuickActionsWidget({
  actions,
  className,
}: {
  actions: QuickAction[];
  className?: string;
}) {
  return (
    <SectionCard
      title="Quick Actions"
      subtitle="Frequently used operations"
      icon={ArrowRight}
      className={className}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {actions.map((action) => {
          const Icon = QA_ICONS[action.iconName] || CheckCircle;

          return (
            <Link
              key={action.id}
              href={action.href}
              className="relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-border/60 bg-muted/20 hover:bg-primary/5 hover:border-primary/30 transition-all group outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              {action.badge && (
                <span className="absolute top-2 right-2 min-w-[18px] h-[18px] px-1 bg-destructive text-destructive-foreground text-[9px] font-heading font-extrabold rounded-full flex items-center justify-center">
                  {action.badge}
                </span>
              )}
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-center">
                <span className="font-heading text-[11px] font-bold text-foreground block leading-tight">
                  {action.label}
                </span>
                <span className="font-body text-[9px] text-muted-foreground mt-0.5 block leading-tight">
                  {action.description}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </SectionCard>
  );
}

/* ─── Platform Health Widget ─── */
export function PlatformHealth({
  metrics,
  className,
}: {
  metrics: HealthMetric[];
  className?: string;
}) {
  const severityConfig = {
    critical: {
      bg: "bg-destructive/10",
      text: "text-destructive",
      border: "border-destructive/20",
      dot: "bg-destructive",
      icon: AlertCircle,
    },
    warning: {
      bg: "bg-amber-500/10",
      text: "text-amber-600",
      border: "border-amber-500/20",
      dot: "bg-amber-500",
      icon: AlertTriangle,
    },
    info: {
      bg: "bg-blue-500/10",
      text: "text-blue-600",
      border: "border-blue-500/20",
      dot: "bg-blue-500",
      icon: Info,
    },
  };

  return (
    <SectionCard
      title="Platform Health"
      subtitle="Items requiring attention"
      icon={AlertTriangle}
      className={className}
    >
      <div className="space-y-2">
        {metrics.map((metric) => {
          const config = severityConfig[metric.severity];
          const SevIcon = config.icon;

          return (
            <Link
              key={metric.id}
              href={metric.href}
              className={cn(
                "flex items-center justify-between gap-3 p-3 rounded-xl border transition-all hover:shadow-sm group outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                config.bg,
                config.border
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <SevIcon className={cn("w-4 h-4 shrink-0", config.text)} />
                <span className="font-body text-xs font-semibold text-foreground/90 truncate">
                  {metric.label}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={cn("font-heading text-sm font-extrabold", config.text)}>
                  {metric.count}
                </span>
                <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          );
        })}

        {metrics.length === 0 && (
          <EmptyState message="All systems healthy" icon={CheckCircle} />
        )}
      </div>
    </SectionCard>
  );
}

/* ─── Admin Notifications Widget ─── */
export function AdminNotificationsWidget({
  notifications,
  className,
}: {
  notifications: AdminNotification[];
  className?: string;
}) {
  const typeConfig = {
    critical: { bg: "bg-destructive/10", text: "text-destructive", icon: AlertCircle },
    alert: { bg: "bg-amber-500/10", text: "text-amber-600", icon: AlertTriangle },
    warning: { bg: "bg-amber-500/10", text: "text-amber-600", icon: AlertTriangle },
    info: { bg: "bg-blue-500/10", text: "text-blue-600", icon: Info },
  };

  return (
    <SectionCard
      title="Admin Notifications"
      subtitle="Recent alerts & updates"
      icon={Bell}
      actions={
        <button
          type="button"
          className="flex items-center gap-1 font-heading text-[11px] font-bold text-primary hover:text-accent transition-colors cursor-pointer"
        >
          View All <ArrowRight className="w-3 h-3" />
        </button>
      }
      className={className}
    >
      <div className="space-y-1 max-h-[360px] overflow-y-auto scrollbar-thin">
        {notifications.map((notif) => {
          const config = typeConfig[notif.type];
          const NIcon = config.icon;

          return (
            <div
              key={notif.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer",
                notif.isRead ? "hover:bg-muted/20" : "bg-primary/[0.03] hover:bg-primary/[0.06]"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                  config.bg
                )}
              >
                <NIcon className={cn("w-4 h-4", config.text)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading text-[11px] font-bold text-foreground truncate">
                    {notif.title}
                  </h4>
                  {!notif.isRead && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </div>
                <p className="font-body text-[10px] text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">
                  {notif.message}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-2.5 h-2.5 text-muted-foreground/50" />
                  <span className="font-body text-[9px] text-muted-foreground/60">
                    {notif.relativeTime}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {notifications.length === 0 && (
          <EmptyState message="No notifications" icon={Bell} />
        )}
      </div>
    </SectionCard>
  );
}

/* ─── Reusable Empty State ─── */
export function EmptyState({
  message,
  icon: Icon = Info,
  className,
}: {
  message: string;
  icon?: React.ElementType;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-8 gap-3", className)}>
      <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground">
        <Icon className="w-6 h-6" />
      </div>
      <p className="font-body text-sm text-muted-foreground text-center">
        {message}
      </p>
    </div>
  );
}
