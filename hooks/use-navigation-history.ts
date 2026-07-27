"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";

const HISTORY_KEY = "roofonclick_navigation_history";

export function useNavigationHistory() {
  const router = useRouter();
  const pathname = usePathname();

  // Track route changes safely in client-side effect
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const search = window.location.search;
      const currentFullUrl = `${pathname}${search}`;
      const rawHistory = sessionStorage.getItem(HISTORY_KEY);
      let history: string[] = rawHistory ? JSON.parse(rawHistory) : [];

      if (history.length > 1 && history[history.length - 2] === currentFullUrl) {
        // User went back (either browser back or programmatic back)
        history.pop();
      } else if (history[history.length - 1] !== currentFullUrl) {
        // User navigated forward
        history.push(currentFullUrl);
        // Keep max 20 entries
        if (history.length > 20) {
          history = history.slice(history.length - 20);
        }
      }
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      // Fallback silently if storage unavailable
    }
  }, [pathname]);

  const goBack = React.useCallback(
    (fallbackUrl: string = "/") => {
      if (typeof window !== "undefined") {
        try {
          const rawHistory = sessionStorage.getItem(HISTORY_KEY);
          const history: string[] = rawHistory ? JSON.parse(rawHistory) : [];

          if (history.length > 1) {
            // Pop current route
            history.pop();
            const previousUrl = history[history.length - 1];
            sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
            router.push(previousUrl);
            return;
          }
        } catch {
          // Fallback if storage failed
        }
      }

      // If no previous logical route exists, redirect to Home (/)
      router.push("/");
    },
    [router]
  );

  return { goBack };
}
