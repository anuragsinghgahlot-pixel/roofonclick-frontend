"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Heart,
  Calendar,
  Settings,
  LogOut,
  Building,
  ChevronDown,
  Bell,
  LayoutDashboard,
  Plus,
  Bookmark,
  Clock,
  Scale,
} from "lucide-react";
import { useAuth, UserRole } from "@/providers/auth-provider";
import { EnquiryService } from "@/services/enquiry";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { showToast } from "@/lib/toast";

/**
 * Calculates uppercase 1-2 letter initials from full name or email.
 */
export function getInitials(name?: string, email?: string): string {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }
  if (email && email.trim().length > 0) {
    const username = email.split("@")[0];
    const parts = username.split(/[._-]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  }
  return "U";
}

export function ProfileAvatar({
  name,
  email,
  avatarUrl,
  size = "md",
  className,
}: {
  name?: string;
  email?: string;
  avatarUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const initials = getInitials(name, email);

  const sizeClasses = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-8.5 h-8.5 text-xs",
    lg: "w-11 h-11 text-sm",
  }[size];

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name || "User Profile"}
        data-no-intercept="true"
        className={cn(
          sizeClasses,
          "rounded-full object-cover border border-primary/20 shadow-sm shrink-0 pointer-events-none",
          className
        )}
      />
    );
  }

  return (
    <div
      data-no-intercept="true"
      className={cn(
        sizeClasses,
        "rounded-full bg-primary/10 border border-primary/25 text-primary font-heading font-extrabold flex items-center justify-center shrink-0 select-none shadow-sm transition-transform duration-300 pointer-events-none",
        className
      )}
    >
      {initials}
    </div>
  );
}

import { CallbackService, CALLBACK_UPDATED_EVENT } from "@/services/callback/callback.service";
import { NotificationDropdown } from "./notification-dropdown";

export function NotificationsButton() {
  const { user, role } = useAuth();
  const isOwner = user !== null && (user.role === "owner" || role === "owner");

  if (!isOwner) {
    return <NotificationDropdown />;
  }

  const getCombinedCount = React.useCallback(() => {
    return EnquiryService.getPendingCount() + CallbackService.getPendingCount();
  }, []);

  const [unreadCount, setUnreadCount] = React.useState<number>(() => {
    return EnquiryService.getPendingCount() + CallbackService.getPendingCount();
  });

  React.useEffect(() => {
    const updateCount = () => {
      setUnreadCount(getCombinedCount());
    };
    updateCount();
    window.addEventListener("focus", updateCount);
    window.addEventListener(CALLBACK_UPDATED_EVENT, updateCount);
    const interval = setInterval(updateCount, 2000);
    return () => {
      window.removeEventListener("focus", updateCount);
      window.removeEventListener(CALLBACK_UPDATED_EVENT, updateCount);
      clearInterval(interval);
    };
  }, [getCombinedCount]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (unreadCount > 0) {
      showToast.info("Pending Enquiries & Visits", `You have ${unreadCount} pending request(s) on your Owner Dashboard.`);
    } else {
      showToast.info("You're all caught up.", "You have no new notifications or property alerts.");
    }
  };

  return (
    <button
      type="button"
      data-no-intercept="true"
      onClick={handleClick}
      aria-label="Notifications"
      className="relative p-2.5 rounded-full text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
    >
      <Bell className="w-4.5 h-4.5 pointer-events-none" />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-background animate-pulse pointer-events-none">
          {unreadCount}
        </span>
      )}
    </button>
  );
}

