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
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGallery, MediaTab } from "@/hooks/use-gallery";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600' fill='none'><rect width='800' height='600' fill='%2318181B'/><path d='M360 260H440V340H360V260Z' stroke='%2352525B' stroke-width='4'/><path d='M400 200L320 280H480L400 200Z' fill='%233F3F46'/><text x='50%25' y='65%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' font-weight='600' fill='%2371717A'>RoofOnClick Property Photo</text></svg>";

export interface GalleryProps {
  /** Array of image URLs to display. */
  images: string[];
  /** Alt text prefix for accessibility */
  altPrefix?: string;
  /** Optional class override for the root wrapper */
  className?: string;
}

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

function SmartImage({ src, alt, className, ...props }: SmartImageProps) {
  const [imgSrc, setImgSrc] = React.useState<string>(src);
  const [hasError, setHasError] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!src) {
      setHasError(true);
      setImgSrc(FALLBACK_IMAGE);
    } else {
      setImgSrc(src);
      setHasError(false);
    }
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(FALLBACK_IMAGE);
    }
  };

  if (!imgSrc) return null;

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={cn("w-full h-full object-cover", className)}
      {...props}
    />
  );
}

// ─── Lightbox Fullscreen Modal ───────────────────────────────────────────────

interface LightboxModalProps {
  images: string[];
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
  const currentList = images;

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
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
        {/* Left: Counter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md text-white font-heading text-xs font-bold">
            <Camera className="w-3.5 h-3.5" />
            <span>Photos ({images.length})</span>
          </div>

          <span className="text-white/70 font-heading text-xs font-bold hidden sm:inline-block">
            {currentIndex + 1} / {currentList.length}
          </span>
        </div>

        {/* Right: Zoom & Close Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-white/10 p-1 rounded-xl backdrop-blur-md">
            <button
              type="button"
              onClick={onZoomOut}
              disabled={zoomLevel <= 1}
              title="Zoom Out (-)"
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-white font-mono text-xs px-2 font-semibold">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={onZoomIn}
              disabled={zoomLevel >= 3}
              title="Zoom In (+)"
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            {zoomLevel > 1 && (
              <button
                type="button"
                onClick={onResetZoom}
                title="Reset Zoom (0)"
                className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Close Lightbox (Esc)"
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Main Media Display Area ── */}
      <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden">
        {/* Previous Button */}
        {currentList.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            title="Previous (Left Arrow)"
            className="absolute left-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-90"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {currentList.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            title="Next (Right Arrow)"
            className="absolute right-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-90"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Active Media Item */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`img-${currentIndex}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: zoomLevel }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="relative flex items-center justify-center max-w-full max-h-full cursor-zoom-in"
            onClick={(e) => {
              e.stopPropagation();
              onToggleZoom();
            }}
          >
            <SmartImage
              src={currentList[currentIndex] || FALLBACK_IMAGE}
              alt={`${altPrefix} ${currentIndex + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl transition-transform duration-200"
            />
          </motion.div>
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
                "relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer",
                idx === currentIndex
                  ? "border-primary scale-105 shadow-md"
                  : "border-transparent opacity-50 hover:opacity-100"
              )}
            >
              <SmartImage
                src={src}
                alt={`Thumbnail ${idx + 1}`}
              />
            </button>
          ))}
        </div>

        <span className="text-white/50 text-[10px] font-body">
          Use ← → arrow keys to navigate, Esc to close
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main Advanced Gallery Component ─────────────────────────────────────────

export function Gallery({
  images = [],
  altPrefix = "Property photo",
  className,
}: GalleryProps) {
  const gallery = useGallery({ images });

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

  if (totalPhotos === 0) {
    return (
      <div className={cn("w-full h-64 rounded-3xl bg-muted flex flex-col items-center justify-center gap-2 text-muted-foreground border border-border/60", className)}>
        <ImageIcon className="w-10 h-10 stroke-1" />
        <span className="font-heading text-xs font-semibold">No photos available</span>
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* ── Desktop Grid Layout ── */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2.5 h-[440px] rounded-3xl overflow-hidden shadow-premium">
        {/* Large Featured Primary Image */}
        <div
          className="col-span-2 row-span-2 relative group overflow-hidden cursor-pointer bg-muted"
          onClick={() => gallery.open(0)}
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
              gallery.open(0);
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
              onClick={() => gallery.open(photoIndex)}
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
              onClick={() => gallery.open(i)}
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
