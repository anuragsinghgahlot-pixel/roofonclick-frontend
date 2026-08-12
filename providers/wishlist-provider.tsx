"use client";

import * as React from "react";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import { UserAPI } from "@/services/user/user.api";

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  getLastBrowsingRoute: () => string;
  saveLastBrowsingRoute: () => void;
}

const WishlistContext = React.createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, role } = useAuth();
  const [wishlist, setWishlist] = React.useState<string[]>([]);

  const isAuthenticated = user !== null;
  const userRole = user?.role || role;
  const userKey = user?.email ? `roofonclick_wishlist_${user.email}` : "roofonclick_wishlist_guest";

  // Load user-specific wishlist from backend / fallback local storage
  React.useEffect(() => {
    if (typeof window !== "undefined" && isAuthenticated && userRole === "buyer") {
      let isMounted = true;
      UserAPI.getSavedListings()
        .then((props) => {
          if (isMounted) {
            const ids = props.map((p) => p.id);
            setWishlist(ids);
          }
        })
        .catch(() => {
          if (isMounted) {
            try {
              const stored = localStorage.getItem(userKey);
              setWishlist(stored ? JSON.parse(stored) : []);
            } catch {
              setWishlist([]);
            }
          }
        });
      return () => { isMounted = false; };
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated, userRole, userKey]);

  const getLastBrowsingRoute = React.useCallback(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("lastBrowsingRoute") || "/";
    }
    return "/";
  }, []);

  const saveLastBrowsingRoute = React.useCallback(() => {
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login") && window.location.pathname !== "/wishlist") {
      const currentRoute = window.location.pathname + window.location.search;
      sessionStorage.setItem("lastBrowsingRoute", currentRoute);
    }
  }, []);

  // Save wishlist to user-specific storage
  const updateWishlist = React.useCallback(
    (nextList: string[]) => {
      setWishlist(nextList);
      if (typeof window !== "undefined" && userKey) {
        try {
          localStorage.setItem(userKey, JSON.stringify(nextList));
        } catch {
          // ignore
        }
      }
    },
    [userKey]
  );

  // Auto-resolve pending wishlist action after login
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const isUserLoggedIn = user !== null || !!localStorage.getItem("auth_user");
      const activeRole = user?.role || role || (localStorage.getItem("auth_role") as any) || "buyer";

      if (isUserLoggedIn && activeRole === "buyer") {
        const pendingId = sessionStorage.getItem("pending_wishlist_id");
        if (pendingId) {
          sessionStorage.removeItem("pending_wishlist_id");
          setWishlist((prev) => {
            if (!prev.includes(pendingId)) {
              const next = [...prev, pendingId];
              try {
                localStorage.setItem(userKey, JSON.stringify(next));
              } catch {
                // ignore
              }
              showToast.success("Added to Wishlist", "Property saved to your Wishlist.");
              return next;
            }
            return prev;
          });
        }
      }
    }
  }, [user, role, userKey]);

  const toggleWishlist = React.useCallback(
    (id: string) => {
      // Dynamically resolve live session and role
      const isUserLoggedIn = user !== null || (typeof window !== "undefined" && !!localStorage.getItem("auth_user"));
      const activeRole = user?.role || role || (typeof window !== "undefined" ? (localStorage.getItem("auth_role") as any) : null) || "buyer";

      // 1. Unauthenticated Guest Check
      if (!isUserLoggedIn) {
        saveLastBrowsingRoute();
        if (typeof window !== "undefined") {
          sessionStorage.setItem("pending_wishlist_id", id);
        }
        showToast.info("Sign In Required", "Please sign in to save properties to your Wishlist.");
        router.push("/login");
        return;
      }

      // 2. Owner or Admin Check
      if (activeRole === "owner") {
        showToast.warning("Buyer Account Required", "This feature is available for Buyer accounts only.");
        return;
      }

      if (activeRole === "admin") {
        showToast.warning("Unavailable", "Wishlist is unavailable for Admin accounts.");
        return;
      }

      // 3. Buyer Wishlist Toggle
      saveLastBrowsingRoute();
      setWishlist((prev) => {
        const isCurrentlySaved = prev.includes(id);
        let next: string[];
        if (isCurrentlySaved) {
          showToast.info("Removed from Wishlist", "Property removed from your saved stays.");
          next = prev.filter((item) => item !== id);
          UserAPI.unsaveListing(id).catch(() => {});
        } else {
          showToast.success("Added to Wishlist", "Property saved to your Wishlist.");
          next = [...prev, id];
          UserAPI.saveListing(id).catch(() => {});
        }
        if (typeof window !== "undefined" && userKey) {
          try {
            localStorage.setItem(userKey, JSON.stringify(next));
          } catch {
            // ignore
          }
        }
        return next;
      });
    },
    [user, role, saveLastBrowsingRoute, userKey, router]
  );

  const isInWishlist = React.useCallback(
    (id: string) => wishlist.includes(id),
    [wishlist]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        getLastBrowsingRoute,
        saveLastBrowsingRoute,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = React.useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
