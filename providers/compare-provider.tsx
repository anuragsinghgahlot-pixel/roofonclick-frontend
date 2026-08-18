"use client";

import * as React from "react";
import { CompareService } from "@/services/compare.service";
import { Property } from "@/services/property";
import { showToast } from "@/lib/toast";

interface CompareContextType {
  compareIds: string[];
  compareProperties: Property[];
  addToCompare: (propertyId: string) => boolean;
  removeFromCompare: (propertyId: string) => void;
  toggleCompare: (propertyId: string) => void;
  clearCompare: () => void;
  isInCompare: (propertyId: string) => boolean;
}

const CompareContext = React.createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareIds, setCompareIds] = React.useState<string[]>(() => CompareService.getCompareIds());
  const [compareProperties, setCompareProperties] = React.useState<Property[]>([]);

  React.useEffect(() => {
    CompareService.setCompareIds(compareIds);
    let isMounted = true;
    CompareService.getCompareProperties(compareIds).then((props) => {
      if (isMounted) setCompareProperties(props);
    });
    return () => {
      isMounted = false;
    };
  }, [compareIds]);

  const addToCompare = React.useCallback(
    (propertyId: string): boolean => {
      if (compareIds.includes(propertyId)) return true;

      if (compareIds.length >= CompareService.getMaxLimit()) {
        showToast.warning(
          "Comparison Limit Reached",
          `You can compare a maximum of ${CompareService.getMaxLimit()} properties at a time.`
        );
        return false;
      }

      setCompareIds((prev) => [...prev, propertyId]);
      showToast.success("Added to Compare", "Property added to side-by-side comparison bar.");
      return true;
    },
    [compareIds]
  );

  const removeFromCompare = React.useCallback((propertyId: string) => {
    setCompareIds((prev) => prev.filter((id) => id !== propertyId));
    showToast.info("Removed from Compare", "Property removed from comparison bar.");
  }, []);

  const toggleCompare = React.useCallback(
    (propertyId: string) => {
      if (compareIds.includes(propertyId)) {
        removeFromCompare(propertyId);
      } else {
        addToCompare(propertyId);
      }
    },
    [compareIds, addToCompare, removeFromCompare]
  );

  const clearCompare = React.useCallback(() => {
    setCompareIds([]);
    showToast.info("Compare Cleared", "All properties removed from comparison bar.");
  }, []);

  const isInCompare = React.useCallback(
    (propertyId: string) => compareIds.includes(propertyId),
    [compareIds]
  );

  return (
    <CompareContext.Provider
      value={{
        compareIds,
        compareProperties,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = React.useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
