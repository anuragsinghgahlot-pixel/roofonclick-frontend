"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Wifi, ShieldCheck, Heart, User, Check, Zap, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";

const MOCK_CRITERIA = [
  { id: "boys", label: "Boys PG", icon: User, color: "text-primary bg-primary/10 border-primary/20" },
  { id: "girls", label: "Girls PG", icon: Heart, color: "text-secondary bg-secondary/10 border-secondary/20" },
  { id: "co-living", label: "Co-Living", icon: Sparkles, color: "text-accent bg-accent/10 border-accent/20" },
  { id: "wifi", label: "Wi-Fi Included", icon: Wifi, color: "text-primary bg-primary/10 border-primary/20" },
  { id: "verified", label: "Verified Host", icon: ShieldCheck, color: "text-accent bg-accent/10 border-accent/20" },
  { id: "deposit", label: "Zero Deposit", icon: Zap, color: "text-secondary bg-secondary/10 border-secondary/20" },
];

export function Search() {
  const [selected, setSelected] = React.useState<string[]>(["boys", "wifi"]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <Section className="bg-muted/10 py-10 relative overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6"
        >
          {/* Header */}
          <div className="flex flex-col gap-1.5 text-left">
            <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary">
              Quick Filter
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-primary">
              What are you looking for?
            </h2>
          </div>

          {/* Filters List */}
          <div className="flex flex-wrap gap-3">
            {MOCK_CRITERIA.map((item) => {
              const Icon = item.icon;
              const isSelected = selected.includes(item.id);

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => toggleSelect(item.id)}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex items-center gap-2.5 px-4.5 py-3 rounded-2xl border text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer shadow-sm relative overflow-hidden",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary/30"
                      : "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isSelected ? "text-primary-foreground" : item.color.split(" ")[0])} />
                  <span>{item.label}</span>

                  {/* Micro indicator */}
                  {isSelected && (
                    <span className="w-3.5 h-3.5 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0 ml-1.5">
                      <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}

// CN Utility wrapper for standalone usage in components
import { cn } from "@/lib/utils";

export default Search;
