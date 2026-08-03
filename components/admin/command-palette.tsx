"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search,
  Building,
  Users,
  UserCheck,
  CalendarCheck,
  CreditCard,
  ShieldCheck,
  BarChart3,
  SlidersHorizontal,
  LayoutDashboard,
  Zap,
  ArrowRight,
  X,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Quick Action";
  icon: React.ElementType;
  action: () => void;
  shortcut?: string;
}

export function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  // Keydown listener for Ctrl+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered by parent state or keyboard event
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const items: CommandItem[] = [
    { id: "nav-dash", title: "Go to Dashboard", category: "Navigation", icon: LayoutDashboard, action: () => { router.push("/admin"); onClose(); } },
    { id: "nav-props", title: "Property Management Command Center", category: "Navigation", icon: Building, action: () => { router.push("/admin/properties"); onClose(); } },
    { id: "nav-owners", title: "Owner Management CRM", category: "Navigation", icon: Users, action: () => { router.push("/admin/owners"); onClose(); } },
    { id: "nav-buyers", title: "Buyer / Student CRM", category: "Navigation", icon: UserCheck, action: () => { router.push("/admin/buyers"); onClose(); } },
    { id: "nav-bookings", title: "Booking Operations Center", category: "Navigation", icon: CalendarCheck, action: () => { router.push("/admin/bookings"); onClose(); } },
    { id: "nav-payments", title: "Payment & Finance Center", category: "Navigation", icon: CreditCard, action: () => { router.push("/admin/payments"); onClose(); } },
    { id: "nav-safety", title: "Trust & Safety Center", category: "Navigation", icon: ShieldCheck, action: () => { router.push("/admin/trust-safety"); onClose(); } },
    { id: "nav-analytics", title: "Business Intelligence Analytics", category: "Navigation", icon: BarChart3, action: () => { router.push("/admin/analytics"); onClose(); } },
    { id: "nav-platform", title: "Platform Control Center (Enterprise)", category: "Navigation", icon: SlidersHorizontal, action: () => { router.push("/admin/platform"); onClose(); } },
    { id: "act-prop", title: "Create New Property Listing", category: "Quick Action", icon: Zap, action: () => { router.push("/admin/properties"); onClose(); } },
  ];

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[499] bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[500] w-full max-w-2xl px-4"
          >
            <div className="bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden space-y-0">
              {/* Search Bar */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40 bg-muted/20">
                <Search className="w-5 h-5 text-primary shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search module... (Press Esc to close)"
                  className="flex-1 bg-transparent text-sm font-heading font-semibold text-foreground placeholder:text-muted-foreground outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="max-h-96 overflow-y-auto p-2 space-y-1">
                {filtered.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.action}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/40 transition-colors text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-heading text-xs font-bold text-foreground block truncate">
                            {item.title}
                          </span>
                          <span className="font-body text-[10px] text-muted-foreground block">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </button>
                  );
                })}

                {filtered.length === 0 && (
                  <div className="py-8 text-center text-xs font-body text-muted-foreground">
                    No commands matching &quot;{query}&quot;
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
