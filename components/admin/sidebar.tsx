"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Building,
  Users,
  UserCheck,
  CalendarCheck,
  CreditCard,
  Star,
  HeadphonesIcon,
  Bell,
  BarChart3,
  Megaphone,
  Settings,
  ShieldCheck,
  ScrollText,
  ChevronDown,
  ChevronRight,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Terminal,
  TrendingUp,
  Pin,
  Clock,
  Sparkles,
} from "lucide-react";

/* ─── Types ─── */
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
}

export interface NavGroup {
  id: string;
  label: string;
  icon?: React.ElementType;
  items: NavItem[];
}

/* ─── Enterprise Group Configuration ─── */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: "overview",
    label: "OVERVIEW",
    items: [
      { id: "dash", label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    id: "management",
    label: "MANAGEMENT",
    items: [
      { id: "props", label: "Properties", href: "/admin/properties", icon: Building },
      { id: "owners", label: "Owners", href: "/admin/owners", icon: Users },
      { id: "buyers", label: "Buyers", href: "/admin/buyers", icon: UserCheck },
    ],
  },
  {
    id: "operations",
    label: "OPERATIONS",
    items: [
      { id: "bookings", label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
      { id: "finance", label: "Finance", href: "/admin/payments", icon: CreditCard },
      { id: "reviews", label: "Reviews", href: "/admin/reviews", icon: Star },
      { id: "support", label: "Support", href: "/admin/support", icon: HeadphonesIcon },
    ],
  },
  {
    id: "communication",
    label: "COMMUNICATION",
    items: [
      { id: "notifs", label: "Notifications", href: "/admin/notifications", icon: Bell },
      { id: "marketing", label: "Marketing", href: "/admin/marketing", icon: Megaphone },
    ],
  },
  {
    id: "bi",
    label: "BUSINESS INTELLIGENCE",
    items: [
      { id: "analytics", label: "Analytics", href: "/admin/analytics", icon: TrendingUp },
      { id: "reports", label: "Reports", href: "/admin/reports", icon: BarChart3 },
    ],
  },
  {
    id: "platform",
    label: "PLATFORM",
    items: [
      { id: "platform-cc", label: "Platform Control Center", href: "/admin/platform", icon: Settings },
      { id: "admin-mgmt", label: "Admin Management", href: "/admin/admins", icon: ShieldCheck },
      { id: "dev-center", label: "Developer Center", href: "/admin/developer", icon: Terminal },
      { id: "audit-logs", label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
    ],
  },
];

/* Flattened Nav Items for Quick Lookups */
const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

/* ─── LocalStorage Helpers ─── */
const FAVORITES_KEY = "stayynest_admin_favorites";
const EXPANDED_GROUPS_KEY = "stayynest_admin_expanded_groups";
const RECENTS_KEY = "stayynest_admin_recents";

function getStoredArray(key: string, fallback: string[]): string[] {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStoredArray(key: string, value: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

/* ─── Main Desktop AdminSidebar Component ─── */
export function AdminSidebar({
  isCollapsed,
  onToggleCollapse,
}: {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const pathname = usePathname();

  /* State */
  const [favoriteHrefs, setFavoriteHrefs] = React.useState<string[]>([]);
  const [expandedGroupIds, setExpandedGroupIds] = React.useState<string[]>([]);
  const [recentHrefs, setRecentHrefs] = React.useState<string[]>([]);

  /* Initialize from localStorage */
  React.useEffect(() => {
    setFavoriteHrefs(getStoredArray(FAVORITES_KEY, ["/admin/bookings", "/admin/analytics"]));
    setExpandedGroupIds(
      getStoredArray(EXPANDED_GROUPS_KEY, ["overview", "management", "operations", "communication", "bi", "platform"])
    );
    setRecentHrefs(getStoredArray(RECENTS_KEY, ["/admin/properties", "/admin/payments"]));
  }, []);

  /* Track Recents on Route Change */
  React.useEffect(() => {
    if (!pathname || !pathname.startsWith("/admin")) return;
    setRecentHrefs((prev) => {
      const updated = [pathname, ...prev.filter((p) => p !== pathname)].slice(0, 4);
      setStoredArray(RECENTS_KEY, updated);
      return updated;
    });
  }, [pathname]);

  /* Toggle Favorite */
  const toggleFavorite = (href: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setFavoriteHrefs((prev) => {
      const updated = prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href];
      setStoredArray(FAVORITES_KEY, updated);
      return updated;
    });
  };

  /* Toggle Group Expand */
  const toggleGroupExpand = (groupId: string) => {
    setExpandedGroupIds((prev) => {
      const updated = prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId];
      setStoredArray(EXPANDED_GROUPS_KEY, updated);
      return updated;
    });
  };

  /* Favorite Nav Items */
  const favoriteItems = React.useMemo(() => {
    return ALL_NAV_ITEMS.filter((item) => favoriteHrefs.includes(item.href));
  }, [favoriteHrefs]);

  /* Recent Nav Items */
  const recentItems = React.useMemo(() => {
    return ALL_NAV_ITEMS.filter((item) => recentHrefs.includes(item.href) && !favoriteHrefs.includes(item.href));
  }, [recentHrefs, favoriteHrefs]);

  return (
    <aside
      aria-label="Admin Navigation Sidebar"
      className={cn(
        "fixed left-0 top-0 bottom-0 z-30 flex flex-col bg-card border-r border-border/60 shadow-xs transition-all duration-300 ease-[var(--ease-premium)] select-none",
        isCollapsed ? "w-[76px]" : "w-[270px]"
      )}
    >
      {/* ═══ Header Logo & Toggle ═══ */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border/40 shrink-0">
        <Link href="/admin" className="flex items-center gap-2.5 min-w-0 outline-none">
          <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground font-heading text-sm font-black flex items-center justify-center shrink-0 shadow-sm">
            R
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex flex-col">
              <span className="font-heading text-base font-extrabold text-foreground tracking-tight leading-none truncate">
                RoofOnClick
              </span>
              <span className="font-heading text-[9px] font-extrabold text-primary uppercase tracking-widest mt-0.5">
                Enterprise Admin
              </span>
            </div>
          )}
        </Link>

        <button
          type="button"
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className="p-1.5 rounded-xl border border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* ═══ Scrollable Navigation Groups ═══ */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin">
        {/* ─── FAVORITES / PINNED SECTION ─── */}
        {favoriteItems.length > 0 && (
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-2 py-1 flex items-center justify-between text-[10px] font-heading font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> FAVORITES
                </span>
                <span className="text-[9px] font-body text-muted-foreground">{favoriteItems.length}</span>
              </div>
            )}
            {favoriteItems.map((item) => (
              <NavItemRow
                key={item.href}
                item={item}
                isCollapsed={isCollapsed}
                pathname={pathname}
                isFavorite={true}
                onToggleFavorite={(e) => toggleFavorite(item.href, e)}
              />
            ))}
          </div>
        )}

        {/* ─── RECENTS SECTION ─── */}
        {!isCollapsed && recentItems.length > 0 && (
          <div className="space-y-1">
            <div className="px-2 py-1 flex items-center gap-1 text-[10px] font-heading font-black text-muted-foreground uppercase tracking-wider">
              <Clock className="w-3 h-3 text-muted-foreground" /> RECENT
            </div>
            {recentItems.map((item) => (
              <NavItemRow
                key={item.href}
                item={item}
                isCollapsed={isCollapsed}
                pathname={pathname}
                isFavorite={false}
                onToggleFavorite={(e) => toggleFavorite(item.href, e)}
              />
            ))}
          </div>
        )}

        {/* ─── MAIN NAV GROUPS ─── */}
        {NAV_GROUPS.map((group) => {
          const isGroupExpanded = expandedGroupIds.includes(group.id);

          return (
            <div key={group.id} className="space-y-1">
              {!isCollapsed && (
                <button
                  type="button"
                  onClick={() => toggleGroupExpand(group.id)}
                  className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-heading font-black text-muted-foreground hover:text-foreground uppercase tracking-wider transition-colors cursor-pointer text-left outline-none"
                >
                  <span>{group.label}</span>
                  <motion.div
                    animate={{ rotate: isGroupExpanded ? 0 : -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-3 h-3" />
                  </motion.div>
                </button>
              )}

              <AnimatePresence initial={false}>
                {(isGroupExpanded || isCollapsed) && (
                  <motion.div
                    initial={isCollapsed ? {} : { height: 0, opacity: 0 }}
                    animate={isCollapsed ? {} : { height: "auto", opacity: 1 }}
                    exit={isCollapsed ? {} : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-0.5 overflow-hidden"
                  >
                    {group.items.map((item) => (
                      <NavItemRow
                        key={item.href}
                        item={item}
                        isCollapsed={isCollapsed}
                        pathname={pathname}
                        isFavorite={favoriteHrefs.includes(item.href)}
                        onToggleFavorite={(e) => toggleFavorite(item.href, e)}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

/* ─── Nav Item Row Component ─── */
function NavItemRow({
  item,
  isCollapsed,
  pathname,
  isFavorite,
  onToggleFavorite,
}: {
  item: NavItem;
  isCollapsed: boolean;
  pathname: string;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}) {
  const isActive = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={isCollapsed ? item.label : undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative flex items-center justify-between rounded-xl px-3 py-2 font-heading text-xs font-semibold transition-all duration-200 select-none outline-none cursor-pointer",
        isActive
          ? "bg-primary text-primary-foreground shadow-xs font-bold"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
        isCollapsed && "justify-center px-2 py-2.5"
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon
          className={cn(
            "w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
            isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
          )}
        />
        {!isCollapsed && <span className="truncate">{item.label}</span>}
      </div>

      {!isCollapsed && (
        <button
          type="button"
          onClick={onToggleFavorite}
          title={isFavorite ? "Unstar module" : "Star module"}
          className={cn(
            "p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer outline-none",
            isFavorite && "opacity-100 text-amber-500"
          )}
        >
          <Star className={cn("w-3 h-3", isFavorite && "fill-amber-500")} />
        </button>
      )}
    </Link>
  );
}

/* ─── Mobile Drawer Sidebar Component ─── */
export function AdminMobileSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  // Close mobile sidebar on route change
  React.useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[399] bg-black/50 backdrop-blur-sm lg:hidden"
          />

          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
            className="fixed top-0 left-0 bottom-0 z-[400] w-[280px] bg-card border-r border-border/60 shadow-2xl flex flex-col lg:hidden"
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-border/40 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground font-heading text-sm font-black flex items-center justify-center">
                  R
                </div>
                <span className="font-heading text-base font-extrabold text-foreground">RoofOnClick</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {NAV_GROUPS.map((group) => (
                <div key={group.id} className="space-y-1">
                  <div className="px-2 py-1 text-[10px] font-heading font-black text-muted-foreground uppercase">
                    {group.label}
                  </div>
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 font-heading text-xs font-bold transition-all",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                        )}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
