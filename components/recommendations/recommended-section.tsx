"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Compass } from "lucide-react";
import { RecommendationItem, RecommendationService } from "@/services/recommendations";
import { PropertyCard } from "@/components/cards/property-card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/shared/section";
import { EmptyState } from "@/components/shared/empty-state";
import { useAuth } from "@/providers/auth-provider";
import { useCity } from "@/providers/city-provider";

interface RecommendedSectionProps {
  location?: string;
  propertyType?: string;
  city?: string;
}

export function RecommendedSection({ location, propertyType, city }: RecommendedSectionProps) {
  const { user, role } = useAuth();
  const { selectedCity } = useCity();
  const activeCity = city || selectedCity.name;
  const isOwner = user !== null && (user.role === "owner" || role === "owner");
  const [recommendations, setRecommendations] = React.useState<RecommendationItem[]>([]);

  React.useEffect(() => {
    let isMounted = true;
    RecommendationService.getRecommendationsForLocation(location, propertyType, activeCity).then((items) => {
      if (isMounted) setRecommendations(items);
    });
    return () => {
      isMounted = false;
    };
  }, [location, propertyType, activeCity]);

  // Owners MUST NEVER see "Recommended For You"
  if (isOwner) return null;

  return (
    <Section className="bg-background relative text-left py-16 border-t border-border/60">
      <Container className="space-y-8">
        <div className="flex flex-col gap-1.5 text-left">
          <span className="font-heading text-xs font-extrabold uppercase tracking-widest text-secondary flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Contextual Recommendations
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
            Recommended For You
          </h2>
          <p className="font-body text-xs md:text-sm text-muted-foreground max-w-2xl">
            Properties similar to your search.
          </p>
        </div>

        {recommendations.filter(item => Boolean(item?.property)).length === 0 ? (
          <EmptyState
            icon={Compass}
            title="No similar properties found."
            description="Try expanding your location or budget filters to explore more verified stays."
            primaryAction={{
              label: "Explore All Properties",
              href: "/search",
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {recommendations
                .filter((item) => Boolean(item && item.property))
                .map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group flex flex-col"
                >
                  {/* Explanation Tag Above Card */}
                  <div className="mb-2 flex items-center justify-between gap-2 px-1">
                    <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-heading font-extrabold px-2.5 py-0.5 rounded-full truncate">
                      ✨ {item.badgeLabel}
                    </span>
                    <span className="text-[10px] font-body text-muted-foreground truncate">
                      {item.reason}
                    </span>
                  </div>

                  <PropertyCard
                    property={{
                      id: item.property.id,
                      name: item.property.propertyName || (item.property as any).name || "StayyNest Property",
                      location: item.property.area || item.property.city || (item.property as any).location || "Indore",
                      price: item.property.startingRent || (item.property as any).price || 5000,
                      rating: (item.property as any).rating || 4.5,
                      verified: (item.property as any).verified ?? true,
                      image: item.property.coverPhoto || item.property.images?.[0]?.url || (item.property as any).image || "",
                      type: item.property.propertyType || (item.property as any).type || "PG",
                      amenities: item.property.amenities || [],
                      rooms: item.property.rooms || [],
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </Container>
    </Section>
  );
}
