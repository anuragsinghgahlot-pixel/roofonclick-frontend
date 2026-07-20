"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/shared/section";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Plus, Building, Users, Calendar, BarChart3, ArrowRight, Eye, Trash2, Edit3, ExternalLink, MapPin, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { PropertyService, Property } from "@/services/property";

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

export default function OwnerDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [pathnameKey, setPathnameKey] = React.useState(pathname);
  const [properties, setProperties] = React.useState<Property[]>(() => {
    return PropertyService.getAllProperties();
  });
  const [propertyToDelete, setPropertyToDelete] = React.useState<Property | null>(null);

  // Sync properties when pathname changes during client navigation
  if (pathnameKey !== pathname) {
    setPathnameKey(pathname);
    setProperties(PropertyService.getAllProperties());
  }

  // Re-sync properties on window focus
  React.useEffect(() => {
    const handleFocus = () => {
      setProperties(PropertyService.getAllProperties());
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleAddProperty = () => {
    PropertyService.clearDraft();
    router.push("/owner/property/new?step=1");
  };

  // Stat computations
  const totalListings = properties.length;
  const totalViews = properties.reduce((acc, p) => acc + Number(p.views || 0), 0);
  const totalEnquiries = properties.reduce((acc, p) => acc + Number(p.enquiries || 0), 0);

  // 1. View Property Handler
  const handleView = (prop: Property) => {
    router.push(`/property/${prop.id}?preview=owner`);
  };

  // 2. Edit Property Handler
  const handleEdit = (prop: Property) => {
    router.push(`/owner/property/edit/${prop.id}?step=1`);
  };

  // 3. Delete Property Handler & Confirmation
  const confirmDelete = () => {
    if (!propertyToDelete) return;
    const targetId = propertyToDelete.id;
    PropertyService.deleteProperty(targetId);
    setProperties(PropertyService.getAllProperties());
    toast.success("Your property has been deleted successfully.");
    setPropertyToDelete(null);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1" data-no-intercept="true">
        <Section className="bg-muted/10 py-12 relative overflow-hidden text-left">
          {/* Background glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />

          <Container>
            {/* Header / Welcome Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/80 pb-6 mb-10">
              <div>
                <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary block mb-1">
                  Management Center
                </span>
                <h1 className="font-heading text-3xl font-extrabold text-primary tracking-tight">
                  Owner Dashboard
                </h1>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  Welcome back, <span className="font-semibold text-primary">{user?.name || user?.email || "Partner"}</span>. Here is how your properties are performing.
                </p>
              </div>

              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <button
                  data-no-intercept="true"
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-primary text-xs font-bold transition-all duration-200 cursor-pointer"
                >
                  Logout
                </button>
                <button
                  data-no-intercept="true"
                  onClick={handleAddProperty}
                  className="bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground text-xs font-bold tracking-wide px-5 py-2.5 rounded-xl transition-all duration-300 cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add Property
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { label: "Active Listings", value: totalListings.toString(), icon: Building, color: "text-primary bg-primary/10" },
                { label: "Enquiries Received", value: totalEnquiries.toString(), icon: Users, color: "text-secondary bg-secondary/10" },
                { label: "Bookings Pending", value: "0", icon: Calendar, color: "text-accent bg-accent/10" },
                { label: "Profile Views", value: totalViews.toString(), icon: BarChart3, color: "text-muted-foreground bg-muted/70" },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.08, ease: PREMIUM_EASE }}
                    className="bg-card border border-border/80 rounded-2xl p-6 shadow-premium flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-muted-foreground block">{stat.label}</span>
                      <span className="font-heading text-2xl font-extrabold text-primary">{stat.value}</span>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Empty State vs List grid switcher */}
            {properties.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: PREMIUM_EASE }}
                className="bg-card border border-border/80 rounded-3xl p-8 sm:p-10 shadow-premium flex flex-col lg:flex-row items-center gap-10 max-w-4xl mx-auto"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[32px] bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0 shadow-sm text-5xl select-none">
                  🏢
                </div>

                <div className="flex-1 flex flex-col gap-4 text-center lg:text-left items-center lg:items-start">
                  <div className="space-y-1">
                    <h3 className="font-heading text-xl font-extrabold text-primary">No properties listed yet</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">
                      List your first hostel or PG accommodation in Indore to start receiving verified leads and digital bookings on RoofOnClick.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-2">
                    <button
                      data-no-intercept="true"
                      onClick={handleAddProperty}
                      className="w-full sm:w-auto bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all duration-300 cursor-pointer shadow-md shadow-primary/10 flex items-center justify-center gap-1.5"
                    >
                      Create Listing
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      data-no-intercept="true"
                      onClick={() => router.push("/")}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-primary text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center"
                    >
                      View Homepage
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Published Listings Section */
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center border-b border-border/60 pb-3 mb-6">
                  <h2 className="font-heading text-xl font-extrabold text-primary">
                    Your Properties
                  </h2>
                  <span className="text-xs font-semibold text-muted-foreground">
                    Showing {properties.length} Listings
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {properties.map((prop, idx) => (
                      <motion.div
                        key={prop.id}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.4, ease: PREMIUM_EASE, delay: idx * 0.05 }}
                        className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-premium flex flex-col group"
                      >
                        {/* Image Banner */}
                        <div className="relative aspect-video w-full overflow-hidden bg-muted">
                          <img
                            src={prop.coverPhoto}
                            alt={prop.propertyName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                          />
                          <div className="absolute top-3 right-3 bg-emerald-500 text-white font-heading text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-md">
                            {prop.status}
                          </div>
                          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white font-heading text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                            {prop.propertyType}
                          </div>
                        </div>

                        {/* Card Info */}
                        <div className="p-5 flex-1 flex flex-col gap-4">
                          <div className="space-y-1">
                            <h3 className="font-heading text-base font-extrabold text-primary line-clamp-1">
                              {prop.propertyName}
                            </h3>
                            <div className="flex items-center gap-1 text-muted-foreground text-xs">
                              <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                              <span className="font-semibold">{prop.area}, {prop.city}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center border-t border-b border-border/40 py-2.5">
                            <div>
                              <span className="text-[10px] text-muted-foreground font-semibold block">STARTING RENT</span>
                              <span className="font-heading text-sm font-extrabold text-emerald-500">₹{prop.startingRent} / mo</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-muted-foreground font-semibold block">GENDER</span>
                              <span className="font-heading text-xs font-bold text-primary">{prop.gender}</span>
                            </div>
                          </div>

                          {/* Stats and Info Indicators */}
                          <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4 text-secondary shrink-0" />
                              {prop.views} views
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-secondary shrink-0" />
                              {prop.enquiries} enquiries
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-3 gap-2 border-t border-border/40 pt-4 mt-auto">
                            <button
                              data-no-intercept="true"
                              onClick={() => handleView(prop)}
                              className="px-2.5 py-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-primary text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View
                            </button>
                            <button
                              data-no-intercept="true"
                              onClick={() => handleEdit(prop)}
                              className="px-2.5 py-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-primary text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              data-no-intercept="true"
                              onClick={() => setPropertyToDelete(prop)}
                              className="px-2.5 py-2 rounded-xl border border-border bg-card hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
              {propertyToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-premium space-y-6 text-left relative"
                  >
                    <button
                      onClick={() => setPropertyToDelete(null)}
                      className="absolute top-5 right-5 p-1.5 rounded-xl border border-border hover:bg-muted/40 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-extrabold text-primary">
                          Delete Property?
                        </h3>
                        <span className="font-body text-xs text-muted-foreground block truncate max-w-[240px]">
                          {propertyToDelete.propertyName}
                        </span>
                      </div>
                    </div>

                    <p className="font-body text-sm text-muted-foreground leading-relaxed">
                      Are you sure you want to delete this property? This action cannot be undone.
                    </p>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        data-no-intercept="true"
                        onClick={() => setPropertyToDelete(null)}
                        className="px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-primary text-xs font-bold transition-all duration-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        data-no-intercept="true"
                        onClick={confirmDelete}
                        className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md shadow-rose-600/20"
                      >
                        Delete Property
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
