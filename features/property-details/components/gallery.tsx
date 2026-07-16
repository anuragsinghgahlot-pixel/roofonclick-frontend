"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight, X, Grid2x2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface GalleryProps {
  /** Array of image URLs to display. First image is the featured (large) image. */
  images: string[];
  /** Alt text prefix for accessibility (defaults to "Property photo") */
  altPrefix?: string;
  /** Optional class override for the root wrapper */
  className?: string;
}

// ─── Animation Variants ────────────────────────────────────────────────────────

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

// ─── Skeleton Placeholder ──────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted/60 rounded-xl",
        className
      )}
    />
  );
}

// ─── Gallery Image ─────────────────────────────────────────────────────────────

interface GalleryImageProps {
  src: string;
  alt: string;
  index: number;
  className?: string;
  overlay?: React.ReactNode;
  onClick?: () => void;
}

function GalleryImage({ src, alt, index, className, overlay, onClick }: GalleryImageProps) {
  return (
    <motion.div
      custom={index}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className={cn(
        "group relative overflow-hidden cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        loading={index === 0 ? "eager" : "lazy"}
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
      {overlay}
    </motion.div>
  );
}

// ─── Lightbox ──────────────────────────────────────────────────────────────────

interface LightboxProps {
  images: string[];
  altPrefix: string;
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ images, altPrefix, currentIndex, onClose, onPrev, onNext }: LightboxProps) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer focus:outline-none z-10"
        aria-label="Close gallery"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-5 text-white/70 font-heading text-sm font-bold z-10">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Prev */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer focus:outline-none z-10"
        aria-label="Previous photo"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer focus:outline-none z-10"
        aria-label="Next photo"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${altPrefix} ${currentIndex + 1}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Mobile Swipeable Gallery ──────────────────────────────────────────────────

interface MobileGalleryProps {
  images: string[];
  altPrefix: string;
  onImageClick: (i: number) => void;
}

function MobileGallery({ images, altPrefix, onImageClick }: MobileGalleryProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const itemWidth = scrollRef.current.offsetWidth * 0.85;
    setActiveIndex(Math.round(scrollLeft / itemWidth));
  };

  return (
    <div className="md:hidden flex flex-col gap-3">
      {/* Swipeable strip */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1 -mx-4 px-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {images.map((src, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="snap-center shrink-0 w-[85%] aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group relative"
            onClick={() => onImageClick(i)}
          >
            <img
              src={src}
              alt={`${altPrefix} ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </motion.div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5">
        {images.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === activeIndex
                ? "w-6 bg-primary"
                : "w-1.5 bg-muted-foreground/30"
            )}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

export function Gallery({ images, altPrefix = "Property photo", className }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  const totalPhotos = images.length;
  const featuredImage = images[0];
  const sideImages = images.slice(1, 5);
  const extraCount = Math.max(0, totalPhotos - 5);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + totalPhotos) % totalPhotos : null));
  const nextImage = () =>
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % totalPhotos : null));

  // ── Empty / Skeleton state ──
  if (!images.length) {
    return (
      <div className={cn("w-full", className)}>
        {/* Desktop skeleton */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-xl overflow-hidden">
          <Skeleton className="col-span-2 row-span-2 rounded-none rounded-l-xl" />
          <Skeleton className="rounded-none" />
          <Skeleton className="rounded-none rounded-tr-xl" />
          <Skeleton className="rounded-none" />
          <Skeleton className="rounded-none rounded-br-xl" />
        </div>
        {/* Mobile skeleton */}
        <div className="md:hidden flex gap-3 overflow-hidden">
          <Skeleton className="shrink-0 w-[85%] aspect-[4/3]" />
          <Skeleton className="shrink-0 w-[85%] aspect-[4/3]" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* ── Desktop Layout ── */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-xl overflow-hidden">
        {/* Featured Image — spans left half */}
        <GalleryImage
          src={featuredImage}
          alt={`${altPrefix} — featured`}
          index={0}
          className="col-span-2 row-span-2 rounded-l-xl"
          onClick={() => openLightbox(0)}
          overlay={
            <>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* Photo count badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/15 text-white">
                <Camera className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">{totalPhotos} Photos</span>
              </div>

              {/* View All Photos button */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); openLightbox(0); }}
                className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 hover:bg-white text-primary text-xs font-heading font-bold shadow-lg transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none"
              >
                <Grid2x2 className="w-3.5 h-3.5" />
                View All Photos
              </button>
            </>
          }
        />

        {/* Side Images — 2×2 grid */}
        {sideImages.map((src, i) => {
          const isTopRight = i === 1;
          const isBottomRight = i === 3;
          const isLast = i === sideImages.length - 1;

          return (
            <GalleryImage
              key={i}
              src={src}
              alt={`${altPrefix} ${i + 2}`}
              index={i + 1}
              className={cn(
                isTopRight && "rounded-tr-xl",
                isBottomRight && "rounded-br-xl"
              )}
              onClick={() => openLightbox(i + 1)}
              overlay={
                isLast && extraCount > 0 ? (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                    <span className="font-heading text-2xl font-extrabold text-white">
                      +{extraCount}
                    </span>
                  </div>
                ) : undefined
              }
            />
          );
        })}
      </div>

      {/* ── Mobile Layout ── */}
      <MobileGallery images={images} altPrefix={altPrefix} onImageClick={openLightbox} />

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            altPrefix={altPrefix}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Gallery;
