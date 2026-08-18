import { Property } from "@/services/property";
import { propertyService } from "@/services/property/property.service";

const STORAGE_KEY = "roofonclick_compare_ids";
const MAX_COMPARE_LIMIT = 4;

export const CompareService = {
  getCompareIds: (): string[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  setCompareIds: (ids: string[]): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }
  },

  getCompareProperties: async (ids: string[]): Promise<Property[]> => {
    if (!ids || ids.length === 0) return [];
    try {
      const promises = ids.map((id) => propertyService.getPropertyById(id));
      const results = await Promise.all(promises);
      return results.filter((p): p is Property => Boolean(p));
    } catch {
      return [];
    }
  },

  getMaxLimit: (): number => MAX_COMPARE_LIMIT,
};
