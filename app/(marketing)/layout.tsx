import * as React from "react";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="relative flex flex-col min-h-[100dvh] bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
