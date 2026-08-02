"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Eye, Trash2, ArrowRight } from "lucide-react";
import { RecentlyViewedItem, RecentlyViewedService } from "@/services/recently-viewed";
import { PropertyCard } from "@/components/cards/property-card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/shared/section";
import { showToast } from "@/lib/toast";

import { EmptyState } from "@/components/shared/empty-state";
import { useAuth } from "@/providers/auth-provider";

interface RecentlyViewedSectionProps {
  currentPropertyId?: string;
  title?: string;
  subtitle?: string;
  showEmptyState?: boolean;
}

export function RecentlyViewedSection({
  currentPropertyId,
  title = "Recently Viewed Stays",
  subtitle = "Quickly pick up where you left off in your search history.",
  showEmptyState = false,
}: RecentlyViewedSectionProps) {
  const { user, role } = useAuth();
  const isOwner = user !== null && (user.role === "owner" || role === "owner");
  const [items, setItems] = React.useState<RecentlyViewedItem[]>([]);

  const refreshList = React.useCallback(() => {
    const history = RecentlyViewedService.getRecentlyViewed();
    // Exclude current property if rendered on property detail page
    const filtered = currentPropertyId
      ? history.filter((item) => item.id !== currentPropertyId)
      : history;
    setItems(filtered);
  }, [currentPropertyId]);

  React.useEffect(() => {
    refreshList();
  }, [refreshList]);

  // Owners MUST NEVER see Recently Viewed
  if (isOwner) return null;

  if (items.length === 0) {
    if (showEmptyState) {
      return (
        <Section className="bg-background relative text-left py-6">
          <Container className="space-y-6">
            <EmptyState
              icon={Clock}
              title="No recently viewed properties"
              description="Explore verified PGs, Hostels, and Co-living stays in Indore to build your viewing history."
              primaryAction={{
                label: "Explore Properties",
                href: "/search",
              }}
            />
          </Container>
        </Section>
      );
    }
    return null;
  }

  return (
    <Section className="bg-background relative text-left py-12 border-t border-border/60">
      <Container className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-heading text-xs font-extrabold uppercase tracking-widest text-secondary flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Search History
            </span>
            <h3 className="font-heading text-xl md:text-2xl font-extrabold text-primary tracking-tight">
              {title}
            </h3>
            <p className="font-body text-xs text-muted-foreground">{subtitle}</p>
          </div>

          <button
            type="button"
            data-no-intercept="true"
            onClick={() => {
              RecentlyViewedService.clearRecentlyViewed();
              showToast.info("History Cleared", "Recently viewed properties cleared.");
              refreshList();
            }}
            className="text-xs font-heading font-bold text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
          >
            Clear History
          </button>
        </div>

        {/* Responsive Grid / Horizontal Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
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

                {/* Remove Quick Action */}
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    RecentlyViewedService.removeRecentlyViewed(item.id);
                    showToast.info("Removed from History", "Property removed from recently viewed.");
                    refreshList();
                  }}
                  className="absolute top-3 left-3 p-1.5 rounded-full bg-black/60 hover:bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity z-30 cursor-pointer shadow-md"
                  title="Remove from recently viewed"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Container>
    </Section>
  );
}
