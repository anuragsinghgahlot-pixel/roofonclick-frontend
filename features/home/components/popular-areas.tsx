"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";

const POPULAR_AREAS_DATA = [
  {
    id: "vijay-nagar",
    name: "Vijay Nagar",
    tagline: "Indore IT & Commercial Hub",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "bhawarkuan",
    name: "Bhawarkuan",
    tagline: "Student & Coaching Center",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "palasia",
    name: "Palasia",
    tagline: "Central & Premium Stays",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "lig-colony",
    name: "LIG Colony",
    tagline: "Connected Residential Area",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80",
  },
];

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

export function PopularAreas() {
  const router = useRouter();

  const handleAreaClick = (areaName: string) => {
    router.push(`/search?area=${encodeURIComponent(areaName)}`);
  };

  return (
    <Section className="bg-background">
      <Container>
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8 sm:mb-12 text-left">
          <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary">
            Explore Indore
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary tracking-tight leading-[1.15]">
            Popular Areas
          </h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-md">
            Find verified stays positioned near top coaching institutes, universities, and IT hubs.
          </p>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="flex sm:hidden gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
          {POPULAR_AREAS_DATA.map((area) => (
            <div
              key={area.id}
              onClick={() => handleAreaClick(area.name)}
              className="group relative overflow-hidden rounded-[20px] cursor-pointer shrink-0 w-[60vw] max-w-[240px] aspect-[3/4] shadow-md snap-start"
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={area.image}
                  alt={`${area.name} area in Indore`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent pointer-events-none" />
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold bg-card/85 backdrop-blur-sm text-foreground border border-border/30">
                  Verified Stays
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-1 z-10">
                <h3 className="font-heading text-base font-extrabold text-secondary leading-snug">{area.name}</h3>
                <p className="text-[10px] text-primary-foreground/90">{area.tagline}</p>
              </div>
            </div>
          ))}
        </div>

        {/* sm+: grid */}
        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
        >
          {POPULAR_AREAS_DATA.map((area) => (
            <motion.div
              key={area.id}
              onClick={() => handleAreaClick(area.name)}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: PREMIUM_EASE } },
              }}
              whileHover={{ y: -6, scale: 1.015 }}
              transition={{ duration: 0.3, ease: PREMIUM_EASE }}
              className="group relative overflow-hidden rounded-[24px] cursor-pointer aspect-[3/4] shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={area.image}
                  alt={`${area.name} area in Indore`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent pointer-events-none" />
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-card/85 backdrop-blur-sm text-foreground border border-border/30 shadow-xs">
                  Verified Stays
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-1 z-10 text-left">
                <h3 className="font-heading text-xl font-extrabold text-secondary tracking-tight group-hover:text-primary-foreground transition-colors">
                  {area.name}
                </h3>
                <span className="text-[11px] font-semibold text-secondary-foreground/80">{area.tagline}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}

export default PopularAreas;
