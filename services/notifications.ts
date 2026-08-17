/**
 * notifications.ts
 * Real-time notification client service integrated with the RoofOnClick backend.
 */

import { apiClient } from "@/lib/api-client";
import { TokenManager } from "@/lib/token-manager";

export type NotificationCategory =
  | "Booking"
  | "Enquiry"
  | "Visit"
  | "Property"
  | "Wishlist"
  | "Availability"
  | "SavedSearch"
  | "Announcement"
  | "System";

export interface NotificationBackendDoc {
  _id: string;
  recipient: string;
  category: NotificationCategory;
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: NotificationCategory;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

function mapDocToItem(doc: NotificationBackendDoc): NotificationItem {
  return {
    id: doc._id,
    title: doc.title,
    description: doc.message,
    category: doc.category,
    timestamp: doc.createdAt,
    isRead: doc.isRead,
    actionUrl: doc.actionUrl,
  };
}

export interface NotificationsFetchResponse {
  notifications: NotificationItem[];
  unreadCount: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const NotificationService = {
  /**
   * Fetch paginated list of notifications from backend.
   */
  fetchNotifications: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    isRead?: boolean;
  }): Promise<NotificationsFetchResponse> => {
    try {
      const query = new URLSearchParams();
      if (params?.page) query.set("page", String(params.page));
      if (params?.limit) query.set("limit", String(params.limit));
      if (params?.category && params.category !== "All") query.set("category", params.category);
      if (typeof params?.isRead === "boolean") query.set("isRead", String(params.isRead));

      const endpoint = `/api/notifications${query.toString() ? `?${query.toString()}` : ""}`;
      const res = await apiClient.get<{
        notifications: NotificationBackendDoc[];
        unreadCount: number;
        pagination: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>(endpoint);

      return {
        notifications: (res.data?.notifications || []).map(mapDocToItem),
        unreadCount: res.data?.unreadCount || 0,
        pagination: res.data?.pagination || { total: 0, page: 1, limit: 20, totalPages: 1 },
      };
    } catch {
      return {
        notifications: [],
        unreadCount: 0,
        pagination: { total: 0, page: 1, limit: 20, totalPages: 1 },
      };
    }
  },

  /**
   * Fast unread count fetch for Navbar badge.
   */
  fetchUnreadCount: async (): Promise<number> => {
    try {
      const res = await apiClient.get<{ unreadCount: number }>("/api/notifications/unread-count");
      return res.data?.unreadCount || 0;
    } catch {
      return 0;
    }
  },

  /**
   * Subscribe to real-time Server-Sent Events (SSE) push stream.
   * Auto-reconnects on network loss. Returns cleanup/unsubscribe function.
   */
  subscribeToStream: (callbacks: {
    onNotification?: (notification: NotificationItem) => void;
    onUnreadCount?: (unreadCount: number) => void;
    onError?: (err: unknown) => void;
  }): (() => void) => {
    if (typeof window === "undefined") return () => {};

    let eventSource: EventSource | null = null;
    let isClosed = false;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      if (isClosed) return;

      const at = TokenManager.getAT();
      if (!at) {
        // Fast-retry if user has an active session being restored, or normal retry
        const retryDelay = TokenManager.hasSession() ? 800 : 3000;
        reconnectTimeout = setTimeout(connect, retryDelay);
        return;
      }

      const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
      const streamUrl = `${apiBase}/api/notifications/stream?token=${encodeURIComponent(at)}`;

      try {
        eventSource = new EventSource(streamUrl);

        eventSource.addEventListener("connected", (e: MessageEvent) => {
          try {
            const data = JSON.parse(e.data);
            if (typeof data.unreadCount === "number" && callbacks.onUnreadCount) {
              callbacks.onUnreadCount(data.unreadCount);
            }
          } catch {
            // Ignored
          }
        });

        eventSource.addEventListener("notification", (e: MessageEvent) => {
          try {
            const data = JSON.parse(e.data);
            if (data.notification && callbacks.onNotification) {
              callbacks.onNotification(data.notification);
            }
            if (typeof data.unreadCount === "number" && callbacks.onUnreadCount) {
              callbacks.onUnreadCount(data.unreadCount);
            }
          } catch {
            // Ignored
          }
        });

        eventSource.onerror = (err) => {
          if (callbacks.onError) callbacks.onError(err);
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          if (!isClosed) {
            reconnectTimeout = setTimeout(connect, 5000);
          }
        };
      } catch (err) {
        if (!isClosed) {
          reconnectTimeout = setTimeout(connect, 5000);
        }
      }
    };

    connect();

    return () => {
      isClosed = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
    };
  },

  /**
   * Mark a single notification as read.
   */
  markAsRead: async (id: string): Promise<boolean> => {
    try {
      await apiClient.put(`/api/notifications/${id}/read`);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Mark all notifications as read.
   */
  markAllAsRead: async (): Promise<boolean> => {
    try {
      await apiClient.put("/api/notifications/read-all");
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Delete a single notification.
   */
  deleteNotification: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/api/notifications/${id}`);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Clear all notifications for user.
   */
  clearAllNotifications: async (): Promise<boolean> => {
    try {
      await apiClient.delete("/api/notifications");
      return true;
    } catch {
      return false;
    }
  },
};
