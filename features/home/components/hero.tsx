"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search as SearchIcon, Compass, Star, BadgeCheck, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";

const SEARCH_SUGGESTIONS = [
  {
    label: "Vijay Nagar",
    category: "Popular Area",
    description: "126 verified PGs available",
    badge: "Popular"
  },
  {
    label: "Palasia",
    category: "Popular Area",
    description: "84 premium stays nearby",
    badge: "Trending"
  },
  {
    label: "Bhawarkuan",
    category: "Student Area",
    description: "Near DAVV & SGSITS",
    badge: "Students"
  },
  {
    label: "IET DAVV",
    category: "College",
    description: "54 hostels nearby",
    badge: "College"
  },
  {
    label: "Medanta Hospital",
    category: "Hospital",
    description: "Premium PGs nearby",
    badge: "Medical"
  },
  {
    label: "C21 Mall",
    category: "Landmark",
    description: "Luxury stays nearby",
    badge: "Lifestyle"
  }
];

export function Hero() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  const navigateToSearch = React.useCallback((location?: string) => {
    if (!location || !location.trim()) {
      router.push("/search");
    } else {
      const slug = location
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
      router.push(`/search?location=${slug}`);
    }
  }, [router]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  const filteredSuggestions = React.useMemo(() => {
    if (!searchQuery.trim()) return SEARCH_SUGGESTIONS;
    const lowerQuery = searchQuery.toLowerCase();
    return SEARCH_SUGGESTIONS.filter(
      (item) =>
        item.label.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <Section className="relative pt-[120px] pb-24 bg-background overflow-visible">
      {/* Decorative background wrapper to crop glowing background shapes/grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20">
        {/* Premium backdrop abstract glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse duration-10000" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-secondary/8 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-[40%] left-[45%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[90px] pointer-events-none -z-10" />

        {/* Grid Pattern overlay for tech/premium texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] pointer-events-none -z-15" />
      </div>

      <Container className="max-w-[1280px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* Content Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Tagline Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 shadow-md mb-6 hover:bg-primary/15 transition-all duration-300 select-none"
            >
              <Compass className="w-3.5 h-3.5 text-secondary animate-spin-slow" />
              Verified Student & Professional Housing Network
            </motion.div>

            {/* Typography Header */}
            <motion.h1
              variants={itemVariants}
              className="font-heading text-4xl sm:text-5xl lg:text-6.5xl font-extrabold text-primary tracking-tight leading-[1.08] mb-6 drop-shadow-sm"
            >
              <span className="block">
                Find Your Perfect
              </span>

              <span className="relative inline-block mt-4 leading-[1.3] text-transparent bg-clip-text bg-gradient-to-r from-secondary to-secondary/80 relative">
                <span>Roof on</span>
                <span className="ml-3">click</span>
                <span className="absolute bottom-2 left-0 w-full h-[4px] bg-secondary/20 rounded-full" />
              </span>
            </motion.h1>

            {/* Description Paragraph */}
            <motion.p
              variants={itemVariants}
              className="font-body text-base sm:text-lg text-muted-foreground/90 leading-relaxed mb-10 max-w-xl"
            >
              Discover handpicked student hostels, luxury PGs, and premium co-living suites across Indore. Verified locations, transparent leases, and zero brokerage hassle.
            </motion.p>

            {/* Search Box Form */}
            <motion.div
              animate={{ marginBottom: isSearchOpen ? 336 : 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl"
            >
              <motion.div
                ref={searchRef}
                variants={itemVariants}
                className="w-full flex flex-col sm:flex-row gap-3 p-3 bg-card/75 backdrop-blur-xl border border-border/80 rounded-[28px] shadow-premium hover:shadow-2xl transition-all duration-300 hover:border-primary/20 group/search relative"
              >
                <div className="flex-1 flex items-center px-4 gap-3 border-b sm:border-b-0 sm:border-r border-border/60 pb-3.5 sm:pb-0 transition-colors group-hover/search:border-primary/25">
                  <MapPin className="text-secondary w-5 h-5 shrink-0 transition-transform duration-300 group-hover/search:scale-110" strokeWidth={2.5} />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsSearchOpen(true)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setIsSearchOpen(false);
                        e.currentTarget.blur();
                      }
                    }}
                    className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none p-0 w-full text-sm font-semibold font-body text-foreground placeholder:text-muted-foreground/50"
                    placeholder="Where in Indore? (e.g. Vijay Nagar)"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => navigateToSearch(searchQuery)}
                  className="bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground px-8 py-4 rounded-[18px] font-heading text-sm font-bold tracking-wide flex items-center justify-center gap-2 hover:scale-102 active:scale-98 transition-all duration-300 cursor-pointer shadow-md shadow-primary/10 hover:shadow-accent/20"
                >
                  <SearchIcon className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                  Explore Stays
                </button>

                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 right-0 top-full mt-2 z-[100] bg-card border border-border rounded-2xl shadow-premium backdrop-blur-xl max-h-[320px] overflow-y-auto p-2 flex flex-col gap-1 text-left"
                    >
                      {filteredSuggestions.length > 0 ? (
                        filteredSuggestions.map((item) => (
                          <div
                            key={item.label}
                            onClick={() => {
                              setSearchQuery(item.label);
                              setIsSearchOpen(false);
                              navigateToSearch(item.label);
                            }}
                            className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer hover:bg-muted/40 hover:-translate-y-0.5 transition-all duration-200 group/item"
                          >
                            <div className="flex items-center gap-3.5">
                              <MapPin className="w-5 h-5 text-primary shrink-0 transition-transform duration-200 group-hover/item:scale-110" />
                              <div className="flex flex-col text-left">
                                <span className="font-body text-sm font-semibold text-primary">
                                  {item.label}
                                </span>
                                <span className="font-body text-xs text-muted-foreground">
                                  {item.description}
                                </span>
                              </div>
                            </div>
                            <span className="font-heading text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full shrink-0">
                              {item.badge}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="py-6 text-center text-sm font-semibold text-muted-foreground">
                          No matches found for &ldquo;{searchQuery}&rdquo;
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>

          {/* Image Column */}
          <motion.div
            variants={imageVariants}
            className="lg:col-span-5 relative w-full max-w-[480px] lg:max-w-none aspect-[4/3] z-10 mx-auto"
          >
            {/* Visual Frame wrapper */}
            <div className="w-full h-full rounded-[32px] overflow-hidden shadow-premium border-2 border-border/80 bg-card group relative p-1.5 transition-all duration-500 hover:border-primary/10">
              <div className="w-full h-full rounded-[26px] overflow-hidden relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-106"
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80"
                  alt="Premium co-living and hostel suite in Indore"
                />
                {/* Subtle dark glare layer overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 rounded-[26px] border border-border/10 pointer-events-none" />
              </div>
            </div>

            {/* Premium Floating Elements */}

            {/* 1. Rating Pill (Top-Right) */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -top-4 -right-4 bg-card/85 backdrop-blur-md border border-border/80 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 select-none hover:shadow-2xl transition-all duration-300 hover:border-primary/20"
            >
              <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-secondary fill-current" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-primary">4.9 Star Rating</span>
                <span className="text-[9px] text-muted-foreground font-semibold">Indore&apos;s Top Rated</span>
              </div>
            </motion.div>

            {/* 2. Verified Stays Badge (Bottom-Left) */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-4 -left-4 bg-card/85 backdrop-blur-md border border-border/80 px-4.5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 select-none hover:shadow-2xl transition-all duration-300 hover:border-primary/20"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                <BadgeCheck className="w-4.5 h-4.5 text-accent" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-extrabold text-primary">100% Physical Audited</span>
                <span className="text-[9px] text-muted-foreground font-semibold">Safe & Verified Hosts</span>
              </div>
            </motion.div>

            {/* 3. Community Pill (Bottom-Right overlay) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-5 right-5 bg-card/75 backdrop-blur-md border border-border/40 px-3.5 py-2 rounded-xl flex items-center gap-2 text-foreground select-none"
            >
              <Users className="w-3.5 h-3.5 text-secondary" />
              <span className="text-[10px] font-bold tracking-wide">Join 5,000+ Students</span>
            </motion.div>

            {/* Decorative background framing shapes */}
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/10 rounded-[32px] -z-10 blur-sm animate-pulse duration-4000" />
            <div className="absolute -top-4 -right-4 w-40 h-40 border-2 border-primary/5 rounded-[32px] -z-10" />
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}

export default Hero;
