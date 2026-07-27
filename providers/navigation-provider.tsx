"use client";

import * as React from "react";
import { usePathname, useSearchParams, useParams } from "next/navigation";

interface NavigationContextType {
  sourceRoute: string | null;
  currentRoute: string;
  routeParameters: Record<string, string | string[] | undefined>;
  searchQuery: string;
  appliedFilters: Record<string, string>;
}

const NavigationContext = React.createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();

  const currentRoute = React.useMemo(() => {
    const search = searchParams?.toString();
    return `${pathname}${search ? `?${search}` : ""}`;
  }, [pathname, searchParams]);

  const sourceRoute = React.useMemo(() => {
    return searchParams?.get("sourceRoute") || null;
  }, [searchParams]);

  const routeParameters = React.useMemo(() => {
    return params || {};
  }, [params]);

  const searchQuery = React.useMemo(() => {
    if (sourceRoute) {
      try {
        const url = new URL(sourceRoute, "http://dummy.com");
        return url.searchParams.get("query") || url.searchParams.get("location") || "";
      } catch {
        // Ignore
      }
    }
    return searchParams?.get("query") || searchParams?.get("location") || "";
  }, [searchParams, sourceRoute]);

  const appliedFilters = React.useMemo(() => {
    const filters: Record<string, string> = {};
    
    const extractFrom = (sp: URLSearchParams) => {
      sp.forEach((value, key) => {
        if (key !== "sourceRoute") {
          filters[key] = value;
        }
      });
    };

    if (searchParams) {
      extractFrom(searchParams);
    }

    if (sourceRoute) {
      try {
        const url = new URL(sourceRoute, "http://dummy.com");
        extractFrom(url.searchParams);
      } catch {
        // Ignore
      }
    }

    return filters;
  }, [searchParams, sourceRoute]);

  return (
    <NavigationContext.Provider
      value={{
        sourceRoute,
        currentRoute,
        routeParameters,
        searchQuery,
        appliedFilters,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = React.useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
