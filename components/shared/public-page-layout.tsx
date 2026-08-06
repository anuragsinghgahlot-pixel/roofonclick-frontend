"use client";

import * as React from "react";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

interface PublicPageLayoutProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  showFooter?: boolean;
  withContainer?: boolean;
}



export function PublicPageLayout({
  children,
  className,
  containerClassName,
  showFooter = true,
  withContainer = true,
}: PublicPageLayoutProps) {
  return (
    <div className="relative flex flex-col min-h-[100dvh] bg-background">
      <Navbar />
      <main className={cn("flex-1 text-left pt-4 sm:pt-6 lg:pt-8 pb-6 sm:pb-10", className)} data-no-intercept="true">
        {withContainer ? (
          <Container className={containerClassName}>{children}</Container>
        ) : (
          children
        )}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
