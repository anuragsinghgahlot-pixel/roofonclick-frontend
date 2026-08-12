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

/* ─── Data ─── */
const MOCK_CAMPAIGNS: MarketingCampaign[] = [];
const MOCK_COUPONS: CouponItem[] = [];
const MOCK_LOYALTY_TIERS: LoyaltyTier[] = [];
const MOCK_SEGMENTS: UserSegment[] = [];

/* ─── Admin Growth Service Class ─── */
export class AdminGrowthService {
  static getQuickStats(): GrowthQuickStats {
    return {
      campaignsRunning: MOCK_CAMPAIGNS.filter((c) => c.status === "Running").length,
      activeCoupons: MOCK_COUPONS.filter((c) => c.status === "Active").length,
      referralUsers: 0,
      conversionRate: 0,
      ctr: 0,
      revenueGenerated: 0,
      campaignRoi: 0,
      budgetSpent: 0,
    };
  }

  static getCampaigns() { return MOCK_CAMPAIGNS; }
  static getCoupons() { return MOCK_COUPONS; }
  static getLoyaltyTiers() { return MOCK_LOYALTY_TIERS; }
  static getSegments() { return MOCK_SEGMENTS; }
}
