"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Portal } from "./portal";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
}: ModalProps) {
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
          {/* Backdrop Scrim */}
          <div className="fixed inset-0 z-backdrop flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className={cn(
                "relative bg-card border border-border/80 rounded-[28px] shadow-2xl p-6 sm:p-8 max-w-md w-full z-modal max-h-[90vh] overflow-y-auto text-left",
                className
              )}
            >
              {showCloseButton && (
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={onClose}
                  className="absolute top-5 right-5 p-2 rounded-xl bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer z-10"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {children}
            </motion.div>
          </div>
        </Portal>
      )}
    </AnimatePresence>
  );
}
