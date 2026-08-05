"use client";

import * as React from "react";
import { Container } from "@/components/shared/container";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/65 backdrop-blur-md py-12 sm:py-16 text-muted-foreground transition-all duration-300 relative overflow-hidden">
      {/* Soft glow */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <Container>
        {/* Main grid — stacks on mobile, 12-col on md+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 pb-10 sm:pb-12 border-b border-border/60">

          {/* Brand — full width on mobile, spans 5 cols on md */}
          <div className="sm:col-span-2 md:col-span-5 flex flex-col gap-4 text-left">
            <span className="font-heading text-2xl font-extrabold text-primary tracking-tight select-none">
              RoofOnClick
            </span>
            <p className="font-body text-sm text-muted-foreground/80 max-w-sm leading-relaxed">
              Indore&apos;s modern accommodation discovery platform helping students and working professionals find premium, verified hostels and PGs with zero brokerage hassle.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              {[
                { label: "Website", icon: "🌐" },
                { label: "Email", icon: "✉" },
                { label: "Phone", icon: "☎" },
                { label: "Github", icon: "📂" },
              ].map(({ label, icon }) => (
                <a
                  key={label}
                  href="#"
                  className="w-10 h-10 rounded-xl border border-border/80 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 bg-card hover:bg-muted/40 transition-colors shadow-sm font-bold text-xs"
                  aria-label={label}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links — 3-column inner grid on both mobile and md */}
          <div className="sm:col-span-2 md:col-span-7 grid grid-cols-3 gap-6">
            {/* Explore Indore */}
            <div className="flex flex-col gap-3 text-left">
              <span className="font-heading text-xs font-bold text-foreground uppercase tracking-widest">
                Explore
              </span>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {["Vijay Nagar", "Bhawarkuan", "Palasia", "Geeta Bhawan"].map((area) => (
                  <li key={area}>
                    <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                      {area}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-3 text-left">
              <span className="font-heading text-xs font-bold text-foreground uppercase tracking-widest">
                Company
              </span>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {["About Us", "List Property", "Careers"].map((item) => (
                  <li key={item}>
                    <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Support */}
            <div className="flex flex-col gap-3 text-left">
              <span className="font-heading text-xs font-bold text-foreground uppercase tracking-widest">
                Legal &amp; Support
              </span>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {[
                  { label: "Buyer Terms & Conditions", href: "/legal/buyer-terms" },
                  { label: "Property Owner Terms", href: "/legal/owner-terms" },
                  { label: "Privacy Policy", href: "/legal/privacy-policy" },
                  { label: "Refund & Cancellation", href: "/legal/cancellation-policy" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row sm:justify-between items-center gap-3 text-xs font-medium text-muted-foreground/80 text-center">
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
