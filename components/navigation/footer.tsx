"use client";

import * as React from "react";
import { Container } from "@/components/shared/container";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/65 backdrop-blur-md py-16 text-muted-foreground transition-all duration-300 relative overflow-hidden">
      {/* Soft dark green glow in the background */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 pb-12 border-b border-border/60">
          
          {/* Brand Info Section (Spans 5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4 text-left">
            <span className="font-heading text-2xl font-extrabold text-primary tracking-tight select-none">
              RoofOnClick
            </span>
            <p className="font-body text-sm text-muted-foreground/80 max-w-sm leading-relaxed">
              Indore&apos;s modern accommodation discovery platform helping students and working professionals find premium, verified hostels and PGs with zero brokerage hassle.
            </p>
            {/* Social Icons list */}
            <div className="flex items-center gap-3.5 mt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-xl border border-border/80 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 bg-card hover:bg-muted/40 transition-colors shadow-sm font-bold text-xs"
                aria-label="Website"
              >
                🌐
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl border border-border/80 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 bg-card hover:bg-muted/40 transition-colors shadow-sm font-bold text-xs"
                aria-label="Email"
              >
                ✉
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl border border-border/80 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 bg-card hover:bg-muted/40 transition-colors shadow-sm font-bold text-xs"
                aria-label="Phone"
              >
                ☎
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl border border-border/80 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 bg-card hover:bg-muted/40 transition-colors shadow-sm font-bold text-xs"
                aria-label="Github"
              >
                📂
              </a>
            </div>
          </div>

          {/* Quick Links Column 1 (Spans 3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-4 text-left">
            <span className="font-heading text-xs font-bold text-foreground uppercase tracking-widest pl-0.5">
              Explore Indore
            </span>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              <li>
                <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  Vijay Nagar Stays
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  Bhawarkuan Stays
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  Palasia Stays
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  Geeta Bhawan Stays
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links Column 2 (Spans 2 cols) */}
          <div className="md:col-span-2 flex flex-col gap-4 text-left">
            <span className="font-heading text-xs font-bold text-foreground uppercase tracking-widest pl-0.5">
              Company
            </span>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              <li>
                <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  List Property
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links Column 3 (Spans 2 cols) */}
          <div className="md:col-span-2 flex flex-col gap-4 text-left">
            <span className="font-heading text-xs font-bold text-foreground uppercase tracking-widest pl-0.5">
              Support
            </span>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              <li>
                <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright details block */}
        <div className="pt-8 flex flex-col md:flex-row md:justify-between items-center gap-4 text-xs font-medium text-muted-foreground/80">
          <p>&copy; {new Date().getFullYear()} RoofOnClick. All rights reserved.</p>
          <div className="flex items-center gap-1 select-none">
            <span>Made with</span>
            <span className="text-rose-500 animate-pulse text-sm">❤️</span>
            <span>in Indore</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
