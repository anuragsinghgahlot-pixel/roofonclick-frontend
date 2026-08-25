"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MapPin, Building2, ArrowRight, ShieldCheck, Sparkles, Clock, Lock } from "lucide-react";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { PageHeader } from "@/components/shared/page-header";
import { useCity } from "@/providers/city-provider";
import { CITIES_REGISTRY, CityConfig } from "@/constants/cities";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AreasPageContent() {
  const router = useRouter();
  const { selectedCity, setCity } = useCity();

  const liveCities = CITIES_REGISTRY.filter((c) => c.isLive);
  const upcomingCities = CITIES_REGISTRY.filter((c) => !c.isLive);

  const handleSelectArea = (city: CityConfig, areaName: string) => {
    if (!city.isLive) {
      toast.info(`${city.name} Launching Soon`, {
        description: `We are currently onboarding verified properties in ${city.name}.`,
      });
      return;
    }
    setCity(city);
    router.push(`/search?city=${encodeURIComponent(city.id)}&area=${encodeURIComponent(areaName)}`);
  };

  const handleCityClick = (city: CityConfig) => {
    if (!city.isLive) {
      toast.info(`${city.name} Launching Soon`, {
        description: `We are currently onboarding verified properties in ${city.name}.`,
      });
      return;
    }
    setCity(city);
    router.push(`/search?city=${encodeURIComponent(city.id)}`);
  };

  return (
    <div className="relative flex flex-col min-h-[100dvh] bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Section className="bg-muted/10 pt-4 sm:pt-6 lg:pt-8 pb-12 relative overflow-hidden">
          {/* Ambient decorative glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />

          <Container>
            <PageHeader
              title="Explore Cities & Localities"
              subtitle="Browse student & co-living hubs with verified accommodations across active cities"
              badge={
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active in {liveCities.map((c) => c.name).join(", ")}
                </span>
              }
              backFallbackUrl="/"
            />

            {/* ─── LIVE OPERATIONAL CITIES ────────────────────────────────────────── */}
            <div className="mt-8 space-y-12">
              {liveCities.map((city) => (
                <div key={city.id} className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
                          {city.name}
                        </h2>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3" />
                          Verified Stays
                        </span>
                      </div>
                      <p className="font-body text-xs sm:text-sm text-muted-foreground mt-1">
                        {city.tagline}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCityClick(city)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-heading text-xs font-bold hover:bg-primary/90 transition-all shadow-xs cursor-pointer select-none active:scale-95 shrink-0"
                    >
                      <span>Browse All {city.name} Stays</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Areas Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {city.popularAreas.map((area) => (
                      <div
                        key={area.id}
                        onClick={() => handleSelectArea(city, area.name)}
                        className="group bg-card border border-border/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                          <img
                            src={area.image}
                            alt={area.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                          <div className="absolute top-3 right-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                              Verified
                            </span>
                          </div>
                          <div className="absolute bottom-3 left-3 right-3 text-left">
                            <h3 className="font-heading text-lg font-bold text-white leading-tight">
                              {area.name}
                            </h3>
                          </div>
                        </div>

                        <div className="p-4 flex items-center justify-between mt-auto text-left">
                          <p className="font-body text-xs text-muted-foreground line-clamp-1">
                            {area.tagline}
                          </p>
                          <span className="font-heading text-xs font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0 ml-2">
                            Explore →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* ─── UPCOMING CITIES (DISABLED / COMING SOON) ───────────────────────── */}
              <div className="pt-8 border-t border-border/80 space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-foreground">
                      Expanding Soon Across India
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      <Clock className="w-3 h-3" />
                      Phase 2 Expansion
                    </span>
                  </div>
                  <p className="font-body text-xs sm:text-sm text-muted-foreground mt-1">
                    We are currently onboarding and physically verifying student accommodations in these hub cities.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {upcomingCities.map((city) => (
                    <div
                      key={city.id}
                      onClick={() => handleCityClick(city)}
                      className="p-5 rounded-2xl bg-muted/20 border border-dashed border-border/70 flex flex-col justify-between opacity-70 hover:opacity-90 transition-opacity cursor-not-allowed text-left"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <h4 className="font-heading text-base font-extrabold text-foreground">
                              {city.name}
                            </h4>
                          </div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-muted text-muted-foreground border border-border/40">
                            <Lock className="w-2.5 h-2.5" />
                            Soon
                          </span>
                        </div>
                        <p className="font-body text-xs text-muted-foreground line-clamp-2">
                          {city.tagline}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{city.popularAreas.length} Planned Areas</span>
                        <span className="font-semibold text-muted-foreground/80">Launching Soon</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
