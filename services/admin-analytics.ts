"use client";

/* ─── Business Intelligence Admin Types ─── */
export interface AdminExecutiveSummary {
  totalRevenue: number;
  netRevenue: number;
  mrr: number; // Monthly Recurring Revenue
  activeProperties: number;
  occupancyRate: number; // %
  customerSatisfaction: number; // 4.8/5
  monthlyGrowth: number; // %
  platformHealthScore: number; // 98/100
}

export interface FunnelStep {
  stage: string;
  count: number;
  dropoff: string;
  conversion: string;
}

export interface CityMetric {
  city: string;
  occupancy: number; // %
  revenue: number; // ₹
  bookings: number;
}

/* ─── Mock Data ─── */
const MOCK_EXECUTIVE_SUMMARY: AdminExecutiveSummary = {
  totalRevenue: 12400000, // ₹1.24 Cr
  netRevenue: 620000, // ₹6.2L (5% platform fee)
  mrr: 1030000, // ₹10.3L MRR
  activeProperties: 48,
  occupancyRate: 86,
  customerSatisfaction: 4.8,
  monthlyGrowth: 18.4,
  platformHealthScore: 98,
};

const MOCK_REVENUE_TRENDS = {
  daily: [
    { label: "01 Aug", value: 38000 },
    { label: "02 Aug", value: 42000 },
    { label: "03 Aug", value: 55000 },
    { label: "04 Aug", value: 49000 },
    { label: "05 Aug", value: 61000 },
    { label: "06 Aug", value: 58000 },
    { label: "07 Aug", value: 72000 },
  ],
  monthly: [
    { label: "Jan", value: 680000 },
    { label: "Feb", value: 720000 },
    { label: "Mar", value: 810000 },
    { label: "Apr", value: 750000 },
    { label: "May", value: 920000 },
    { label: "Jun", value: 880000 },
    { label: "Jul", value: 1050000 },
    { label: "Aug", value: 1240000 },
  ],
};

const MOCK_FUNNEL_STEPS: FunnelStep[] = [
  { stage: "Visitors", count: 120000, dropoff: "0%", conversion: "100%" },
  { stage: "Property Views", count: 45000, dropoff: "62.5%", conversion: "37.5%" },
  { stage: "Wishlist Added", count: 12000, dropoff: "73.3%", conversion: "26.7%" },
  { stage: "Booking Started", count: 3200, dropoff: "73.3%", conversion: "26.7%" },
  { stage: "Payment Completed", count: 1800, dropoff: "43.7%", conversion: "56.3%" },
  { stage: "Move-in Confirmed", count: 1540, dropoff: "14.4%", conversion: "85.6%" },
];

const MOCK_TOP_CITIES: CityMetric[] = [
  { city: "Indore", occupancy: 91, revenue: 8400000, bookings: 1240 },
  { city: "Bhopal", occupancy: 82, revenue: 2100000, bookings: 320 },
  { city: "Ujjain", occupancy: 78, revenue: 1100000, bookings: 180 },
  { city: "Jabalpur", occupancy: 74, revenue: 500000, bookings: 90 },
  { city: "Gwalior", occupancy: 70, revenue: 300000, bookings: 50 },
];

/* ─── Admin Analytics Service Class ─── */
import { apiClient } from "@/lib/api-client";

export class AdminAnalyticsService {
  static async fetchExecutiveSummary(): Promise<AdminExecutiveSummary> {
    try {
      const res = await apiClient.get<{
        kpis: {
          totalProperties: number;
          activeProperties: number;
          totalBookings: number;
          totalUsers: number;
          totalReviews: number;
        };
      }>("/api/admin/stats");

      const kpis = res.data?.kpis;
      if (!kpis) return MOCK_EXECUTIVE_SUMMARY;

      return {
        totalRevenue: kpis.totalBookings * 10000,
        netRevenue: kpis.totalBookings * 500,
        mrr: kpis.activeProperties * 2500,
        activeProperties: kpis.activeProperties || 0,
        occupancyRate: kpis.totalProperties > 0 ? Math.round((kpis.activeProperties / kpis.totalProperties) * 100) : 0,
        customerSatisfaction: 4.8,
        monthlyGrowth: 18.4,
        platformHealthScore: 100,
      };
    } catch {
      return MOCK_EXECUTIVE_SUMMARY;
    }
  }

  static getExecutiveSummary(): AdminExecutiveSummary {
    return MOCK_EXECUTIVE_SUMMARY;
  }

  static getRevenueTrends() {
    return MOCK_REVENUE_TRENDS;
  }

  static getFunnelSteps(): FunnelStep[] {
    return MOCK_FUNNEL_STEPS;
  }

  static getTopCities(): CityMetric[] {
    return MOCK_TOP_CITIES;
  }
}
