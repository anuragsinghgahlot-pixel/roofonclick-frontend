import { Review } from "./review.types";
import { safeGetItem, safeSetItem } from "@/services/property/property.storage";

const STORAGE_KEYS = {
  REVIEWS: "roofonclick_property_reviews",
} as const;

export class ReviewStorageImpl {
  public getReviews(): Review[] {
    return safeGetItem<Review[]>(STORAGE_KEYS.REVIEWS, []);
  }

  public saveReviews(reviews: Review[]): void {
    safeSetItem(STORAGE_KEYS.REVIEWS, reviews);
  }
}

export const ReviewStorage = new ReviewStorageImpl();
