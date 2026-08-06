"use client";

import * as React from "react";
import { Container } from "@/components/shared/container";
import { BrandLogo } from "@/components/shared/brand-logo";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://instagram.com/roofonclick",
    icon: InstagramIcon,
    hoverClass: "hover:text-pink-500 hover:border-pink-500/40 hover:bg-pink-500/10",
  },
  {
    label: "Facebook",
    href: "https://facebook.com/roofonclick",
    icon: FacebookIcon,
    hoverClass: "hover:text-blue-600 hover:border-blue-600/40 hover:bg-blue-600/10",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/roofonclick",
    icon: LinkedinIcon,
    hoverClass: "hover:text-sky-600 hover:border-sky-600/40 hover:bg-sky-600/10",
  },
  {
    label: "Twitter (X)",
    href: "https://twitter.com/roofonclick",
    icon: TwitterIcon,
    hoverClass: "hover:text-foreground hover:border-foreground/40 hover:bg-foreground/10",
  },
];

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
            <BrandLogo />
            <p className="font-body text-sm text-muted-foreground/80 max-w-sm leading-relaxed">
              Indore&apos;s modern accommodation discovery platform helping students and working professionals find premium, verified hostels and PGs with zero brokerage hassle.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon, hoverClass }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl border border-border/80 flex items-center justify-center text-muted-foreground bg-card transition-all duration-200 shadow-xs hover:scale-110 active:scale-95 ${hoverClass}`}
                  aria-label={label}
                >
                  <Icon className="w-4.5 h-4.5 pointer-events-none" />
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
