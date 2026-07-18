"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const NAV_ITEMS = ["Explore", "Areas", "For Owners"];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState("Explore");
  const [isOpen, setIsOpen] = React.useState(false);
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const hamburgerRef = React.useRef<HTMLButtonElement>(null);

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

    if (focusableElements && focusableElements.length > 0) {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKey = (e: KeyboardEvent) => {
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

      drawerRef.current?.addEventListener("keydown", handleTabKey);

      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
        drawerRef.current?.removeEventListener("keydown", handleTabKey);
      };
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
              zIndex: 1000,
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
              zIndex: 1000,
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
            <div className="flex items-center">
              <span className="font-heading text-2xl font-extrabold text-primary tracking-tight select-none cursor-pointer">
                RoofOnClick
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 relative h-full">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveItem(item)}
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
            </nav>

            {/* Desktop Auth Controls */}
            <div className="hidden md:flex items-center gap-5">
              <button className="font-heading text-[15px] font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                Sign In
              </button>
              <button className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground px-6 py-2.5 rounded-full font-heading text-[14px] font-bold tracking-wide scale-95 hover:scale-100 active:scale-95 transition-all duration-200 cursor-pointer shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                Sign Up
              </button>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              ref={hamburgerRef}
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-50 p-2 md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded-full hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
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

      {/* Mobile Slide-Over Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-overlay bg-black/40 backdrop-blur-sm md:hidden"
            />

            {/* Drawer Panel */}
            <motion.div
              ref={drawerRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-modal w-[300px] bg-background p-6 shadow-premium border-l border-border flex flex-col md:hidden"
            >
              <div className="flex justify-between items-center mb-8 mt-2">
                <span className="font-heading text-2xl font-extrabold text-primary tracking-tight select-none">
                  StayyNest
                </span>
              </div>

              {/* Navigation Items */}
              <nav className="flex flex-col gap-5 mb-8">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setActiveItem(item);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "text-left font-heading text-lg font-semibold py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
                      activeItem === item ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </nav>

              {/* Action Buttons */}
              <div className="border-t border-border pt-6 flex flex-col gap-4 mt-auto">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-fast focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 text-sm font-bold bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground rounded-full transition-fast shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Sign Up
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
