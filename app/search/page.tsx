"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { MapPin, Star, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterSidebar } from "@/components/filters/filter-sidebar";

// Mock Properties Dataset (9 items)
const MOCK_PROPERTIES = [
  {
    id: "p1",
    name: "Elite Residency",
    location: "Vijay Nagar",
    price: 8500,
    rating: 4.8,
    verified: true,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80",
    type: "Co-Living",
    gender: "co-living",
    propertyTypeGroup: "PG",
    amenities: ["WiFi", "Food", "AC", "Laundry", "Parking"],
  },
  {
    id: "p2",
    name: "Skyline Premium Stays",
    location: "Bhawarkuan",
    price: 7200,
    rating: 4.5,
    verified: true,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80",
    type: "Boys PG",
    gender: "boys",
    propertyTypeGroup: "PG",
    amenities: ["WiFi", "Food", "AC", "Laundry"],
  },
  {
    id: "p3",
    name: "CoHabit Spaces",
    location: "Palasia",
    price: 9500,
    rating: 4.9,
    verified: true,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80",
    type: "Co-Living",
    gender: "co-living",
    propertyTypeGroup: "PG",
    amenities: ["WiFi", "AC", "Laundry", "Parking"],
  },
  {
    id: "p4",
    name: "Oasis Student Hostel",
    location: "Vijay Nagar",
    price: 6000,
    rating: 4.2,
    verified: false,
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&auto=format&fit=crop&q=80",
    type: "Hostel",
    gender: "boys",
    propertyTypeGroup: "Hostel",
    amenities: ["WiFi", "Food", "Laundry"],
  },
  {
    id: "p5",
    name: "Serene Nest for Girls",
    location: "Bhawarkuan",
    price: 8000,
    rating: 4.7,
    verified: true,
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    type: "Girls PG",
    gender: "girls",
    propertyTypeGroup: "PG",
    amenities: ["WiFi", "Food", "AC", "Laundry", "Parking"],
  },
  {
    id: "p6",
    name: "DAVV Scholar House",
    location: "IET DAVV",
    price: 6500,
    rating: 4.4,
    verified: true,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
    type: "Hostel",
    gender: "boys",
    propertyTypeGroup: "Hostel",
    amenities: ["WiFi", "Food", "Laundry", "Parking"],
  },
  {
    id: "p7",
    name: "Medanta Care Suites",
    location: "Medanta Hospital",
    price: 11000,
    rating: 4.9,
    verified: true,
    image: "https://images.unsplash.com/photo-1560185127-6a2806647f81?w=600&auto=format&fit=crop&q=80",
    type: "Co-Living",
    gender: "co-living",
    propertyTypeGroup: "PG",
    amenities: ["WiFi", "AC", "Laundry", "Parking"],
  },
  {
    id: "p8",
    name: "C21 Luxury Stay",
    location: "C21 Mall",
    price: 12500,
    rating: 4.9,
    verified: true,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80",
    type: "Co-Living",
    gender: "co-living",
    propertyTypeGroup: "PG",
    amenities: ["WiFi", "Food", "AC", "Laundry", "Parking"],
  },
  {
    id: "p9",
    name: "Orchard Heights",
    location: "Palasia",
    price: 8800,
    rating: 4.6,
    verified: false,
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80",
    type: "Girls PG",
    gender: "girls",
    propertyTypeGroup: "PG",
    amenities: ["WiFi", "Food", "AC", "Laundry"],
  },
];

