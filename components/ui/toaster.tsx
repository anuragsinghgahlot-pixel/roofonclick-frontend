"use client";

import { Toaster as SonnerToaster } from "sonner";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, Loader2 } from "lucide-react";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      visibleToasts={4}
      duration={4000}
      closeButton
      richColors={false}
      className="toaster group font-body"
      style={{
        top: "var(--navbar-height, 5rem)",
      }}
      toastOptions={{
        unstyled: true,
        className:
          "group flex items-center gap-3 w-full p-4 rounded-2xl bg-card/95 border border-border/80 shadow-[0_16px_36px_-8px_rgba(15,28,22,0.12)] backdrop-blur-xl text-left select-none transition-all duration-300 pointer-events-auto",
        classNames: {
          toast: "font-body text-xs leading-snug text-foreground",
          title: "font-heading font-bold text-xs text-primary block mb-0.5",
          description: "font-body text-xs text-muted-foreground leading-relaxed",
          actionButton:
            "bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer",
          cancelButton:
            "bg-muted text-muted-foreground text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-muted/80 transition-colors cursor-pointer",
          closeButton:
            "bg-muted/50 hover:bg-muted text-muted-foreground border-none rounded-full transition-colors p-1",
        },
      }}
      icons={{
        success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
        error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
        info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
        loading: <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />,
      }}
    />
  );
}
