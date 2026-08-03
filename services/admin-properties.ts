"use client";

import type { StatusType } from "@/components/admin/data-table";

/* ─── Property Admin Types ─── */
export interface AdminProperty {
  id: string;
  propertyName: string;
  coverPhoto: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  city: string;
  area: string;
  address: string;
  propertyType: "Hostel" | "PG" | "Co-living" | "Apartment";
  gender: "Boys" | "Girls" | "Co-ed";
  startingRent: number;
  occupancyRate: number; // percentage e.g. 85
  totalBeds: number;
  occupiedBeds: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  healthScore: number; // 0-100
  healthLabel: "Excellent" | "Good" | "Needs Attention";
  status: StatusType;
  createdAt: string;
  updatedAt: string;
  // Detail drawer attributes
  description: string;
  amenities: string[];
  rooms: {
    roomType: string;
    rent: number;
    total: number;
    available: number;
  }[];
  photos: string[];
  verificationDetails: {
    propertyDocVerified: boolean;
    ownerIdVerified: boolean;
    locationVerified: boolean;
    inspectionCompleted: boolean;
  };
  timeline: {
    event: string;
    description: string;
    date: string;
    by: string;
  }[];
}

export interface AdminPropertyQuickStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  featured: number;
  draft: number;
  suspended: number;
  avgOccupancy: number;
}

