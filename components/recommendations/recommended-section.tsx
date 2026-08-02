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

interface RecommendedSectionProps {
  location?: string;
  propertyType?: string;
}

export function RecommendedSection({ location, propertyType }: RecommendedSectionProps) {
  const { user, role } = useAuth();
  const isOwner = user !== null && (user.role === "owner" || role === "owner");
  const [recommendations, setRecommendations] = React.useState<RecommendationItem[]>([]);

  React.useEffect(() => {
    setRecommendations(RecommendationService.getRecommendationsForLocation(location, propertyType));
  }, [location, propertyType]);

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

        {recommendations.length === 0 ? (
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
              {recommendations.map((item) => (
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
