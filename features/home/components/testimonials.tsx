"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";

interface TestimonialItem {
  id: string;
  name: string;
  occupation: string;
  rating: number;
  review: string;
  initials: string;
  avatarBg: string;
  location: string;
}

const MOCK_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "t1",
    name: "Aman Sharma",
    occupation: "Student, IIT Indore",
    rating: 5,
    review: "RoofOnClick made finding a PG near Vijay Nagar incredibly simple. The zero brokerage promise was 100% real, and the rooms were exactly as shown in the photos.",
    initials: "AS",
    avatarBg: "bg-primary/10 text-primary border-primary/20",
    location: "Vijay Nagar",
  },
  {
    id: "t2",
    name: "Priya Patel",
    occupation: "Software Engineer, TCS",
    rating: 5,
    review: "The biometric safety locks and the overall hygiene in my co-living space exceeded my expectations. High-speed Wi-Fi handles my hybrid Work-From-Home tasks easily.",
    initials: "PP",
    avatarBg: "bg-secondary/10 text-secondary border-secondary/20",
    location: "Palasia",
  },
  {
    id: "t3",
    name: "Rohan Verma",
    occupation: "Student, IET DAVV",
    rating: 4,
    review: "Excellent response speed from the support desk for any minor repair queries. Very clean mess food menu options and clean common laundry spaces.",
    initials: "RV",
    avatarBg: "bg-accent/10 text-accent border-accent/20",
    location: "Bhawarkuan",
  },
  {
    id: "t4",
    name: "Sneha Reddy",
    occupation: "Professional, Medanta",
    rating: 5,
    review: "Security is my top priority, and the 24/7 security guard layers and warden support give my parents complete peace of mind. Truly feels like a premium hotel stay.",
    initials: "SR",
    avatarBg: "bg-secondary/10 text-secondary border-secondary/20",
    location: "LIG Colony",
  },
  {
    id: "t5",
    name: "Vikram Singh",
    occupation: "Chartered Accountant",
    rating: 5,
    review: "Zero deposit hassle and flexible month-to-month contracts allowed me to move in with no stress. The pricing matches the verified quality perfectly.",
    initials: "VS",
    avatarBg: "bg-accent/10 text-accent border-accent/20",
    location: "Geeta Bhawan",
  },
  {
    id: "t6",
    name: "Anjali Gupta",
    occupation: "Student, SGSITS",
    rating: 5,
    review: "Highly recommend for anyone moving to Indore for coaching or college. Clean, community-focused, and premium accommodations close to important transits.",
    initials: "AG",
    avatarBg: "bg-primary/10 text-primary border-primary/20",
    location: "Vijay Nagar",
  },
];

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

export function Testimonials() {
  return (
    <Section className="bg-muted/5">
      <Container>
        {/* Header Block */}
        <div className="flex flex-col gap-2 mb-12 text-center items-center">
          <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary">
            Real Experiences
          </span>
          <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight leading-[1.15]">
            What Our Residents Say
          </h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-md">
            Trusted by students and working professionals across Indore&apos;s active hubs.
          </p>
        </div>

        {/* Testimonials Grid */}
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
          {MOCK_TESTIMONIALS.map((t) => (
            <motion.div
              key={t.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: PREMIUM_EASE } },
              }}
              whileHover={{ y: -5, scale: 1.015 }}
              transition={{ duration: 0.28, ease: PREMIUM_EASE }}
              className="group flex flex-col gap-5 p-7 rounded-[24px] bg-card/65 backdrop-blur-md border border-border/80 hover:border-border hover:shadow-xl transition-all duration-300 cursor-default relative overflow-hidden"
            >
              {/* Glassmorphism subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-card/[0.03] to-transparent pointer-events-none" />

              {/* Rating stars & Quote */}
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3.5 h-3.5 ${
                        idx < t.rating ? "text-secondary fill-current" : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-secondary/20 shrink-0" />
              </div>

              {/* Review text */}
              <p className="font-body text-sm text-foreground/80 leading-relaxed flex-1 relative z-10">
                &ldquo;{t.review}&rdquo;
              </p>

              {/* Divider */}
              <div className="h-px w-full bg-border/60 relative z-10" />

              {/* Reviewer Meta details */}
              <div className="flex items-center gap-3.5 relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-heading text-xs font-extrabold border shrink-0 ${t.avatarBg}`}
                >
                  {t.initials}
                </div>

                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-heading text-sm font-bold text-primary truncate">
                    {t.name}
                  </span>
                  <span className="font-body text-[11px] text-muted-foreground truncate">
                    {t.occupation}
                  </span>
                  <span className="font-body text-[10px] text-muted-foreground/75 truncate">
                    📍 {t.location}, Indore
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}

export default Testimonials;
