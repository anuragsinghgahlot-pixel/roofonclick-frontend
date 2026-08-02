import { Property } from "@/services/property";
import { MOCK_PROPERTIES } from "@/constants/mock-properties";

export interface RecommendationItem {
  id: string;
  badgeLabel: string;
  reason: string;
  property: Property;
}

export const RecommendationService = {
  getRecommendations: (): RecommendationItem[] => {
    return RecommendationService.getRecommendationsForLocation();
  },

  getRecommendationsForLocation: (location?: string, propertyType?: string): RecommendationItem[] => {
    const locName = location && location.trim().length > 0 ? location : "Indore";
    const typeName = propertyType && propertyType !== "All" ? propertyType : "Stays";

    return [
      {
        id: "rec-loc-1",
        badgeLabel: "Near Your Search",
        reason: `Because you searched ${locName}`,
        property: MOCK_PROPERTIES[0] as any,
      },
      {
        id: "rec-loc-2",
        badgeLabel: "Best Rated Nearby",
        reason: `Within 2 km of ${locName}`,
        property: MOCK_PROPERTIES[1] as any,
      },
      {
        id: "rec-loc-3",
        badgeLabel: "Best Value",
        reason: `Similar monthly rent for ${typeName}`,
        property: MOCK_PROPERTIES[2] as any,
      },
      {
        id: "rec-loc-4",
        badgeLabel: "New Listing",
        reason: `Trending in ${locName}`,
        property: MOCK_PROPERTIES[3] as any,
      },
    ];
  },
};
