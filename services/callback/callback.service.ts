import { CallbackRequest, CallbackStatus } from "./callback.types";
import { CallbackStorage } from "./callback.storage";

export const CALLBACK_UPDATED_EVENT = "roofonclick_callback_requests_updated";

class CallbackServiceImpl {
  private notifyListeners() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(CALLBACK_UPDATED_EVENT));
    }
  }

  public getAllRequests(): CallbackRequest[] {
    return CallbackStorage.getRequests();
  }

  public createRequest(data: Omit<CallbackRequest, "id" | "status" | "createdAt">): CallbackRequest {
    const requests = CallbackStorage.getRequests();
    const newRequest: CallbackRequest = {
      ...data,
      id: `call-${Math.random().toString(36).substring(2, 9)}`,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const updated = [newRequest, ...requests];
    CallbackStorage.saveRequests(updated);
    this.notifyListeners();
    return newRequest;
  }

  public updateRequestStatus(
    id: string,
    status: CallbackStatus,
    updatedDetails?: { preferredDate?: string; preferredTime?: string }
  ): CallbackRequest | null {
    const requests = CallbackStorage.getRequests();
    const index = requests.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const updatedRequest: CallbackRequest = {
      ...requests[index],
      status,
      ...(updatedDetails?.preferredDate ? { preferredDate: updatedDetails.preferredDate } : {}),
      ...(updatedDetails?.preferredTime ? { preferredTime: updatedDetails.preferredTime } : {}),
    };

    requests[index] = updatedRequest;
    CallbackStorage.saveRequests(requests);
    this.notifyListeners();
    return updatedRequest;
  }

  public getPendingCount(): number {
    const requests = CallbackStorage.getRequests();
    return requests.filter((r) => r.status === "Pending").length;
  }
}

export const CallbackService = new CallbackServiceImpl();
