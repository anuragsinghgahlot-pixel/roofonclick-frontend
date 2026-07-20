"use client";

import * as React from "react";

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  getLastBrowsingRoute: () => string;
  saveLastBrowsingRoute: () => void;
}

const WishlistContext = React.createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = React.useState<string[]>([]);

  const getLastBrowsingRoute = React.useCallback(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("lastBrowsingRoute") || "/";
    }
    return "/";
  }, []);

  const saveLastBrowsingRoute = React.useCallback(() => {
    if (typeof window !== "undefined" && window.location.pathname !== "/wishlist") {
      const currentRoute = window.location.pathname + window.location.search;
      sessionStorage.setItem("lastBrowsingRoute", currentRoute);
    }
  }, []);

  const toggleWishlist = React.useCallback((id: string) => {
    saveLastBrowsingRoute();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, [saveLastBrowsingRoute]);

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
