"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ShieldCheck, MapPin, Star, Heart, Share2, Scale, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/providers/wishlist-provider";
import { useCompare } from "@/providers/compare-provider";
import { motion } from "framer-motion";

import {
  calculatePropertyAvailability,
  calculateRoomAvailability,
} from "@/lib/availability-utils";
import { shareProperty } from "@/lib/share-utils";
import { ShareModal } from "@/components/shared/share-modal";
import { RoomConfiguration } from "@/services/property";

import { useAuth } from "@/providers/auth-provider";

export interface PropertyItem {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  verified: boolean;
  image: string;
  type: string;
  amenities: string[];
  rooms?: RoomConfiguration[];
  availableRooms?: number;
  totalRooms?: number;
}

interface PropertyCardProps {
  property: PropertyItem;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, role } = useAuth();
  const isOwner = user !== null && (user.role === "owner" || role === "owner");
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();
  const isWishlisted = isInWishlist(property.id);
  const isCompared = isInCompare(property.id);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  const availability = property.rooms && property.rooms.length > 0
    ? calculatePropertyAvailability(property.rooms)
    : calculateRoomAvailability(property.availableRooms ?? 3, property.totalRooms ?? 5);

  const handleCardClick = () => {
    const search = searchParams?.toString();
    const currentRoute = `${pathname}${search ? `?${search}` : ""}`;
    router.push(`/property/${property.id}?sourceRoute=${encodeURIComponent(currentRoute)}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-card border border-border/80 rounded-2xl overflow-hidden shadow-premium hover:shadow-2xl hover:scale-[1.015] hover:-translate-y-0.5 transition-all duration-250 flex flex-col cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted flex items-center justify-center">
        {property.image ? (
          <img
            src={property.image}
            alt={property.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted via-muted/80 to-muted/50 flex flex-col items-center justify-center gap-1.5 text-muted-foreground p-4 text-center">
            <Building className="w-8 h-8 stroke-1 text-primary/40" />
            <span className="font-heading text-[11px] font-bold text-foreground/70">{property.name}</span>
          </div>
        )}
        
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

        {/* Action Overlay: Compare + Share + Wishlist */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-20">
          <button
            type="button"
            data-no-intercept="true"
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(property.id);
            }}
            className={cn(
              "w-9 h-9 rounded-full backdrop-blur-md border border-border/40 shadow-premium flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer",
              isCompared
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card/90 text-muted-foreground hover:text-primary"
            )}
            title={isCompared ? "Remove from Compare" : "Add to Compare"}
          >
            <Scale className="w-4 h-4" />
          </button>

          <button
            type="button"
            data-no-intercept="true"
            onClick={async (e) => {
              e.stopPropagation();
              const url = typeof window !== "undefined" ? `${window.location.origin}/property/${property.id}` : "";
              const shared = await shareProperty({
                title: property.name,
                text: `Check out ${property.name} on RoofOnClick!`,
                url,
              });
              if (!shared) {
                setIsShareModalOpen(true);
              }
            }}
            className="w-9 h-9 rounded-full bg-card/90 backdrop-blur-md border border-border/40 shadow-premium flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer text-muted-foreground hover:text-primary"
            title="Share property"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {!isOwner && (
            <button
              type="button"
              data-no-intercept="true"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(property.id);
              }}
              className="w-9 h-9 rounded-full bg-card/90 backdrop-blur-md border border-border/40 shadow-premium flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer"
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <motion.div
                animate={{ scale: isWishlisted ? [1, 1.25, 1] : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Heart
                  className={cn(
                    "w-4.5 h-4.5 transition-colors duration-200",
                    isWishlisted ? "fill-rose-500 text-rose-500" : "text-muted-foreground/80 hover:text-rose-500"
                  )}
                />
              </motion.div>
            </button>
          )}
        </div>
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

          {/* Amenities Tags (Single horizontal row with seamless infinite auto-scrolling loop) */}
          <div className="overflow-hidden w-full mb-4 select-none group/marquee relative py-0.5">
            <div className="flex items-center gap-1.5 animate-marquee-slow group-hover/marquee:[animation-play-state:paused]">
              {[...property.amenities, ...property.amenities].map((amenity, idx) => (
                <span
                  key={`${amenity}-${idx}`}
                  className="text-[10px] font-semibold text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="border-t border-border/60 pt-4 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className={cn("w-2 h-2 rounded-full animate-pulse", availability.dotColor)} />
              <span className={cn("text-[10px] font-extrabold uppercase tracking-wider", availability.textColor)}>
                {availability.label}
              </span>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block leading-none">
              Starting from
            </span>
            <span className="font-heading text-lg font-extrabold text-primary">
              ₹{property.price.toLocaleString()}
              <span className="text-xs font-semibold text-muted-foreground font-body">/mo</span>
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground text-xs font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer shadow-md shadow-primary/10"
          >
            View Details
          </button>
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareData={{
          title: property.name,
          text: `Find verified rooms and PG accommodation at ${property.name}`,
          url: typeof window !== "undefined" ? `${window.location.origin}/property/${property.id}` : "",
        }}
      />
    </div>
  );
}
export default PropertyCard;
