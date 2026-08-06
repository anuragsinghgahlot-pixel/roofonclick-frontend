"use client";

import * as React from "react";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/shared/section";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Calendar, ShieldCheck, MapPin, Clock, ArrowRight, ExternalLink } from "lucide-react";
import { BookingService, BookingReservation } from "@/services/booking";
import { cn } from "@/lib/utils";

export default function BookingPage() {
  const [bookings, setBookings] = React.useState<BookingReservation[]>([]);

  React.useEffect(() => {
    const list = BookingService.getAllBookings();
    setBookings(list);
  }, []);

  return (
    <div className="relative flex flex-col min-h-[100dvh] bg-background">
      <Navbar />

      <main className="flex-1" data-no-intercept="true">
        <Section className="bg-background relative overflow-hidden text-left pt-4 sm:pt-6 lg:pt-8 pb-20">
          <Container className="space-y-8">
            <PageHeader
              title="My Bookings"
              subtitle="View your active reservations, move-in schedules, and room leases."
              backFallbackUrl="/"
            />

            {bookings.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No active bookings found"
                description="You have not reserved any PG rooms or student hostels yet. Start exploring verified properties across Indore."
                primaryAction={{
                  label: "Explore Properties",
                  href: "/search",
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-6 rounded-3xl bg-card border border-border/80 shadow-md space-y-4 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-heading text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/20">
                          ✓ {b.status.toUpperCase()}
                        </span>
                        <h3 className="font-heading text-lg font-extrabold text-primary mt-2">
                          {b.propertyName}
                        </h3>
                        <p className="font-body text-xs text-secondary font-bold">
                          Room: {b.roomType}
                        </p>
                      </div>

                      <span className="font-heading text-xs font-extrabold text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-lg">
                        {b.reservationId}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/60 text-xs font-body">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="w-4 h-4 text-secondary shrink-0" />
                        <span>Move-in: <strong className="text-foreground">{b.moveInDate}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Status: <strong className="text-foreground">Confirmed</strong></span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60 flex items-center justify-between font-body text-xs">
                      <span className="text-muted-foreground">Total Due Paid:</span>
                      <span className="font-heading text-sm font-extrabold text-primary">
                        ₹{b.pricing.totalDueNow.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <a
                        href={`/property/${b.propertyId}`}
                        className="px-4 py-2 rounded-xl border border-border/80 text-foreground font-heading text-xs font-bold hover:bg-muted/40 transition-colors flex items-center gap-1.5"
                      >
                        <span>View Property</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
