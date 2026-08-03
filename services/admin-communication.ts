"use client";

/* ─── Communication Hub Types ─── */
export type ChannelType = "WhatsApp" | "Email" | "SMS" | "Push Notification" | "Internal Note";

export interface ChatMessage {
  id: string;
  sender: string;
  senderRole: "Buyer" | "Owner" | "Admin" | "System";
  channel: ChannelType;
  content: string;
  timestamp: string;
  isInternalNote?: boolean;
  attachments?: { name: string; url: string; size: string }[];
}

export interface ConversationThread {
  id: string;
  customerName: string;
  customerRole: "Buyer" | "Owner";
  customerEmail: string;
  customerPhone: string;
  trustScore: number; // 0-100
  riskScore: "Low" | "Medium" | "High";
  associatedBookingId?: string;
  associatedPropertyTitle?: string;
  channel: ChannelType;
  status: "Unread" | "Open" | "Pinned" | "Resolved";
  priority: "High" | "Medium" | "Low";
  lastMessageSnippet: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
  notes: { author: string; note: string; timestamp: string }[];
}

export interface CommunicationQuickStats {
  openConversations: number;
  messagesSentToday: number;
  avgResponseTime: string;
  customerSatisfaction: number;
  activeWhatsappThreads: number;
}

/* ─── Mock Conversations ─── */
const MOCK_CONVERSATIONS: ConversationThread[] = [
  {
    id: "CONV-101",
    customerName: "Anurag Singh Gahlot",
    customerRole: "Buyer",
    customerEmail: "anurag.singh@email.com",
    customerPhone: "+91 98765 43210",
    trustScore: 98,
    riskScore: "Low",
    associatedBookingId: "ROC-1087",
    associatedPropertyTitle: "Elite Residency PG & Hostel",
    channel: "WhatsApp",
    status: "Unread",
    priority: "High",
    lastMessageSnippet: "Hello, I arrived at PG but caretaker is not at gate.",
    lastMessageTime: "2026-08-03 12:40",
    unreadCount: 2,
    messages: [
      { id: "M-1", sender: "Anurag Singh", senderRole: "Buyer", channel: "WhatsApp", content: "Hello, I arrived at PG but caretaker is not at gate.", timestamp: "12:40 PM" },
      { id: "M-2", sender: "Anurag Singh", senderRole: "Buyer", channel: "WhatsApp", content: "Can someone check?", timestamp: "12:41 PM" },
      { id: "M-3", sender: "Rohit (Ops Admin)", senderRole: "Admin", channel: "Internal Note", content: "Contacted owner Rajesh Kumar. Caretaker is returning with supplies.", timestamp: "12:42 PM", isInternalNote: true },
      { id: "M-4", sender: "Rohit (Ops Admin)", senderRole: "Admin", channel: "WhatsApp", content: "Hi Anurag! We spoke with owner Rajesh Kumar. Caretaker is arriving in 3 mins.", timestamp: "12:43 PM" },
    ],
    notes: [
      { author: "Rohit (Ops)", note: "Student arrived early for move-in.", timestamp: "12:42 PM" },
    ],
  },
  {
    id: "CONV-102",
    customerName: "Rajesh Kumar",
    customerRole: "Owner",
    customerEmail: "rajesh.kumar@email.com",
    customerPhone: "+91 98260 12345",
    trustScore: 94,
    riskScore: "Low",
    associatedBookingId: "ROC-1087",
    associatedPropertyTitle: "Elite Residency PG & Hostel",
    channel: "Email",
    status: "Open",
    priority: "Medium",
    lastMessageSnippet: "Re: Monthly payout settlement receipt for August.",
    lastMessageTime: "2026-08-03 10:15",
    unreadCount: 0,
    messages: [
      { id: "M-10", sender: "Rajesh Kumar", senderRole: "Owner", channel: "Email", content: "Hello Admin team, please send the tax invoice for platform commission.", timestamp: "10:15 AM" },
    ],
    notes: [],
  },
  {
    id: "CONV-103",
    customerName: "Sneha Mukherjee",
    customerRole: "Buyer",
    customerEmail: "sneha.m@email.com",
    customerPhone: "+91 94251 12233",
    trustScore: 92,
    riskScore: "Low",
    associatedBookingId: "ROC-1088",
    associatedPropertyTitle: "Shree Comfort Stay Girls PG",
    channel: "SMS",
    status: "Resolved",
    priority: "Low",
    lastMessageSnippet: "Thank you for fixing the WiFi on the 3rd floor!",
    lastMessageTime: "2026-08-02 16:20",
    unreadCount: 0,
    messages: [
      { id: "M-20", sender: "Sneha Mukherjee", senderRole: "Buyer", channel: "SMS", content: "Thank you for fixing the WiFi on the 3rd floor!", timestamp: "Yesterday 4:20 PM" },
    ],
    notes: [],
  },
];

/* ─── Admin Communication Service ─── */
export class AdminCommunicationService {
  static getQuickStats(): CommunicationQuickStats {
    return {
      openConversations: MOCK_CONVERSATIONS.filter((c) => c.status === "Open" || c.status === "Unread").length,
      messagesSentToday: 1420,
      avgResponseTime: "1.8 mins",
      customerSatisfaction: 4.9,
      activeWhatsappThreads: 84,
    };
  }

  static getConversations(): ConversationThread[] {
    return MOCK_CONVERSATIONS;
  }
}
