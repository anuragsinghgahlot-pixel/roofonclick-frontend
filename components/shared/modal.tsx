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
  title?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  showCloseButton?: boolean;
  /**
   * - "centered": Standard centered dialog layout for small/medium popups.
   * - "large": Wide 80vh dialog layout (max 1100px) with compact sticky header, 24px padded scrollable body, and light-shadowed sticky footer.
   */
  variant?: "centered" | "large";
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  footer,
  className,
  bodyClassName,
  showCloseButton = true,
  variant = "centered",
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

  const isLarge = variant === "large";

  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          {/* Backdrop Scrim */}
          <div
            className={cn(
              "fixed inset-0 z-backdrop flex justify-center p-4 sm:p-6",
              isLarge
                ? "items-center pt-24 pb-6"
                : "items-center"
            )}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className={cn(
                "relative bg-card border border-border/80 rounded-3xl sm:rounded-[28px] shadow-2xl w-full z-modal text-left flex flex-col overflow-hidden",
                isLarge
                  ? "h-[calc(100vh-160px)] max-h-[calc(100vh-160px)] max-w-[1100px]"
                  : "max-h-[90vh] max-w-md p-6 sm:p-8",
                className
              )}
            >
              {/* Compact Sticky Header (24px padding) */}
              {title ? (
                <div className="px-6 py-4.5 border-b border-border/60 flex items-center justify-between shrink-0 bg-card z-10">
                  <div className="min-w-0 pr-4">{title}</div>
                  {showCloseButton && (
                    <button
                      type="button"
                      data-no-intercept="true"
                      onClick={onClose}
                      className="p-2 rounded-xl bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer shrink-0"
                      aria-label="Close modal"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                showCloseButton && (
                  <button
                    type="button"
                    data-no-intercept="true"
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-xl bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer z-10"
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )
              )}

              {/* Scrollable Body (24px padding) */}
              <div
                className={cn(
                  "flex-1 overflow-y-auto",
                  isLarge ? "p-6 sm:p-8" : "",
                  bodyClassName
                )}
              >
                {children}
              </div>

              {/* Sticky Footer (Top border, light shadow, 20–24px padding) */}
              {footer && (
                <div className="px-6 py-5 border-t border-border/60 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] shrink-0 bg-card z-10">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </Portal>
      )}
    </AnimatePresence>
  );
}
