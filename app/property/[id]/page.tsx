"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Wifi,
  Wind,
  Shield,
  Coffee,
  Tv,
  Utensils,
  WashingMachine,
  Sparkles,
  Train,
  ShoppingBag,
  GraduationCap,
  Activity,
  ArrowLeft,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Check,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import {
  PropertyHeader,
  Gallery,
  PropertyType,
  Amenities,
  PricingCard,
  OwnerCard,
  LocationMap,
  SimilarProperties,
  PropertyReviews,
} from "@/features/property-details/components";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { RecentlyViewedService } from "@/services/recently-viewed";
import { RecentlyViewedSection } from "@/components/property/recently-viewed-section";
import { ReviewsSection } from "@/components/review/reviews-section";
import { calculateRoomAvailability } from "@/lib/availability-utils";
import { cn } from "@/lib/utils";

// ─── Fallback Mock Data ─────────────────────────────────────────────────────────

const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80",
];

const MOCK_AMENITIES = [
  { icon: Wifi, title: "High-Speed Wi-Fi", isAvailable: true },
  { icon: Wind, title: "Air Conditioning", isAvailable: true },
  { icon: Shield, title: "24/7 Security", isAvailable: true },
  { icon: Coffee, title: "Community Lounge", isAvailable: true, statusText: "Premium" },
  { icon: Tv, title: "Smart TV", isAvailable: true },
  { icon: Utensils, title: "Mess Service", isAvailable: true, statusText: "Optional" },
  { icon: WashingMachine, title: "Laundry Service", isAvailable: true },
  { icon: Sparkles, title: "Daily Cleaning", isAvailable: true },
];



const MOCK_SIMILAR_PROPERTIES = [
  {
    id: "serene-oasis",
    title: "Serene Oasis PG",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
    location: "Bhawarkuan, Indore",
    price: 7500,
    rating: 4.9,
    type: "PG",
    isVerified: true,
    onView: () => {},
  },
  {
    id: "skyline-co-living",
    title: "Skyline Co-Living",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
    location: "Palasia, Indore",
    price: 12000,
    rating: 4.7,
    type: "Co-Living",
    isVerified: false,
    onView: () => {},
  },
];

import { PropertyService, Property, MediaImage, RoomConfiguration } from "@/services/property";
import { ReviewService } from "@/services/reviews";
import { MOCK_PROPERTIES } from "@/constants/mock-properties";

import { ScheduleVisitModal } from "@/components/enquiry/schedule-visit-modal";
import { SendEnquiryModal } from "@/components/enquiry/send-enquiry-modal";
import { BookCallModal } from "@/components/callback/book-call-modal";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { BackButton } from "@/components/shared/back-button";
import { shareProperty } from "@/lib/share-utils";
import { ShareModal } from "@/components/shared/share-modal";
import { useAuth } from "@/providers/auth-provider";

