"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export function NavigationHandler() {
  const router = useRouter();

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Don't intercept clicks inside specific components like profile dropdown, photo uploads, forms, etc.
      if (
        target.closest('[data-no-intercept="true"]') ||
        target.closest('[aria-haspopup="true"]') ||
        target.closest('[role="menu"]') ||
        target.closest('button[aria-expanded]') ||
        target.closest('input[type="file"]') ||
        target.closest('form')
      ) {
        return;
      }

      const interactiveEl = target.closest("a, button") as HTMLElement | null;
      if (!interactiveEl) return;

      const text = (interactiveEl.textContent || "").trim().toLowerCase();
      const href = interactiveEl.getAttribute("href");

      // Don't intercept buttons without hrefs that perform action triggers
      if (
        interactiveEl.tagName === "BUTTON" &&
        (!href || href === "#") &&
        (text.includes("upload") ||
          text.includes("photo") ||
          text.includes("change") ||
          text.includes("save") ||
          text.includes("cancel") ||
          text.includes("remove") ||
          text.includes("edit"))
      ) {
        return;
      }

      // 1. Let valid internal/external routes navigate naturally
      if (href && href !== "#" && !href.startsWith("javascript:")) {
        return;
      }

      // If it's a Logo link or brand, route to home
      if (text === "roofonclick" && (href === "/" || href === "#" || !href)) {
        e.preventDefault();
        e.stopPropagation();
        router.push("/");
        return;
      }

      // Prevent default dead clicks/hashes/javascript links
      e.preventDefault();
      e.stopPropagation();

      // 2. View Details / property click
      if (text.includes("view details")) {
        router.push("/property/elite-residency");
        return;
      }

      // 3. Explore Properties
      if (text.includes("explore properties") || text === "explore") {
        router.push("/explore");
        return;
      }

      // 4. Book Now
      if (text.includes("book now")) {
        router.push("/booking");
        return;
      }

      // 5. Contact Owner / Call / Message
      if (
        text.includes("contact owner") ||
        text.includes("contact host") ||
        text === "message" ||
        text.includes("call owner")
      ) {
        router.push("/contact-owner");
        return;
      }

      // 6. Login / Sign In
      if (text.includes("sign in") || text.includes("login")) {
        router.push("/login");
        return;
      }

      // 7. Sign Up / Register
      if (text.includes("sign up") || text.includes("create account")) {
        router.push("/signup");
        return;
      }

      // 8. Categories / Listings Card Clicks
      if (
        text.includes("listings") ||
        text.includes("boys pg") ||
        text.includes("girls pg") ||
        text.includes("co-living") ||
        text.includes("hostel") ||
        text.includes("studio") ||
        text.includes("1 rk")
      ) {
        router.push("/explore");
        return;
      }

      // 9. Areas / Popular Areas
      if (
        text === "areas" ||
        (text.includes("properties") &&
          (text.includes("vijay nagar") ||
            text.includes("bhawarkuan") ||
            text.includes("palasia") ||
            text.includes("geeta bhawan")))
      ) {
        router.push("/areas");
        return;
      }

      // 10. For Owners links
      if (text.includes("owners") || text.includes("for owners")) {
        router.push("/owners");
        return;
      }

      // 11. Fallback for other clicks
      router.push("/coming-soon");
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [router]);

  return null;
}

export default NavigationHandler;
