export interface CategoryRatings {
  cleanliness: number;
  safety: number;
  location: number;
  valueForMoney: number;
  foodQuality?: number;
  wifi: number;
  management: number;
  overall: number;
}

export interface OwnerReply {
  replyText: string;
  text?: string;
  replyDate: string;
  createdAt: string;
  isVerifiedOwner: boolean;
}

export interface ReviewItem {
  id: string;
  propertyId: string;
  userName: string;
  userAvatar: string;
  userAvatarUrl?: string;
  rating: number;
  date: string;
  stayDate?: string;
  createdAt: string;
  isVerifiedStay: boolean;
  content: string;
  title?: string;
  text?: string;
  categoryRatings: CategoryRatings;
  helpfulCount: number;
  isHelpfulClicked?: boolean;
  recommend?: boolean;
  images?: string[];
  ownerReply?: OwnerReply;
}

export type Review = ReviewItem;

export interface RatingSummary {
  overallRating: number;
  totalVerifiedReviews: number;
  categoryBreakdown: {
    cleanliness: number;
    safety: number;
    location: number;
    valueForMoney: number;
    foodQuality: number;
    wifi: number;
    management: number;
  };
  starDistribution: Record<number, number>;
}

const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    propertyId: "p1",
    userName: "Ananya Sharma",
    userAvatar: "https://api.dicebear.com/8.x/lorelei/svg?seed=Ananya",
    rating: 5,
    date: "12 Jul 2026",
    createdAt: "2026-07-12T10:00:00Z",
    isVerifiedStay: true,
    content: "Absolute 5-star experience! Clean rooms, super fast Wi-Fi for WFH, and biometric security. The location in Vijay Nagar is walking distance from C21 Mall.",
    categoryRatings: {
      cleanliness: 4.9,
      safety: 5.0,
      location: 4.8,
      valueForMoney: 4.7,
      foodQuality: 4.5,
      wifi: 5.0,
      management: 4.8,
      overall: 4.9,
    },
    helpfulCount: 24,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
    ],
    ownerReply: {
      replyText: "Thank you Ananya! We are delighted to host you. Fast Wi-Fi and student security are our top priorities.",
      replyDate: "13 Jul 2026",
      createdAt: "2026-07-13T11:00:00Z",
      isVerifiedOwner: true,
    },
  },
  {
    id: "rev-2",
    propertyId: "p1",
    userName: "Rahul Verma",
    userAvatar: "https://api.dicebear.com/8.x/lorelei/svg?seed=Rahul",
    rating: 4,
    date: "28 Jun 2026",
    createdAt: "2026-06-28T14:30:00Z",
    isVerifiedStay: true,
    content: "Great stay overall. The food quality is decent and housekeeping happens daily. Wi-Fi speed is good, security warden is cooperative.",
    categoryRatings: {
      cleanliness: 4.5,
      safety: 4.8,
      location: 4.7,
      valueForMoney: 4.4,
      foodQuality: 4.0,
      wifi: 4.6,
      management: 4.5,
      overall: 4.5,
    },
    helpfulCount: 18,
  },
  {
    id: "rev-3",
    propertyId: "p1",
    userName: "Priya Patel",
    userAvatar: "https://api.dicebear.com/8.x/lorelei/svg?seed=Priya",
    rating: 5,
    date: "15 May 2026",
    createdAt: "2026-05-15T09:15:00Z",
    isVerifiedStay: true,
    content: "Felt very safe as a female student moving to Indore. CCTV surveillance on all floors and biometric entry gate. Highly recommended!",
    categoryRatings: {
      cleanliness: 5.0,
      safety: 5.0,
      location: 4.9,
      valueForMoney: 4.8,
      foodQuality: 4.6,
      wifi: 4.8,
      management: 5.0,
      overall: 4.9,
    },
    helpfulCount: 31,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    ],
  },
];

const STORAGE_KEY = "stayynest_reviews_cache";

export const ReviewService = {
  getReviews: (propertyId?: string): ReviewItem[] => {
    if (typeof window === "undefined") return MOCK_REVIEWS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const list = JSON.parse(stored);
        return list.length > 0 ? list : MOCK_REVIEWS;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_REVIEWS));
      return MOCK_REVIEWS;
    } catch {
      return MOCK_REVIEWS;
    }
  },

  getReviewsByPropertyId: (propertyId?: string): ReviewItem[] => {
    return ReviewService.getReviews(propertyId);
  },

  getRatingSummary: (propertyId?: string): RatingSummary => {
    const list = ReviewService.getReviews(propertyId);
    const total = list.length;
    const avg = total > 0 ? list.reduce((acc, r) => acc + r.rating, 0) / total : 4.8;

    return {
      overallRating: Number(avg.toFixed(1)),
      totalVerifiedReviews: 126, // Verified reviews count
      categoryBreakdown: {
        cleanliness: 4.8,
        safety: 4.9,
        location: 4.7,
        valueForMoney: 4.6,
        foodQuality: 4.4,
        wifi: 4.8,
        management: 4.7,
      },
      starDistribution: {
        5: 88,
        4: 26,
        3: 8,
        2: 3,
        1: 1,
      },
    };
  },

  getRatingBreakdown: (propertyId?: string) => {
    const summary = ReviewService.getRatingSummary(propertyId);
    return {
      overallRating: summary.overallRating,
      totalReviews: summary.totalVerifiedReviews,
      breakdown: summary.starDistribution,
    };
  },

  toggleHelpful: (reviewId: string): ReviewItem[] => {
    const list = ReviewService.getReviews();
    const updated = list.map((item) => {
      if (item.id === reviewId) {
        const isClicked = !item.isHelpfulClicked;
        return {
          ...item,
          isHelpfulClicked: isClicked,
          helpfulCount: isClicked ? item.helpfulCount + 1 : Math.max(0, item.helpfulCount - 1),
        };
      }
      return item;
    });

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  },

  incrementHelpfulCount: (reviewId: string, userEmail?: string) => {
    ReviewService.toggleHelpful(reviewId);
    return { success: true, message: "Marked as helpful!" };
  },

  addOwnerReply: (reviewId: string, replyText: string) => {
    const list = ReviewService.getReviews();
    const updated = list.map((item) => {
      if (item.id === reviewId) {
        return {
          ...item,
          ownerReply: {
            replyText,
            replyDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
            createdAt: new Date().toISOString(),
            isVerifiedOwner: true,
          },
        };
      }
      return item;
    });

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return { success: true, message: "Reply posted successfully", reviews: updated };
  },

  addReview: (propertyId: string, reviewData: Partial<ReviewItem>) => {
    const list = ReviewService.getReviews();
    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      propertyId,
      userName: reviewData.userName || "Anonymous Stayyer",
      userAvatar: reviewData.userAvatarUrl || reviewData.userAvatar || "https://api.dicebear.com/8.x/lorelei/svg?seed=Stayyer",
      userAvatarUrl: reviewData.userAvatarUrl || reviewData.userAvatar,
      rating: reviewData.rating || 5,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      createdAt: new Date().toISOString(),
      isVerifiedStay: true,
      content: reviewData.text || reviewData.content || "",
      title: reviewData.title,
      text: reviewData.text || reviewData.content,
      categoryRatings: reviewData.categoryRatings || {
        cleanliness: 5,
        safety: 5,
        location: 5,
        valueForMoney: 5,
        wifi: 5,
        management: 5,
        overall: 5,
      },
      helpfulCount: 0,
    };

    const updated = [newReview, ...list];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return newReview;
  },
};