// Helper to format slug to title case / display name
function getDisplayTitle(slug: string): string {
  const mapping: { [key: string]: string } = {
    "vijay-nagar": "Vijay Nagar",
    "palasia": "Palasia",
    "bhawarkuan": "Bhawarkuan",
    "iet-davv": "IET DAVV",
    "medanta-hospital": "Medanta Hospital",
    "c21-mall": "C21 Mall",
  };
  return mapping[slug.toLowerCase()] || slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locationSlug = searchParams.get("location");
  const [selectedType, setSelectedType] = React.useState<string>("All");
  const [selectedGenders, setSelectedGenders] = React.useState<string[]>([]);
  const [selectedSidebarTypes, setSelectedSidebarTypes] = React.useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = React.useState<string | null>(null);

  const handleGenderChange = React.useCallback((gender: string) => {
    setSelectedGenders((prev) =>
      prev.includes(gender)
        ? prev.filter((g) => g !== gender)
        : [...prev, gender]
    );
  }, []);

  const handleSidebarTypeChange = React.useCallback((type: string) => {
    setSelectedSidebarTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  }, []);

  const handleBudgetChange = React.useCallback((budget: string | null) => {
    setSelectedBudget((prev) => (prev === budget ? null : budget));
  }, []);

  // Filter properties based on URL slug, selected top type, selected genders, selected sidebar types AND budget range
  const filteredProperties = React.useMemo(() => {
    let result = MOCK_PROPERTIES;

    // 1. Filter by location slug
    if (locationSlug) {
      const targetSlug = locationSlug.toLowerCase();
      result = result.filter(
        (p) => p.location.toLowerCase().replace(/\s+/g, "-") === targetSlug
      );
    }

    // 2. Filter by selected top property type chip
    if (selectedType !== "All") {
      result = result.filter((p) => p.type === selectedType);
    }

    // 3. Filter by selected genders
    if (selectedGenders.length > 0) {
      if (selectedGenders.includes("boys") && selectedGenders.includes("girls")) {
        // Both selected: show boys, girls, and co-living
        result = result.filter(
          (p) => p.gender === "boys" || p.gender === "girls" || p.gender === "co-living"
        );
      } else if (selectedGenders.includes("boys")) {
        // Only boys selected: show boys only
        result = result.filter((p) => p.gender === "boys");
      } else if (selectedGenders.includes("girls")) {
        // Only girls selected: show girls only
        result = result.filter((p) => p.gender === "girls");
      }
    }

    // 4. Filter by selected sidebar property types (PG / Hostel)
    if (selectedSidebarTypes.length > 0) {
      result = result.filter((p) => selectedSidebarTypes.includes(p.propertyTypeGroup));
    }

    // 5. Filter by budget range (Budget pill chips)
    if (selectedBudget) {
      if (selectedBudget === "Under ₹5,000") {
        result = result.filter((p) => p.price < 5000);
      } else if (selectedBudget === "₹5,000 – ₹8,000") {
        result = result.filter((p) => p.price >= 5000 && p.price <= 8000);
      } else if (selectedBudget === "₹8,000 – ₹12,000") {
        result = result.filter((p) => p.price >= 8000 && p.price <= 12000);
      } else if (selectedBudget === "Above ₹12,000") {
        result = result.filter((p) => p.price > 12000);
      }
    }

    return result;
  }, [locationSlug, selectedType, selectedGenders, selectedSidebarTypes, selectedBudget]);

  const displayLocation = React.useMemo(() => {
    return locationSlug ? getDisplayTitle(locationSlug) : "All Locations";
  }, [locationSlug]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Section className="bg-muted/10 py-12 relative overflow-hidden">
          {/* Decorative ambient background glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />

          <Container>
            {/* Search Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/80 pb-6 mb-8 text-left">
              <div>
                <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mb-2">
                  Search Results
                </h1>
                <p className="font-body text-base text-muted-foreground flex items-center gap-1.5">
                  Showing stays in <span className="font-semibold text-secondary flex items-center gap-1">📍 {displayLocation}</span>
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="font-body text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-lg">
                  {filteredProperties.length} Stays Found
                </span>
              </div>
            </div>

            {/* Property Type Filter Chips */}
            <div className="flex flex-wrap gap-2.5 mb-10 text-left" data-no-intercept="true">
              {["All", "Boys PG", "Girls PG", "Co-Living", "Hostel"].map((type) => {
                const isSelected = selectedType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      "px-5 py-2.5 rounded-full text-xs font-bold tracking-wide border transition-all duration-200 cursor-pointer shadow-sm select-none",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary/30 font-extrabold"
                        : "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:border-border/60"
                    )}
                  >
                    {type}
                  </button>
                );
              })}
            </div>

            {/* Main Content Layout: Sidebar + Grid */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Left Filter Sidebar */}
              <FilterSidebar
                selectedGenders={selectedGenders}
                onGenderChange={handleGenderChange}
                selectedTypes={selectedSidebarTypes}
                onTypeChange={handleSidebarTypeChange}
                selectedBudget={selectedBudget}
                onBudgetChange={handleBudgetChange}
              />

              {/* Right Column: Grid or Empty State */}
              <div className="flex-1 w-full">
                {filteredProperties.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredProperties.map((property) => (
                      <div
                        key={property.id}
                        onClick={() => router.push(`/property/${property.id}`)}
                        className="group bg-card border border-border/80 rounded-2xl overflow-hidden shadow-premium hover:shadow-2xl hover:scale-[1.015] hover:-translate-y-0.5 transition-all duration-250 flex flex-col cursor-pointer"
                      >
                        {/* Image Container */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                          <img
                            src={property.image}
                            alt={property.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          
                          {/* Type Badge */}
                          <span className="absolute top-3 left-3 bg-foreground/80 backdrop-blur-md text-background text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md z-10">
                            {property.type}
                          </span>

                          {/* Verified Badge */}
                          {property.verified && (
                            <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm z-10">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Verified
                            </span>
                          )}
                        </div>

                        {/* Content Container */}
                        <div className="p-5 flex-1 flex flex-col justify-between text-left">
                          <div>
                            {/* Location and Rating Row */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                                <span className="text-xs font-semibold font-body">{property.location}</span>
                              </div>
                              <div className="flex items-center gap-1 bg-secondary/10 px-2 py-0.5 rounded-lg">
                                <Star className="w-3.5 h-3.5 text-secondary fill-current shrink-0" />
                                <span className="text-xs font-bold text-primary">{property.rating}</span>
                              </div>
                            </div>

                            {/* Property Name */}
                            <h3 className="font-heading text-lg font-bold text-primary mb-3 group-hover:text-secondary transition-colors duration-200">
                              {property.name}
                            </h3>

                            {/* Amenities Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {property.amenities.map((amenity) => (
                                <span
                                  key={amenity}
                                  className="text-[10px] font-semibold text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md"
                                >
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Price & Action Row */}
                          <div className="border-t border-border/60 pt-4 flex items-center justify-between mt-auto">
                            <div>
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block leading-none">
                                Starting from
                              </span>
                              <span className="font-heading text-lg font-extrabold text-primary">
                                ₹{property.price.toLocaleString()}
                                <span className="text-xs font-semibold text-muted-foreground font-body">/mo</span>
                              </span>
                            </div>
                            <button className="bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground text-xs font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer shadow-md shadow-primary/10">
                              Book Room
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center flex flex-col items-center justify-center gap-4 bg-card border border-border/80 rounded-2xl shadow-premium">
                    <span className="text-5xl">🏢</span>
                    <h3 className="font-heading text-xl font-bold text-primary">No properties found</h3>
                    <p className="font-body text-sm text-muted-foreground max-w-md">
                      We couldn&apos;t find any matching stays in &ldquo;{displayLocation}&rdquo; under the &ldquo;{selectedType}&rdquo; filter.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="relative flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <span className="font-body text-sm font-semibold text-muted-foreground">Loading Search Results...</span>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
