"use client";

import * as React from "react";
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
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import {
  PropertyHeader,
  Gallery,
  Amenities,
  PricingCard,
  OwnerCard,
  LocationMap,
  SimilarProperties,
} from "@/features/property-details/components";

// ─── Temporary Mock Data ───────────────────────────────────────────────────────

const MOCK_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBBioc3bTmd4Cnx4CoLqJwDmgifaSLFft8aWGsZ1UYQ46TH6NU5Kvh-1364-pR8mPAMsMJLBgBVCHJExeY1E3cquupJrkzBWRN8eSCZtWzuOSZuJ4azGtDymccmGJ85JZw7CK-FHn0mop4-k3for8HLgyfMkTMtQqb1PtbX1VoZOAf76fnYGWgW_Cf0dQ0fEXRybxY8I08w3nAlM12D9XlRPeqbl1CYOqumHQXwjaKfoBouF-jie-kW5GNU62plTWU_RDDbdD3sdTnf",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAOGJjlWzTSbpYdmeITEUBmfJdtmadS9Ay9SNiBmfjU5kRlTLW4jX-TSeaKJJezQdBrxBVhMu2jdr8QoNccFs51MfKdr7nqLte-WRQMvtN_q7TRDcQXgtqKn2qmFHZaRS1p9L45c-6w0GM7zAaY7c6hbyxlmi3ToaXHpSuOL4XtdGjK86KOFZBLdWNy2AajEZzDCnaY4klzoY1uHCSr9Jg3jP5telIwz-tE8CAsjnWCBZ3h0eA-wEKva_VOnkTZyaCd4tykP6RIlU-A",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA1r2AYVVLCTOz-mmG5ZzpriCqSXko4D-XObLhN6mkIC-zUlW2TMsa6RIaQ2tWKX_4kMxr9yfqTqhaEVSUzOYJeIIYyP0rnTSbOzCX3iQDfTYG0xMq0iMLYv9UqBkM_Tc4iQycBB3tG84bTBHhM9nSA3v8HO79oFN72mYlYcjG_TUFU-j91BQ1YLTspDevHLHhBIP1SPIQ3cNyQ1TbPBQj2fEdzD2qQc3Ux2zB8QTDRqhQ3KCYBP0cv478LWmbwOt5qmOiqYc_2HQEE",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBom54qUEQA1Ay3uqpWhluPk5Kafp4lGEoInKPGdyvgUeXqfqSPIBm5RtN4QxlqygEthuU6zAikwfGj2eTq6LRoB5vb0f_g_C7fh4jjSV3NcetMB9N_qvdNuuKIPPpYgKB2rSlhh4YpNS23FUz1RaTKBnJA8bPDZawjCL-kC2sDednG6otjg9k7IBBnVIAc5MxFVnyIumh_PaV45b_S80xyeoz7hQ5DS1VIHLshDv_n1HDaDIF3HHxWmaYSOYBVMSVEZxS1v2wC7UMp",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80",
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

const MOCK_NEARBY_PLACES = [
  { name: "Vijay Nagar Metro Station", type: "Transit", distance: "450m", icon: Train },
  { name: "C21 Mall", type: "Shopping & Dining", distance: "800m", icon: ShoppingBag },
  { name: "IET DAVV College", type: "Education", distance: "3.2 km", icon: GraduationCap },
  { name: "Medanta Hospital", type: "Healthcare", distance: "1.5 km", icon: Activity },
];

