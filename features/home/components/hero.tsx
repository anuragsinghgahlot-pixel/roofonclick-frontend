"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search as SearchIcon, Compass, Star, BadgeCheck, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";

const SEARCH_SUGGESTIONS = [
  { label: "Vijay Nagar", category: "Popular Area", description: "126 verified PGs available", badge: "Popular" },
  { label: "Palasia", category: "Popular Area", description: "84 premium stays nearby", badge: "Trending" },
  { label: "Bhawarkuan", category: "Student Area", description: "Near DAVV & SGSITS", badge: "Students" },
  { label: "IET DAVV", category: "College", description: "54 hostels nearby", badge: "College" },
  { label: "Medanta Hospital", category: "Hospital", description: "Premium PGs nearby", badge: "Medical" },
  { label: "C21 Mall", category: "Landmark", description: "Luxury stays nearby", badge: "Lifestyle" },
];

export function Hero() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  const navigateToSearch = React.useCallback(
    (location?: string) => {
      if (!location || !location.trim()) {
        router.push("/search");
      } else {
        const slug = location.trim().toLowerCase().replace(/\s+/g, "-");
        router.push(`/search?location=${slug}`);
      }
    },
    [router]
  );

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  const filteredSuggestions = React.useMemo(() => {
    if (!searchQuery.trim()) return SEARCH_SUGGESTIONS;
    const lq = searchQuery.toLowerCase();
    return SEARCH_SUGGESTIONS.filter(
      (item) => item.label.toLowerCase().includes(lq) || item.category.toLowerCase().includes(lq)
    );
  }, [searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <Section className="relative pt-6 sm:pt-8 lg:pt-6 pb-16 sm:pb-24 lg:pb-20 bg-background overflow-hidden">
      {/* Decorative glows — clipped by overflow-hidden on Section */}
      <div className="absolute inset-0 pointer-events-none -z-20">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-primary/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-secondary/8 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[45%] w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-primary/5 rounded-full blur-[90px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <Container className="max-w-[1280px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center"
        >
          {/* ── Content Column ── */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Tagline Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 shadow-md mb-5 sm:mb-6 transition-all duration-300 select-none max-w-full"
            >
              <Compass className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-secondary animate-spin-slow shrink-0" />
              <span className="leading-none truncate">Verified Student &amp; Professional Housing Network</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="font-heading text-[1.875rem] sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-extrabold text-primary tracking-tight leading-[1.08] mb-5 sm:mb-6 drop-shadow-sm"
            >
              <span className="block">Find Your Perfect</span>
              <span className="relative inline-block mt-3 sm:mt-4 leading-[1.3] text-transparent bg-clip-text bg-gradient-to-r from-secondary to-secondary/80">
                <span>Roof On</span>
                <span className="ml-2 sm:ml-3">Click</span>
                <span className="absolute bottom-1 sm:bottom-2 left-0 w-full h-[3px] sm:h-[4px] bg-secondary/20 rounded-full" />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="font-body text-sm sm:text-base lg:text-lg text-muted-foreground/90 leading-relaxed mb-8 sm:mb-10 max-w-xl"
            >
              Discover handpicked student hostels, luxury PGs, and premium co-living suites across Indore. Verified locations, transparent leases, and zero brokerage hassle.
            </motion.p>

            {/* Search Box */}
            <motion.div
              animate={{ marginBottom: isSearchOpen ? 320 : 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl"
            >
              <motion.div
                ref={searchRef}
                variants={itemVariants}
                className="w-full flex flex-col sm:flex-row gap-3 p-2.5 sm:p-3 bg-card/75 backdrop-blur-xl border border-border/80 rounded-[24px] sm:rounded-[28px] shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-primary/20 group/search relative"
              >
                {/* Input */}
                <div className="flex-1 flex items-center px-3 sm:px-4 gap-2 sm:gap-3 border-b sm:border-b-0 sm:border-r border-border/60 pb-3 sm:pb-0 transition-colors group-hover/search:border-primary/25">
                  <MapPin className="text-secondary w-4 sm:w-5 h-4 sm:h-5 shrink-0" strokeWidth={2.5} />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsSearchOpen(true)}
                    onChange={(e) => { setSearchQuery(e.target.value); setIsSearchOpen(true); }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") { setIsSearchOpen(false); e.currentTarget.blur(); }
                      if (e.key === "Enter") navigateToSearch(searchQuery);
                    }}
                    className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0 w-full text-sm font-semibold font-body text-foreground placeholder:text-muted-foreground/50 min-h-[36px]"
                    placeholder="Where in Indore? (e.g. Vijay Nagar)"
                  />
                </div>

                {/* CTA Button — full width on mobile */}
                <button
                  type="button"
                  onClick={() => navigateToSearch(searchQuery)}
                  className="bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground px-5 sm:px-8 py-3 sm:py-4 rounded-[16px] sm:rounded-[18px] font-heading text-sm font-bold tracking-wide flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 cursor-pointer shadow-md min-h-[44px]"
                >
                  <SearchIcon className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                  Explore Stays
                </button>

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 right-0 top-full mt-2 z-[100] bg-card border border-border rounded-2xl shadow-xl backdrop-blur-xl max-h-[280px] sm:max-h-[320px] overflow-y-auto p-2 flex flex-col gap-1 text-left"
                    >
                      {filteredSuggestions.length > 0 ? (
                        filteredSuggestions.map((item) => (
                          <div
                            key={item.label}
                            onClick={() => { setSearchQuery(item.label); setIsSearchOpen(false); navigateToSearch(item.label); }}
                            className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl cursor-pointer hover:bg-muted/40 transition-all duration-200 group/item min-h-[44px]"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <MapPin className="w-4 h-4 text-primary shrink-0" />
                              <div className="flex flex-col text-left min-w-0">
                                <span className="font-body text-sm font-semibold text-primary truncate">{item.label}</span>
                                <span className="font-body text-xs text-muted-foreground truncate">{item.description}</span>
                              </div>
                            </div>
                            <span className="font-heading text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full shrink-0 ml-2">
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

          {/* ── Desktop Image Column (lg+) ── */}
          <motion.div
            variants={imageVariants}
            className="hidden lg:block lg:col-span-5 relative w-full aspect-[4/3] z-10"
          >
            <div className="w-full h-full rounded-[32px] overflow-hidden shadow-2xl border-2 border-border/80 bg-card group relative p-1.5 transition-all duration-500 hover:border-primary/10">
              <div className="w-full h-full rounded-[26px] overflow-hidden relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80"
                  alt="Premium co-living and hostel suite in Indore"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/10 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Rating Pill */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -top-4 -right-4 bg-card/85 backdrop-blur-md border border-border/80 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 select-none z-20"
            >
              <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-secondary fill-current" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-primary">4.9 Star Rating</span>
                <span className="text-[9px] text-muted-foreground font-semibold">Indore&apos;s Top Rated</span>
              </div>
            </motion.div>

            {/* Verified Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-4 -left-4 bg-card/85 backdrop-blur-md border border-border/80 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 select-none z-20"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                <BadgeCheck className="w-4 h-4 text-accent" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-extrabold text-primary">100% Physical Audited</span>
                <span className="text-[9px] text-muted-foreground font-semibold">Safe &amp; Verified Hosts</span>
              </div>
            </motion.div>

            {/* Community Pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-5 right-5 bg-card/75 backdrop-blur-md border border-border/40 px-3.5 py-2 rounded-xl flex items-center gap-2 text-foreground select-none"
            >
              <Users className="w-3.5 h-3.5 text-secondary" />
              <span className="text-[10px] font-bold tracking-wide">Join 5,000+ Students</span>
            </motion.div>

            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/10 rounded-[32px] -z-10 blur-sm animate-pulse" />
            <div className="absolute -top-4 -right-4 w-40 h-40 border-2 border-primary/5 rounded-[32px] -z-10" />
          </motion.div>

          {/* ── Mobile/Tablet Hero Image (below content, hidden on lg+) ── */}
          <motion.div
            variants={imageVariants}
            className="lg:hidden w-full max-w-sm sm:max-w-lg mx-auto aspect-[16/10] relative z-10"
          >
            <div className="w-full h-full rounded-[20px] overflow-hidden shadow-lg border border-border/80 bg-card">
              <img
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80"
                alt="Premium co-living and hostel suite in Indore"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent pointer-events-none" />
            </div>
            {/* Compact badges */}
            <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm border border-border/80 px-3 py-1.5 rounded-xl shadow flex items-center gap-1.5 z-10">
              <Star className="w-3.5 h-3.5 text-secondary fill-current" />
              <span className="text-[11px] font-bold text-primary">4.9 Rating</span>
            </div>
            <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm border border-border/80 px-3 py-1.5 rounded-xl shadow flex items-center gap-1.5 z-10">
              <BadgeCheck className="w-3.5 h-3.5 text-accent" />
              <span className="text-[11px] font-bold text-primary">Verified Stays</span>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}

export default Hero;
