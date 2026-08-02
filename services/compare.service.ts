import { Property } from "@/services/property";
import { MOCK_PROPERTIES } from "@/constants/mock-properties";

const STORAGE_KEY = "stayynest_compare_ids";
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

  getCompareProperties: (ids: string[]): any[] => {
    return ids
      .map((id) => MOCK_PROPERTIES.find((p) => p.id === id))
      .filter((p): p is any => Boolean(p));
  },

  getMaxLimit: (): number => MAX_COMPARE_LIMIT,
};