/* ─── Mock Data ─── */
const MOCK_ADMIN_PROPERTIES: AdminProperty[] = [
  {
    id: "PROP-1001",
    propertyName: "Elite Residency PG & Hostel",
    coverPhoto: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    ownerName: "Rajesh Kumar",
    ownerEmail: "rajesh.kumar@email.com",
    ownerPhone: "+91 98260 12345",
    city: "Indore",
    area: "Vijay Nagar",
    address: "Plot 12, Scheme 54, Near C21 Mall, Vijay Nagar, Indore, MP 452010",
    propertyType: "Hostel",
    gender: "Boys",
    startingRent: 8500,
    occupancyRate: 92,
    totalBeds: 40,
    occupiedBeds: 37,
    rating: 4.8,
    reviewCount: 34,
    isVerified: true,
    isFeatured: true,
    healthScore: 95,
    healthLabel: "Excellent",
    status: "approved",
    createdAt: "2026-06-15T10:30:00Z",
    updatedAt: "2026-08-01T14:20:00Z",
    description: "Premium boys hostel equipped with high-speed Wi-Fi, daily housekeeping, 3 times nutritious meals, biometrics entry, and 24/7 security guard.",
    amenities: ["Wi-Fi", "Air Conditioner", "Daily Housekeeping", "3 Times Meals", "CCTV & Security", "Power Backup", "Washing Machine"],
    rooms: [
      { roomType: "Single Occupancy", rent: 12000, total: 10, available: 1 },
      { roomType: "Double Sharing", rent: 8500, total: 20, available: 2 },
      { roomType: "Triple Sharing", rent: 6500, total: 10, available: 0 },
    ],
    photos: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    ],
    verificationDetails: {
      propertyDocVerified: true,
      ownerIdVerified: true,
      locationVerified: true,
      inspectionCompleted: true,
    },
    timeline: [
      { event: "Submitted", description: "Property listing submitted by owner", date: "2026-06-15 10:30", by: "Rajesh Kumar" },
      { event: "Edited", description: "Updated room pricing & amenities", date: "2026-06-16 11:45", by: "Rajesh Kumar" },
      { event: "Photos Updated", description: "Uploaded 8 high-resolution interior photos", date: "2026-06-16 14:20", by: "Rajesh Kumar" },
      { event: "Approved", description: "Physical inspection completed & listing approved", date: "2026-06-18 16:00", by: "Admin Rohit" },
      { event: "Featured", description: "Promoted to Featured on Indore Homepage", date: "2026-07-01 09:00", by: "Super Admin" },
      { event: "Booking Received", description: "New booking confirmed (#ROC-1087)", date: "2026-08-02 18:45", by: "System" },
    ],
  },
  {
    id: "PROP-1002",
    propertyName: "Shree Comfort Stay PG for Girls",
    coverPhoto: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
    ownerName: "Sunita Verma",
    ownerEmail: "sunita.v@email.com",
    ownerPhone: "+91 94250 98765",
    city: "Indore",
    area: "Palasia",
    address: "45 Old Palasia, Near Industry House, Indore, MP 452001",
    propertyType: "PG",
    gender: "Girls",
    startingRent: 7500,
    occupancyRate: 88,
    totalBeds: 25,
    occupiedBeds: 22,
    rating: 4.6,
    reviewCount: 19,
    isVerified: true,
    isFeatured: false,
    healthScore: 89,
    healthLabel: "Good",
    status: "approved",
    createdAt: "2026-07-01T12:00:00Z",
    updatedAt: "2026-07-28T16:10:00Z",
    description: "Safe & comfortable girls PG with female warden, biometric access, home-cooked food, and study lounge.",
    amenities: ["Wi-Fi", "Female Warden", "Home Meals", "Biometric Entry", "Refrigerator", "Power Backup"],
    rooms: [
      { roomType: "Double Sharing", rent: 9000, total: 15, available: 2 },
      { roomType: "Triple Sharing", rent: 7500, total: 10, available: 1 },
    ],
    photos: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    ],
    verificationDetails: {
      propertyDocVerified: true,
      ownerIdVerified: true,
      locationVerified: true,
      inspectionCompleted: true,
    },
    timeline: [
      { event: "Submitted", description: "Property listing created", date: "2026-07-01 12:00", by: "Sunita Verma" },
      { event: "Approved", description: "Listing verified & approved", date: "2026-07-03 15:30", by: "Admin Rohit" },
    ],
  },
  {
    id: "PROP-1003",
    propertyName: "Sunshine Luxury Co-Living Spaces",
    coverPhoto: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    ownerName: "Amitabh Jain",
    ownerEmail: "amitabh.jain@email.com",
    ownerPhone: "+91 97520 54321",
    city: "Indore",
    area: "Bhawarkua",
    address: "78 Bhawarkua Main Road, Near IT Park, Indore, MP 452014",
    propertyType: "Co-living",
    gender: "Co-ed",
    startingRent: 11000,
    occupancyRate: 45,
    totalBeds: 50,
    occupiedBeds: 23,
    rating: 4.2,
    reviewCount: 8,
    isVerified: false,
    isFeatured: false,
    healthScore: 48,
    healthLabel: "Needs Attention",
    status: "pending",
    createdAt: "2026-07-25T09:15:00Z",
    updatedAt: "2026-08-02T11:00:00Z",
    description: "Modern co-living space for tech professionals near IT Park with gaming room, rooftop lounge, and high-speed fiber internet.",
    amenities: ["Fiber Wi-Fi", "Gaming Zone", "Rooftop Lounge", "Gym", "Meals", "Co-working Space"],
    rooms: [
      { roomType: "Private Studio", rent: 16000, total: 20, available: 15 },
      { roomType: "Double Studio", rent: 11000, total: 30, available: 12 },
    ],
    photos: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    ],
    verificationDetails: {
      propertyDocVerified: false,
      ownerIdVerified: true,
      locationVerified: false,
      inspectionCompleted: false,
    },
    timeline: [
      { event: "Submitted", description: "Listing submitted — pending physical audit", date: "2026-07-25 09:15", by: "Amitabh Jain" },
      { event: "Edited", description: "Added studio room specifications", date: "2026-07-26 14:00", by: "Amitabh Jain" },
    ],
  },
  {
    id: "PROP-1004",
    propertyName: "Green Meadows Student Hostel",
    coverPhoto: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    ownerName: "Vikram Rathore",
    ownerEmail: "vikram.r@email.com",
    ownerPhone: "+91 98930 76543",
    city: "Indore",
    area: "Rau",
    address: "Near IIM Indore Campus, Rau, Indore, MP 453331",
    propertyType: "Hostel",
    gender: "Boys",
    startingRent: 6500,
    occupancyRate: 76,
    totalBeds: 60,
    occupiedBeds: 46,
    rating: 4.4,
    reviewCount: 27,
    isVerified: true,
    isFeatured: true,
    healthScore: 82,
    healthLabel: "Good",
    status: "approved",
    createdAt: "2026-05-10T11:00:00Z",
    updatedAt: "2026-07-20T10:00:00Z",
    description: "Budget-friendly student hostel located 5 mins from IIM Indore. Free shuttle service to campus.",
    amenities: ["Shuttle Bus", "Wi-Fi", "Study Hall", "3 Meals", "Cricket Ground"],
    rooms: [
      { roomType: "Double Sharing", rent: 8000, total: 30, available: 6 },
      { roomType: "Four Sharing", rent: 6500, total: 30, available: 8 },
    ],
    photos: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    ],
    verificationDetails: {
      propertyDocVerified: true,
      ownerIdVerified: true,
      locationVerified: true,
      inspectionCompleted: true,
    },
    timeline: [
      { event: "Submitted", description: "Listing submitted", date: "2026-05-10 11:00", by: "Vikram Rathore" },
      { event: "Approved", description: "Listing approved", date: "2026-05-12 16:20", by: "Admin Priya" },
      { event: "Featured", description: "Featured tag applied", date: "2026-06-01 09:00", by: "Super Admin" },
    ],
  },
  {
    id: "PROP-1005",
    propertyName: "Urban Living Executive PG",
    coverPhoto: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    ownerName: "Megha Gupta",
    ownerEmail: "megha.gupta@email.com",
    ownerPhone: "+91 91110 33445",
    city: "Indore",
    area: "Geeta Bhawan",
    address: "12 AB Road, Opp. Geeta Bhawan Hospital, Indore, MP 452001",
    propertyType: "PG",
    gender: "Girls",
    startingRent: 9500,
    occupancyRate: 0,
    totalBeds: 30,
    occupiedBeds: 0,
    rating: 0,
    reviewCount: 0,
    isVerified: false,
    isFeatured: false,
    healthScore: 35,
    healthLabel: "Needs Attention",
    status: "rejected",
    createdAt: "2026-07-29T14:30:00Z",
    updatedAt: "2026-07-30T10:00:00Z",
    description: "Executive girls PG on main AB Road. (Rejected due to missing fire safety certificate).",
    amenities: ["Wi-Fi", "AC", "Elevator", "Power Backup"],
    rooms: [
      { roomType: "Single Room", rent: 13000, total: 10, available: 10 },
      { roomType: "Double Sharing", rent: 9500, total: 20, available: 20 },
    ],
    photos: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    ],
    verificationDetails: {
      propertyDocVerified: false,
      ownerIdVerified: true,
      locationVerified: true,
      inspectionCompleted: true,
    },
    timeline: [
      { event: "Submitted", description: "Property listing submitted", date: "2026-07-29 14:30", by: "Megha Gupta" },
      { event: "Rejected", description: "Rejected: Fire NOC certificate missing", date: "2026-07-30 10:00", by: "Admin Rohit" },
    ],
  },
  {
    id: "PROP-1006",
    propertyName: "Comfort Residency Draft",
    coverPhoto: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    ownerName: "Sanjay Joshi",
    ownerEmail: "sanjay.j@email.com",
    ownerPhone: "+91 93000 11223",
    city: "Indore",
    area: "Khajrana",
    address: "Khajrana Main Road, Indore, MP 452016",
    propertyType: "Hostel",
    gender: "Boys",
    startingRent: 6000,
    occupancyRate: 0,
    totalBeds: 20,
    occupiedBeds: 0,
    rating: 0,
    reviewCount: 0,
    isVerified: false,
    isFeatured: false,
    healthScore: 20,
    healthLabel: "Needs Attention",
    status: "draft",
    createdAt: "2026-08-01T16:00:00Z",
    updatedAt: "2026-08-01T16:00:00Z",
    description: "Incomplete draft listing by owner.",
    amenities: ["Wi-Fi"],
    rooms: [],
    photos: [],
    verificationDetails: {
      propertyDocVerified: false,
      ownerIdVerified: false,
      locationVerified: false,
      inspectionCompleted: false,
    },
    timeline: [
      { event: "Submitted", description: "Draft created by owner", date: "2026-08-01 16:00", by: "Sanjay Joshi" },
    ],
  },
  {
    id: "PROP-1007",
    propertyName: "Royal Residency (Suspended)",
    coverPhoto: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    ownerName: "Deepak Sharma",
    ownerEmail: "deepak.s@email.com",
    ownerPhone: "+91 98270 44556",
    city: "Indore",
    area: "LIG Colony",
    address: "LIG Square, Indore, MP 452011",
    propertyType: "Hostel",
    gender: "Boys",
    startingRent: 7000,
    occupancyRate: 60,
    totalBeds: 30,
    occupiedBeds: 18,
    rating: 2.8,
    reviewCount: 14,
    isVerified: true,
    isFeatured: false,
    healthScore: 42,
    healthLabel: "Needs Attention",
    status: "suspended",
    createdAt: "2026-04-12T10:00:00Z",
    updatedAt: "2026-07-25T11:30:00Z",
    description: "Suspended due to multiple unresolved food quality complaints.",
    amenities: ["Wi-Fi", "Meals"],
    rooms: [
      { roomType: "Double Sharing", rent: 7000, total: 30, available: 12 },
    ],
    photos: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    ],
    verificationDetails: {
      propertyDocVerified: true,
      ownerIdVerified: true,
      locationVerified: true,
      inspectionCompleted: true,
    },
    timeline: [
      { event: "Submitted", description: "Property listed", date: "2026-04-12 10:00", by: "Deepak Sharma" },
      { event: "Approved", description: "Approved", date: "2026-04-15 14:00", by: "Admin Rohit" },
      { event: "Suspended", description: "Suspended: Multiple food complaints", date: "2026-07-25 11:30", by: "Super Admin" },
    ],
  },
];

