"use client";

import * as React from "react";
import Link from "next/link";
import { Home, Search, HelpCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 md:py-24">
        <Section className="w-full">
          <Container className="max-w-xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* 404 Badge & Graphic */}
              <div className="relative inline-block">
                <span className="font-heading text-8xl sm:text-9xl font-extrabold text-primary/10 tracking-tighter select-none">
                  404
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-3xl bg-secondary/15 border border-secondary/30 text-secondary flex items-center justify-center text-4xl shadow-md">
                    🏚️
                  </div>
                </div>
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary block">
                  Error 404 • Destination Not Found
                </span>
                <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                  Lost Your Way Home?
                </h1>
                <p className="font-body text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  The page or property listing you are looking for might have been moved, renamed, or is temporarily unavailable.
                </p>
              </div>
            </motion.div>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto"
            >
              <Link
                href="/"
                className="flex items-center justify-center gap-2 bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground py-3.5 px-4 rounded-2xl font-heading text-xs font-bold transition-all shadow-md"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </Link>

              <Link
                href="/explore"
                className="flex items-center justify-center gap-2 bg-secondary/15 hover:bg-secondary hover:text-secondary-foreground text-secondary border border-secondary/30 py-3.5 px-4 rounded-2xl font-heading text-xs font-bold transition-all shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>Browse Stays</span>
              </Link>

              <Link
                href="/contact-owner"
                className="flex items-center justify-center gap-2 bg-card border border-border hover:bg-muted/40 text-foreground py-3.5 px-4 rounded-2xl font-heading text-xs font-bold transition-all shadow-xs"
              >
                <HelpCircle className="w-4 h-4 text-primary" />
                <span>Contact Support</span>
              </Link>
            </motion.div>

            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to RoofOnClick Homepage</span>
              </Link>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
