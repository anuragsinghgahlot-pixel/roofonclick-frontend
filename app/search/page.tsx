"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Bookmark } from "lucide-react";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { FilterSidebar } from "@/components/filters/filter-sidebar";
import { SearchToolbar } from "@/components/search/search-toolbar";
import { PropertyCard } from "@/components/cards/property-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { BackButton } from "@/components/shared/back-button";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SaveSearchModal } from "@/components/saved-searches/save-search-modal";
import { SearchHistoryService } from "@/services/search-history";
import { RecommendedSection } from "@/components/recommendations/recommended-section";

import { MOCK_PROPERTIES } from "@/constants/mock-properties";

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
  const searchParams = useSearchParams();
  const locationSlug = searchParams.get("location") || searchParams.get("area");
  const [selectedType] = React.useState<string>("All");
  const [isSaveModalOpen, setIsSaveModalOpen] = React.useState(false);
  const [selectedGenders, setSelectedGenders] = React.useState<string[]>([]);
  const [selectedSidebarTypes, setSelectedSidebarTypes] = React.useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = React.useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>([]);
  const [selectedSharing, setSelectedSharing] = React.useState<string[]>([]);
  const [selectedSort, setSelectedSort] = React.useState<string>("Recommended");

  React.useEffect(() => {
    const displayLoc = locationSlug ? getDisplayTitle(locationSlug) : "Indore";
    const summary = `${selectedGenders[0] || "All"} ${selectedSidebarTypes[0] || "Stays"} in ${displayLoc}`;
    SearchHistoryService.addRecentSearch({
      querySummary: summary,
      location: displayLoc,
      propertyType: selectedSidebarTypes[0],
      gender: selectedGenders[0],
      sharingType: selectedSharing[0],
    });
  }, [locationSlug, selectedGenders, selectedSidebarTypes, selectedSharing]);

  const handleSortChange = React.useCallback((sort: string) => {
    setSelectedSort(sort);
  }, []);

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

  const handleAmenityChange = React.useCallback((amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  }, []);

  const handleSharingChange = React.useCallback((option: string) => {
    setSelectedSharing((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  }, []);

  const handleClearAll = React.useCallback(() => {
    setSelectedGenders([]);
    setSelectedSidebarTypes([]);
    setSelectedBudget(null);
    setSelectedAmenities([]);
    setSelectedSharing([]);
  }, []);

  const hasActiveFilters = React.useMemo(() => {
    return (
      selectedGenders.length > 0 ||
      selectedSidebarTypes.length > 0 ||
      selectedBudget !== null ||
      selectedAmenities.length > 0 ||
      selectedSharing.length > 0
    );
  }, [selectedGenders, selectedSidebarTypes, selectedBudget, selectedAmenities, selectedSharing]);

  // Filter properties based on URL slug, selected top type, selected genders, selected sidebar types, budget range, selected amenities AND sharing options
  const filteredProperties = React.useMemo(() => {
    let result = [...MOCK_PROPERTIES];

    // 1. Filter by location/area slug
    if (locationSlug) {
      const targetSlug = locationSlug.toLowerCase().trim();
      const targetClean = targetSlug.replace(/[-_]/g, " ");
      result = result.filter((p) => {
        const loc = p.location.toLowerCase();
        return loc.includes(targetClean) || targetClean.includes(loc) || loc.replace(/\s+/g, "-") === targetSlug;
      });
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

    // 6. Filter by selected amenities (AND logic)
    if (selectedAmenities.length > 0) {
      result = result.filter((p) =>
        selectedAmenities.every((amenity) => p.amenities.includes(amenity))
      );
    }

    // 7. Filter by sharing options (OR logic)
    if (selectedSharing.length > 0) {
      result = result.filter((p) =>
        p.sharing.some((opt) => selectedSharing.includes(opt))
      );
    }

    // --- SORTING (happens after filtering) ---
    if (selectedSort === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "Price: High to Low") {
      result.sort((a, b) => b.price - a.price);
    } else if (selectedSort === "Highest Rated") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (selectedSort === "Newest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [locationSlug, selectedType, selectedGenders, selectedSidebarTypes, selectedBudget, selectedAmenities, selectedSharing, selectedSort]);

  const displayLocation = React.useMemo(() => {
    return locationSlug ? getDisplayTitle(locationSlug) : "All Locations";
  }, [locationSlug]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Section className="bg-muted/10 pt-24 pb-8 sm:pb-12 relative overflow-hidden">
          {/* Decorative ambient background glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />

          <Container>
            {/* Standardized Page Header */}
            <PageHeader
              title="Search Results"
              subtitle={
                <span className="flex items-center gap-1.5">
                  Showing stays in <span className="font-semibold text-secondary flex items-center gap-1">📍 {displayLocation}</span>
                </span>
              }
              badge={
                <div className="flex items-center gap-2">
                  <span className="font-body text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg">
                    {filteredProperties.length} Stays Found
                  </span>
                  <button
                    type="button"
                    data-no-intercept="true"
                    onClick={() => setIsSaveModalOpen(true)}
                    className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 hover:bg-primary hover:text-primary-foreground text-primary font-heading text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer select-none active:scale-95"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save Search</span>
                  </button>
                </div>
              }
              backFallbackUrl="/"
            />

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
                selectedAmenities={selectedAmenities}
                onAmenityChange={handleAmenityChange}
                selectedSharing={selectedSharing}
                onSharingChange={handleSharingChange}
              />

              {/* Right Column: Grid or Empty State */}
              <div className="flex-1 w-full">
                <SearchToolbar
                  selectedGenders={selectedGenders}
                  onGenderChange={handleGenderChange}
                  selectedTypes={selectedSidebarTypes}
                  onTypeChange={handleSidebarTypeChange}
                  selectedBudget={selectedBudget}
                  onBudgetChange={handleBudgetChange}
                  selectedAmenities={selectedAmenities}
                  onAmenityChange={handleAmenityChange}
                  selectedSharing={selectedSharing}
                  onSharingChange={handleSharingChange}
                  hasActiveFilters={hasActiveFilters}
                  onClearAll={handleClearAll}
                  selectedSort={selectedSort}
                  onSortChange={handleSortChange}
                />
                {filteredProperties.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredProperties.map((property) => (
                      <PropertyCard property={property} key={property.id} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    emoji="🔍"
                    title="No Matching Stays Found"
                    description={`We couldn't find any accommodation in "${displayLocation}" matching your selected filters.`}
                    primaryAction={{
                      label: "Clear All Filters",
                      onClick: handleClearAll,
                    }}
                    secondaryAction={{
                      label: "Browse All Locations",
                      href: "/search",
                    }}
                  />
                )}
              </div>
            </div>
          </Container>
        </Section>

        {/* Location-Aware Contextual Recommendation Section */}
        <RecommendedSection
          location={locationSlug ? getDisplayTitle(locationSlug) : undefined}
          propertyType={selectedSidebarTypes[0]}
        />
      </main>

      <SaveSearchModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        filters={{
          location: locationSlug || undefined,
          propertyType: selectedSidebarTypes[0],
          gender: selectedGenders[0],
          sharingType: selectedSharing[0],
          amenities: selectedAmenities,
        }}
      />

      <Footer />
    </div>
  );
}

import { SearchPageSkeleton } from "@/components/shared/skeletons";

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="relative flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-1" data-no-intercept="true">
          <Section className="bg-background relative overflow-hidden text-left pt-6 pb-20">
            <Container className="space-y-8">
              <SearchPageSkeleton />
            </Container>
          </Section>
        </main>
        <Footer />
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
