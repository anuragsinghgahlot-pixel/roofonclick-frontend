"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/providers/wishlist-provider";
import { useAuth } from "@/providers/auth-provider";
import { Heart, User as UserIcon, Calendar, Settings, LogOut, Building, LayoutDashboard, X, Plus, ChevronDown, MapPin, MessageSquare, Bookmark, Clock, Bell } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { ProfileDropdown, NotificationsButton, ProfileAvatar } from "./profile-dropdown";
import { NotificationDropdown } from "./notification-dropdown";
import { Portal } from "@/components/shared/portal";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { toast } from "sonner";

export const INDORE_AREAS = [
  "Vijay Nagar",
  "Palasia",
  "Bhawarkuan",
  "Geeta Bhawan",
  "Bengali Square",
  "Scheme No. 54",
  "Scheme No. 78",
  "LIG",
  "AB Road",
  "Rajendra Nagar",
  "Annapurna",
  "Sudama Nagar",
];

export const SERVICES_ITEMS = [
  { label: "Hostels", description: "Budget & premium student hostels", filterType: "Hostel", icon: "🏢" },
  { label: "PGs", description: "Paying guest stays with food & laundry", filterType: "PG", icon: "🏠" },
  { label: "Studio / RK", description: "Independent 1RK & studio apartments", filterType: "Studio/RK", icon: "🚪" },
  { label: "BHKs", description: "1BHK, 2BHK & 3BHK full apartments", filterType: "Apartment", icon: "🏬" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { wishlist, saveLastBrowsingRoute } = useWishlist();
  const { user, role, logout } = useAuth();
  const isAuthenticated = user !== null;

  const wishlistCount = wishlist.length;
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);
  const [isAreasOpen, setIsAreasOpen] = React.useState(false);
  const [isServicesOpen, setIsServicesOpen] = React.useState(false);
  const [isMobileAreasOpen, setIsMobileAreasOpen] = React.useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = React.useState(false);
  const areasDropdownRef = React.useRef<HTMLDivElement>(null);
  const servicesDropdownRef = React.useRef<HTMLDivElement>(null);
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const hamburgerRef = React.useRef<HTMLButtonElement>(null);

  // Close dropdowns on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (areasDropdownRef.current && !areasDropdownRef.current.contains(e.target as Node)) {
        setIsAreasOpen(false);
      }
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(e.target as Node)) {
        setIsServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Monitor scroll position to apply sticky effects
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Manage body scroll lock and focus trap on mobile drawer open
  React.useEffect(() => {
    if (!isOpen) return;

    // Lock body scrolling
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // Close on Escape key press
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Trap focus inside the drawer
    const focusableElements = drawerRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    let handleTabKey: ((e: KeyboardEvent) => void) | null = null;

    if (focusableElements && focusableElements.length > 0) {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };

      const drawerNode = drawerRef.current;
      drawerNode?.addEventListener("keydown", handleTabKey);
    }

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener("keydown", handleKeyDown);
      if (handleTabKey && drawerRef.current) {
        drawerRef.current.removeEventListener("keydown", handleTabKey);
      }
    };
  }, [isOpen]);

  const handleNavItemClick = (item: string) => {
    setIsOpen(false);
    if (item === "Explore") {
      router.push("/");
    } else if (item === "Areas") {
      router.push("/areas");
    } else if (item === "Services") {
      router.push("/search");
    } else if (item === "Owner Dashboard") {
      router.push("/owner/dashboard");
    }
  };

  const getActiveNavItem = () => {
    if (pathname === "/areas") return "Areas";
    if (pathname.startsWith("/search")) return "Services";
    if (pathname.startsWith("/owner/")) return "Owner Dashboard";
    if (pathname === "/") return "Explore";
    return "";
  };

  const activeItem = getActiveNavItem();
  const userRole = user?.role || role;
  const isGuest = !isAuthenticated;
  const isOwner = userRole === "owner";
  const isInsideOwnerArea = pathname.startsWith("/owner/");

  const visibleNavItems = React.useMemo(() => {
    if (isGuest) {
      // Guest sees: Explore, Areas, Services
      return ["Explore", "Areas", "Services"];
    }

    if (isOwner) {
      if (isInsideOwnerArea) {
        // Owner inside Dashboard: Explore, Areas, Services
        return ["Explore", "Areas", "Services"];
      }
      // Owner on Public pages: Explore, Areas, Services, Owner Dashboard
      return ["Explore", "Areas", "Services", "Owner Dashboard"];
    }

    // Buyer logged in: Explore, Areas, Services
    return ["Explore", "Areas", "Services"];
  }, [isGuest, isOwner, isInsideOwnerArea]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-1/2 -translate-x-1/2 z-[100] transition-all duration-350 ease-out",
          isScrolled
            ? "top-4 w-[90%] md:w-[80%] max-w-7xl bg-background/85 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-full shadow-lg py-2"
            : "w-full bg-background/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-b border-border/40 md:border-b-0 py-3 md:py-6"
        )}
      >
        <Container>
          <div className="flex h-12 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="font-heading text-xl sm:text-2xl font-extrabold text-primary tracking-tight select-none cursor-pointer">
                RoofOnClick
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 relative h-full">
              {visibleNavItems.map((item) => {
                if (item === "Areas") {
                  return (
                    <div key="Areas" ref={areasDropdownRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setIsAreasOpen(!isAreasOpen)}
                        className={cn(
                          "relative inline-flex items-center gap-1 font-heading text-[15px] font-semibold tracking-wide transition-colors py-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
                          activeItem === "Areas" || isAreasOpen
                            ? "text-primary"
                            : "text-muted-foreground hover:text-primary"
                        )}
                      >
                        <span>Areas</span>
                        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isAreasOpen && "rotate-180")} />
                        {activeItem === "Areas" && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute bottom-[-6px] left-0 right-0 h-[2px] bg-primary rounded-full"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {isAreasOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 mt-3 w-64 bg-card/95 backdrop-blur-md border border-border/80 rounded-2xl shadow-xl p-3 z-50 flex flex-col gap-2"
                          >
                            <div className="flex items-center justify-between px-2.5 py-1 border-b border-border/40">
                              <span className="font-heading text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-secondary" /> Indore City
                              </span>
                              <span className="text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">
                                {INDORE_AREAS.length} Areas
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-1 max-h-56 overflow-y-auto custom-scrollbar p-1">
                              {INDORE_AREAS.map((areaName) => (
                                <button
                                  key={areaName}
                                  type="button"
                                  onClick={() => {
                                    setIsAreasOpen(false);
                                    router.push(`/search?area=${encodeURIComponent(areaName)}`);
                                  }}
                                  className="text-left font-body text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-muted/60 text-foreground hover:text-primary transition-colors truncate cursor-pointer"
                                >
                                  {areaName}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                if (item === "Services") {
                  return (
                    <div key="Services" ref={servicesDropdownRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setIsServicesOpen(!isServicesOpen)}
                        className={cn(
                          "relative inline-flex items-center gap-1 font-heading text-[15px] font-semibold tracking-wide transition-colors py-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
                          activeItem === "Services" || isServicesOpen
                            ? "text-primary"
                            : "text-muted-foreground hover:text-primary"
                        )}
                      >
                        <span>Services</span>
                        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isServicesOpen && "rotate-180")} />
                        {activeItem === "Services" && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute bottom-[-6px] left-0 right-0 h-[2px] bg-primary rounded-full"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </button>

                      {/* Services Dropdown Menu */}
                      <AnimatePresence>
                        {isServicesOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 mt-3 w-72 bg-card/95 backdrop-blur-md border border-border/80 rounded-2xl shadow-xl p-2.5 z-50 flex flex-col gap-1 text-left select-none"
                          >
                            {SERVICES_ITEMS.map((service) => (
                              <button
                                key={service.label}
                                type="button"
                                onClick={() => {
                                  setIsServicesOpen(false);
                                  router.push(`/search?type=${encodeURIComponent(service.filterType)}`);
                                }}
                                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-all cursor-pointer group text-left w-full"
                              >
                                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-base group-hover:scale-105 transition-transform shrink-0">
                                  {service.icon}
                                </div>
                                <div className="flex flex-col text-left min-w-0">
                                  <span className="font-heading text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                    {service.label}
                                  </span>
                                  <span className="font-body text-[10px] text-muted-foreground truncate">
                                    {service.description}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <button
                    key={item}
                    onClick={() => handleNavItemClick(item)}
                    className={cn(
                      "relative font-heading text-[15px] font-semibold tracking-wide transition-colors py-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
                      activeItem === item
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    {item}
                    {activeItem === item && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-[-6px] left-0 right-0 h-[2px] bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}

              {/* Wishlist Link (Buyer Only) */}
              {isAuthenticated && userRole === "buyer" && (
                <button
                  data-no-intercept="true"
                  onClick={() => {
                    saveLastBrowsingRoute();
                    router.push("/wishlist");
                  }}
                  className="relative flex items-center gap-1.5 font-heading text-[15px] font-semibold tracking-wide transition-colors py-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm text-muted-foreground hover:text-primary"
                >
                  <Heart className={cn("w-4 h-4 text-rose-500", wishlistCount > 0 && "fill-rose-500")} />
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full select-none">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              )}
            </nav>

            {/* Desktop Auth Controls */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <NotificationsButton isOpen={isNotificationOpen} onOpenChange={setIsNotificationOpen} />
                  <ProfileDropdown />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    data-no-intercept="true"
                    className="font-heading text-[15px] font-semibold text-muted-foreground hover:text-primary transition-colors py-1 cursor-pointer"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    data-no-intercept="true"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4.5 py-2 rounded-full font-heading text-xs font-bold transition-all duration-300 shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              ref={hamburgerRef}
              type="button"
              data-no-intercept="true"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="relative z-50 p-2 md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded-full hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer select-none shrink-0"
              aria-label={isOpen ? "Close Menu" : "Open Menu"}
              aria-expanded={isOpen}
            >
              <motion.span
                animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-5.5 h-[2px] bg-foreground rounded-full"
              />
              <motion.span
                animate={isOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
                className="w-5.5 h-[2px] bg-foreground rounded-full"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-5.5 h-[2px] bg-foreground rounded-full"
              />
            </button>
          </div>
        </Container>
      </header>

      {/* Structural layout spacer reserving height for fixed navbar */}
      <div className="h-[var(--navbar-height)] w-full shrink-0 pointer-events-none" aria-hidden="true" />

      {/* Mobile Slide-Over Drawer Navigation in Portal */}
      <AnimatePresence>
        {isOpen && (
          <Portal>
            {/* Backdrop Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-backdrop bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Drawer Panel */}
            <motion.div
              ref={drawerRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-modal w-[80vw] sm:w-[320px] max-w-[340px] bg-background p-6 shadow-2xl border-l border-border flex flex-col md:hidden overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6 mt-1">
                <Link href="/" onClick={() => setIsOpen(false)} data-no-intercept="true">
                  <span className="font-heading text-xl sm:text-2xl font-extrabold text-primary tracking-tight select-none">
                    RoofOnClick
                  </span>
                </Link>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <button
                    type="button"
                    data-no-intercept="true"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="flex flex-col gap-3 mb-6">
                {visibleNavItems.map((item) => {
                  if (item === "Areas") {
                    return (
                      <div key="Areas" className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => setIsMobileAreasOpen((prev) => !prev)}
                          className={cn(
                            "flex items-center justify-between font-heading text-base font-semibold py-2 transition-colors focus:outline-none rounded-sm cursor-pointer text-left",
                            activeItem === "Areas" || isMobileAreasOpen ? "text-primary" : "text-muted-foreground hover:text-primary"
                          )}
                        >
                          <span>Areas</span>
                          <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isMobileAreasOpen && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                          {isMobileAreasOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden pl-3 py-1.5 flex flex-col gap-1 border-l-2 border-primary/20 my-1"
                            >
                              <div className="grid grid-cols-2 gap-1 py-1">
                                {INDORE_AREAS.map((areaName) => (
                                  <button
                                    key={areaName}
                                    type="button"
                                    onClick={() => {
                                      setIsMobileAreasOpen(false);
                                      setIsOpen(false);
                                      router.push(`/search?area=${encodeURIComponent(areaName)}`);
                                    }}
                                    className="text-left font-body text-xs font-semibold px-2 py-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-primary transition-colors truncate cursor-pointer"
                                  >
                                    📍 {areaName}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  if (item === "Services") {
                    return (
                      <div key="Services" className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => setIsMobileServicesOpen((prev) => !prev)}
                          className={cn(
                            "flex items-center justify-between font-heading text-base font-semibold py-2 transition-colors focus:outline-none rounded-sm cursor-pointer text-left",
                            activeItem === "Services" || isMobileServicesOpen ? "text-primary" : "text-muted-foreground hover:text-primary"
                          )}
                        >
                          <span>Services</span>
                          <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isMobileServicesOpen && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                          {isMobileServicesOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden pl-3 py-1.5 flex flex-col gap-1.5 border-l-2 border-primary/20 my-1 text-left"
                            >
                              {SERVICES_ITEMS.map((service) => (
                                <button
                                  key={service.label}
                                  type="button"
                                  onClick={() => {
                                    setIsMobileServicesOpen(false);
                                    setIsOpen(false);
                                    router.push(`/search?type=${encodeURIComponent(service.filterType)}`);
                                  }}
                                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-muted/60 transition-all cursor-pointer text-left w-full"
                                >
                                  <span className="text-sm">{service.icon}</span>
                                  <div className="flex flex-col text-left min-w-0">
                                    <span className="font-heading text-xs font-bold text-foreground">
                                      {service.label}
                                    </span>
                                    <span className="font-body text-[10px] text-muted-foreground truncate">
                                      {service.description}
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={item}
                      onClick={() => handleNavItemClick(item)}
                      className={cn(
                        "text-left font-heading text-base font-semibold py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm cursor-pointer",
                        activeItem === item ? "text-primary" : "text-muted-foreground hover:text-primary"
                      )}
                    >
                      {item}
                    </button>
                  );
                })}
              </nav>

              {/* Mobile Auth Controls */}
              {isAuthenticated ? (
                <div className="border-t border-border pt-5 flex flex-col gap-4 mt-auto">
                  {/* User Profile Card */}
                  <div className="flex items-center justify-between p-3 bg-muted/40 rounded-2xl border border-border/80">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ProfileAvatar
                        name={user?.name}
                        email={user?.email}
                        avatarUrl={user?.avatarUrl}
                        size="md"
                      />
                      <div className="flex flex-col min-w-0 text-left">
                        <span className="font-heading text-xs font-extrabold text-primary truncate">
                          {user?.name || (user?.email ? user.email.split("@")[0] : "User")}
                        </span>
                        <span className="font-heading text-[10px] font-bold uppercase tracking-wider text-secondary">
                          {user?.role || role || "Buyer"}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      data-no-intercept="true"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsNotificationOpen(true);
                        setIsOpen(false);
                      }}
                      className="relative p-2.5 rounded-full border border-border/80 bg-card/60 hover:bg-card text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer select-none"
                      aria-label="Notifications"
                    >
                      <Bell className="w-4.5 h-4.5 pointer-events-none" />
                    </button>
                  </div>

                  {/* Role Menu Options */}
                  <div className="flex flex-col gap-1 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                    {(user?.role || role) === "owner" ? (
                      <>
                        <button
                          onClick={() => { setIsOpen(false); router.push("/profile"); }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:bg-primary/5 text-left cursor-pointer"
                        >
                          <UserIcon className="w-4 h-4 text-primary shrink-0" />
                          <span>My Profile</span>
                        </button>

                        <button
                          onClick={() => { setIsOpen(false); router.push("/owner/properties"); }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:bg-primary/5 text-left cursor-pointer"
                        >
                          <Building className="w-4 h-4 text-secondary shrink-0" />
                          <span>My Properties</span>
                        </button>

                        <button
                          onClick={() => { setIsOpen(false); router.push("/owner/dashboard"); }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:bg-primary/5 text-left cursor-pointer"
                        >
                          <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Bookings</span>
                        </button>

                        <button
                          onClick={() => { setIsOpen(false); router.push("/owner/dashboard"); }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:bg-primary/5 text-left cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4 text-sky-500 shrink-0" />
                          <span>Enquiries</span>
                        </button>

                        <button
                          onClick={() => { setIsOpen(false); router.push("/owner/dashboard"); }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:bg-primary/5 text-left cursor-pointer"
                        >
                          <LayoutDashboard className="w-4 h-4 text-primary shrink-0" />
                          <span>Dashboard</span>
                        </button>

                        <button
                          onClick={() => { setIsOpen(false); router.push("/settings"); }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:bg-primary/5 text-left cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span>Settings</span>
                        </button>
                      </>
                    ) : (user?.role || role) === "admin" ? (
                      <>
                        <button
                          onClick={() => { setIsOpen(false); router.push("/admin"); }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:bg-primary/5 text-left cursor-pointer"
                        >
                          <LayoutDashboard className="w-4 h-4 text-primary shrink-0" />
                          <span>Admin Dashboard</span>
                        </button>

                        <button
                          onClick={() => { setIsOpen(false); router.push("/admin/properties"); }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:bg-primary/5 text-left cursor-pointer"
                        >
                          <Building className="w-4 h-4 text-secondary shrink-0" />
                          <span>Manage Properties</span>
                        </button>

                        <button
                          onClick={() => { setIsOpen(false); router.push("/settings"); }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:bg-primary/5 text-left cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span>Settings</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setIsOpen(false); router.push("/profile"); }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:bg-primary/5 text-left cursor-pointer"
                        >
                          <UserIcon className="w-4 h-4 text-primary shrink-0" />
                          <span>My Profile</span>
                        </button>

                        <button
                          onClick={() => { setIsOpen(false); router.push("/wishlist"); }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:bg-primary/5 text-left cursor-pointer"
                        >
                          <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>Wishlist</span>
                        </button>

                        <button
                          onClick={() => { setIsOpen(false); router.push("/saved-searches"); }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:bg-primary/5 text-left cursor-pointer"
                        >
                          <Bookmark className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Saved Searches</span>
                        </button>

                        <button
                          onClick={() => { setIsOpen(false); router.push("/recently-viewed"); }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:bg-primary/5 text-left cursor-pointer"
                        >
                          <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span>Recently Viewed</span>
                        </button>

                        <button
                          onClick={() => { setIsOpen(false); router.push("/booking"); }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:bg-primary/5 text-left cursor-pointer"
                        >
                          <Calendar className="w-4 h-4 text-secondary shrink-0" />
                          <span>My Bookings</span>
                        </button>

                        <button
                          onClick={() => { setIsOpen(false); router.push("/settings"); }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:bg-primary/5 text-left cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span>Settings</span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                      toast.success("Logged out successfully");
                      router.push("/");
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-heading text-xs font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="border-t border-border pt-6 flex flex-col gap-4 mt-auto">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/login");
                    }}
                    className="w-full text-center py-3 text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-fast focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/signup");
                    }}
                    className="w-full text-center py-3 text-sm font-bold bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground rounded-full transition-fast shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </>
  );
}
