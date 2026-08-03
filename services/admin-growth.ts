"use client";

/* ─── Growth & Marketing Types ─── */
export interface MarketingCampaign {
  id: string;
  title: string;
  type: "Homepage Banner" | "Push Notification" | "Email" | "SMS" | "WhatsApp" | "Referral" | "Festival Campaign";
  targetAudience: "All Users" | "Buyers / Students" | "Property Owners" | "Inactive Users";
  status: "Running" | "Scheduled" | "Paused" | "Completed";
  budget: number;
  spent: number;
  ctr: number; // %
  conversions: number;
  revenueGenerated: number;
  startDate: string;
  endDate: string;
}

export interface CouponItem {
  id: string;
  code: string;
  discountType: "Percentage" | "Flat";
  discountValue: number; // % or ₹
  minBookingValue: number;
  usageLimit: number;
  usedCount: number;
  applicableCities: string[];
  validUntil: string;
  status: "Active" | "Expired" | "Disabled";
}

export interface LoyaltyTier {
  name: "Silver" | "Gold" | "Platinum";
  pointsRequired: number;
  cashbackRate: number; // %
  perks: string[];
  activeUsersCount: number;
}

export interface UserSegment {
  id: string;
  name: string;
  criteria: string;
  userCount: number;
}

export interface GrowthQuickStats {
  campaignsRunning: number;
  activeCoupons: number;
  referralUsers: number;
  conversionRate: number; // %
  ctr: number; // %
  revenueGenerated: number; // ₹
  campaignRoi: number; // %
  budgetSpent: number; // ₹
}

/* ─── Mock Data ─── */
const MOCK_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: "CAMP-101",
    title: "Indore Student Admission Rush 2026",
    type: "Festival Campaign",
    targetAudience: "Buyers / Students",
    status: "Running",
    budget: 150000,
    spent: 85000,
    ctr: 6.8,
    conversions: 420,
    revenueGenerated: 3570000,
    startDate: "2026-07-15",
    endDate: "2026-08-31",
  },
  {
    id: "CAMP-102",
    title: "Vijay Nagar Early Bird Discount (FEST500)",
    type: "Homepage Banner",
    targetAudience: "All Users",
    status: "Running",
    budget: 50000,
    spent: 32000,
    ctr: 8.2,
    conversions: 180,
    revenueGenerated: 1530000,
    startDate: "2026-08-01",
    endDate: "2026-08-15",
  },
  {
    id: "CAMP-103",
    title: "WhatsApp Move-in Checklist Broadcast",
    type: "WhatsApp",
    targetAudience: "Buyers / Students",
    status: "Scheduled",
    budget: 20000,
    spent: 0,
    ctr: 0,
    conversions: 0,
    revenueGenerated: 0,
    startDate: "2026-08-05",
    endDate: "2026-08-06",
  },
];

const MOCK_COUPONS: CouponItem[] = [
  {
    id: "COUP-1",
    code: "WELCOME500",
    discountType: "Flat",
    discountValue: 500,
    minBookingValue: 5000,
    usageLimit: 1000,
    usedCount: 412,
    applicableCities: ["Indore", "Bhopal"],
    validUntil: "2026-08-31",
    status: "Active",
  },
  {
    id: "COUP-2",
    code: "STAYY10",
    discountType: "Percentage",
    discountValue: 10,
    minBookingValue: 8000,
    usageLimit: 500,
    usedCount: 198,
    applicableCities: ["All Cities"],
    validUntil: "2026-08-15",
    status: "Active",
  },
];

const MOCK_LOYALTY_TIERS: LoyaltyTier[] = [
  { name: "Silver", pointsRequired: 0, cashbackRate: 1, perks: ["Standard Support", "1% Cashback"], activeUsersCount: 1240 },
  { name: "Gold", pointsRequired: 500, cashbackRate: 3, perks: ["Priority Support", "3% Cashback", "Free Move-in Kit"], activeUsersCount: 380 },
  { name: "Platinum", pointsRequired: 1500, cashbackRate: 5, perks: ["Dedicated Account Mgr", "5% Cashback", "Zero Deposit Guarantee"], activeUsersCount: 95 },
];

const MOCK_SEGMENTS: UserSegment[] = [
  { id: "SEG-1", name: "High-Budget Tech Workers", criteria: "Rent > ₹12,000 & Company Tech", userCount: 450 },
  { id: "SEG-2", name: "Indore IIM & DAVV Students", criteria: "Institution: IIM/DAVV", userCount: 820 },
  { id: "SEG-3", name: "Inactive 30+ Days", criteria: "Last Active > 30 days", userCount: 310 },
];

/* ─── Admin Growth Service Class ─── */
export class AdminGrowthService {
  static getQuickStats(): GrowthQuickStats {
    return {
      campaignsRunning: MOCK_CAMPAIGNS.filter((c) => c.status === "Running").length,
      activeCoupons: MOCK_COUPONS.filter((c) => c.status === "Active").length,
      referralUsers: 1420,
      conversionRate: 4.8,
      ctr: 7.2,
      revenueGenerated: 5100000,
      campaignRoi: 420,
      budgetSpent: 117000,
    };
  }

  static getCampaigns() { return MOCK_CAMPAIGNS; }
  static getCoupons() { return MOCK_COUPONS; }
  static getLoyaltyTiers() { return MOCK_LOYALTY_TIERS; }
  static getSegments() { return MOCK_SEGMENTS; }
}
