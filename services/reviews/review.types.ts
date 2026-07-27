export interface OwnerReply {
  text: string;
  createdAt: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userName: string;
  userAvatarUrl?: string;
  rating: number; // 1 to 5
  title: string;
  text: string;
  images?: string[]; // Base64 data URLs
  createdAt: string; // ISO date string
  stayDate: string; // E.g. "June 2026"
  isVerifiedStay: boolean;
  recommend: boolean;
  helpfulCount: number;
  helpfulUsers?: string[]; // Array of user identifiers (e.g. email) who clicked helpful
  ownerReply?: OwnerReply;
}
