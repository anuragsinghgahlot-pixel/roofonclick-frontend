import { Review } from "./review.types";
import { ReviewStorage } from "./review.storage";
import { apiClient } from "@/lib/api-client";

// Initial reviews array (empty for production DB mode)
const INITIAL_REVIEWS: Review[] = [];

class ReviewServiceImpl {
  constructor() {
    // Seed default reviews if storage is empty
    if (typeof window !== "undefined") {
      try {
        const existing = ReviewStorage.getReviews();
        if (existing.length === 0) {
          ReviewStorage.saveReviews(INITIAL_REVIEWS);
        } else {
          // Normalize existing legacy reviews to ensure they don't cause runtime crashes
          const normalized = existing.map(r => ({
            ...r,
            stayDate: r.stayDate || "July 2026",
            isVerifiedStay: typeof r.isVerifiedStay === "boolean" ? r.isVerifiedStay : true,
            recommend: typeof r.recommend === "boolean" ? r.recommend : true,
            helpfulCount: typeof r.helpfulCount === "number" ? r.helpfulCount : 0,
            helpfulUsers: Array.isArray(r.helpfulUsers) ? r.helpfulUsers : [],
          }));
          ReviewStorage.saveReviews(normalized);
        }
      } catch (e) {
        console.warn("[ReviewService] Failed to seed reviews", e);
      }
    }
  }

  public getReviewsByPropertyId(propertyId: string): Review[] {
    const allReviews = ReviewStorage.getReviews();
    return allReviews.filter((r) => r.propertyId === propertyId);
  }

  public addReview(
    propertyId: string,
    reviewData: { 
      userName: string; 
      userAvatarUrl?: string; 
      rating: number; 
      title: string; 
      text: string; 
      images?: string[]; 
      stayDate: string;
      isVerifiedStay: boolean;
      recommend: boolean;
    }
  ): Review {
    const allReviews = ReviewStorage.getReviews();
    const newReview: Review = {
      ...reviewData,
      id: Math.random().toString(36).substring(7),
      propertyId,
      helpfulCount: 0,
      helpfulUsers: [],
      createdAt: new Date().toISOString(),
    };

    allReviews.push(newReview);
    ReviewStorage.saveReviews(allReviews);
    return newReview;
  }

  public async addReviewAsync(
    propertyId: string,
    reviewData: { 
      userName: string; 
      userAvatarUrl?: string; 
      rating: number; 
      title: string; 
      text: string; 
      images?: string[]; 
      stayDate: string;
      isVerifiedStay: boolean;
      recommend: boolean;
    }
  ): Promise<Review> {
    try {
      const res = await apiClient.post<{ review: any }>(`/api/reviews/${propertyId}`, {
        rating: reviewData.rating,
        title: reviewData.title,
        text: reviewData.text,
        images: reviewData.images || [],
        userName: reviewData.userName,
      });
      const backendRev = res.data?.review;
      if (backendRev) {
        const rev: Review = {
          id: backendRev._id || backendRev.id,
          propertyId,
          userName: backendRev.userName || reviewData.userName,
          userAvatarUrl: backendRev.userAvatar || reviewData.userAvatarUrl,
          rating: backendRev.rating || reviewData.rating,
          title: backendRev.title || reviewData.title,
          text: backendRev.content || reviewData.text,
          images: backendRev.images || reviewData.images || [],
          stayDate: reviewData.stayDate,
          isVerifiedStay: reviewData.isVerifiedStay,
          recommend: reviewData.recommend,
          helpfulCount: 0,
          helpfulUsers: [],
          createdAt: backendRev.createdAt || new Date().toISOString(),
        };
        const allReviews = ReviewStorage.getReviews();
        allReviews.push(rev);
        ReviewStorage.saveReviews(allReviews);
        return rev;
      }
    } catch (e) {
      console.warn("[ReviewService] Backend review post error", e);
    }
    return this.addReview(propertyId, reviewData);
  }

  public incrementHelpfulCount(reviewId: string, userEmail: string): { success: boolean; helpfulCount: number; message: string } {
    const allReviews = ReviewStorage.getReviews();
    const index = allReviews.findIndex(r => r.id === reviewId);
    
    if (index === -1) {
      return { success: false, helpfulCount: 0, message: "Review not found." };
    }

    const review = allReviews[index];
    const users = review.helpfulUsers || [];
    
    if (users.includes(userEmail)) {
      return { success: false, helpfulCount: review.helpfulCount, message: "You have already marked this review as helpful." };
    }

    const updatedUsers = [...users, userEmail];
    const updatedCount = (review.helpfulCount || 0) + 1;
    
    allReviews[index] = {
      ...review,
      helpfulCount: updatedCount,
      helpfulUsers: updatedUsers
    };

    ReviewStorage.saveReviews(allReviews);
    return { success: true, helpfulCount: updatedCount, message: "Review marked helpful!" };
  }

  public addOwnerReply(reviewId: string, replyText: string): { success: boolean; message: string; reply?: { text: string; createdAt: string } } {
    const allReviews = ReviewStorage.getReviews();
    const index = allReviews.findIndex(r => r.id === reviewId);
    
    if (index === -1) {
      return { success: false, message: "Review not found." };
    }

    const review = allReviews[index];
    if (review.ownerReply) {
      return { success: false, message: "You can only reply once to a review." };
    }

    const reply = {
      text: replyText.trim(),
      createdAt: new Date().toISOString()
    };

    allReviews[index] = {
      ...review,
      ownerReply: reply
    };

    ReviewStorage.saveReviews(allReviews);
    return { success: true, message: "Reply posted successfully.", reply };
  }

  public getRatingBreakdown(propertyId: string): {
    overallRating: number;
    totalReviews: number;
    breakdown: Record<number, number>; // rating (1-5) to count
  } {
    const reviews = this.getReviewsByPropertyId(propertyId);
    const totalReviews = reviews.length;

    const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (totalReviews === 0) {
      return { overallRating: 0, totalReviews: 0, breakdown };
    }

    let sum = 0;
    reviews.forEach((r) => {
      sum += r.rating;
      breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
    });

    const overallRating = Math.round((sum / totalReviews) * 10) / 10;

    return {
      overallRating,
      totalReviews,
      breakdown,
    };
  }
}

export const ReviewService = new ReviewServiceImpl();
