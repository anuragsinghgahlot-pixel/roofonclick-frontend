"use client";

import * as React from "react";
import { CITIES_REGISTRY, DEFAULT_CITY, CityConfig } from "@/constants/cities";
import { toast } from "sonner";

interface CityContextType {
  selectedCity: CityConfig;
  setCity: (city: CityConfig | string) => void;
  detectLocation: () => Promise<CityConfig | null>;
  isLocating: boolean;
  availableCities: CityConfig[];
}

const STORAGE_KEY = "roofonclick_active_city";
const COOKIE_KEY = "roc_city";

const CityContext = React.createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [selectedCity, setSelectedCityState] = React.useState<CityConfig>(DEFAULT_CITY);
  const [isLocating, setIsLocating] = React.useState(false);

  // Initialize from LocalStorage or Cookies on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const found = CITIES_REGISTRY.find(
          (c) => c.id === stored || c.name.toLowerCase() === stored.toLowerCase()
        );
        if (found) {
          setSelectedCityState(found);
          return;
        }
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  const setCity = React.useCallback((cityOrId: CityConfig | string) => {
    let targetCity: CityConfig | undefined;
    if (typeof cityOrId === "string") {
      targetCity = CITIES_REGISTRY.find(
        (c) => c.id === cityOrId || c.name.toLowerCase() === cityOrId.toLowerCase()
      );
    } else {
      targetCity = cityOrId;
    }

    if (!targetCity) return;

    setSelectedCityState(targetCity);

    try {
      localStorage.setItem(STORAGE_KEY, targetCity.id);
      document.cookie = `${COOKIE_KEY}=${targetCity.id}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Handle cookie/storage restrictions
    }

    if (!targetCity.isLive) {
      toast.info(`${targetCity.name} is launching soon!`, {
        description: `We are onboarding verified stays in ${targetCity.name}. Showing preview areas.`,
      });
    }
  }, []);

  /**
   * Helper to resolve closest registered city from lat/lng
   */
  const findClosestCity = (lat: number, lng: number): CityConfig => {
    let closestCity = CITIES_REGISTRY[0];
    let minDistance = Infinity;

    for (const city of CITIES_REGISTRY) {
      const dLat = city.coordinates.lat - lat;
      const dLng = city.coordinates.lng - lng;
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);
      if (dist < minDistance) {
        minDistance = dist;
        closestCity = city;
      }
    }
    return closestCity;
  };

  /**
   * Fallback IP-based location detector (useful for Brave, Safari, or denied permissions)
   */
  const detectLocationByIP = async (): Promise<CityConfig | null> => {
    try {
      const res = await fetch("https://freeipapi.com/api/json", { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const data = await res.json();
        if (data && data.latitude && data.longitude) {
          const closest = findClosestCity(data.latitude, data.longitude);
          setCity(closest);
          toast.success(`Location set to ${closest.name}`, {
            description: `Auto-detected via network location.`,
          });
          return closest;
        }
      }
    } catch {
      // Ignore network fallback failure
    }
    return null;
  };

  /**
   * 1-Click Location detector.
   * Resolves device GPS coordinates or falls back to IP-based detection.
   */
  const detectLocation = React.useCallback(async (): Promise<CityConfig | null> => {
    setIsLocating(true);

    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      const ipCity = await detectLocationByIP();
      setIsLocating(false);
      return ipCity || DEFAULT_CITY;
    }

    return new Promise((resolve) => {
      try {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const closestCity = findClosestCity(latitude, longitude);

              setCity(closestCity);
              toast.success(`Location set to ${closestCity.name}`, {
                description: `Showing verified student & co-living stays in ${closestCity.name}.`,
              });
              setIsLocating(false);
              resolve(closestCity);
            } catch {
              setCity(DEFAULT_CITY);
              setIsLocating(false);
              resolve(DEFAULT_CITY);
            }
          },
          async () => {
            // Geolocation denied or blocked by browser policy -> Try IP fallback
            const ipCity = await detectLocationByIP();
            setIsLocating(false);
            if (ipCity) {
              resolve(ipCity);
            } else {
              setCity(DEFAULT_CITY);
              toast.info("Using Indore by default", {
                description: "You can select your city anytime from the top menu.",
              });
              resolve(DEFAULT_CITY);
            }
          },
          { timeout: 6000, enableHighAccuracy: false }
        );
      } catch {
        detectLocationByIP().then((city) => {
          setIsLocating(false);
          resolve(city || DEFAULT_CITY);
        });
      }
    });
  }, [setCity]);

  const value = React.useMemo(
    () => ({
      selectedCity,
      setCity,
      detectLocation,
      isLocating,
      availableCities: CITIES_REGISTRY,
    }),
    [selectedCity, setCity, detectLocation, isLocating]
  );

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity() {
  const context = React.useContext(CityContext);
  if (!context) {
    throw new Error("useCity must be used within a CityProvider");
  }
  return context;
}
