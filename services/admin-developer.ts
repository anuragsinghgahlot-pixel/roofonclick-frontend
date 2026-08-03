"use client";

/* ─── Developer & Integration Center Types ─── */
export interface ApiKeyItem {
  id: string;
  name: string;
  maskedKey: string; // e.g. "sk_live_••••••••9821"
  environment: "Production" | "Staging" | "Development";
  permissions: "Full Access" | "Read Only" | "Webhooks Only";
  createdDate: string;
  lastUsed: string;
  status: "Active" | "Disabled" | "Revoked";
}

export interface WebhookEndpoint {
  id: string;
  eventType: "payment.captured" | "booking.confirmed" | "user.signup" | "review.flagged";
  endpointUrl: string;
  gateway: "Razorpay" | "Stripe" | "StayyNest Internal";
  status: "Delivered" | "Failed" | "Retrying";
  lastDelivery: string;
  httpStatus: number; // 200, 500, etc.
}

export interface IntegrationServiceConfig {
  id: string;
  serviceName: string;
  category: "Payment Gateway" | "Maps & Location" | "Storage & CDN" | "Messaging" | "AI & ML" | "Auth";
  provider: string;
  status: "Operational" | "Degraded" | "Disabled";
  healthScore: number; // %
  quotaUsed: string;
  latencyMs: number;
  maskedApiKey: string;
}

export interface DeveloperQuickStats {
  integrationHealth: number; // %
  connectedServices: number;
  apiRequestsToday: number;
  webhookDeliveries: number;
  systemLatencyMs: number;
  errorRatePercent: number;
  successRatePercent: number;
}

/* ─── Mock Data ─── */
const MOCK_API_KEYS: ApiKeyItem[] = [
  { id: "KEY-101", name: "Production Server Primary API Key", maskedKey: "sk_live_••••••••9821", environment: "Production", permissions: "Full Access", createdDate: "2026-01-15", lastUsed: "Just now", status: "Active" },
  { id: "KEY-102", name: "Mobile App Android & iOS Key", maskedKey: "sk_live_••••••••4410", environment: "Production", permissions: "Read Only", createdDate: "2026-02-01", lastUsed: "2 mins ago", status: "Active" },
  { id: "KEY-103", name: "Staging Testing Automation Key", maskedKey: "sk_test_••••••••1120", environment: "Staging", permissions: "Full Access", createdDate: "2026-05-10", lastUsed: "Yesterday", status: "Active" },
];

const MOCK_WEBHOOKS: WebhookEndpoint[] = [
  { id: "WH-901", eventType: "payment.captured", endpointUrl: "https://api.roofonclick.com/v1/webhooks/razorpay", gateway: "Razorpay", status: "Delivered", lastDelivery: "2026-08-03 12:45", httpStatus: 200 },
  { id: "WH-902", eventType: "booking.confirmed", endpointUrl: "https://api.roofonclick.com/v1/webhooks/booking", gateway: "StayyNest Internal", status: "Delivered", lastDelivery: "2026-08-03 11:30", httpStatus: 200 },
  { id: "WH-903", eventType: "user.signup", endpointUrl: "https://api.roofonclick.com/v1/webhooks/analytics", gateway: "StayyNest Internal", status: "Delivered", lastDelivery: "2026-08-03 10:15", httpStatus: 200 },
];

const MOCK_INTEGRATIONS: IntegrationServiceConfig[] = [
  { id: "INT-1", serviceName: "Razorpay Payment Gateway", category: "Payment Gateway", provider: "Razorpay India", status: "Operational", healthScore: 99.98, quotaUsed: "₹1.24 Cr Volume", latencyMs: 145, maskedApiKey: "rzp_live_••••••••9812" },
  { id: "INT-2", serviceName: "Google Maps Geocoding API", category: "Maps & Location", provider: "Google Cloud Platform", status: "Operational", healthScore: 99.99, quotaUsed: "42,100 / 100,000 reqs", latencyMs: 32, maskedApiKey: "AIzaSy••••••••8812" },
  { id: "INT-3", serviceName: "Cloudinary CDN Storage", category: "Storage & CDN", provider: "Cloudinary Ltd.", status: "Operational", healthScore: 100.0, quotaUsed: "62 GB / 200 GB", latencyMs: 65, maskedApiKey: "cld_live_••••••••4412" },
  { id: "INT-4", serviceName: "WhatsApp Business API", category: "Messaging", provider: "Meta for Developers", status: "Operational", healthScore: 99.92, quotaUsed: "14,200 / 50,000 msg", latencyMs: 160, maskedApiKey: "EAAX••••••••9912" },
  { id: "INT-5", serviceName: "OpenAI GPT-4o API", category: "AI & ML", provider: "OpenAI Inc.", status: "Operational", healthScore: 99.70, quotaUsed: "145,000 tokens", latencyMs: 450, maskedApiKey: "sk-proj-••••••••7712" },
  { id: "INT-6", serviceName: "Twilio SMS & OTP", category: "Messaging", provider: "Twilio Inc.", status: "Operational", healthScore: 99.85, quotaUsed: "8,500 SMS sent", latencyMs: 195, maskedApiKey: "AC88••••••••3312" },
];

/* ─── Admin Developer Service Class ─── */
export class AdminDeveloperService {
  static getQuickStats(): DeveloperQuickStats {
    return {
      integrationHealth: 99.98,
      connectedServices: MOCK_INTEGRATIONS.length,
      apiRequestsToday: 452100,
      webhookDeliveries: 14200,
      systemLatencyMs: 35,
      errorRatePercent: 0.02,
      successRatePercent: 99.98,
    };
  }

  static getApiKeys() { return MOCK_API_KEYS; }
  static getWebhooks() { return MOCK_WEBHOOKS; }
  static getIntegrations() { return MOCK_INTEGRATIONS; }
}
