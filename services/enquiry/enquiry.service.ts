import { EnquiryRequest, RequestStatus } from "./enquiry.types";

const ENQUIRIES_STORAGE_KEY = "roofonclick_enquiries";

const INITIAL_MOCK_ENQUIRIES: EnquiryRequest[] = [
  {
    id: "enq-101",
    propertyId: "serene-oasis",
    propertyName: "Serene Oasis PG for Boys",
    buyerName: "Rahul Sharma",
    buyerEmail: "rahul.sharma@example.com",
    buyerPhone: "+91 98765 12345",
    requestType: "Visit",
    status: "Pending",
    preferredDate: "2026-07-25",
    preferredTime: "11:00 AM",
    notes: "I want to inspect the Double Sharing room with attached bathroom.",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "enq-102",
    propertyId: "skyline-co-living",
    propertyName: "Skyline Luxury Co-Living Hostel",
    buyerName: "Ananya Roy",
    buyerEmail: "ananya.roy@example.com",
    buyerPhone: "+91 91234 56789",
    requestType: "Enquiry",
    status: "Pending",
    message: "Is food included in the monthly rent for Single Sharing rooms?",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

class EnquiryServiceImpl {
  private safeGet(): EnquiryRequest[] {
    if (typeof window === "undefined") return INITIAL_MOCK_ENQUIRIES;
    try {
      const stored = localStorage.getItem(ENQUIRIES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ENQUIRIES));
      return INITIAL_MOCK_ENQUIRIES;
    } catch {
      return INITIAL_MOCK_ENQUIRIES;
    }
  }

  private safeSet(data: EnquiryRequest[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage write errors
    }
  }

  public getAllRequests(): EnquiryRequest[] {
    return this.safeGet();
  }

  public getRequestsForProperty(propertyId: string): EnquiryRequest[] {
    return this.safeGet().filter((r) => r.propertyId === propertyId);
  }

  public createRequest(data: Partial<EnquiryRequest>): EnquiryRequest {
    const list = this.safeGet();
    const id = `req-${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();

    const newRequest: EnquiryRequest = {
      id,
      propertyId: data.propertyId || "general",
      propertyName: data.propertyName || "RoofOnClick Property",
      buyerName: data.buyerName || "Anonymous Buyer",
      buyerEmail: data.buyerEmail || "",
      buyerPhone: data.buyerPhone || "",
      requestType: data.requestType || "Enquiry",
      status: "Pending",
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      notes: data.notes,
      message: data.message,
      createdAt: now,
      updatedAt: now,
    };

    list.unshift(newRequest);
    this.safeSet(list);
    return newRequest;
  }

  public updateRequestStatus(
    id: string,
    status: RequestStatus,
    updatedDetails?: { preferredDate?: string; preferredTime?: string; notes?: string }
  ): EnquiryRequest | null {
    const list = this.safeGet();
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const updated: EnquiryRequest = {
      ...list[index],
      status,
      preferredDate: updatedDetails?.preferredDate || list[index].preferredDate,
      preferredTime: updatedDetails?.preferredTime || list[index].preferredTime,
      notes: updatedDetails?.notes || list[index].notes,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    this.safeSet(list);
    return updated;
  }

  public getPendingCount(): number {
    return this.safeGet().filter((r) => r.status === "Pending").length;
  }
}

export const EnquiryService = new EnquiryServiceImpl();
