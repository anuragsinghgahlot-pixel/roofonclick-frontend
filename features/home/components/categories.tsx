"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";

const MOCK_CATEGORIES = [
  {
    id: "boys-pg",
    name: "Boys PG",
    description: "Premium boys hostel and PG rooms with full food services and power backup.",
    badge: "Student Fav",
    propertyCount: 78,
    gradient: "from-primary/60 to-primary",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "girls-pg",
    name: "Girls PG",
    description: "Highly secure and safe girls stays with strict biometric entry and 24/7 warden support.",
    badge: "Safe & Secure",
    propertyCount: 92,
    gradient: "from-secondary/60 to-primary",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "co-living",
    name: "Co-Living",
    description: "Modern shared apartments for working professionals near commercial zones.",
    badge: "Flexible Stay",
    propertyCount: 45,
    gradient: "from-accent/60 to-primary",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "studio-apartment",
    name: "Studio Apartment",
    description: "Independently managed single-occupancy rooms with private pantries.",
    badge: "Independent",
    propertyCount: 30,
    gradient: "from-secondary/60 to-primary",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "1-rk",
    name: "1 RK",
    description: "Economical compact studio spaces, perfect for single occupancy or double sharing.",
    badge: "Budget Choice",
    propertyCount: 56,
    gradient: "from-accent/60 to-primary",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "hostel",
    name: "Hostel",
    description: "Budget-friendly shared dorms with active community zones, gaming, and dining halls.",
    badge: "Active Community",
    propertyCount: 88,
    gradient: "from-primary/60 to-primary",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80",
  },
];

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

export function Categories() {
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

        {/* Mobile: horizontal scroll; sm+: 2-col; lg+: 3-col grid */}
        {/* Mobile scroll strip */}
        <div className="flex sm:hidden gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
          {MOCK_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="group relative overflow-hidden rounded-[20px] cursor-pointer shrink-0 w-[72vw] max-w-[280px] h-64 shadow-md snap-start"
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={category.image}
                  alt={`${category.name} accommodation`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} to-primary/10`} />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-secondary text-primary shadow-sm">
                  {category.badge}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold bg-card/80 backdrop-blur-sm text-foreground border border-border/30">
                  {category.propertyCount}+ stays
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-1">
                <h3 className="font-heading text-lg font-extrabold text-secondary leading-snug">{category.name}</h3>
                <p className="font-body text-xs text-background/85 leading-relaxed line-clamp-2">{category.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* sm+: regular grid */}
        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        >
          {MOCK_CATEGORIES.map((category) => (
            <motion.div
              key={category.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: PREMIUM_EASE } },
              }}
              whileHover={{ y: -6, scale: 1.015 }}
              transition={{ duration: 0.3, ease: PREMIUM_EASE }}
              className="group relative overflow-hidden rounded-[24px] cursor-pointer h-72 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={category.image}
                  alt={`${category.name} accommodation`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} to-primary/10`} />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-secondary text-primary shadow-sm">
                  {category.badge}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-card/80 backdrop-blur-sm text-foreground border border-border/30">
                  {category.propertyCount}+ stays
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-1.5 z-10">
                <h3 className="font-heading text-xl font-extrabold text-secondary leading-snug">{category.name}</h3>
                <p className="font-body text-xs text-background/85 leading-relaxed line-clamp-2">{category.description}</p>
                <div className="flex items-center gap-1.5 mt-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span className="font-heading text-xs font-bold text-secondary uppercase tracking-widest">Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 text-secondary" />
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
