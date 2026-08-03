"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/sidebar";
import { AdminTopNavbar } from "@/components/admin/top-navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  /**
   * Disable Lenis smooth-scroll on admin pages.
   * Lenis hijacks document-level wheel events which conflicts with the
   * admin panel's own inner scroll container (`<main>`).
   * We stop it on mount and restart on unmount so the rest of the site is unaffected.
   */
  React.useEffect(() => {
    // Stop Lenis if it's running (it observes body.style mutations)
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      // Restore so Lenis restarts when navigating away from admin
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    /*
     * h-screen (not min-h-screen) locks the wrapper to exactly the viewport.
     * overflow-hidden on the wrapper prevents any document-level scrollbar.
     * The ONLY element that scrolls is <main> below.
     */
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Desktop Sidebar — fixed, full height, own internal scroll */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Mobile Drawer Sidebar */}
      <AdminMobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Column — takes remaining width */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 ease-[var(--ease-premium)]",
          /* Offset for fixed sidebar on desktop */
          isSidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        )}
      >
        {/* Top Navbar — sticky within the scroll container */}
        <AdminTopNavbar
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/*
         * Scrollable Content Area
         * flex-1 + min-h-0 is the key: it allows the element to shrink below
         * its content size so overflow-y-auto actually activates.
         * Without min-h-0, flex children have an implicit min-height of their
         * content, preventing overflow from ever triggering.
         */}
        <main className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-5 lg:p-8 xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
