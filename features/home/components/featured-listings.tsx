"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Star, Heart, BadgeCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { cn } from "@/lib/utils";

interface Property {
  id: string;
  title: string;
  type: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  gender: "boys" | "girls" | "co-living";
  amenities: string[];
  image: string;
  isVerified?: boolean;
}

const MOCK_LISTINGS: Property[] = [
  {
    id: "elite-residency",
    title: "Elite Residency",
    type: "Hostel",
    location: "Vijay Nagar, Indore",
    price: 8500,
    rating: 4.8,
    reviewCount: 124,
    gender: "boys",
    amenities: ["Wi-Fi", "AC", "Gym", "Food"],
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80",
    isVerified: true,
  },
  {
    id: "skyline-stays",
    title: "Skyline Premium Stays",
    type: "PG",
    location: "Bhawarkuan, Indore",
    price: 6500,
    rating: 4.6,
    reviewCount: 98,
    gender: "girls",
    amenities: ["Wi-Fi", "CCTV", "Mess", "Laundry"],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80",
    isVerified: true,
  },
  {
    id: "co-habit-suites",
    title: "CoHabit Spaces",
    type: "Co-Living",
    location: "Palasia, Indore",
    price: 12000,
    rating: 4.9,
    reviewCount: 75,
    gender: "co-living",
    amenities: ["Wi-Fi", "Housekeeping", "Lounge"],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80",
    isVerified: true,
  },
  {
    id: "stay-oasis",
    title: "Oasis Student Hostel",
    type: "Hostel",
    location: "Vijay Nagar, Indore",
    price: 7000,
    rating: 4.4,
    reviewCount: 112,
    gender: "boys",
    amenities: ["Wi-Fi", "Sports Zone", "Food"],
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80",
    isVerified: false,
  },
  {
    id: "serene-nest",
    title: "Serene Nest for Girls",
    type: "PG",
    location: "Geeta Bhawan, Indore",
    price: 7500,
    rating: 4.7,
    reviewCount: 64,
    gender: "girls",
    amenities: ["Wi-Fi", "Security Warden", "Food"],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80",
    isVerified: true,
  },
  {
    id: "urban-studio",
    title: "Urban Studio Suite",
    type: "Studio Apartment",
    location: "LIG Colony, Indore",
    price: 15000,
    rating: 4.9,
    reviewCount: 42,
    gender: "co-living",
    amenities: ["Wi-Fi", "Private Pantry", "Power Backup"],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80",
    isVerified: true,
  },
];

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

function getGenderBadge(gender: Property["gender"]): { label: string; style: string } {
  switch (gender) {
    case "boys":
      return { label: "Boys Only", style: "bg-primary/10 text-primary border-primary/20" };
    case "girls":
      return { label: "Girls Only", style: "bg-secondary/10 text-secondary border-secondary/20" };
    case "co-living":
      return { label: "Co-Living", style: "bg-accent/10 text-accent border-accent/20" };
  }
}

export function FeaturedListings() {
  const [favorites, setFavorites] = React.useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  return (
    <Section className="bg-muted/5">
      <Container>
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div className="flex flex-col gap-2 text-left">
            <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary">
              Handpicked for You
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight leading-[1.15]">
              Featured Listings
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-md">
              Discover student hostels, luxury PGs, and premium co-living rooms verified by our team.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              className="p-3 bg-card border border-border/80 rounded-full hover:bg-muted/40 text-muted-foreground transition-all duration-200 shadow-sm cursor-pointer active:scale-90"
              aria-label="Previous stays"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-3 bg-card border border-border/80 rounded-full hover:bg-muted/40 text-muted-foreground transition-all duration-200 shadow-sm cursor-pointer active:scale-90"
              aria-label="Next stays"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        <motion.div
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        >
          {MOCK_LISTINGS.map((property) => {
            const isFavorite = favorites.includes(property.id);
            const genderDetails = getGenderBadge(property.gender);

            return (
              <motion.div
                key={property.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: PREMIUM_EASE } },
                }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: PREMIUM_EASE }}
                className="flex flex-col w-full"
              >
                <div className="group bg-card rounded-[24px] overflow-hidden border border-border/80 hover:shadow-xl transition-shadow duration-300 flex flex-col relative w-full h-full">
                  {/* Image container */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      src={property.image}
                      alt={`${property.title} in ${property.location}`}
                    />

                    {/* Verified Host Badge overlay */}
                    {property.isVerified && (
                      <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-primary text-primary-foreground border border-primary/20 shadow-sm">
                        <BadgeCheck className="w-3 h-3" />
                        Verified
                      </span>
                    )}

                    {/* Wishlist button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(property.id);
                      }}
                      className={cn(
                        "absolute top-4 right-4 p-2.5 bg-card/85 backdrop-blur-sm rounded-full shadow-md transition-all duration-200 cursor-pointer hover:bg-card active:scale-90",
                        isFavorite ? "text-accent" : "text-muted-foreground/75 hover:text-accent"
                      )}
                      aria-label="Add to wishlist"
                    >
                      <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
                    </button>
                  </div>

                  {/* Info details box */}
                  <div className="p-6 flex-1 flex flex-col gap-4 border-t border-border/80">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold text-secondary uppercase tracking-widest">
                          {property.type}
                        </span>

                        <span className={cn("px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border", genderDetails.style)}>
                          {genderDetails.label}
                        </span>
                      </div>

                      <h3 className="font-heading text-lg font-bold text-primary truncate mt-1.5 leading-snug">
                        {property.title}
                      </h3>
                      <p className="font-body text-xs text-muted-foreground">
                        {property.location}
                      </p>
                    </div>

                    {/* Amenities list */}
                    <div className="flex flex-wrap gap-1">
                      {property.amenities.map((item) => (
                        <span
                          key={item}
                          className="text-[10px] font-semibold text-foreground/80 px-2.5 py-0.5 bg-muted/40 rounded-full border border-border/60"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* Pricing, review, CTA */}
                    <div className="border-t border-border/85 pt-4 mt-auto flex justify-between items-center gap-4">
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-0.5">
                          <span className="font-heading text-xl font-extrabold text-primary">
                            ₹{property.price.toLocaleString("en-IN")}
                          </span>
                          <span className="font-body text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                            / mo
                          </span>
                        </div>
                        {/* Rating indicator */}
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 text-secondary fill-current" />
                          <span className="text-[11px] font-bold text-primary">
                            {property.rating.toFixed(1)}
                          </span>
                          <span className="text-[9px] text-muted-foreground">
                            ({property.reviewCount})
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-accent px-5 py-3 rounded-xl text-xs font-semibold active:scale-95 transition-all duration-200 cursor-pointer shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        View Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </Section>
  );
}

export default FeaturedListings;
