export interface SavedSearch {
  id: string;
  name: string;
  location?: string;
  minRent?: number;
  maxRent?: number;
  propertyType?: string;
  gender?: string;
  sharingType?: string;
  amenities?: string[];
  querySummary?: string;
  createdAt: string;
}

export function buildSearchSummary(filters: Partial<SavedSearch>): string {
  const parts: string[] = [];
  if (filters.gender) parts.push(filters.gender);
  if (filters.propertyType) parts.push(filters.propertyType);
  if (filters.location) parts.push(`in ${filters.location}`);
  if (filters.minRent || filters.maxRent) {
    parts.push(`(₹${filters.minRent || 0} - ₹${filters.maxRent || "20k+"})`);
  }
  return parts.length > 0 ? parts.join(" ") : "All Stays in Indore";
}

const STORAGE_KEY = "stayynest_saved_searches";

const MOCK_SAVED_SEARCHES: SavedSearch[] = [];

export const SavedSearchService = {
  getSavedSearches: (): SavedSearch[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.some(s => s.id.startsWith("saved-1") || s.id.startsWith("saved-2"))) {
          localStorage.removeItem(STORAGE_KEY);
          return [];
        }
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  },

  saveSearch: (search: Omit<SavedSearch, "id" | "createdAt">): SavedSearch => {
    const searches = SavedSearchService.getSavedSearches();
    const newSearch: SavedSearch = {
      ...search,
      id: `saved-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newSearch, ...searches];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return newSearch;
  },

  renameSearch: (id: string, newName: string): boolean => {
    const searches = SavedSearchService.getSavedSearches();
    const updated = searches.map((s) => (s.id === id ? { ...s, name: newName } : s));
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return true;
  },

  deleteSearch: (id: string): boolean => {
    const searches = SavedSearchService.getSavedSearches();
    const updated = searches.filter((s) => s.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return true;
  },

  duplicateSearch: (id: string): SavedSearch | null => {
    const searches = SavedSearchService.getSavedSearches();
    const target = searches.find((s) => s.id === id);
    if (!target) return null;

    const duplicated: SavedSearch = {
      ...target,
      id: `saved-${Date.now()}`,
      name: `${target.name} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    const updated = [duplicated, ...searches];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return duplicated;
  },
};
