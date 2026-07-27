"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Portal } from "./portal";
import { cn } from "@/lib/utils";

export interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  onWheel?: (e: React.WheelEvent) => void;
}

export function FullscreenModal({
  isOpen,
  onClose,
  children,
  className,
  onClick,
  onWheel,
}: FullscreenModalProps) {
  // Lock body scrolling and bind ESC key listener
  React.useEffect(() => {
    if (!isOpen) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClick}
            onWheel={onWheel}
            className={cn(
              "fixed inset-0 z-gallery bg-black/95 backdrop-blur-md flex flex-col justify-between select-none",
              className
            )}
          >
            {children}
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  );
}
