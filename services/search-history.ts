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

const MOCK_RECENT_SEARCHES: RecentSearchItem[] = [
  {
    id: "history-1",
    querySummary: "Girls PG in Vijay Nagar under ₹8,000",
    location: "Vijay Nagar",
    propertyType: "PG",
    maxRent: 8000,
    gender: "Female Only",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "history-2",
    querySummary: "Single Room Hostels in Bhawarkua",
    location: "Bhawarkua",
    propertyType: "Hostel",
    sharingType: "Single",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "history-3",
    querySummary: "AC Rooms in Palasia near College",
    location: "Palasia",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const SearchHistoryService = {
  getRecentSearches: (): RecentSearchItem[] => {
    if (typeof window === "undefined") return MOCK_RECENT_SEARCHES;
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(MOCK_RECENT_SEARCHES));
      return MOCK_RECENT_SEARCHES;
    } catch {
      return MOCK_RECENT_SEARCHES;
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
