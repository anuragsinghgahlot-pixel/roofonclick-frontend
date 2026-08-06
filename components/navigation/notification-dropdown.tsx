"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Calendar,
  MessageSquare,
  Clock,
  Heart,
  Bookmark,
  Building,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";
import { NotificationItem, NotificationService, NotificationCategory } from "@/services/notifications";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/shared/portal";

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

function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

interface NotificationDropdownProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export function NotificationDropdown({
  isOpen: controlledIsOpen,
  onOpenChange,
}: NotificationDropdownProps) {
  const router = useRouter();
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const toggleOpen = React.useCallback(
    (nextState?: boolean) => {
      const next = nextState !== undefined ? nextState : !isOpen;
      if (onOpenChange) {
        onOpenChange(next);
      } else {
        setInternalIsOpen(next);
      }
    },
    [isOpen, onOpenChange]
  );

  const refreshList = React.useCallback(() => {
    setNotifications(NotificationService.getNotifications());
  }, []);

  React.useEffect(() => {
    refreshList();
  }, [refreshList]);

  // Lock body scrolling when mobile notification panel is open
  React.useEffect(() => {
    if (!isOpen) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  // Click outside to close desktop dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        toggleOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, toggleOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    NotificationService.markAllAsRead();
    showToast.success("All Marked as Read", "Notifications updated.");
    refreshList();
  };

  const handleItemClick = (item: NotificationItem) => {
    NotificationService.markAsRead(item.id);
    refreshList();
    toggleOpen(false);
    if (item.actionUrl) {
      router.push(item.actionUrl);
    }
  };

  return (
    <div ref={dropdownRef} data-no-intercept="true" className="relative inline-block text-left">
      {/* Bell Trigger Button */}
      <button
        type="button"
        data-no-intercept="true"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleOpen();
        }}
        className="relative p-2.5 rounded-full border border-border/80 bg-card/60 hover:bg-card hover:border-primary/40 text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer select-none"
        aria-label="Toggle notifications menu"
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-heading font-extrabold flex items-center justify-center animate-pulse border-2 border-background">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Animated Desktop Dropdown / Mobile Sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop & Bottom Sheet (Visible on < md) */}
            <Portal>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => toggleOpen(false)}
                className="fixed inset-0 bg-background/70 backdrop-blur-md z-[2000] md:hidden"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-x-0 bottom-0 z-[2001] rounded-t-[28px] max-h-[80vh] bg-card border-t border-border shadow-2xl p-4 flex flex-col gap-3 md:hidden text-left overflow-hidden"
              >
                {/* Drag Handle indicator */}
                <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto shrink-0" />

                {/* Sticky Header */}
                <div className="flex items-center justify-between border-b border-border/60 pb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-base font-extrabold text-primary">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        data-no-intercept="true"
                        onClick={handleMarkAllRead}
                        className="text-xs font-heading font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <CheckCheck className="w-4 h-4" />
                        <span>Mark All Read</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleOpen(false)}
                      className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Mobile Internal Scroll Content */}
                <div
                  onWheel={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  className="overflow-y-auto overscroll-contain touch-auto space-y-2 pr-1 scrollbar-thin max-h-[60vh]"
                >
                  {notifications.length === 0 ? (
                    <div className="py-12 text-center space-y-2">
                      <Bell className="w-10 h-10 text-muted-foreground/40 mx-auto" />
                      <p className="font-heading text-xs font-bold text-muted-foreground">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className={cn(
                          "p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative group",
                          item.isRead
                            ? "bg-card/40 border-border/40 hover:bg-card/80"
                            : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                        )}
                      >
                        <div className="w-9 h-9 rounded-xl bg-card border border-border/60 flex items-center justify-center shrink-0 shadow-xs">
                          {getCategoryIcon(item.category)}
                        </div>

                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className={cn("font-heading text-xs truncate", item.isRead ? "font-bold text-foreground/90" : "font-extrabold text-primary")}>
                              {item.title}
                            </h4>
                            <span className="text-[10px] font-body text-muted-foreground shrink-0">
                              {formatRelativeTime(item.timestamp)}
                            </span>
                          </div>
                          <p className="font-body text-xs text-muted-foreground line-clamp-2 leading-tight">
                            {item.description}
                          </p>
                        </div>

                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 self-center animate-pulse" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Mobile View All Link */}
                <div className="border-t border-border/60 pt-2 text-center shrink-0">
                  <Link
                    href="/profile/notifications"
                    onClick={() => toggleOpen(false)}
                    className="font-heading text-xs font-bold text-primary hover:text-secondary transition-colors inline-flex items-center gap-1 cursor-pointer py-1"
                  >
                    <span>View All Notifications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            </Portal>

            {/* Desktop Dropdown Panel (Visible on >= md) */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:flex absolute right-0 mt-3 w-96 rounded-3xl bg-card/95 backdrop-blur-xl border border-border/80 shadow-premium p-4 z-dropdown flex-col gap-3 select-none overflow-hidden text-left"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-sm font-extrabold text-primary">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    data-no-intercept="true"
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-heading font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark All Read</span>
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className="max-h-[340px] overflow-y-auto overscroll-contain touch-auto space-y-2 pr-1 scrollbar-thin"
              >
                {notifications.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <Bell className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                    <p className="font-heading text-xs font-bold text-muted-foreground">No notifications yet</p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        "p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative group",
                        item.isRead
                          ? "bg-card/40 border-border/40 hover:bg-card/80"
                          : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                      )}
                    >
                      <div className="w-8 h-8 rounded-xl bg-card border border-border/60 flex items-center justify-center shrink-0 shadow-xs">
                        {getCategoryIcon(item.category)}
                      </div>

                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={cn("font-heading text-xs truncate", item.isRead ? "font-bold text-foreground/90" : "font-extrabold text-primary")}>
                            {item.title}
                          </h4>
                          <span className="text-[9px] font-body text-muted-foreground shrink-0">
                            {formatRelativeTime(item.timestamp)}
                          </span>
                        </div>
                        <p className="font-body text-[11px] text-muted-foreground line-clamp-2 leading-tight">
                          {item.description}
                        </p>
                      </div>

                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 self-center animate-pulse" />
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Bottom View All Link */}
              <div className="border-t border-border/60 pt-3 text-center">
                <Link
                  href="/profile/notifications"
                  onClick={() => toggleOpen(false)}
                  className="font-heading text-xs font-bold text-primary hover:text-secondary transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Notifications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
