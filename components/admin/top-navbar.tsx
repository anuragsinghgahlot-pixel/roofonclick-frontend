"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Bell,
  Menu,
  ChevronRight,
  LogOut,
  User,
  Settings,
  ShieldCheck,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { CommandPalette } from "@/components/admin/command-palette";
import { useAuth } from "@/providers/auth-provider";

/* ─── Dynamic Auto-Generated Breadcrumbs ─── */
export function AdminBreadcrumb({ className }: { className?: string }) {
  const pathname = usePathname();

  const segments = React.useMemo(() => {
    const parts = pathname
      .replace(/^\/admin\/?/, "")
      .split("/")
      .filter(Boolean);

    const crumbs = [{ label: "Admin", href: "/admin" }];
    let path = "/admin";

    for (const part of parts) {
      path += `/${part}`;
      const label = part
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      crumbs.push({ label, href: path });
    }

    return crumbs;
  }, [pathname]);

  return (
    <nav aria-label="Breadcrumb" className={cn("hidden sm:flex items-center gap-1.5 text-xs font-body", className)}>
      {segments.map((crumb, idx) => (
        <React.Fragment key={crumb.href}>
          {idx > 0 && (
            <ChevronRight className="w-3 h-3 text-muted-foreground/40 shrink-0" />
          )}
          {idx === segments.length - 1 ? (
            <span className="font-heading font-extrabold text-foreground truncate max-w-[180px]">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="font-heading font-semibold text-muted-foreground hover:text-primary transition-colors truncate max-w-[140px]"
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

/* ─── Main AdminTopNavbar Component ─── */
export function AdminTopNavbar({
  onOpenMobileSidebar,
}: {
  onOpenMobileSidebar: () => void;
}) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);

  const userName = user?.name || "Platform Admin";
  const userEmail = user?.email || "admin@roofonclick.com";
  const userInitial = userName.charAt(0).toUpperCase();

  const [notifications, setNotifications] = React.useState([
    {
      id: "1",
      title: "New Booking #ROC-1091",
      description: "Student Rahul Verma booked Elite Residency PG.",
      time: "5 mins ago",
      read: false,
    },
    {
      id: "2",
      title: "Settlement Processed",
      description: "₹22,800 transferred to owner Rajesh Kumar.",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      title: "New Visit Scheduled",
      description: "Priya Sharma requested visit for Vijay Nagar PG.",
      time: "3 hours ago",
      read: false,
    },
    {
      id: "4",
      title: "System Update Complete",
      description: "RoofOnClick Platform updated to v2.4.",
      time: "1 day ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkItemRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <>
      <header className="h-16 border-b border-border/60 bg-card/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shrink-0 select-none">
        {/* Left: Mobile Menu Toggle + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            aria-label="Open mobile navigation menu"
            className="p-2.5 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground md:hidden cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>

          <AdminBreadcrumb />
        </div>

        {/* Right: Search, ThemeToggle, Notifications, Profile Dropdown */}
        <div className="flex items-center gap-2.5 shrink-0">
          <ThemeToggle />

          {/* Global Search & Command Palette Trigger */}
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 text-muted-foreground hover:text-foreground text-xs font-heading font-semibold transition-all cursor-pointer shadow-xs"
          >
            <Search className="w-3.5 h-3.5 text-primary" />
            <span className="hidden md:inline">Search or jump to...</span>
            <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-card text-[10px] font-mono border border-border/60">
              Ctrl+K
            </kbd>
          </button>

          {/* Notification Button & Drawer */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              aria-label="Notifications"
              aria-expanded={isNotifOpen}
              className="p-2.5 rounded-xl border border-border/60 bg-card text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-all cursor-pointer relative flex items-center justify-center min-w-[42px] min-h-[42px]"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-heading font-extrabold flex items-center justify-center ring-2 ring-card animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            <AnimatePresence>
              {isNotifOpen && (
                <>
                  <div
                    onClick={() => setIsNotifOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 sm:w-88 bg-card border border-border/80 rounded-2xl shadow-xl z-50 p-4 space-y-3 text-left overflow-hidden select-none"
                  >
                    <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-xs font-extrabold text-foreground">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-primary/20">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllRead}
                          className="font-heading text-[10px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Mark All Read</span>
                        </button>
                      )}
                    </div>

                    <div
                      onWheel={(e) => e.stopPropagation()}
                      onTouchMove={(e) => e.stopPropagation()}
                      className="space-y-2 text-xs font-body max-h-[320px] overflow-y-auto overscroll-contain touch-auto pr-1 scrollbar-thin"
                    >
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center space-y-2">
                          <Bell className="w-7 h-7 text-muted-foreground/40 mx-auto" />
                          <p className="font-heading text-xs font-bold text-muted-foreground">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleMarkItemRead(item.id)}
                            className={cn(
                              "p-3 rounded-xl border transition-all cursor-pointer space-y-1 relative group text-left",
                              item.read
                                ? "bg-card/40 border-border/40 hover:bg-card/80"
                                : "bg-primary/5 border-primary/25 hover:bg-primary/10"
                            )}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className={cn("font-heading text-xs truncate", item.read ? "font-bold text-foreground/80" : "font-extrabold text-primary")}>
                                {item.title}
                              </span>
                              <span className="text-[9px] text-muted-foreground shrink-0 font-body">
                                {item.time}
                              </span>
                            </div>
                            <p className="text-muted-foreground text-[11px] font-body leading-tight line-clamp-2">
                              {item.description}
                            </p>
                            {!item.read && (
                              <span className="absolute top-3 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Admin Profile Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-border/60 bg-card hover:bg-muted/40 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground font-heading text-xs font-bold flex items-center justify-center">
                {userInitial}
              </div>
              <span className="hidden sm:inline font-heading text-xs font-bold text-foreground truncate max-w-[120px]">
                {userName}
              </span>
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div
                    onClick={() => setIsProfileOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-card border border-border/80 rounded-2xl shadow-xl z-50 p-2 space-y-1 text-xs font-heading font-bold"
                  >
                    <div className="p-2.5 border-b border-border/40 space-y-0.5">
                      <span className="text-foreground block truncate">{userName}</span>
                      <span className="text-[10px] font-body text-muted-foreground block truncate">{userEmail}</span>
                    </div>

                    <Link
                      href="/admin/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
                    >
                      <Settings className="w-4 h-4 text-primary" /> Platform Settings
                    </Link>

                    <Link
                      href="/admin/owners"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-primary" /> Admin Control
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-destructive hover:bg-destructive/10 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  );
}
