"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Percent, PhoneCall, CalendarCheck, Lock, RefreshCw } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";

const MOCK_ADVANTAGES = [
  {
    id: "verified",
    title: "Verified Properties",
    description: "Every room undergoes complete physical checks on location, size, hygiene, and amenities before going active.",
    icon: ShieldCheck,
    iconBg: "bg-primary/10 border-primary/20",
    accentColor: "text-primary",
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
    id: "support",
    title: "24/7 Resident Support",
    description: "Dedicated stay manager assistance for maintenance queries, utility coordination, or dynamic ticket raising.",
    icon: PhoneCall,
    iconBg: "bg-accent/10 border-accent/20",
    accentColor: "text-accent",
  },
  {
    id: "booking",
    title: "Instant Confirmation",
    description: "Lock room reservations in real-time with instant token deposits. Skip long physical vetting waiting rows.",
    icon: CalendarCheck,
    iconBg: "bg-secondary/10 border-secondary/20",
    accentColor: "text-secondary",
  },
  {
    id: "secure",
    title: "Safe & Biometric",
    description: "Modern entrance safety setups with CCTV surveillance layers, biometric locks, and security warden guards.",
    icon: Lock,
    iconBg: "bg-accent/10 border-accent/20",
    accentColor: "text-accent",
  },
  {
    id: "flexible",
    title: "Flexible Stay Contracts",
    description: "Freedom of occupancy from single semesters to full-year leases with seamless room upgrades.",
    icon: RefreshCw,
    iconBg: "bg-primary/10 border-primary/20",
    accentColor: "text-primary",
  },
];

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

export function Advantages() {
  return (
    <Section className="bg-background">
      <Container>
        {/* Header Block */}
        <div className="flex flex-col gap-2 mb-12 text-center items-center">
          <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary">
            Our Promise
          </span>
          <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight leading-[1.15]">
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
          {MOCK_ADVANTAGES.map((item) => {
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
                className="group flex flex-col gap-5 p-7 rounded-[24px] bg-card border border-border/80 hover:border-border hover:shadow-xl transition-all duration-300 cursor-default"
              >
                {/* Icon Container */}
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-[14px] border ${item.iconBg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className={`w-5 h-5 ${item.accentColor}`} strokeWidth={2.2} />
                </div>

                {/* Info Text */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading text-base font-bold text-primary leading-snug">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom accent indicator line */}
                <div className="mt-auto pt-2">
                  <div
                    className={`h-[2.5px] w-8 rounded-full ${item.accentColor.replace("text-", "bg-")} opacity-40 group-hover:w-16 group-hover:opacity-90 transition-all duration-500`}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </Section>
  );
}

export default Advantages;
