import { CallbackRequest } from "./callback.types";

const STORAGE_KEY = "roofonclick_callback_requests";

const INITIAL_MOCK_CALLBACKS: CallbackRequest[] = [
  {
    id: "call-101",
    propertyId: "1",
    propertyName: "Stanza Living Munich House",
    buyerName: "Aarav Sharma",
    buyerPhone: "+91 98765 43210",
    preferredDate: "2026-07-25",
    preferredTime: "Morning (9 AM - 12 PM)",
    purpose: "Pricing Discussion",
    notes: "Would like to discuss security deposit terms and monthly rent for single sharing.",
    status: "Pending",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "call-102",
    propertyId: "2",
    propertyName: "Zolo Stays Prime",
    buyerName: "Ananya Roy",
    buyerPhone: "+91 98123 45678",
    preferredDate: "2026-07-26",
    preferredTime: "Evening (4 PM - 8 PM)",
    purpose: "Room Availability",
    notes: "Looking for double sharing availability starting next month.",
    status: "Accepted",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "call-103",
    propertyId: "3",
    propertyName: "Housr Co-Living Residency",
    buyerName: "Rohan Verma",
    buyerPhone: "+91 97890 12345",
    preferredDate: "2026-07-24",
    preferredTime: "Afternoon (12 PM - 4 PM)",
    purpose: "Schedule Visit",
    notes: "Want to confirm if weekend visits are open.",
    status: "Rescheduled",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

export class CallbackStorage {
  public static getRequests(): CallbackRequest[] {
    if (typeof window === "undefined") return INITIAL_MOCK_CALLBACKS;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_CALLBACKS));
        return INITIAL_MOCK_CALLBACKS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MOCK_CALLBACKS;
    }
  }

  public static saveRequests(requests: CallbackRequest[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch (e) {
      console.error("Failed to save callback requests to localStorage", e);
    }
  }
}
