"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Zap } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

export function PartnerCTA() {
  return (
    <Section className="relative overflow-hidden bg-background">
      {/* Ambient background glows */}
      <div className="absolute top-[20%] right-[-100px] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] left-[-100px] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: PREMIUM_EASE }}
          className="relative overflow-hidden w-full rounded-[24px] sm:rounded-[32px] bg-primary text-primary-foreground px-5 sm:px-8 py-12 sm:py-16 md:py-20 text-center shadow-xl border border-primary/20"
        >
          {/* Inner glass overlay details */}
          <div className="absolute inset-0 bg-gradient-to-br from-background/[0.03] to-transparent pointer-events-none" />
          <div className="absolute inset-0 rounded-[32px] border border-background/[0.06] pointer-events-none" />

          {/* Accent Badge */}
          <div className="relative z-10 flex justify-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-background/10 text-secondary border border-background/10 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-secondary animate-pulse" />
              Instant Reservation Confirmation
            </span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="relative z-10 flex flex-col items-center gap-4 max-w-2xl mx-auto mb-10">
            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold text-background tracking-tight leading-[1.15]">
              Ready to Find Your{" "}
              <span className="text-secondary bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent">Perfect Stay?</span>
            </h2>
            <p className="font-body text-sm sm:text-base text-background/80 leading-relaxed max-w-lg">
              Discover verified PGs, hostels, co-living spaces, and apartments with zero brokerage hassle. Lock your room onboarding today!
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            {/* Get Started / Explore */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-4 rounded-xl font-heading text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer shadow-md"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            {/* List Property */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-background/20 bg-background/5 hover:bg-background hover:text-primary text-background px-8 py-4 rounded-xl font-heading text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer shadow-sm"
            >
              List Your Property
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}

export default PartnerCTA;
