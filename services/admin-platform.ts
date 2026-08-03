"use client";

/* ─── Platform Control Center Types ─── */
export interface SystemServiceHealth {
  name: string;
  category: "Core" | "Infrastructure" | "Third-Party" | "Engine";
  status: "Operational" | "Degraded" | "Outage";
  uptimePercent: number; // e.g. 99.98
  responseTimeMs: number; // e.g. 142
  lastChecked: string;
}

export interface FeatureFlag {
  id: string;
  name: string;
  category: "User Experience" | "Monetization" | "Core Operations" | "Beta Features";
  status: "Enabled" | "Disabled" | "Beta";
  rolloutPercentage: 10 | 25 | 50 | 75 | 100;
  description: string;
}

export interface PermissionMatrixModule {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
  export: boolean;
  assign: boolean;
  suspend: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Operations" | "Verification" | "Finance" | "Support" | "Marketing" | "Analytics" | "Content Manager";
  department: "Operations" | "Finance" | "Support" | "Verification" | "Marketing";
  status: "Active" | "Inactive";
  lastLogin: string;
}

export interface PlatformAuditLog {
  id: string;
  action: string;
  performedBy: string;
  module: string;
  ipAddress: string;
  timestamp: string;
}

/* ─── Mock Services & Data ─── */
const MOCK_SYSTEM_HEALTH: SystemServiceHealth[] = [
  { name: "Platform Uptime", category: "Core", status: "Operational", uptimePercent: 99.99, responseTimeMs: 45, lastChecked: "Just now" },
  { name: "Database Primary", category: "Infrastructure", status: "Operational", uptimePercent: 99.98, responseTimeMs: 12, lastChecked: "10s ago" },
  { name: "Razorpay Gateway", category: "Third-Party", status: "Operational", uptimePercent: 99.95, responseTimeMs: 180, lastChecked: "1 min ago" },
  { name: "Email Service (SMTP)", category: "Infrastructure", status: "Operational", uptimePercent: 99.90, responseTimeMs: 210, lastChecked: "2 mins ago" },
  { name: "SMS Service (Twilio)", category: "Third-Party", status: "Operational", uptimePercent: 99.85, responseTimeMs: 195, lastChecked: "1 min ago" },
  { name: "WhatsApp Business API", category: "Third-Party", status: "Operational", uptimePercent: 99.92, responseTimeMs: 160, lastChecked: "Just now" },
  { name: "Cloudinary CDN", category: "Infrastructure", status: "Operational", uptimePercent: 100.0, responseTimeMs: 65, lastChecked: "30s ago" },
  { name: "Search Index (Algolia)", category: "Engine", status: "Operational", uptimePercent: 99.99, responseTimeMs: 25, lastChecked: "Just now" },
  { name: "OpenAI AI Assistant", category: "Third-Party", status: "Operational", uptimePercent: 99.70, responseTimeMs: 450, lastChecked: "3 mins ago" },
  { name: "Booking Engine", category: "Engine", status: "Operational", uptimePercent: 99.99, responseTimeMs: 38, lastChecked: "Just now" },
  { name: "Review Audit Engine", category: "Engine", status: "Operational", uptimePercent: 99.95, responseTimeMs: 52, lastChecked: "1 min ago" },
  { name: "Google Maps API", category: "Third-Party", status: "Operational", uptimePercent: 99.99, responseTimeMs: 95, lastChecked: "Just now" },
];

const MOCK_FEATURE_FLAGS: FeatureFlag[] = [
  { id: "ff-1", name: "AI Assistant Widget", category: "User Experience", status: "Enabled", rolloutPercentage: 100, description: "Floating AI conversational discovery assistant." },
  { id: "ff-2", name: "Wishlist System", category: "User Experience", status: "Enabled", rolloutPercentage: 100, description: "Save properties to student wishlist." },
  { id: "ff-3", name: "Booking Engine", category: "Core Operations", status: "Enabled", rolloutPercentage: 100, description: "Instant online room reservation system." },
  { id: "ff-4", name: "Razorpay Payments", category: "Monetization", status: "Enabled", rolloutPercentage: 100, description: "Online UPI, Netbanking & Credit Card payments." },
  { id: "ff-5", name: "Student & Owner Reviews", category: "User Experience", status: "Enabled", rolloutPercentage: 100, description: "Verified accommodation ratings & reviews." },
  { id: "ff-6", name: "Coupons & Discounts", category: "Monetization", status: "Beta", rolloutPercentage: 50, description: "Promotional checkout discount codes." },
  { id: "ff-7", name: "Property Comparison Tool", category: "User Experience", status: "Enabled", rolloutPercentage: 100, description: "Side-by-side room & amenity comparison." },
  { id: "ff-8", name: "Dynamic Pricing AI", category: "Beta Features", status: "Beta", rolloutPercentage: 25, description: "AI seasonal rent & surge recommendation." },
  { id: "ff-9", name: "WhatsApp Notification Broadcast", category: "Core Operations", status: "Enabled", rolloutPercentage: 100, description: "Automated booking receipts via WhatsApp." },
];

