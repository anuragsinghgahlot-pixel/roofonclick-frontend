import { Property } from "@/services/property";

export interface RecentlyViewedItem {
  id: string;
  viewedAt: string;
  property: Property;
}

const STORAGE_KEY = "roofonclick_recently_viewed_history";
const MAX_HISTORY_LIMIT = 10;

export const RecentlyViewedService = {
  getRecentlyViewed: (): RecentlyViewedItem[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((item) => Boolean(item && item.property && (item.property.id || item.property._id)));
        }
      }
      return [];
    } catch {
      return [];
    }
  },

  addRecentlyViewed: (property: Property | any): RecentlyViewedItem[] => {
    if (!property || !(property.id || property._id)) return RecentlyViewedService.getRecentlyViewed();

    const propId = property.id || property._id;
    const history = RecentlyViewedService.getRecentlyViewed();
    const existingIndex = history.findIndex((item) => item.id === propId);

    const newItem: RecentlyViewedItem = {
      id: propId,
      viewedAt: new Date().toISOString(),
      property,
    };

    let updated: RecentlyViewedItem[];

    if (existingIndex !== -1) {
      const filtered = history.filter((item) => item.id !== propId);
      updated = [newItem, ...filtered];
    } else {
      updated = [newItem, ...history];
    }

    updated = updated.slice(0, MAX_HISTORY_LIMIT);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Handle storage quota limits gracefully
      }
    }

    return updated;
  },

  clearHistory: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  clearRecentlyViewed: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  removeRecentlyViewed: (propertyId: string): RecentlyViewedItem[] => {
    if (typeof window === "undefined") return [];
    const history = RecentlyViewedService.getRecentlyViewed();
    const updated = history.filter((item) => item.id !== propertyId && item.property?.id !== propertyId);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return updated;
  },
};
