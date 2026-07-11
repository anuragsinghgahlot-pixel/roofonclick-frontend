import * as React from "react";
import { Container } from "@/components/layout/container";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card py-12 text-muted-foreground transition-fast">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
          <div className="flex flex-col gap-2">
            <span className="font-heading text-lg font-bold text-primary tracking-tight">
              StayyNest
            </span>
            <p className="text-xs text-muted-foreground max-w-xs">
              Indore's modern accommodation discovery platform helping you find the perfect student hostel and PG.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-sm">
            <div>
              {/* TODO: Add real footer navigation categories */}
              <span className="block font-semibold text-foreground mb-2">Company</span>
              <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
                <li className="text-xs">About Us</li>
                <li className="text-xs">Careers</li>
              </ul>
            </div>
            <div>
              <span className="block font-semibold text-foreground mb-2">Support</span>
              <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
                <li className="text-xs">Help Center</li>
                <li className="text-xs">Contact Support</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row md:justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} StayyNest. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
