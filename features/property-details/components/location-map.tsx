"use client";

import * as React from "react";
import {
  MapPin,
  Navigation,
  Compass,
  ExternalLink,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  Crosshair,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";

export interface LocationMapProps {
  address: string;
  latitude?: number;
  longitude?: number;
  className?: string;
}

export function LocationMap({
  address = "Scheme 54, Vijay Nagar, Indore, MP 452010",
  latitude = 22.7533,
  longitude = 75.8937,
  className,
}: LocationMapProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  // Map Controls State
  const [zoomScale, setZoomScale] = React.useState(1);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const openGoogleMapsDirections = () => {
    const destination = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=${latitude},${longitude}`;
    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setIsCopied(true);
    showToast.success("Address Copied! 📍", "Property address copied to clipboard.");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(prev - 0.25, 1));
  const handleRecenter = () => {
    setZoomScale(1);
  };

  return (
    <div className={cn("space-y-4 text-left select-none", className)}>
      {/* ── 1. Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-heading text-xs font-extrabold uppercase tracking-widest text-secondary flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" /> Property Location
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
            Interactive Location
          </h2>
        </div>

        {/* Open in Google Maps Navigation Button */}
        <button
          type="button"
          data-no-intercept="true"
          onClick={openGoogleMapsDirections}
          className="px-4 py-2.5 rounded-2xl bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground font-heading text-xs font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer w-fit"
          aria-label="Open directions in Google Maps"
        >
          <span>Open in Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── 2. Full-Width Interactive Map Canvas ── */}
      <div
        className={cn(
          "relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl bg-card border border-border/80 overflow-hidden shadow-md group transition-all",
          isFullscreen && "fixed inset-4 z-modal aspect-none h-[calc(100vh-2rem)] shadow-2xl"
        )}
      >
        {isLoading ? (
          <div className="absolute inset-0 bg-muted/40 animate-pulse flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Compass className="w-8 h-8 animate-spin text-primary" />
              <span className="font-heading text-xs font-bold">Loading Interactive Map...</span>
            </div>
          </div>
        ) : (
          <>
            {/* SVG Vector Map Grid */}
            <div
              className="absolute inset-0 transition-transform duration-300 ease-out"
              style={{ transform: `scale(${zoomScale})` }}
            >
              <div
                className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.8) 1.5px, transparent 1.5px)",
                  backgroundSize: "24px 24px",
                }}
              />

              <svg className="absolute inset-0 w-full h-full text-border/60 pointer-events-none">
                <line x1="20%" y1="0%" x2="20%" y2="100%" stroke="currentColor" strokeWidth="2" />
                <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="currentColor" strokeWidth="4" />
                <line x1="80%" y1="0%" x2="80%" y2="100%" stroke="currentColor" strokeWidth="2" />
                <line x1="0%" y1="35%" x2="100%" y2="35%" stroke="currentColor" strokeWidth="3" />
                <line x1="0%" y1="65%" x2="100%" y2="65%" stroke="currentColor" strokeWidth="4" strokeDasharray="6 4" />
                <rect x="10%" y="15%" width="22%" height="16%" fill="currentColor" opacity="0.06" rx="8" />
                <rect x="58%" y="45%" width="28%" height="22%" fill="currentColor" opacity="0.06" rx="8" />
              </svg>

              {/* Property Main Marker Pin (Center) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-primary/20 animate-ping absolute" />
                <div className="relative bg-primary text-primary-foreground p-2 rounded-2xl shadow-xl border-2 border-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 fill-primary-foreground" />
                  <span className="font-heading text-[10px] font-extrabold uppercase tracking-wider hidden sm:inline">
                    RoofOnClick Property
                  </span>
                </div>
              </div>
            </div>

            {/* Map Control Buttons Overlay */}
            <div className="absolute top-3 left-3 z-20">
              <button
                type="button"
                data-no-intercept="true"
                onClick={() => setIsFullscreen((prev) => !prev)}
                className="p-2 rounded-xl bg-card/90 backdrop-blur-md border border-border/80 text-foreground hover:text-primary transition-colors shadow-sm cursor-pointer"
                aria-label="Toggle Fullscreen Map"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            <div className="absolute top-3 right-3 z-20 flex flex-col gap-1">
              <button
                type="button"
                data-no-intercept="true"
                onClick={handleZoomIn}
                className="p-2 rounded-xl bg-card/90 backdrop-blur-md border border-border/80 text-foreground hover:text-primary transition-colors shadow-sm cursor-pointer"
                aria-label="Zoom In"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                data-no-intercept="true"
                onClick={handleZoomOut}
                className="p-2 rounded-xl bg-card/90 backdrop-blur-md border border-border/80 text-foreground hover:text-primary transition-colors shadow-sm cursor-pointer"
                aria-label="Zoom Out"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            <div className="absolute bottom-3 right-3 z-20">
              <button
                type="button"
                data-no-intercept="true"
                onClick={handleRecenter}
                className="p-2 rounded-xl bg-card/90 backdrop-blur-md border border-border/80 text-foreground hover:text-primary transition-colors shadow-sm cursor-pointer"
                aria-label="Recenter Property Marker"
              >
                <Crosshair className="w-4 h-4" />
              </button>
            </div>

            <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
              <div className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-primary" />
                {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── 3. Full-Width Property Address Card ── */}
      <div className="flex items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border border-border/80 bg-card shadow-xs w-full">
        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5 sm:mt-0">
            <Navigation className="w-4 h-4" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-heading text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
              Full Property Address
            </span>
            <p className="font-body text-xs sm:text-sm text-foreground leading-snug break-words whitespace-normal font-medium">
              {address}
            </p>
          </div>
        </div>

        {/* Compact Copy Address Button */}
        <button
          type="button"
          data-no-intercept="true"
          onClick={handleCopyAddress}
          title="Copy Address"
          aria-label="Copy Address"
          className="p-2 rounded-xl border border-border/80 bg-muted/30 hover:bg-muted text-foreground transition-colors shrink-0 cursor-pointer flex items-center justify-center"
        >
          {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />}
        </button>
      </div>
    </div>
  );
}

export default LocationMap;
