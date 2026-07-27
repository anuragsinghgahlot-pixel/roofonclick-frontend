import { Review } from "./review.types";
import { ReviewStorage } from "./review.storage";

// Default initial reviews for the mock properties in constants/mock-properties.ts
const INITIAL_REVIEWS: Review[] = [
  // Reviews for property p1 (Elite Residency)
  {
    id: "r1",
    propertyId: "p1",
    userName: "Aarav Mehta",
    userAvatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Aarav",
    rating: 5,
    title: "Absolutely fantastic stay!",
    text: "The amenities are top-notch and the security is very good. Best decision to move here. I would definitely recommend it to anyone looking for a premium co-living space in Vijay Nagar.",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=400&q=80"
    ],
    createdAt: "2026-07-15T10:00:00.000Z"
  },
  {
    id: "r2",
    propertyId: "p1",
    userName: "Riya Sharma",
    userAvatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Riya",
    rating: 4,
    title: "Clean and well maintained",
    text: "Very clean and well maintained. The food is decent, though it could be a bit more diverse. Clean bathrooms and common areas are a huge plus point.",
    createdAt: "2026-07-12T14:30:00.000Z"
  },
  {
    id: "r3",
    propertyId: "p1",
    userName: "Kabir Singh",
    userAvatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Kabir",
    rating: 5,
    title: "Highly recommended for students",
    text: "Best PG in Vijay Nagar. Super close to coaching centers, highly recommended for students who are preparing for competitive exams.",
    createdAt: "2026-07-08T09:15:00.000Z"
  },
  {
    id: "r4",
    propertyId: "p1",
    userName: "Neha Patel",
    userAvatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Neha",
    rating: 5,
    title: "Great community environment",
    text: "Great community and staff. The high-speed WiFi is perfect for work and online classes. They also organize events occasionally.",
    createdAt: "2026-07-01T16:45:00.000Z"
  },
  {
    id: "r5",
    propertyId: "p1",
    userName: "Amit Verma",
    userAvatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Amit",
    rating: 4,
    title: "Good value for money",
    text: "Good value for money. Rooms are spacious and ventilation is good. Clean bathrooms and helpful staff make this place very comfortable.",
    createdAt: "2026-06-25T11:20:00.000Z"
  },
  {
    id: "r6",
    propertyId: "p1",
    userName: "Siddharth Malhotra",
    userAvatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Siddharth",
    rating: 3,
    title: "Average experience",
    text: "Average experience. The power backup is good but the room cleaning was occasionally skipped. Management responds slowly to complaints.",
    createdAt: "2026-06-18T18:10:00.000Z"
  },
  // Reviews for property p2 (Skyline Premium Stays)
  {
    id: "r7",
    propertyId: "p2",
    userName: "Varun Dhawan",
    userAvatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Varun",
    rating: 4,
    title: "Nice stays in Bhawarkuan",
    text: "Decent boys PG. The roommates are friendly and the warden is very supportive. Good location near public transit.",
    createdAt: "2026-07-20T10:00:00.000Z"
  },
  {
    id: "r8",
    propertyId: "p2",
    userName: "Aditya Roy",
    userAvatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Aditya",
    rating: 5,
    title: "Excellent mess food!",
    text: "Mess food is honestly the best part. Clean rooms and proper power backup. Worth every single penny.",
    createdAt: "2026-07-16T12:00:00.000Z"
  },
  // Reviews for property p5 (Serene Nest for Girls)
  {
    id: "r9",
    propertyId: "p5",
    userName: "Ananya Panday",
    userAvatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Ananya",
    rating: 5,
    title: "Super safe and comfortable",
    text: "Extremely safe for girls. CCTV cameras, security guards, and biometric entry. Rooms are very clean and cozy.",
    createdAt: "2026-07-22T08:00:00.000Z"
  },
  {
    id: "r10",
    propertyId: "p5",
    userName: "Kiara Advani",
    userAvatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Kiara",
    rating: 4,
    title: "Spacious rooms",
    text: "Spacious wardrobes and good study desks. Very clean environment. Sometimes laundry services are a bit delayed, but overall very good.",
    createdAt: "2026-07-18T15:00:00.000Z"
  }
];

class ReviewServiceImpl {
  constructor() {
    // Seed default reviews if storage is empty
    if (typeof window !== "undefined") {
      try {
        const existing = ReviewStorage.getReviews();
        if (existing.length === 0) {
          ReviewStorage.saveReviews(INITIAL_REVIEWS);
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
    reviewData: { userName: string; userAvatarUrl?: string; rating: number; title: string; text: string; images?: string[] }
  ): Review {
    const allReviews = ReviewStorage.getReviews();
    const newReview: Review = {
      ...reviewData,
      id: Math.random().toString(36).substring(7),
      propertyId,
      createdAt: new Date().toISOString(),
    };

    allReviews.push(newReview);
    ReviewStorage.saveReviews(allReviews);
    return newReview;
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
