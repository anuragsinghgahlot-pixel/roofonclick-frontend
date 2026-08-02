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

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Visit Confirmed",
    description: "Owner confirmed your visit request for Elite Student PG on Aug 3rd at 11:00 AM.",
    category: "Visit",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    isRead: false,
    actionUrl: "/booking",
  },
  {
    id: "notif-2",
    title: "Price Drop Alert! 📉",
    description: "Royal Comfort Hostel reduced rent by ₹1,000/mo. Check updated pricing now.",
    category: "Wishlist",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    isRead: false,
    actionUrl: "/property/p2",
  },
  {
    id: "notif-3",
    title: "New Reply to your Enquiry",
    description: "Indore Residency Owner replied: 'Single AC room available for immediate move-in.'",
    category: "Enquiry",
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
    isRead: true,
    actionUrl: "/contact-owner?propertyId=p1",
  },
  {
    id: "notif-4",
    title: "3 New Stays Matching 'Vijay Nagar PGs'",
    description: "New verified stays matching your saved search criteria were just published.",
    category: "SavedSearch",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    isRead: true,
    actionUrl: "/search?location=vijay-nagar",
  },
  {
    id: "notif-5",
    title: "Booking Request Approved 🎉",
    description: "Your room reservation request for Sunflower Girls PG has been approved.",
    category: "Booking",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    isRead: true,
    actionUrl: "/booking",
  },
];

export const NotificationService = {
  getNotifications: (): NotificationItem[] => {
    if (typeof window === "undefined") return MOCK_NOTIFICATIONS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_NOTIFICATIONS));
      return MOCK_NOTIFICATIONS;
    } catch {
      return MOCK_NOTIFICATIONS;
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
