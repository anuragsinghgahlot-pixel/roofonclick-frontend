import { Property } from "@/services/property";
import { MOCK_PROPERTIES } from "@/constants/mock-properties";

export interface RecentlyViewedItem {
  id: string;
  viewedAt: string;
  property: Property;
}

const STORAGE_KEY = "stayynest_recently_viewed_history";
const MAX_HISTORY_LIMIT = 10;

const MOCK_RECENT_VIEWED: RecentlyViewedItem[] = [
  {
    id: "p1",
    viewedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    property: MOCK_PROPERTIES[0] as any,
  },
  {
    id: "p2",
    viewedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    property: MOCK_PROPERTIES[1] as any,
  },
];

export const RecentlyViewedService = {
  getRecentlyViewed: (): RecentlyViewedItem[] => {
    if (typeof window === "undefined") return MOCK_RECENT_VIEWED;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_RECENT_VIEWED));
      return MOCK_RECENT_VIEWED;
    } catch {
      return MOCK_RECENT_VIEWED;
    }
  },

  addRecentlyViewed: (property: Property | any): RecentlyViewedItem[] => {
    if (!property || !property.id) return RecentlyViewedService.getRecentlyViewed();

    const history = RecentlyViewedService.getRecentlyViewed();
    const existingIndex = history.findIndex((item) => item.id === property.id);

    const newItem: RecentlyViewedItem = {
      id: property.id,
      viewedAt: new Date().toISOString(),
      property,
    };

    let updated: RecentlyViewedItem[];

    if (existingIndex !== -1) {
      // Move to top
      const filtered = history.filter((item) => item.id !== property.id);
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

  removeRecentlyViewed: (propertyId: string): RecentlyViewedItem[] => {
    const history = RecentlyViewedService.getRecentlyViewed();
    const updated = history.filter((item) => item.id !== propertyId);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  },

  clearRecentlyViewed: (): boolean => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    return true;
  },
};