export function ProfileDropdown() {
  const router = useRouter();
  const { user, role, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const activeRole: UserRole = user?.role || role || "buyer";
  const displayName = user?.name || (user?.email ? user.email.split("@")[0] : "User");
  const isOwner = activeRole === "owner";

  // Outside click listener & ESC key support
  React.useEffect(() => {
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("touchstart", handlePointerDown);
      document.addEventListener("keydown", handleGlobalKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [isOpen]);

  // Focus management when menu opens
  React.useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstFocusable = menuRef.current.querySelector<HTMLElement>(
        'button:not([disabled]), [tabindex="0"]:not([disabled])'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  // Keyboard navigation inside the trigger button
  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(true);
    } else if (e.key === "Escape" && isOpen) {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  // Keyboard navigation inside menu items
  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!menuRef.current) return;
    const focusables = Array.from(
      menuRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [role="menuitem"]:not([disabled])')
    );
    const currentIndex = focusables.indexOf(document.activeElement as HTMLElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % focusables.length;
      focusables[nextIndex]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + focusables.length) % focusables.length;
      focusables[prevIndex]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      focusables[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      focusables[focusables.length - 1]?.focus();
    }
  };

  return (
    <div ref={dropdownRef} data-no-intercept="true" className="relative inline-block text-left">
      {/* Desktop Profile Trigger Button (TOGGLES DROPDOWN ONLY - NO NAVIGATION) */}
      <button
        ref={triggerRef}
        type="button"
        id="profile-menu-button"
        data-no-intercept="true"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls="profile-dropdown-menu"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border border-border/80 bg-card/60 hover:bg-card hover:border-primary/40 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-sm select-none",
          isOpen && "border-primary bg-card ring-2 ring-primary/10"
        )}
      >
        <ProfileAvatar name={displayName} email={user?.email} avatarUrl={user?.avatarUrl} size="md" />
        
        <span className="font-heading text-xs font-bold text-primary max-w-[110px] truncate select-none">
          {displayName}
        </span>

        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-muted-foreground transition-transform duration-300 shrink-0 pointer-events-none",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>

      {/* Floating Animated Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            id="profile-dropdown-menu"
            role="menu"
            aria-labelledby="profile-menu-button"
            tabIndex={-1}
            onKeyDown={handleMenuKeyDown}
            data-no-intercept="true"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute right-0 mt-3 w-64 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/80 shadow-premium p-2 z-dropdown flex flex-col gap-1 select-none overflow-hidden focus:outline-none"
          >
            {/* User Header */}
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/40 select-none">
              <ProfileAvatar name={displayName} email={user?.email} avatarUrl={user?.avatarUrl} size="lg" />
              <div className="flex flex-col min-w-0 text-left">
                <span className="font-heading text-sm font-extrabold text-primary truncate leading-tight">
                  {displayName}
                </span>
                <span className="font-body text-[11px] text-muted-foreground truncate">
                  {user?.email || "Account Profile"}
                </span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 font-heading text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                      isOwner
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : "bg-primary/10 text-primary border-primary/20"
                    )}
                  >
                    <span>{isOwner ? "🏢" : "👤"}</span>
                    <span>{isOwner ? "Owner" : "Buyer"}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px bg-border/60 my-1" />

            {/* Menu Links */}
            <div className="flex flex-col gap-0.5">
              {isOwner ? (
                <>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleNavigate("/owner/dashboard")}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer text-left focus:outline-none focus:bg-primary/5 focus:text-primary"
                  >
                    <LayoutDashboard className="w-4 h-4 text-primary shrink-0" />
                    <span>Owner Dashboard</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleNavigate("/owner/dashboard")}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer text-left focus:outline-none focus:bg-primary/5 focus:text-primary"
                  >
                    <Building className="w-4 h-4 text-secondary shrink-0" />
                    <span>My Properties</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleNavigate("/owner/property/new")}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer text-left focus:outline-none focus:bg-primary/5 focus:text-primary"
                  >
                    <Plus className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Add Property</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleNavigate("/profile")}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer text-left focus:outline-none focus:bg-primary/5 focus:text-primary"
                  >
                    <UserIcon className="w-4 h-4 text-primary shrink-0" />
                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleNavigate("/settings")}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer text-left focus:outline-none focus:bg-primary/5 focus:text-primary"
                  >
                    <Settings className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span>Settings</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleNavigate("/profile")}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer text-left focus:outline-none focus:bg-primary/5 focus:text-primary"
                  >
                    <UserIcon className="w-4 h-4 text-primary shrink-0" />
                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleNavigate("/wishlist")}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer text-left focus:outline-none focus:bg-primary/5 focus:text-primary"
                  >
                    <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Wishlist</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleNavigate("/saved-searches")}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer text-left focus:outline-none focus:bg-primary/5 focus:text-primary"
                  >
                    <Bookmark className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Saved Searches</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleNavigate("/recently-viewed")}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer text-left focus:outline-none focus:bg-primary/5 focus:text-primary"
                  >
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Recently Viewed</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleNavigate("/booking")}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer text-left focus:outline-none focus:bg-primary/5 focus:text-primary"
                  >
                    <Calendar className="w-4 h-4 text-secondary shrink-0" />
                    <span>My Bookings</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleNavigate("/settings")}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer text-left focus:outline-none focus:bg-primary/5 focus:text-primary"
                  >
                    <Settings className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span>Settings</span>
                  </button>
                </>
              )}
            </div>

            <div className="h-px bg-border/60 my-1" />

            {/* Logout Button */}
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-bold text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 transition-all duration-200 cursor-pointer text-left focus:outline-none focus:bg-rose-500/10"
            >
              <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
