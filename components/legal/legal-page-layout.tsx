"use client";

import * as React from "react";
import Link from "next/link";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Printer, ArrowUp, ShieldCheck, ChevronRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  title: string;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated?: string;
  toc: TocItem[];
  children: React.ReactNode;
}

export function LegalPageLayout({
  title,
  subtitle,
  lastUpdated = "August 5, 2026",
  toc,
  children,
}: LegalPageLayoutProps) {
  const [activeSection, setActiveSection] = React.useState<string>(toc[0]?.id || "");
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      // Section intersection detection
      const scrollPosition = window.scrollY + 180;
      for (const item of toc) {
        const element = document.getElementById(item.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [toc]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between relative">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        {/* Header Hero Banner */}
        <Section className="bg-muted/20 border-b border-border/60 py-10 sm:py-14 text-left">
          <Container>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-6xl mx-auto">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-heading font-extrabold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Official Legal Document
                  </span>
                  <span className="text-xs font-body text-muted-foreground">
                    Last Updated: {lastUpdated}
                  </span>
                </div>
                <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-primary tracking-tight">
                  {title}
                </h1>
                <p className="font-body text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  {subtitle}
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-3 shrink-0 print:hidden">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted/50 text-foreground font-heading text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-primary" />
                  <span>Print Document</span>
                </button>
              </div>
            </div>
          </Container>
        </Section>

        {/* Content Body with Sticky TOC */}
        <Section className="py-10">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto text-left">
              {/* Sticky Table of Contents Sidebar */}
              <aside className="lg:col-span-4 print:hidden">
                <div className="sticky top-28 bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin">
                  <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                    <FileText className="w-4 h-4 text-primary" />
                    <h2 className="font-heading text-xs font-extrabold uppercase tracking-wider text-primary">
                      Table of Contents
                    </h2>
                  </div>

                  <nav className="space-y-1">
                    {toc.map((item, idx) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const target = document.getElementById(item.id);
                          if (target) {
                            const y = target.getBoundingClientRect().top + window.scrollY - 100;
                            window.scrollTo({ top: y, behavior: "smooth" });
                          }
                        }}
                        className={cn(
                          "group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-heading font-semibold transition-all cursor-pointer",
                          activeSection === item.id
                            ? "bg-primary/10 text-primary border border-primary/20 font-bold"
                            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                        )}
                      >
                        <span className="truncate pr-2">
                          {idx + 1}. {item.title}
                        </span>
                        <ChevronRight
                          className={cn(
                            "w-3.5 h-3.5 shrink-0 transition-transform",
                            activeSection === item.id ? "text-primary translate-x-0.5" : "opacity-0 group-hover:opacity-100"
                          )}
                        />
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Main Legal Content */}
              <article className="lg:col-span-8 space-y-8 font-body text-foreground leading-relaxed print:w-full print:col-span-12">
                <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-10 shadow-premium space-y-8 print:border-none print:shadow-none print:p-0">
                  {children}
                </div>
              </article>
            </div>
          </Container>
        </Section>
      </main>

      {/* Floating Scroll to Top */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 print:hidden cursor-pointer"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      <Footer />
    </div>
  );
}
