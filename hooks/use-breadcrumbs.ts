"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useNavigation } from "@/providers/navigation-provider";

export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent: boolean;
}

export function useBreadcrumbs(customDynamicLabel?: string): BreadcrumbItem[] {
  const pathname = usePathname();
  const { sourceRoute } = useNavigation();

  return React.useMemo(() => {
    if (!pathname || pathname === "/") {
      return [{ label: "Home", href: "/", isCurrent: true }];
    }

    const items: BreadcrumbItem[] = [{ label: "Home", href: "/", isCurrent: false }];

    // Check specific route patterns
    if (pathname.startsWith("/property/")) {
      // Property Details page
      // Determine middle breadcrumbs based on sourceRoute query parameter
      if (sourceRoute) {
        const pathOnly = sourceRoute.split("?")[0];
        if (pathOnly === "/search") {
          items.push({ label: "Search Results", href: sourceRoute, isCurrent: false });
        } else if (pathOnly === "/wishlist") {
          items.push({ label: "Wishlist", href: "/wishlist", isCurrent: false });
        } else if (pathOnly === "/owner/dashboard" || pathOnly === "/owner/properties") {
          items.push({ label: "Owner Dashboard", href: "/owner/dashboard", isCurrent: false });
          items.push({ label: "My Properties", href: "/owner/properties", isCurrent: false });
        } else if (pathOnly === "/profile") {
          items.push({ label: "Profile", href: "/profile", isCurrent: false });
        } else if (pathOnly === "/settings") {
          items.push({ label: "Settings", href: "/settings", isCurrent: false });
        } else {
          items.push({ label: "Search Results", href: "/search", isCurrent: false });
        }
      } else {
        items.push({ label: "Search Results", href: "/search", isCurrent: false });
      }

      items.push({
        label: customDynamicLabel || "Property Details",
        href: pathname,
        isCurrent: true,
      });
      return items;
    }

    if (pathname === "/owner/property/new") {
      items.push({ label: "Owner Dashboard", href: "/owner/dashboard", isCurrent: false });
      items.push({ label: "My Properties", href: "/owner/properties", isCurrent: false });
      items.push({ label: "Add New Property", href: pathname, isCurrent: true });
      return items;
    }

    if (pathname.startsWith("/owner/property/edit/")) {
      items.push({ label: "Owner Dashboard", href: "/owner/dashboard", isCurrent: false });
      items.push({ label: "My Properties", href: "/owner/properties", isCurrent: false });
      items.push({ label: "Edit Property", href: pathname, isCurrent: true });
      return items;
    }

    // Default fallbacks for other standard pages
    if (pathname === "/search") {
      items.push({ label: "Search Results", href: pathname, isCurrent: true });
      return items;
    }
    if (pathname === "/wishlist") {
      items.push({ label: "Wishlist", href: pathname, isCurrent: true });
      return items;
    }
    if (pathname === "/profile") {
      items.push({ label: "Profile", href: pathname, isCurrent: true });
      return items;
    }
    if (pathname === "/settings") {
      items.push({ label: "Settings", href: pathname, isCurrent: true });
      return items;
    }
    if (pathname === "/owner/dashboard") {
      items.push({ label: "Owner Dashboard", href: pathname, isCurrent: true });
      return items;
    }

    // Generic fallback for any other path (using segments)
    const segments = pathname.split("/").filter(Boolean);
    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      let label = segment
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      items.push({
        label,
        href: currentPath,
        isCurrent: isLast,
      });
    });

    return items;
  }, [pathname, customDynamicLabel, sourceRoute]);
}
