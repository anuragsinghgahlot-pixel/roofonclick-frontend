export interface Review {
  id: string;
  propertyId: string;
  userName: string;
  userAvatarUrl?: string;
  rating: number; // 1 to 5
  title: string;
  text: string;
  images?: string[]; // Optional review images (base64 data URLs or standard image URLs)
  createdAt: string; // ISO date string
}