const MOCK_SIMILAR_PROPERTIES = [
  {
    id: "serene-oasis",
    title: "Serene Oasis PG",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOGJjlWzTSbpYdmeITEUBmfJdtmadS9Ay9SNiBmfjU5kRlTLW4jX-TSeaKJJezQdBrxBVhMu2jdr8QoNccFs51MfKdr7nqLte-WRQMvtN_q7TRDcQXgtqKn2qmFHZaRS1p9L45c-6w0GM7zAaY7c6hbyxlmi3ToaXHpSuOL4XtdGjK86KOFZBLdWNy2AajEZzDCnaY4klzoY1uHCSr9Jg3jP5telIwz-tE8CAsjnWCBZ3h0eA-wEKva_VOnkTZyaCd4tykP6RIlU-A",
    location: "Bhawarkuan, Indore",
    price: 7500,
    rating: 4.9,
    type: "PG",
    isVerified: true,
    onView: () => console.log("Viewing Serene Oasis PG"),
  },
  {
    id: "skyline-co-living",
    title: "Skyline Co-Living",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1r2AYVVLCTOz-mmG5ZzpriCqSXko4D-XObLhN6mkIC-zUlW2TMsa6RIaQ2tWKX_4kMxr9yfqTqhaEVSUzOYJeIIYyP0rnTSbOzCX3iQDfTYG0xMq0iMLYv9UqBkM_Tc4iQycBB3tG84bTBHhM9nSA3v8HO79oFN72mYlYcjG_TUFU-j91BQ1YLTspDevHLHhBIP1SPIQ3cNyQ1TbPBQj2fEdzD2qQc3Ux2zB8QTDRqhQ3KCYBP0cv478LWmbwOt5qmOiqYc_2HQEE",
    location: "Palasia, Indore",
    price: 12000,
    rating: 4.7,
    type: "Co-Living",
    isVerified: false,
    onView: () => console.log("Viewing Skyline Co-Living"),
  },
  {
    id: "lig-nest-hostel",
    title: "LIG Nest Hostels",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBom54qUEQA1Ay3uqpWhluPk5Kafp4lGEoInKPGdyvgUeXqfqSPIBm5RtN4QxlqygEthuU6zAikwfGj2eTq6LRoB5vb0f_g_C7fh4jjSV3NcetMB9N_qvdNuuKIPPpYgKB2rSlhh4YpNS23FUz1RaTKBnJA8bPDZawjCL-kC2sDednG6otjg9k7IBBnVIAc5MxFVnyIumh_PaV45b_S80xyeoz7hQ5DS1VIHLshDv_n1HDaDIF3HHxWmaYSOYBVMSVEZxS1v2wC7UMp",
    location: "LIG Colony, Indore",
    price: 6000,
    rating: 4.4,
    type: "Hostel",
    isVerified: true,
    onView: () => console.log("Viewing LIG Nest Hostels"),
  },
];

// ─── Page Component ────────────────────────────────────────────────────────────

export default function PropertyDetailsPage() {
  return (
    <Section className="bg-background relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <Container className="flex flex-col gap-8 md:gap-12 lg:gap-16">
        
        {/* 1. Header Information Block */}
        <div className="flex flex-col gap-4">
          <PropertyHeader
            title="Elite Residency"
            type="Hostel"
            address="Vijay Nagar, Scheme 54, Indore, MP 452010"
            rating={4.8}
            reviewCount={124}
            isVerified={true}
            isWishlisted={false}
            onWishlistToggle={() => console.log("Wishlist toggled")}
            onShare={() => console.log("Share clicked")}
          />
        </div>

        {/* 2. Photo Gallery Showcase */}
        <Gallery images={MOCK_IMAGES} altPrefix="Elite Residency" />

        {/* 3. Main Details and Sticky Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
          
          {/* Left Column (Spans 8 cols of 12) */}
          <main className="lg:col-span-8 space-y-12 md:space-y-16">
            
            {/* Amenities Section */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 text-left">
                <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary">
                  Premium Amenities
                </span>
                <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight leading-[1.15]">
                  Comfort & Convenience
                </h2>
              </div>
              <div className="pt-2 border-t border-border/40">
                <Amenities items={MOCK_AMENITIES} />
              </div>
            </div>

            <div className="w-full h-px bg-border/40" />

            {/* Location & Map Section */}
            <LocationMap
              address="Vijay Nagar, Scheme 54, Indore, MP 452010"
              latitude={22.7533}
              longitude={75.8937}
              nearbyPlaces={MOCK_NEARBY_PLACES}
            />
          </main>

          {/* Right Sticky Sidebar (Spans 4 cols of 12) */}
          <aside className="lg:col-span-4">
            {/* Sticky bounds container */}
            <div className="sticky top-24 space-y-6">
              <PricingCard
                monthlyRent={8500}
                securityDeposit={15000}
                brokerage={0}
                availability="few-left"
                includedBenefits={["High-speed Wi-Fi", "Daily housekeeping", "24/7 Power backup", "Pure drinking water"]}
                onBookNow={() => console.log("Book Now clicked")}
                onContactOwner={() => console.log("Contact Owner clicked")}
              />
              
              <OwnerCard
                ownerName="Rajesh Kumar"
                ownerImage="https://api.dicebear.com/8.x/lorelei/svg?seed=Rajesh"
                isVerified={true}
                responseTime="Within 10 mins"
                phone="+91 98765 43210"
                joinedDate="July 2023"
                listingsCount={4}
                onCall={() => console.log("Calling Rajesh Kumar")}
                onMessage={() => console.log("Messaging Rajesh Kumar")}
              />
            </div>
          </aside>

        </div>

        {/* Premium visual divider line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border/80 to-transparent my-4" />

        {/* 4. Similar Properties Showcase */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 text-left">
            <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary">
              Explore Alternatives
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight leading-[1.15]">
              Similar Stays
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-md">
              Handpicked similar premium listings around Vijay Nagar.
            </p>
          </div>
          <SimilarProperties properties={MOCK_SIMILAR_PROPERTIES} />
        </div>

      </Container>
    </Section>
  );
}
