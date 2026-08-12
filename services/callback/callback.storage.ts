import { CallbackRequest } from "./callback.types";

const STORAGE_KEY = "roofonclick_callback_requests";

const INITIAL_MOCK_CALLBACKS: CallbackRequest[] = [];

export class CallbackStorage {
  public static getRequests(): CallbackRequest[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch {
      return [];
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
