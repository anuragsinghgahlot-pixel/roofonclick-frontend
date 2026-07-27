export type CallbackPurpose =
  | "General Enquiry"
  | "Schedule Visit"
  | "Pricing Discussion"
  | "Room Availability"
  | "Amenities"
  | "Other";

export type CallbackStatus = "Pending" | "Accepted" | "Rescheduled" | "Declined";

export interface CallbackRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  buyerName: string;
  buyerPhone: string;
  preferredDate: string; // YYYY-MM-DD
  preferredTime: string; // e.g. "Morning (9 AM - 12 PM)"
  purpose: CallbackPurpose;
  notes?: string;
  status: CallbackStatus;
  createdAt: string;
}
