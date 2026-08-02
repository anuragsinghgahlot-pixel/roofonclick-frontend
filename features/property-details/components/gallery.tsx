"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  X,
  Grid2x2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGallery, MediaTab } from "@/hooks/use-gallery";

// Fallback image placeholder when an image fails to load
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";

export interface GalleryProps {
  /** Array of image URLs to display. */
  images: string[];
  /** Optional array of video URLs to display. */
  videos?: string[];
  /** Alt text prefix for accessibility */
  altPrefix?: string;
  /** Optional class override for the root wrapper */
  className?: string;
}

// ─── Skeleton Component ────────────────────────────────────────────────────────

function GallerySkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted/70 rounded-xl flex items-center justify-center",
        className
      )}
    >
      <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
    </div>
  );
}

// ─── Smart Image Component with Lazy Loading & Error Fallback ──────────────────

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  onClick?: () => void;
  onDoubleClick?: () => void;
}

function SmartImage({ src, alt, className, loading = "lazy", onClick, onDoubleClick }: SmartImageProps) {
  const [imageSrc, setImageSrc] = React.useState(src);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  return (
    <div className={cn("relative w-full h-full overflow-hidden bg-muted/40", className)}>
      {!isLoaded && !hasError && (
        <GallerySkeleton className="absolute inset-0 z-10 rounded-none" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
          setImageSrc(FALLBACK_IMAGE);
        }}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        className={cn(
          "w-full h-full object-cover transition-all duration-500",
          !isLoaded ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}
      />
    </div>
  );
}

// ─── Fullscreen Lightbox Modal ──────────────────────────────────────────────────

export interface LightboxModalProps {
  images: string[];
  videos: string[];
  activeTab: MediaTab;
  setActiveTab: (tab: MediaTab) => void;
  currentIndex: number;
  zoomLevel: number;
  altPrefix: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleZoom: () => void;
}

export function LightboxModal({
  images,
  videos,
  activeTab,
  setActiveTab,
  currentIndex,
  zoomLevel,
  altPrefix,
  onClose,
  onPrev,
  onNext,
  onGoTo,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleZoom,
}: LightboxModalProps) {
  const currentList = activeTab === "photos" ? images : videos;
  const isVideo = activeTab === "videos";

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (isVideo) return;
    if (e.deltaY < 0) {
      onZoomIn();
    } else {
      onZoomOut();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between select-none"
      onClick={onClose}
      onWheel={handleWheel}
    >
      {/* ── Top Header Toolbar ── */}
      <div
        className="w-full flex items-center justify-between p-4 sm:p-6 z-20 bg-gradient-to-b from-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Tab switchers & counter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActiveTab("photos")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                activeTab === "photos"
                  ? "bg-white text-black shadow-md"
                  : "text-white/70 hover:text-white"
              )}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Photos ({images.length})</span>
            </button>
            {videos.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab("videos")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                  activeTab === "videos"
                    ? "bg-white text-black shadow-md"
                    : "text-white/70 hover:text-white"
                )}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Videos ({videos.length})</span>
              </button>
            )}
          </div>

          <span className="text-white/70 font-heading text-xs font-bold hidden sm:inline-block">
            {currentIndex + 1} / {currentList.length}
          </span>
        </div>

        {/* Right: Zoom controls & Close */}
        <div className="flex items-center gap-2">
          {!isVideo && (
            <div className="hidden sm:flex items-center gap-1 bg-white/10 p-1 rounded-xl backdrop-blur-md border border-white/10">
              <button
                type="button"
                onClick={onZoomOut}
                disabled={zoomLevel <= 1}
                className="p-1.5 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-white/90 font-heading text-[11px] font-bold px-2">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={onZoomIn}
                disabled={zoomLevel >= 3}
                className="p-1.5 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              {zoomLevel > 1 && (
                <button
                  type="button"
                  onClick={onResetZoom}
                  className="p-1.5 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
                  title="Reset Zoom (0)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Main Content Viewport ── */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden p-4">
        {/* Navigation Arrow Left */}
        {currentList.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/25 backdrop-blur-md rounded-full text-white transition-all cursor-pointer z-30 shadow-lg"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Navigation Arrow Right */}
        {currentList.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/25 backdrop-blur-md rounded-full text-white transition-all cursor-pointer z-30 shadow-lg"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Image / Video Display */}
        <AnimatePresence mode="wait">
          {!isVideo ? (
            <motion.div
              key={`img-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: zoomLevel }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="max-w-[90vw] max-h-[75vh] flex items-center justify-center cursor-zoom-in"
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={onToggleZoom}
            >
              <img
                src={currentList[currentIndex] || FALLBACK_IMAGE}
                alt={`${altPrefix} ${currentIndex + 1}`}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl transition-transform duration-200"
              />
            </motion.div>
          ) : (
            <motion.div
              key={`vid-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={currentList[currentIndex]}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom Filmstrip Thumbnail Navigation ── */}
      <div
        className="w-full p-4 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 overflow-x-auto max-w-full px-4 py-2 scrollbar-hide">
          {currentList.map((src, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onGoTo(idx)}
              className={cn(
                "relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer",
                idx === currentIndex
                  ? "border-primary scale-105 shadow-md"
                  : "border-transparent opacity-50 hover:opacity-100"
              )}
            >
              {!isVideo ? (
                <img src={src} alt="thumbnail" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted/40 flex items-center justify-center text-white">
                  <Play className="w-5 h-5 fill-current" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Advanced Gallery Component ─────────────────────────────────────────

export function Gallery({
  images = [],
  videos = [],
  altPrefix = "Property photo",
  className,
}: GalleryProps) {
  const gallery = useGallery({ images, videos });

  const totalPhotos = images.length;
  const featuredImage = images[0] || FALLBACK_IMAGE;
  const sideImages = images.slice(1, 5);
  const extraCount = Math.max(0, totalPhotos - 5);

  // Mobile scroll reference for swipe detection
  const mobileScrollRef = React.useRef<HTMLDivElement>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = React.useState(0);

  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    const scrollLeft = mobileScrollRef.current.scrollLeft;
    const itemWidth = mobileScrollRef.current.offsetWidth * 0.85;
    setMobileActiveIndex(Math.round(scrollLeft / itemWidth));
  };

  if (!images.length) {
    return (
      <div className={cn("w-full", className)}>
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-2xl overflow-hidden">
          <GallerySkeleton className="col-span-2 row-span-2 rounded-none rounded-l-2xl" />
          <GallerySkeleton className="rounded-none" />
          <GallerySkeleton className="rounded-none rounded-tr-2xl" />
          <GallerySkeleton className="rounded-none" />
          <GallerySkeleton className="rounded-none rounded-br-2xl" />
        </div>
        <div className="md:hidden flex gap-3 overflow-hidden">
          <GallerySkeleton className="shrink-0 w-[85%] aspect-[4/3] rounded-2xl" />
          <GallerySkeleton className="shrink-0 w-[85%] aspect-[4/3] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Media Tabs Header (if videos exist) */}
      {videos.length > 0 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => gallery.setActiveTab("photos")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl font-heading text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
              gallery.activeTab === "photos"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 hover:bg-muted text-muted-foreground"
            )}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photos ({images.length})</span>
          </button>
          <button
            type="button"
            onClick={() => gallery.setActiveTab("videos")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl font-heading text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
              gallery.activeTab === "videos"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 hover:bg-muted text-muted-foreground"
            )}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Videos ({videos.length})</span>
          </button>
        </div>
      )}

      {/* ── Desktop Grid Layout ── */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2.5 h-[440px] rounded-3xl overflow-hidden shadow-premium">
        {/* Large Featured Primary Image */}
        <div
          className="col-span-2 row-span-2 relative group overflow-hidden cursor-pointer bg-muted"
          onClick={() => gallery.open(0, "photos")}
        >
          <SmartImage
            src={featuredImage}
            alt={`${altPrefix} — primary`}
            loading="eager"
            className="group-hover:scale-105 transition-transform duration-500"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

          {/* Photo Count Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white shadow-sm">
            <Camera className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">{totalPhotos} Photos</span>
          </div>

          {/* View All Photos Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              gallery.open(0, "photos");
            }}
            className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/95 hover:bg-white text-primary font-heading text-xs font-bold shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
          >
            <Grid2x2 className="w-4 h-4" />
            <span>View All Photos</span>
          </button>
        </div>

        {/* 4 Secondary Images Grid */}
        {sideImages.map((src, i) => {
          const isLast = i === sideImages.length - 1;
          const photoIndex = i + 1;

          return (
            <div
              key={i}
              className="relative group overflow-hidden cursor-pointer bg-muted"
              onClick={() => gallery.open(photoIndex, "photos")}
            >
              <SmartImage
                src={src}
                alt={`${altPrefix} ${photoIndex + 1}`}
                className="group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />

              {/* +X More Photos Overlay */}
              {isLast && extraCount > 0 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white pointer-events-none space-y-0.5">
                  <span className="font-heading text-2xl font-extrabold">+ {extraCount}</span>
                  <span className="font-heading text-[10px] font-bold uppercase tracking-wider text-white/80">
                    More Photos
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Mobile Swipeable Carousel ── */}
      <div className="md:hidden space-y-2">
        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-1"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="snap-center shrink-0 w-[92vw] sm:w-[88%] aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer relative group bg-muted shadow-md"
              onClick={() => gallery.open(i, "photos")}
            >
              <SmartImage
                src={src}
                alt={`${altPrefix} ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
              />

              {/* Counter badge on top right */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full font-heading text-[10px] font-extrabold tracking-wider">
                {i + 1} / {images.length}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Dot Indicators */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {images.slice(0, 8).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === mobileActiveIndex ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </div>

      {/* ── Fullscreen Lightbox Modal ── */}
      <AnimatePresence>
        {gallery.isFullscreen && (
          <LightboxModal
            images={images}
            videos={videos}
            activeTab={gallery.activeTab}
            setActiveTab={gallery.setActiveTab}
            currentIndex={gallery.currentIndex}
            zoomLevel={gallery.zoomLevel}
            altPrefix={altPrefix}
            onClose={gallery.close}
            onPrev={gallery.prev}
            onNext={gallery.next}
            onGoTo={gallery.goTo}
            onZoomIn={gallery.zoomIn}
            onZoomOut={gallery.zoomOut}
            onResetZoom={gallery.resetZoom}
            onToggleZoom={gallery.toggleZoom}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Gallery;
