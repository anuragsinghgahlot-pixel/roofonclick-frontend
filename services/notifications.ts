export type NotificationCategory =
  | "Booking"
  | "Enquiry"
  | "Visit"
  | "Wishlist"
  | "Availability"
  | "SavedSearch"
  | "Announcement";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: NotificationCategory;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

const STORAGE_KEY = "stayynest_buyer_notifications";

const MOCK_NOTIFICATIONS: NotificationItem[] = [];

export const NotificationService = {
  getNotifications: (): NotificationItem[] => {
    if (typeof window === "undefined") return MOCK_NOTIFICATIONS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.some(n => n.id.startsWith("notif-"))) {
          localStorage.removeItem(STORAGE_KEY);
          return [];
        }
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  },

  getUnreadCount: (): number => {
    const list = NotificationService.getNotifications();
    return list.filter((n) => !n.isRead).length;
  },

  markAsRead: (id: string): NotificationItem[] => {
    const list = NotificationService.getNotifications();
    const updated = list.map((item) => (item.id === id ? { ...item, isRead: true } : item));
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  },

  markAllAsRead: (): NotificationItem[] => {
    const list = NotificationService.getNotifications();
    const updated = list.map((item) => ({ ...item, isRead: true }));
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  },

  deleteNotification: (id: string): NotificationItem[] => {
    const list = NotificationService.getNotifications();
    const updated = list.filter((item) => item.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  },
};
