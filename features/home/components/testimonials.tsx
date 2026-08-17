"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
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

import { cn } from "@/lib/utils";

function TestimonialCard({ t }: { t: TestimonialItem }) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="flex flex-col gap-3.5 p-4 sm:p-5 rounded-2xl bg-card/65 backdrop-blur-md border border-border/80 hover:border-border hover:shadow-lg transition-all duration-300 cursor-default relative overflow-hidden h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-card/[0.03] to-transparent pointer-events-none" />
      {/* Rating & Quote */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              className={`w-3.5 h-3.5 ${idx < t.rating ? "text-secondary fill-current" : "text-muted-foreground/30"}`}
            />
          ))}
        </div>
        <Quote className="w-5 h-5 text-secondary/20 shrink-0" />
      </div>
      {/* Review */}
      <div className="flex flex-col gap-1 relative z-10 flex-1">
        <p className={cn("font-body text-xs text-foreground/80 leading-relaxed", !isExpanded && "line-clamp-3")}>
          &ldquo;{t.review}&rdquo;
        </p>
        {t.review.length > 90 && (
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => setIsExpanded((prev) => !prev)}
            className="font-heading text-[11px] font-extrabold text-primary hover:text-secondary transition-colors cursor-pointer text-left self-start"
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        )}
      </div>
      {/* Divider */}
      <div className="h-px w-full bg-border/60 relative z-10 mt-auto" />
      {/* Reviewer */}
      <div className="flex items-center gap-3 relative z-10">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-heading text-[11px] font-extrabold border shrink-0 ${t.avatarBg}`}>
          {t.initials}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-heading text-xs font-bold text-primary truncate">{t.name}</span>
          <span className="font-body text-[10px] text-muted-foreground truncate">{t.occupation} • 📍 {t.location}</span>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const total = MOCK_TESTIMONIALS.length;

  const prev = () => setActiveIndex((i) => (i - 1 + total) % total);
  const next = () => setActiveIndex((i) => (i + 1) % total);

  return (
    <Section className="bg-muted/5">
      <Container>
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8 sm:mb-12 text-center items-center">
          <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary">
            Real Experiences
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary tracking-tight leading-[1.15]">
            What Our Residents Say
          </h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-md">
            Trusted by students and working professionals across Indore&apos;s active hubs.
          </p>
        </div>

        {/* Mobile: single-card carousel */}
        <div className="sm:hidden relative">
          <div className="overflow-hidden rounded-[24px]">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: PREMIUM_EASE }}
            >
              <TestimonialCard t={MOCK_TESTIMONIALS[activeIndex]} />
            </motion.div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-5">
            <button
              type="button"
              suppressHydrationWarning
              onClick={prev}
              aria-label="Previous review"
              className="w-11 h-11 rounded-full border border-border/80 bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200 active:scale-90 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {MOCK_TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to review ${idx + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    idx === activeIndex ? "w-5 h-2 bg-primary" : "w-2 h-2 bg-border hover:bg-primary/40"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              suppressHydrationWarning
              onClick={next}
              aria-label="Next review"
              className="w-11 h-11 rounded-full border border-border/80 bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200 active:scale-90 shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* sm+: Grid layout */}
        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
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
            >
              <TestimonialCard t={t} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}

export default Testimonials;
