"use client";

import * as React from "react";
import Link from "next/link";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/shared/section";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { NotificationItem, NotificationService, NotificationCategory } from "@/services/notifications";
import { showToast } from "@/lib/toast";
import {
  Bell,
  CheckCheck,
  Search,
  Trash2,
  Check,
  Building,
  Calendar,
  MessageSquare,
  Heart,
  Bookmark,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

function getCategoryIcon(category: NotificationCategory) {
  switch (category) {
    case "Booking":
      return <Building className="w-4 h-4 text-emerald-500" />;
    case "Visit":
      return <Calendar className="w-4 h-4 text-secondary" />;
    case "Enquiry":
      return <MessageSquare className="w-4 h-4 text-sky-500" />;
    case "Wishlist":
      return <Heart className="w-4 h-4 text-rose-500" />;
    case "SavedSearch":
      return <Bookmark className="w-4 h-4 text-amber-500" />;
    case "Availability":
      return <Clock className="w-4 h-4 text-indigo-500" />;
    default:
      return <Sparkles className="w-4 h-4 text-primary" />;
  }
}

function formatFullDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type TabType = "All" | "Unread" | "Bookings" | "Enquiries" | "Wishlist" | "Updates";

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = React.useState<TabType>("All");
  const [searchQuery, setSearchQuery] = React.useState("");

  const refreshList = React.useCallback(() => {
    setNotifications(NotificationService.getNotifications());
  }, []);

  React.useEffect(() => {
    refreshList();
  }, [refreshList]);

  const handleMarkRead = (id: string) => {
    NotificationService.markAsRead(id);
    refreshList();
  };

  const handleMarkAllRead = () => {
    NotificationService.markAllAsRead();
    showToast.success("All Marked as Read", "Notifications updated.");
    refreshList();
  };

  const handleDelete = (id: string) => {
    NotificationService.deleteNotification(id);
    showToast.info("Notification Removed", "Notification item deleted.");
    refreshList();
  };

  const filteredNotifications = React.useMemo(() => {
    return notifications.filter((n) => {
      // Tab filter
      if (activeTab === "Unread" && n.isRead) return false;
      if (activeTab === "Bookings" && n.category !== "Booking" && n.category !== "Visit") return false;
      if (activeTab === "Enquiries" && n.category !== "Enquiry") return false;
      if (activeTab === "Wishlist" && n.category !== "Wishlist") return false;
      if (activeTab === "Updates" && n.category !== "SavedSearch" && n.category !== "Availability" && n.category !== "Announcement") return false;

      // Search query
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        return n.title.toLowerCase().includes(query) || n.description.toLowerCase().includes(query);
      }

      return true;
    });
  }, [notifications, activeTab, searchQuery]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative flex flex-col min-h-[100dvh] bg-background">
      <Navbar />

      <main className="flex-1" data-no-intercept="true">
        <Section className="bg-background relative overflow-hidden text-left pt-4 sm:pt-6 lg:pt-8 pb-20">
          <Container className="space-y-8">
            <PageHeader
              title="Notification Center"
              subtitle="Stay updated on booking confirmations, owner replies, price drops, and saved search matches."
              badge={
                unreadCount > 0 ? (
                  <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-heading font-extrabold uppercase tracking-wider">
                    {unreadCount} Unread
                  </span>
                ) : undefined
              }
              backFallbackUrl="/profile"
            />

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-card/80 border border-border/80 p-3 rounded-3xl shadow-sm">
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {(["All", "Unread", "Bookings", "Enquiries", "Wishlist", "Updates"] as TabType[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    data-no-intercept="true"
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-2 rounded-2xl font-heading text-xs font-bold transition-all shrink-0 cursor-pointer select-none",
                      activeTab === tab
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search Bar & Bulk Action */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-background border border-border/70 rounded-xl pl-9 pr-3 py-2 text-xs font-body text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    data-no-intercept="true"
                    onClick={handleMarkAllRead}
                    className="px-3.5 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white font-heading text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Mark All Read</span>
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            {filteredNotifications.length === 0 ? (
              <EmptyState
                icon={Bell}
                title="No notifications"
                description="We'll notify you about bookings, enquiries, saved searches and price drops."
                primaryAction={{
                  label: "Explore Properties",
                  href: "/search",
                }}
              />
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "p-4 rounded-3xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left shadow-xs group",
                      item.isRead
                        ? "bg-card/70 border-border/70 hover:border-border"
                        : "bg-primary/5 border-primary/30 hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-card border border-border/70 flex items-center justify-center shrink-0 shadow-xs">
                        {getCategoryIcon(item.category)}
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={cn("font-heading text-sm", item.isRead ? "font-bold text-foreground" : "font-extrabold text-primary")}>
                            {item.title}
                          </h4>
                          <span className="bg-muted px-2 py-0.5 rounded-md text-[10px] font-heading font-extrabold uppercase text-muted-foreground">
                            {item.category}
                          </span>
                          <span className="text-[10px] font-body text-muted-foreground">
                            • {formatFullDate(item.timestamp)}
                          </span>
                        </div>
                        <p className="font-body text-xs text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {item.actionUrl && (
                        <Link
                          href={item.actionUrl}
                          onClick={() => handleMarkRead(item.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground hover:bg-secondary transition-colors font-heading text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>View</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}

                      {!item.isRead && (
                        <button
                          type="button"
                          data-no-intercept="true"
                          onClick={() => handleMarkRead(item.id)}
                          className="p-2 rounded-xl bg-muted/60 text-muted-foreground hover:text-primary hover:bg-muted transition-colors cursor-pointer"
                          title="Mark as Read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        data-no-intercept="true"
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete Notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
