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
import { NotificationDropdown } from "@/components/navigation/notification-dropdown";
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

          {/* Unified Real-Time Notifications Dropdown */}
          <NotificationDropdown isOpen={isNotifOpen} onOpenChange={setIsNotifOpen} />

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