const MOCK_PERMISSION_MATRIX: PermissionMatrixModule[] = [
  { module: "Dashboard", view: true, create: false, edit: false, delete: false, approve: false, export: true, assign: false, suspend: false },
  { module: "Properties", view: true, create: true, edit: true, delete: true, approve: true, export: true, assign: true, suspend: true },
  { module: "Owners (CRM)", view: true, create: true, edit: true, delete: true, approve: true, export: true, assign: true, suspend: true },
  { module: "Buyers (CRM)", view: true, create: true, edit: true, delete: true, approve: true, export: true, assign: true, suspend: true },
  { module: "Bookings", view: true, create: false, edit: true, delete: true, approve: true, export: true, assign: true, suspend: false },
  { module: "Payments & Finance", view: true, create: false, edit: true, delete: false, approve: true, export: true, assign: false, suspend: false },
  { module: "Analytics (BI)", view: true, create: false, edit: false, delete: false, approve: false, export: true, assign: false, suspend: false },
  { module: "Trust & Safety", view: true, create: false, edit: true, delete: true, approve: true, export: true, assign: true, suspend: true },
  { module: "Platform Control", view: true, create: true, edit: true, delete: true, approve: true, export: true, assign: true, suspend: true },
];

const MOCK_ADMIN_TEAM: AdminUser[] = [
  { id: "ADM-1", name: "Anurag Singh (Super Admin)", email: "super.admin@roofonclick.com", role: "Super Admin", department: "Operations", status: "Active", lastLogin: "Just now" },
  { id: "ADM-2", name: "Rohit Sharma", email: "rohit.s@roofonclick.com", role: "Operations", department: "Operations", status: "Active", lastLogin: "10 mins ago" },
  { id: "ADM-3", name: "Priya Verma", email: "priya.v@roofonclick.com", role: "Verification", department: "Verification", status: "Active", lastLogin: "1 hour ago" },
  { id: "ADM-4", name: "Siddharth Jain", email: "siddharth.j@roofonclick.com", role: "Finance", department: "Finance", status: "Active", lastLogin: "Yesterday" },
];

const MOCK_AUDIT_LOGS: PlatformAuditLog[] = [
  { id: "LOG-901", action: "Updated Feature Flag: Coupons (Set to Beta 50%)", performedBy: "Super Admin", module: "Feature Flags", ipAddress: "103.21.12.44", timestamp: "2026-08-03 12:45" },
  { id: "LOG-902", action: "Approved Property ID: PROP-1001", performedBy: "Rohit Sharma", module: "Properties", ipAddress: "103.21.12.48", timestamp: "2026-08-03 11:20" },
  { id: "LOG-903", action: "Verified KYC for Owner ID: OWN-4521", performedBy: "Priya Verma", module: "Owners CRM", ipAddress: "103.21.12.50", timestamp: "2026-08-03 10:15" },
];

/* ─── Admin Platform Service Class ─── */
export class AdminPlatformService {
  static getSystemHealth(): SystemServiceHealth[] {
    return MOCK_SYSTEM_HEALTH;
  }

  static getFeatureFlags(): FeatureFlag[] {
    return MOCK_FEATURE_FLAGS;
  }

  static getPermissionMatrix(): PermissionMatrixModule[] {
    return MOCK_PERMISSION_MATRIX;
  }

  static getAdminTeam(): AdminUser[] {
    return MOCK_ADMIN_TEAM;
  }

  static getAuditLogs(): PlatformAuditLog[] {
    return MOCK_AUDIT_LOGS;
  }
}
