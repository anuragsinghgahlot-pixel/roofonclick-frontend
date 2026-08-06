"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Building, Home, Shield, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";

const CATEGORIES_DATA = [
  {
    id: "hostel",
    name: "Hostels",
    description: "Budget-friendly shared dorms with active community zones, gaming, and 3-time mess facilities.",
    badge: "Active Community",
    propertyCount: 88,
    typeQuery: "Hostel",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "pg",
    name: "PGs",
    description: "Premium boys and girls PGs with full security, power backup, daily cleaning, and biometric entry.",
    badge: "Most Popular",
    propertyCount: 142,
    typeQuery: "PG",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "studio-rk",
    name: "Studio & RK Units",
    description: "Independent 1 RK & studio units with attached kitchenette for professionals & couples.",
    badge: "Independent Stay",
    propertyCount: 56,
    typeQuery: "Studio Apartment",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "bhks",
    name: "1 BHK, 2 BHK & 3 BHK",
    description: "Spacious 1 BHK, 2 BHK, and 3 BHK rental flats for families and group stays near IT hubs.",
    badge: "Full Apartment",
    propertyCount: 64,
    typeQuery: "1 BHK",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80",
  },
];

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

export function Categories() {
  const router = useRouter();

  const handleCategoryClick = (typeQuery: string) => {
    router.push(`/search?type=${encodeURIComponent(typeQuery)}`);
  };

  return (
    <Section className="bg-background">
      <Container>
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8 sm:mb-12 text-center items-center">
          <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary">
            Explore Options
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary tracking-tight leading-[1.15]">
            Browse by Category
          </h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-md">
            Find the perfect accommodation match aligned with your lifestyle and budget.
          </p>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
        >
          {CATEGORIES_DATA.map((cat) => (
            <motion.div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.typeQuery)}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: PREMIUM_EASE } },
              }}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3, ease: PREMIUM_EASE }}
              className="group relative overflow-hidden rounded-[24px] cursor-pointer aspect-[4/5] shadow-md hover:shadow-xl transition-all duration-300 border border-border/60"
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={cat.image}
                  alt={`${cat.name} accommodation category`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-card/90 backdrop-blur-md text-primary border border-border/40 shadow-xs">
                  <Sparkles className="w-3 h-3 text-secondary" />
                  {cat.badge}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-1.5 text-left z-10">
                <h3 className="font-heading text-xl font-extrabold text-white tracking-tight">
                  {cat.name}
                </h3>
                <p className="font-body text-xs text-white/80 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/15">
                  <span className="text-[11px] font-extrabold text-secondary">
                    {cat.propertyCount}+ Verified Options
                  </span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}

export default Categories;