function PropertyDetailsContent() {
  const { user, role } = useAuth();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const propertyId = (params?.id as string) || "";
  const isPreviewMode = searchParams.get("preview") === "owner";

  const [prevId, setPrevId] = React.useState(propertyId);
  const [property, setProperty] = React.useState<Property | null>(() => {
    return propertyId ? PropertyService.getPropertyById(propertyId) : null;
  });

  const [reviewsVersion, setReviewsVersion] = React.useState(0);
  const ratingData = React.useMemo(() => {
    const data = ReviewService.getRatingBreakdown(propertyId);
    if (data.totalReviews === 0) {
      const mockProp = MOCK_PROPERTIES.find(p => p.id === propertyId);
      const defaultRating = mockProp?.rating || 4.5;
      return { overallRating: defaultRating, totalReviews: 0 };
    }
    return data;
  }, [propertyId, property, reviewsVersion]);

  const [isVisitModalOpen, setIsVisitModalOpen] = React.useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = React.useState(false);
  const [isBookCallModalOpen, setIsBookCallModalOpen] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  const [selectedRoomType, setSelectedRoomType] = React.useState<string>("Single Room");

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shared = await shareProperty({
      title: property?.propertyName || "Elite Residency",
      text: `Check out ${property?.propertyName || "this property"} on RoofOnClick!`,
      url,
    });

    if (!shared) {
      setIsShareModalOpen(true);
    }
  };

  if (prevId !== propertyId) {
    setPrevId(propertyId);
    setProperty(propertyId ? PropertyService.getPropertyById(propertyId) : null);
  }

  const isUserOwner = user !== null && (user.role === "owner" || role === "owner");
  const isOwnerView = isUserOwner || isPreviewMode;
  const displayImages = property?.images && property.images.length > 0
    ? property.images.map((img: MediaImage) => img.url)
    : (property?.coverPhoto ? [property.coverPhoto] : MOCK_IMAGES);

  const displayTitle = property?.propertyName || "Elite Residency";
  const displayType = (property?.propertyType === "Co-living" ? "Co-Living" : (property?.propertyType as unknown as PropertyType)) || "Hostel";
  const displayAddress = property?.address 
    ? `${property.address}, ${property.area}, ${property.city}`
    : "Vijay Nagar, Scheme 54, Indore, MP 452010";

  const displayRent = property?.startingRent || (property?.rooms?.[0]?.rent ? Number(property.rooms[0].rent) : 8500);
  const displayDeposit = property?.rooms?.[0]?.securityDeposit ? Number(property.rooms[0].securityDeposit) : 15000;

  React.useEffect(() => {
    if (property && !isOwnerView) {
      RecentlyViewedService.addRecentlyViewed(property);
    }
  }, [property, isOwnerView]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1" data-no-intercept="true">
        <Section className="bg-background relative overflow-hidden text-left pt-4 sm:pt-6 lg:pt-8 pb-28 lg:pb-12">
          {/* Ambient Background Glows */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-[20%] left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />

          <Container className="flex flex-col gap-8 md:gap-12">
            
            {/* Owner Preview Banner */}
            {isOwnerView && (
              <div className="bg-card border-2 border-primary/30 p-4.5 rounded-2xl shadow-premium flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground font-heading text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                        Owner Preview
                      </span>
                      <span className="font-heading text-xs font-bold text-primary">
                        Viewing as Property Owner
                      </span>
                    </div>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      Enquiry and booking actions are disabled while in Owner Preview mode.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/owner/dashboard")}
                  className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-primary font-heading text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Dashboard
                </button>
              </div>
            )}

            {/* Top Navigation Row */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <BackButton fallbackUrl="/explore" />
              <Breadcrumb customLabel={displayTitle} />
            </div>

            {/* 1. Header Information Block */}
            <div className="flex flex-col gap-4">
              <PropertyHeader
                title={displayTitle}
                type={displayType}
                address={displayAddress}
                rating={ratingData.overallRating}
                reviewCount={ratingData.totalReviews}
                isVerified={true}
                isWishlisted={false}
                propertyId={propertyId}
                onWishlistToggle={() => {}}
                onShare={handleShare}
                hideWishlist={isOwnerView}
              />
            </div>

            {/* 2. Photo Gallery Showcase */}
            <Gallery
              images={displayImages}
              videos={[
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
              ]}
              altPrefix={displayTitle}
            />

            {/* 3. Main Details and Sticky Sidebar Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
              
              {/* Left Column (Spans 8 cols of 12) */}
              <div className="lg:col-span-8 space-y-10 md:space-y-14">
                
                {/* Description & Overview */}
                {property?.description && (
                  <div className="flex flex-col gap-3 bg-muted/20 border border-border/60 p-6 rounded-2xl">
                    <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary">
                      About Property
                    </span>
                    <p className="font-body text-sm text-foreground/90 leading-relaxed">
                      {property.description}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-2 pt-3 border-t border-border/40 text-xs font-semibold text-muted-foreground">
                      <span>Target Gender: <strong className="text-primary">{property.gender}</strong></span>
                      {property.landmark && (
                        <span>Landmark: <strong className="text-primary">{property.landmark}</strong></span>
                      )}
                    </div>
                  </div>
                )}

                {/* Room Options Section */}
                {property?.rooms && property.rooms.length > 0 && (
                  <div className="flex flex-col gap-6 text-left">
                    <div className="flex flex-col gap-1">
                      <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary">
                        Available Configurations
                      </span>
                      <h2 className="font-heading text-2xl font-extrabold text-primary tracking-tight">
                        Room Options
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {property.rooms.map((rm: RoomConfiguration, idx: number) => {
                        const sharing = rm.sharingType || rm.roomType || "Single";
                        const rent = rm.monthlyRent ?? rm.rent ?? 0;
                        const deposit = rm.securityDeposit ?? 0;
                        const total = rm.totalRooms ?? 1;
                        const avail = rm.availableRooms ?? 1;
                        const roomGender = rm.gender || "Boys";
                        const bath = rm.attachedBathroom ? "Attached Bathroom" : "Shared Bathroom";
                        const furnished = rm.furnished || "Fully Furnished";

                        const isSelected = selectedRoomType === sharing;
                        return (
                          <div
                            key={idx}
                            onClick={() => setSelectedRoomType(sharing)}
                            className={cn(
                              "bg-card border p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-4 transition-all cursor-pointer select-none",
                              isSelected
                                ? "border-primary ring-2 ring-primary/30 bg-primary/5"
                                : "border-border/80 hover:border-primary/40"
                            )}
                          >
                            <div className="space-y-3">
                              <div className="flex justify-between items-start gap-2">
                                <div className="space-y-1">
                                  <span className="font-heading text-base font-extrabold text-primary block">
                                    {sharing}
                                  </span>
                                  {(() => {
                                    const availability = calculateRoomAvailability(avail, total);
                                    return (
                                      <div className="flex items-center gap-1.5">
                                        <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border flex items-center gap-1.5", availability.bgColor, availability.textColor, availability.borderColor)}>
                                          <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", availability.dotColor)} />
                                          <span>{availability.label}</span>
                                        </span>
                                        <span className="font-body text-[11px] font-semibold text-muted-foreground">
                                          ({avail}/{total} Left)
                                        </span>
                                      </div>
                                    );
                                  })()}
                                </div>
                                <span className="font-heading text-base font-extrabold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 shrink-0">
                                  ₹{rent.toLocaleString()} <span className="text-[10px] font-semibold text-muted-foreground font-body">/mo</span>
                                </span>
                              </div>

                              <div className="w-full h-px bg-border/40" />

                              <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold font-body text-muted-foreground">
                                <div className="space-y-0.5">
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Deposit</span>
                                  <span className="text-primary font-bold">₹{deposit.toLocaleString()}</span>
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Gender</span>
                                  <span className="text-primary font-bold">{roomGender}</span>
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Bathroom</span>
                                  <span className="text-primary font-bold">{bath}</span>
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Furnished</span>
                                  <span className="text-primary font-bold">{furnished}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Amenities Section */}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1 text-left">
                    <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary">
                      Amenities & Facilities
                    </span>
                    <h2 className="font-heading text-2xl font-extrabold text-primary tracking-tight">
                      Comfort & Convenience
                    </h2>
                  </div>

                  {property?.amenities && property.amenities.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
                      {property.amenities.map((item: string) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 bg-card border border-border/80 px-3.5 py-2.5 rounded-xl text-xs font-bold text-primary shadow-sm"
                        >
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Amenities items={MOCK_AMENITIES} />
                  )}
                </div>

                {/* House Rules Section */}
                {property?.rules && (
                  <div className="flex flex-col gap-4 bg-muted/20 border border-border/60 p-6 rounded-2xl">
                    <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary">
                      House Rules
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { label: "Smoking", allowed: property.rules.smokingAllowed },
                        { label: "Drinking", allowed: property.rules.drinkingAllowed },
                        { label: "Visitors", allowed: property.rules.visitorsAllowed },
                        { label: "Pets", allowed: property.rules.petsAllowed },
                        { label: "Loud Music", allowed: property.rules.loudMusicAllowed },
                      ].map((r) => (
                        <div key={r.label} className="flex items-center gap-2 text-xs font-semibold">
                          {r.allowed ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          )}
                          <span className={r.allowed ? "text-primary" : "text-muted-foreground"}>
                            {r.label} {r.allowed ? "Allowed" : "Prohibited"}
                          </span>
                        </div>
                      ))}
                    </div>
                    {property.rules.gateClosingEnabled && (
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-500 pt-2 border-t border-border/40">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span>Gate Curfew Time: {property.rules.gateClosingTime || "10:00 PM"}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Location & Map Section */}
                <LocationMap
                  address={displayAddress}
                  latitude={22.7533}
                  longitude={75.8937}
                />

                {/* Advanced Review & Rating System */}
                <ReviewsSection propertyId={property?.id || propertyId} />
              </div>

              {/* Right Sticky Sidebar (Spans 4 cols of 12) */}
              <aside className="lg:col-span-4">
                <div className="sticky top-24 space-y-6">
                  {isOwnerView ? (
                    /* Owner Preview Pricing Sidebar */
                    <div className="bg-card border-2 border-primary/20 rounded-3xl p-6 shadow-premium space-y-5">
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary block">
                          Owner Preview Pricing
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-heading text-3xl font-extrabold text-primary">₹{displayRent}</span>
                          <span className="font-body text-xs text-muted-foreground">/ month</span>
                        </div>
                        <span className="font-body text-xs text-muted-foreground block pt-0.5">
                          Deposit: ₹{displayDeposit} • Zero Brokerage
                        </span>
                      </div>

                      <div className="bg-muted/40 p-3.5 rounded-xl text-center space-y-1">
                        <span className="font-heading text-xs font-bold text-primary block">
                          Preview Mode Enabled
                        </span>
                        <p className="font-body text-[11px] text-muted-foreground leading-snug">
                          Booking & direct enquiry CTAs are disabled during owner property previews.
                        </p>
                      </div>

                      <button
                        onClick={() => router.push("/owner/dashboard")}
                        className="w-full bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all duration-300 shadow-md cursor-pointer select-none"
                      >
                        Return to Dashboard
                      </button>
                    </div>
                  ) : (
                    <>
                      <PricingCard
                        propertyId={property?.id || propertyId}
                        propertyName={displayTitle}
                        coverPhoto={property?.coverPhoto || property?.images?.[0]?.url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"}
                        monthlyRent={displayRent}
                        securityDeposit={displayDeposit}
                        brokerage={0}
                        availability="available"
                        includedBenefits={["High-speed Wi-Fi", "Daily housekeeping", "24/7 Power backup"]}
                        selectedRoomType={selectedRoomType}
                        onRoomTypeChange={setSelectedRoomType}
                        onScheduleVisit={() => setIsVisitModalOpen(true)}
                        onSendEnquiry={() => setIsEnquiryModalOpen(true)}
                        onContactOwner={() => setIsEnquiryModalOpen(true)}
                      />
                    </>
                  )}
                </div>
              </aside>

            </div>

            {/* Similar Properties Showcase */}
            {!isOwnerView && (
              <div className="flex flex-col gap-8 pt-6">
                <div className="flex flex-col gap-2 text-left">
                  <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary">
                    Explore Alternatives
                  </span>
                  <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight">
                    Similar Stays
                  </h2>
                </div>
                <SimilarProperties properties={MOCK_SIMILAR_PROPERTIES} />
              </div>
            )}

            {!isOwnerView && (
              <RecentlyViewedSection
                currentPropertyId={property?.id || propertyId}
                title="You Recently Viewed"
                subtitle="Stays you explored recently during your search."
              />
            )}

          </Container>
        </Section>
      </main>

      {/* Mobile Fixed Bottom Sticky CTA Bar */}
      {!isOwnerView && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border/80 p-3 sm:p-4 shadow-2xl flex items-center justify-between gap-2">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Starts From</span>
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-lg sm:text-xl font-extrabold text-primary">₹{displayRent.toLocaleString()}</span>
              <span className="text-[10px] font-semibold text-muted-foreground font-body">/mo</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              data-no-intercept="true"
              onClick={() => setIsBookCallModalOpen(true)}
              className="px-3 py-2.5 rounded-xl border border-primary/20 bg-primary/10 text-primary font-heading text-xs font-bold transition-all cursor-pointer min-h-[44px]"
            >
              Call
            </button>
            <button
              type="button"
              data-no-intercept="true"
              onClick={() => setIsVisitModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground font-heading text-xs font-bold transition-all cursor-pointer shadow-md min-h-[44px]"
            >
              Book Visit
            </button>
            <button
              type="button"
              data-no-intercept="true"
              onClick={() => setIsEnquiryModalOpen(true)}
              className="px-3 py-2.5 rounded-xl border border-border bg-card text-foreground font-heading text-xs font-bold transition-all cursor-pointer min-h-[44px]"
            >
              Enquire
            </button>
          </div>
        </div>
      )}

      {/* Action Modals */}
      <BookCallModal
        isOpen={isBookCallModalOpen}
        onClose={() => setIsBookCallModalOpen(false)}
        propertyId={propertyId || "default"}
        propertyName={displayTitle}
      />

      {/* Schedule Visit & Send Enquiry Modals */}
      <ScheduleVisitModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        propertyId={propertyId || "default"}
        propertyName={displayTitle}
      />

      <SendEnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        propertyId={propertyId || "default"}
        propertyName={displayTitle}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareData={{
          title: displayTitle,
          text: `Check out ${displayTitle} on RoofOnClick!`,
          url: typeof window !== "undefined" ? window.location.href : "",
        }}
      />

      <Footer />
    </div>
  );
}

import { SkeletonPropertyDetails } from "@/components/shared/skeletons";

function PropertyDetailsFallback() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1" data-no-intercept="true">
        <Section className="bg-background relative overflow-hidden text-left pt-6 pb-20">
          <Container>
            <SkeletonPropertyDetails />
          </Container>
        </Section>
      </main>
      <Footer />
    </div>
  );
}

export default function PropertyDetailsPage() {
  return (
    <React.Suspense fallback={<PropertyDetailsFallback />}>
      <PropertyDetailsContent />
    </React.Suspense>
  );
}
