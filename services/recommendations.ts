import { Property } from "@/services/property";
import { ListingsAPI } from "@/services/listings/listings.api";

export interface RecommendationItem {
  id: string;
  badgeLabel: string;
  reason: string;
  property: Property;
}

export const RecommendationService = {
  getRecommendations: async (): Promise<RecommendationItem[]> => {
    return RecommendationService.getRecommendationsForLocation();
  },

  getRecommendationsForLocation: async (location?: string, propertyType?: string, city?: string): Promise<RecommendationItem[]> => {
    const locName = location && location.trim().length > 0 ? location : undefined;
    const typeName = propertyType && propertyType !== "All" ? propertyType : "Stays";
    const cityName = city && city.trim().length > 0 ? city : "Indore";

    const badges = [
      { id: "rec-loc-1", badgeLabel: "Near Your Search", reason: locName ? `Because you searched ${locName}` : `Trending in ${cityName}` },
      { id: "rec-loc-2", badgeLabel: "Best Rated Nearby", reason: locName ? `Within 2 km of ${locName}` : `Top rated stays in ${cityName}` },
      { id: "rec-loc-3", badgeLabel: "Best Value", reason: `Similar monthly rent for ${typeName}` },
      { id: "rec-loc-4", badgeLabel: "New Listing", reason: `Trending in ${locName || cityName}` },
    ];

    try {
      const res = await ListingsAPI.getListings({
        limit: 4,
        city: cityName,
        area: locName,
      });
      const propsList = res.listings || [];

      return badges
        .map((b, idx) => {
          const prop = propsList[idx];
          if (!prop) return null;
          return {
            ...b,
            property: prop,
          };
        })
        .filter((item): item is RecommendationItem => item !== null && item.property !== undefined);
    } catch {
      return [];
    }
  },
};
