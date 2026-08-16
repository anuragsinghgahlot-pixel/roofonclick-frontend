"use client";

import * as React from "react";

export type MediaTab = "photos";

export interface MediaItem {
  id?: string;
  type: "image";
  url: string;
  poster?: string;
  title?: string;
}

export interface UseGalleryOptions {
  images?: string[];
  videos?: string[];
  initialIndex?: number;
  initialTab?: MediaTab;
}

export function useGallery({
  images = [],
  initialIndex = 0,
}: UseGalleryOptions) {
  const [activeTab, setActiveTab] = React.useState<MediaTab>("photos");
  const [currentIndex, setCurrentIndex] = React.useState<number>(initialIndex);
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = React.useState<number>(1);

  const totalItems = images.length;

  const open = React.useCallback((index: number = 0) => {
    setActiveTab("photos");
    setCurrentIndex(index);
    setZoomLevel(1);
    setIsFullscreen(true);
  }, []);

  const close = React.useCallback(() => {
    setIsFullscreen(false);
    setZoomLevel(1);
  }, []);

  const next = React.useCallback(() => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (totalItems > 0 ? (prev + 1) % totalItems : 0));
  }, [totalItems]);

  const prev = React.useCallback(() => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (totalItems > 0 ? (prev - 1 + totalItems) % totalItems : 0));
  }, [totalItems]);

  const goTo = React.useCallback((index: number) => {
    setZoomLevel(1);
    setCurrentIndex(index);
  }, []);

  const zoomIn = React.useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  }, []);

  const zoomOut = React.useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  }, []);

  const resetZoom = React.useCallback(() => {
    setZoomLevel(1);
  }, []);

  const toggleZoom = React.useCallback(() => {
    setZoomLevel((prev) => (prev > 1 ? 1 : 2));
  }, []);

  // Keyboard navigation & zoom shortcuts
  React.useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      } else if (e.key === "ArrowRight") {
        next();
      } else if (e.key === "ArrowLeft") {
        prev();
      } else if (e.key === "+" || e.key === "=") {
        zoomIn();
      } else if (e.key === "-") {
        zoomOut();
      } else if (e.key === "0") {
        resetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isFullscreen, close, next, prev, zoomIn, zoomOut, resetZoom]);

  return {
    activeTab,
    setActiveTab,
    currentIndex,
    setCurrentIndex,
    isFullscreen,
    zoomLevel,
    setZoomLevel,
    totalItems,
    open,
    close,
    next,
    prev,
    goTo,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleZoom,
  };
}
