"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface NearbyPlace {
  /** Name of the place (e.g., "IET DAVV") */
  name: string;
  /** Category/type of the place (e.g., "University", "Metro Station") */
  type: string;
  /** Distance in km or mins (e.g., "1.2 km", "10 mins walk") */
  distance: string;
  /** Lucide icon component to represent the category */
  icon: React.ElementType;
}

export interface LocationMapProps {
  /** Property address string */
  address: string;
  /** Latitude coordinate */
  latitude: number;
  /** Longitude coordinate */
  longitude: number;
  /** List of nearby points of interest */
  nearbyPlaces: NearbyPlace[];
  /** Optional class override for root container */
  className?: string;
}

// ─── Animation Variants ────────────────────────────────────────────────────────

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: PREMIUM_EASE },
  },
};

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: PREMIUM_EASE },
  },
};

// ─── LocationMap Component ─────────────────────────────────────────────────────

export function LocationMap({
  address,
  latitude,
  longitude,
  nearbyPlaces,
  className,
}: LocationMapProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={cn("flex flex-col gap-6", className)}
    >
      {/* ── Section Header ── */}
      <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
        <h3 className="font-heading text-xl font-extrabold text-primary">
          Location & Neighborhood
        </h3>
        <p className="font-body text-sm text-muted-foreground">
          Find out what is around your new home.
        </p>
      </motion.div>

      {/* ── Main Layout: Map + Nearby POIs ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Column: Map Placeholder & Address Info (Spans 3 cols on desktop) */}
        <motion.div variants={itemVariants} className="lg:col-span-3 flex flex-col gap-4">
          
          {/* Map Preview Container */}
          <div className="relative aspect-[16/9] w-full rounded-2xl bg-card border border-border/80 overflow-hidden shadow-sm group">
            {/* Grid Pattern Overlay */}
            <div
              className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(0,0,0,0.8) 1.5px, transparent 1.5px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Stylized vector map representation */}
            <svg
              className="absolute inset-0 w-full h-full text-border/40 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Street lines */}
              <line x1="10%" y1="0%" x2="10%" y2="100%" stroke="currentColor" strokeWidth="2" />
              <line x1="45%" y1="0%" x2="45%" y2="100%" stroke="currentColor" strokeWidth="4" />
              <line x1="85%" y1="0%" x2="85%" y2="100%" stroke="currentColor" strokeWidth="2" />
              <line x1="0%" y1="30%" x2="100%" y2="30%" stroke="currentColor" strokeWidth="2" />
              <line x1="0%" y1="65%" x2="100%" y2="65%" stroke="currentColor" strokeWidth="4" strokeDasharray="6 4" />
              <line x1="0%" y1="80%" x2="100%" y2="80%" stroke="currentColor" strokeWidth="1" />
              
              {/* Subtle local parks / spaces */}
              <rect x="15%" y="10%" width="20%" height="15%" fill="currentColor" opacity="0.08" rx="8" />
              <rect x="55%" y="40%" width="25%" height="20%" fill="currentColor" opacity="0.08" rx="8" />
            </svg>

            {/* Central Pulsing Target / Marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              {/* Pulsing ring */}
              <div className="absolute w-12 h-12 rounded-full bg-primary/20 animate-ping pointer-events-none" />
              {/* Solid Marker container */}
              <div className="relative w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg border-2 border-white z-10">
                <MapPin className="w-4 h-4" />
              </div>
            </div>

            {/* Coordinates & Overlay Label */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </div>
              <div className="bg-primary/95 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest text-primary-foreground shadow-sm">
                Interactive Maps Coming Soon
              </div>
            </div>
          </div>

          {/* Address Display Box */}
          <div className="flex items-start gap-3 p-4 rounded-xl border border-border/80 bg-card">
            <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0 mt-0.5">
              <Navigation className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Full Address
              </span>
              <p className="font-body text-sm text-foreground leading-relaxed">
                {address}
              </p>
            </div>
          </div>

        </motion.div>

        {/* Right Column: Neighborhood POIs (Spans 2 cols on desktop) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col gap-3">
          <span className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">
            Nearby Places
          </span>

          <motion.div
            variants={listVariants}
            className="flex flex-col gap-2 overflow-y-auto max-h-[340px] pr-1 scrollbar-thin"
          >
            {nearbyPlaces.map((place, idx) => {
              const PlaceIcon = place.icon;
              return (
                <motion.div
                  key={`${place.name}-${idx}`}
                  variants={cardVariants}
                  whileHover={{ x: 4, scale: 1.01 }}
                  transition={{ duration: 0.2, ease: PREMIUM_EASE }}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-card hover:border-primary/30 transition-colors duration-200 cursor-default"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Icon container */}
                    <div className="w-9 h-9 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                      <PlaceIcon className="w-4 h-4" />
                    </div>
                    {/* Place Name and category */}
                    <div className="flex flex-col min-w-0">
                      <span className="font-heading text-sm font-bold text-foreground truncate">
                        {place.name}
                      </span>
                      <span className="font-body text-[10px] text-muted-foreground">
                        {place.type}
                      </span>
                    </div>
                  </div>

                  {/* Distance info */}
                  <span className="font-heading text-xs font-bold text-primary shrink-0 bg-primary/5 border border-primary/10 px-2.5 py-1 rounded-full">
                    {place.distance}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

      </div>
    </motion.div>
  );
}

export default LocationMap;
