export type RequestType = "Visit" | "Enquiry";
export type RequestStatus = "Pending" | "Approved" | "Rescheduled" | "Rejected";

export interface EnquiryRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  buyerName: string;
  buyerEmail?: string;
  buyerPhone: string;
  requestType: RequestType;
  status: RequestStatus;
  // Schedule Visit specific
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  // Send Enquiry specific
  message?: string;
  createdAt: string;
  updatedAt: string;
}
