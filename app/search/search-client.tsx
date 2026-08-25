"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

import { ListingsAPI } from "@/services/listings/listings.api";
import { Property } from "@/services/property/property.types";
import { useCity } from "@/providers/city-provider";

// Helper to format slug to title case / display name
function getDisplayTitle(slug: string): string {
  const decoded = decodeURIComponent(slug).replace(/[-_+]/g, " ").trim();
  const mapping: { [key: string]: string } = {
    "vijay nagar": "Vijay Nagar",
    "palasia": "Palasia",
    "bhawarkuan": "Bhawarkuan",
    "iet davv": "IET DAVV",
    "medanta hospital": "Medanta Hospital",
    "c21 mall": "C21 Mall",
  };
  return mapping[decoded.toLowerCase()] || decoded.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedCity, setCity } = useCity();
  const cityParam = searchParams.get("city");
  const locationSlug = searchParams.get("location") || searchParams.get("area") || searchParams.get("q");
  const typeParam = searchParams.get("type") || searchParams.get("category");

  // Sync city param from URL if present
  React.useEffect(() => {
    if (cityParam && cityParam.toLowerCase() !== selectedCity.id.toLowerCase()) {
      setCity(cityParam);
    }
  }, [cityParam, selectedCity.id, setCity]);

  const [selectedSidebarTypes, setSelectedSidebarTypes] = React.useState<string[]>(() => {
    if (!typeParam) return [];
    const t = typeParam.toLowerCase().trim();
    if (t.includes("hostel")) return ["Hostel"];
    if (t.includes("pg")) return ["PG"];
    if (t.includes("studio") || t.includes("rk")) return ["Studio Apartment"];
    if (t.includes("bhk") || t.includes("apartment")) return ["Apartment"];
    return [typeParam];
  });

  React.useEffect(() => {
    if (typeParam) {
      const t = typeParam.toLowerCase().trim();
      if (t.includes("hostel")) setSelectedSidebarTypes(["Hostel"]);
      else if (t.includes("pg")) setSelectedSidebarTypes(["PG"]);
      else if (t.includes("studio") || t.includes("rk")) setSelectedSidebarTypes(["Studio Apartment"]);
      else if (t.includes("bhk") || t.includes("apartment")) setSelectedSidebarTypes(["Apartment"]);
      else setSelectedSidebarTypes([typeParam]);
    }
  }, [typeParam]);

  const [isSaveModalOpen, setIsSaveModalOpen] = React.useState(false);
  const [selectedGenders, setSelectedGenders] = React.useState<string[]>([]);
  const [selectedBhk, setSelectedBhk] = React.useState<string[]>([]);
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

  const handleBhkChange = React.useCallback((bhk: string) => {
    setSelectedBhk((prev) =>
      prev.includes(bhk)
        ? prev.filter((b) => b !== bhk)
        : [...prev, bhk]
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
    setSelectedBhk([]);
    setSelectedBudget(null);
    setSelectedAmenities([]);
    setSelectedSharing([]);
    const base = `/search?city=${encodeURIComponent(selectedCity.id)}`;
    const url = locationSlug ? `${base}&location=${encodeURIComponent(locationSlug)}` : base;
    router.replace(url);
  }, [router, selectedCity.id, locationSlug]);

  const hasActiveFilters = React.useMemo(() => {
    return (
      selectedGenders.length > 0 ||
      selectedSidebarTypes.length > 0 ||
      selectedBhk.length > 0 ||
      selectedBudget !== null ||
      selectedAmenities.length > 0 ||
      selectedSharing.length > 0
    );
  }, [selectedGenders, selectedSidebarTypes, selectedBhk, selectedBudget, selectedAmenities, selectedSharing]);

  const [dbProperties, setDbProperties] = React.useState<Property[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    ListingsAPI.getListings({ city: selectedCity.name })
      .then((res) => {
        if (isMounted) {
          setDbProperties(res.listings || []);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setDbProperties([]);
          setIsLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [selectedCity.name]);

  // Filter properties based on URL slug, selected top type, selected genders, selected sidebar types, bhk tags, budget range, selected amenities AND sharing options
  const filteredProperties = React.useMemo(() => {
    let result = [...dbProperties];

    // Filter by active city
    if (selectedCity.name) {
      const cityName = selectedCity.name.toLowerCase();
      result = result.filter((p: any) => {
        const pCity = (p.city || "").toLowerCase();
        return !pCity || pCity.includes(cityName) || cityName.includes(pCity);
      });
    }

    // 1. Filter by location / search query slug (URL-safe & space-normalized)
    if (locationSlug) {
      const targetSlug = decodeURIComponent(locationSlug).toLowerCase().trim();
      const targetClean = targetSlug.replace(/[-_+]/g, " ").replace(/\s+/g, " ").trim();
      
      // If the location slug is the city itself, it represents a city-wide search
      const isCityWideSearch =
        targetClean === selectedCity.name.toLowerCase() ||
        targetClean === selectedCity.id.toLowerCase() ||
        targetClean === "all" ||
        targetClean === "all areas" ||
        targetClean === "all locations";

      if (!isCityWideSearch) {
        result = result.filter((p: any) => {
          const loc = (p.area || p.location || p.city || "").toLowerCase().replace(/[-_+]/g, " ").trim();
          const title = (p.propertyName || p.name || "").toLowerCase().replace(/[-_+]/g, " ").trim();
          const address = (p.address || "").toLowerCase().replace(/[-_+]/g, " ").trim();
          const landmark = (p.landmark || "").toLowerCase().replace(/[-_+]/g, " ").trim();
          const desc = (p.description || "").toLowerCase().replace(/[-_+]/g, " ").trim();
          return (
            loc.includes(targetClean) ||
            targetClean.includes(loc) ||
            loc.replace(/\s+/g, "-") === targetSlug ||
            loc.replace(/\s+/g, "+") === targetSlug ||
            title.includes(targetClean) ||
            address.includes(targetClean) ||
            landmark.includes(targetClean) ||
            desc.includes(targetClean)
          );
        });
      }
    }

    // 2. Filter by selected property types (PG / Hostel / Apartment / Studio, case-insensitive)
    if (selectedSidebarTypes.length > 0) {
      const lowerSidebar = selectedSidebarTypes.map((t) => t.toLowerCase().trim());
      result = result.filter((p: any) => {
        const pType = (p.propertyTypeGroup || p.propertyType || p.type || "").toLowerCase().trim();
        return lowerSidebar.some((st) => {
          if (st.includes("hostel")) return pType.includes("hostel");
          if (st.includes("pg")) return pType.includes("pg");
          if (st.includes("studio") || st.includes("rk")) return pType.includes("studio") || pType.includes("rk");
          if (st.includes("apartment") || st.includes("bhk")) return pType.includes("apartment") || pType.includes("bhk") || pType.includes("flat");
          return pType.includes(st) || st.includes(pType);
        });
      });
    }

    // 3. Filter by selected genders (case-insensitive)
    if (selectedGenders.length > 0) {
      const lowerGenders = selectedGenders.map((g) => g.toLowerCase().trim());
      if (lowerGenders.includes("boys") && lowerGenders.includes("girls")) {
        result = result.filter((p: any) => {
          const g = (p.gender || "").toLowerCase();
          return g.includes("boy") || g.includes("girl") || g.includes("co") || g.includes("unisex");
        });
      } else if (lowerGenders.includes("boys")) {
        result = result.filter((p: any) => (p.gender || "").toLowerCase().includes("boy"));
      } else if (lowerGenders.includes("girls")) {
        result = result.filter((p: any) => (p.gender || "").toLowerCase().includes("girl"));
      }
    }

    // 4.5. Filter by BHK configuration tags (RK, Studio, 1 BHK, 2 BHK, 3 BHK, 4+ BHK, case-insensitive)
    if (selectedBhk.length > 0) {
      result = result.filter((p: any) => {
        const pText = ((p.propertyName || p.name || "") + " " + (p.propertyType || p.type || "") + " " + (p.bhk || "")).toLowerCase();
        return selectedBhk.some((bhk) => {
          const bLower = bhk.toLowerCase().trim();
          if (bLower === "rk") return pText.includes("rk") || pText.includes("1rk");
          if (bLower === "studio") return pText.includes("studio");
          if (bLower === "1 bhk") return pText.includes("1 bhk") || pText.includes("1bhk");
          if (bLower === "2 bhk") return pText.includes("2 bhk") || pText.includes("2bhk");
          if (bLower === "3 bhk") return pText.includes("3 bhk") || pText.includes("3bhk");
          if (bLower === "4+ bhk") return pText.includes("4 bhk") || pText.includes("4bhk");
          return pText.includes(bLower);
        });
      });
    }

    const getPrice = (p: Property) => p.startingRent || p.startingPrice || (p as any).price || 0;

    // 5. Filter by budget range (Budget pill chips)
    if (selectedBudget) {
      if (selectedBudget === "Under ₹5,000") {
        result = result.filter((p) => getPrice(p) < 5000);
      } else if (selectedBudget === "₹5,000 – ₹8,000") {
        result = result.filter((p) => getPrice(p) >= 5000 && getPrice(p) <= 8000);
      } else if (selectedBudget === "₹8,000 – ₹12,000") {
        result = result.filter((p) => getPrice(p) >= 8000 && getPrice(p) <= 12000);
      } else if (selectedBudget === "Above ₹12,000") {
        result = result.filter((p) => getPrice(p) > 12000);
      }
    }

    // 6. Filter by selected amenities (AND logic, case-insensitive)
    if (selectedAmenities.length > 0) {
      result = result.filter((p) => {
        const pAmenities = (p.amenities || []).map((a: string) => a.toLowerCase().trim());
        return selectedAmenities.every((amenity) =>
          pAmenities.some((pa: string) => pa.includes(amenity.toLowerCase().trim()) || amenity.toLowerCase().trim().includes(pa))
        );
      });
    }

    // 7. Filter by sharing options (OR logic, case-insensitive)
    if (selectedSharing.length > 0) {
      const lowerSharing = selectedSharing.map((s) => s.toLowerCase().trim());
      result = result.filter((p: Property) => {
        const rawSharing: string[] = (p as any).sharing || p.rooms?.map((r) => r.sharingType) || [];
        const pSharing = rawSharing.map((s) => s.toLowerCase().trim());
        return lowerSharing.some((opt) =>
          pSharing.some((ps) => ps.includes(opt) || opt.includes(ps))
        );
      });
    }

    // --- SORTING (happens after filtering) ---
    if (selectedSort === "Price: Low to High") {
      result.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (selectedSort === "Price: High to Low") {
      result.sort((a, b) => getPrice(b) - getPrice(a));
    } else if (selectedSort === "Highest Rated") {
      result.sort((a, b) => ((b as any).rating || 0) - ((a as any).rating || 0));
    } else if (selectedSort === "Newest") {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return result;
  }, [dbProperties, selectedCity.name, locationSlug, selectedSidebarTypes, selectedGenders, selectedBhk, selectedBudget, selectedAmenities, selectedSharing, selectedSort]);

  const displayLocation = React.useMemo(() => {
    return locationSlug ? getDisplayTitle(locationSlug) : "All Areas";
  }, [locationSlug]);

  return (
    <div className="relative flex flex-col min-h-[100dvh] bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Section className="bg-muted/10 pt-4 sm:pt-6 lg:pt-8 pb-8 sm:pb-12 relative overflow-hidden">
          {/* Decorative ambient background glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />

          <Container>
            {/* Standardized Page Header */}
            <PageHeader
              title="Search Results"
              subtitle={
                <span className="flex items-center gap-1.5">
                  Showing stays in{" "}
                  <span className="font-semibold text-secondary flex items-center gap-1">
                    📍 {displayLocation === "All Areas" ? selectedCity.name : `${displayLocation}, ${selectedCity.name}`}
                  </span>
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
                selectedBhk={selectedBhk}
                onBhkChange={handleBhkChange}
                selectedBudget={selectedBudget}
                onBudgetChange={handleBudgetChange}
                selectedAmenities={selectedAmenities}
                onAmenityChange={handleAmenityChange}
                selectedSharing={selectedSharing}
                onSharingChange={handleSharingChange}
                onClearAll={handleClearAll}
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
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div key={idx} className="bg-card border border-border/80 rounded-3xl p-4 space-y-3 animate-pulse">
                        <div className="aspect-[4/3] bg-muted/60 rounded-2xl" />
                        <div className="h-4 bg-muted/60 rounded-md w-3/4" />
                        <div className="h-3 bg-muted/40 rounded-md w-1/2" />
                        <div className="h-5 bg-muted/50 rounded-md w-1/3 pt-2" />
                      </div>
                    ))}
                  </div>
                ) : filteredProperties.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredProperties.map((property) => (
                      <PropertyCard property={property as any} key={property.id} />
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
                      href: `/search?city=${encodeURIComponent(selectedCity.id)}`,
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
      <div className="relative flex flex-col min-h-[100dvh] bg-background">
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
