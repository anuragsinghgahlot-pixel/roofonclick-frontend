export interface RecentSearchItem {
  id: string;
  querySummary: string;
  location?: string;
  propertyType?: string;
  minRent?: number;
  maxRent?: number;
  gender?: string;
  sharingType?: string;
  timestamp: string;
}

const HISTORY_STORAGE_KEY = "stayynest_recent_search_history";

const MOCK_RECENT_SEARCHES: RecentSearchItem[] = [];

export const SearchHistoryService = {
  getRecentSearches: (): RecentSearchItem[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.some(h => h.id.startsWith("history-1") || h.id.startsWith("history-2"))) {
          localStorage.removeItem(HISTORY_STORAGE_KEY);
          return [];
        }
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  },

  addRecentSearch: (item: Omit<RecentSearchItem, "id" | "timestamp">): RecentSearchItem[] => {
    const history = SearchHistoryService.getRecentSearches();
    const newItem: RecentSearchItem = {
      ...item,
      id: `history-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    // Filter duplicates with same query summary and keep last 10
    const filtered = history.filter((h) => h.querySummary !== item.querySummary);
    const updated = [newItem, ...filtered].slice(0, 10);

    if (typeof window !== "undefined") {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  },

  deleteRecentSearch: (id: string): RecentSearchItem[] => {
    const history = SearchHistoryService.getRecentSearches();
    const updated = history.filter((item) => item.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  },

  clearSearchHistory: (): boolean => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
    return true;
  },
};