/* ─── Admin Property Service Class ─── */
export class AdminPropertyService {
  static getQuickStats(properties: AdminProperty[] = MOCK_ADMIN_PROPERTIES): AdminPropertyQuickStats {
    const total = properties.length;
    const pending = properties.filter((p) => p.status === "pending").length;
    const approved = properties.filter((p) => p.status === "approved" || p.status === "active").length;
    const rejected = properties.filter((p) => p.status === "rejected").length;
    const featured = properties.filter((p) => p.isFeatured).length;
    const draft = properties.filter((p) => p.status === "draft").length;
    const suspended = properties.filter((p) => p.status === "suspended").length;

    const occupiedSum = properties.reduce((acc, p) => acc + p.occupiedBeds, 0);
    const totalSum = properties.reduce((acc, p) => acc + p.totalBeds, 0);
    const avgOccupancy = totalSum > 0 ? Math.round((occupiedSum / totalSum) * 100) : 0;

    return {
      total,
      pending,
      approved,
      rejected,
      featured,
      draft,
      suspended,
      avgOccupancy,
    };
  }

  static getAllProperties(): AdminProperty[] {
    return MOCK_ADMIN_PROPERTIES;
  }

  static getPropertyById(id: string): AdminProperty | undefined {
    return MOCK_ADMIN_PROPERTIES.find((p) => p.id === id);
  }
}
