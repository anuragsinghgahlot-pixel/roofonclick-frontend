"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Percent, Lock, RefreshCw, UserCheck, DollarSign } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";

const ADVANTAGES_DATA = [
  {
    id: "verified",
    title: "Verified Properties",
    description: "Every room undergoes complete physical checks on location, hygiene, and amenities before going active.",
    icon: ShieldCheck,
    iconBg: "bg-primary/10 border-primary/20",
    accentColor: "text-primary",
  },
  {
    id: "security",
    title: "Safe & Biometric Security",
    description: "Modern entrance safety setups with CCTV surveillance layers, biometric locks, and security guards.",
    icon: Lock,
    iconBg: "bg-secondary/10 border-secondary/20",
    accentColor: "text-secondary",
  },
  {
    id: "contracts",
    title: "Flexible Stay Contracts",
    description: "Freedom of occupancy from single semesters to full-year leases with seamless room upgrades.",
    icon: RefreshCw,
    iconBg: "bg-accent/10 border-accent/20",
    accentColor: "text-accent",
  },
  {
    id: "brokerage",
    title: "Zero Brokerage",
    description: "Rent directly with zero commission overhead. We never impose additional middleman booking costs.",
    icon: Percent,
    iconBg: "bg-secondary/10 border-secondary/20",
    accentColor: "text-secondary",
  },
  {
    id: "owners",
    title: "Trusted Owners",
    description: "Direct communication with vetted property owners for transparent agreements and fast assistance.",
    icon: UserCheck,
    iconBg: "bg-primary/10 border-primary/20",
    accentColor: "text-primary",
  },
  {
    id: "pricing",
    title: "Transparent Pricing",
    description: "Clear breakdown of rent, security deposit, and utilities with zero hidden charges or extra fees.",
    icon: DollarSign,
    iconBg: "bg-accent/10 border-accent/20",
    accentColor: "text-accent",
  },
];

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

export function Advantages() {
  return (
    <Section className="bg-background">
      <Container>
        <div className="flex flex-col gap-2 mb-8 sm:mb-12 text-center items-center">
          <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary">
            Our Promise
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary tracking-tight leading-[1.15]">
            Why Choose RoofOnClick?
          </h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-md">
            Everything you need to find and lease your premium home away from home in Indore.
          </p>
        </div>

        {/* Grid feature list */}
        <motion.div
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        >
          {ADVANTAGES_DATA.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: PREMIUM_EASE } },
                }}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.28, ease: PREMIUM_EASE }}
                className="group relative flex flex-col items-start p-6 rounded-[24px] bg-card/90 border border-border/80 shadow-md hover:shadow-xl transition-all duration-300 text-left"
              >
                <div className={`w-12 h-12 rounded-2xl ${item.iconBg} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${item.accentColor}`} />
                </div>
                <h3 className="font-heading text-base font-extrabold text-primary mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </Section>
  );
}

export default Advantages;
