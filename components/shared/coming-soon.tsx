"use client";

import * as React from "react";
import { Compass, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navigation/navbar";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 pt-24 text-center relative overflow-hidden">
      <Navbar />

      {/* Premium ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main content block */}
      <div className="max-w-md flex flex-col items-center gap-6 relative z-10 my-auto">
        {/* Animated Icon badge */}
        <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shadow-sm">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        {/* Headings */}
        <div className="flex flex-col gap-2">
          <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary">
            Coming Soon
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            {title}
          </h1>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            {description || "We are currently building this feature to provide you with the most premium accommodation discovery experience in Indore. Stay tuned!"}
          </p>
        </div>

        {/* Back Button */}
        <Link
          href="/"
          data-no-intercept="true"
          className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-xl border border-primary/25 bg-primary/5 hover:bg-primary hover:text-primary-foreground text-primary font-heading text-sm font-bold tracking-wide transition-all duration-300 shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Footer copyright */}
      <div className="pb-6 text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
        &copy; {new Date().getFullYear()} RoofOnClick &middot; Made with ♥ in Indore
      </div>
    </div>
  );
}

export default ComingSoon;
