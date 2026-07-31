"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/providers/wishlist-provider";
import { useAuth } from "@/providers/auth-provider";
import { Heart, User as UserIcon, Calendar, Settings, LogOut, Building, LayoutDashboard, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { ProfileDropdown, NotificationsButton, ProfileAvatar } from "./profile-dropdown";
import { Portal } from "@/components/shared/portal";
import { toast } from "sonner";

const NAV_ITEMS = ["Explore", "Areas", "For Owners"];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { wishlist, saveLastBrowsingRoute } = useWishlist();
  const { user, role, logout } = useAuth();
  const isAuthenticated = user !== null;

  const wishlistCount = wishlist.length;
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const hamburgerRef = React.useRef<HTMLButtonElement>(null);

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
    } else if (item === "For Owners") {
      if (user?.role === "owner" || role === "owner") {
        router.push("/owner/dashboard");
      } else {
        router.push("/owners");
      }
    }
  };

  const getActiveNavItem = () => {
    if (pathname === "/areas") return "Areas";
    if (pathname === "/owners" || pathname.startsWith("/owner/")) return "For Owners";
    if (pathname === "/") return "Explore";
    return "";
  };

  const activeItem = getActiveNavItem();

  return (
    <>
      <header
        style={
          isScrolled
            ? {
              position: "fixed",
              top: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "80%",
              maxWidth: "1280px",
              zIndex: 100,
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              borderRadius: "9999px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              transition: "all 350ms cubic-bezier(0.16, 1, 0.3, 1)",
            }
            : {
              position: "fixed",
              top: "0px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
              maxWidth: "100%",
              zIndex: 100,
              background: "transparent",
              backdropFilter: "blur(0px)",
              WebkitBackdropFilter: "blur(0px)",
              border: "1px solid transparent",
              borderRadius: "0px",
              boxShadow: "none",
              paddingTop: "1.5rem",
              paddingBottom: "1.5rem",
              transition: "all 350ms cubic-bezier(0.16, 1, 0.3, 1)",
            }
        }
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
              {NAV_ITEMS.map((item) => (
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
              ))}

              {/* Wishlist Link */}
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
            </nav>

            {/* Desktop Auth Controls */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <NotificationsButton />
                  <ProfileDropdown />
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.push("/login")}
                    className="font-heading text-[15px] font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => router.push("/signup")}
                    className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground px-6 py-2.5 rounded-full font-heading text-[14px] font-bold tracking-wide scale-95 hover:scale-100 active:scale-95 transition-all duration-200 cursor-pointer shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    Sign Up
                  </button>
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

              {/* Navigation Items */}
              <nav className="flex flex-col gap-4 mb-6">
                {NAV_ITEMS.map((item) => (
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
                ))}

                {/* Mobile Wishlist Link */}
                <button
                  data-no-intercept="true"
                  onClick={() => {
                    saveLastBrowsingRoute();
                    setIsOpen(false);
                    router.push("/wishlist");
                  }}
                  className="text-left flex items-center gap-2 font-heading text-base font-semibold py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm text-muted-foreground hover:text-primary cursor-pointer"
                >
                  <Heart className={cn("w-4.5 h-4.5 text-rose-500", wishlistCount > 0 && "fill-rose-500")} />
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full select-none">
                      {wishlistCount}
                    </span>
                  )}
                </button>
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
                    <NotificationsButton />
                  </div>

                  {/* Role Menu Options */}
                  <div className="flex flex-col gap-1">
                    {(user?.role || role) === "owner" ? (
                      <>
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            router.push("/owner/dashboard");
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:bg-primary/5 text-left cursor-pointer"
                        >
                          <LayoutDashboard className="w-4 h-4 text-primary shrink-0" />
                          <span>Owner Dashboard</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsOpen(false);
                            router.push("/owner/properties");
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:bg-primary/5 text-left cursor-pointer"
                        >
                          <Building className="w-4 h-4 text-secondary shrink-0" />
                          <span>My Properties</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsOpen(false);
                            router.push("/profile");
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:bg-primary/5 text-left cursor-pointer"
                        >
                          <UserIcon className="w-4 h-4 text-primary shrink-0" />
                          <span>My Profile</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsOpen(false);
                            router.push("/settings");
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:bg-primary/5 text-left cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span>Settings</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            router.push("/profile");
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:bg-primary/5 text-left cursor-pointer"
                        >
                          <UserIcon className="w-4 h-4 text-primary shrink-0" />
                          <span>My Profile</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsOpen(false);
                            router.push("/booking");
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-foreground hover:bg-primary/5 text-left cursor-pointer"
                        >
                          <Calendar className="w-4 h-4 text-secondary shrink-0" />
                          <span>My Bookings</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsOpen(false);
                            router.push("/settings");
                          }}
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
