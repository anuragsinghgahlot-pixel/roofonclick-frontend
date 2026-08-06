"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Share2, Mail, Send } from "lucide-react";
import { copyToClipboard, getSocialShareLinks, ShareData } from "@/lib/share-utils";
import { cn } from "@/lib/utils";

import { Portal } from "@/components/shared/portal";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareData: ShareData;
}

export function ShareModal({ isOpen, onClose, shareData }: ShareModalProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  const url = shareData.url || (typeof window !== "undefined" ? window.location.href : "");
  const title = shareData.title || "Check out this property on RoofOnClick";
  const text = shareData.text || `Verified room rental accommodation: ${title}`;

  const socialLinks = getSocialShareLinks(url, title, text);

  const handleCopy = async () => {
    const success = await copyToClipboard(url);
    if (success) {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card border border-border/80 p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-premium text-left space-y-6 relative"
        >
          {/* Close Button */}
          <button
            type="button"
            data-no-intercept="true"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="space-y-1">
            <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-1.5">
              <Share2 className="w-4 h-4" />
              Spread The Word
            </span>
            <h3 className="font-heading text-xl font-extrabold text-primary">
              Share Property
            </h3>
            <p className="font-body text-xs text-muted-foreground truncate">
              {title}
            </p>
          </div>

          {/* Social Share Grid */}
          <div className="space-y-2">
            <span className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block pl-0.5">
              Share via Social Media
            </span>
            <div className="grid grid-cols-5 gap-2">
              {/* WhatsApp */}
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-600 transition-all cursor-pointer group"
                title="Share on WhatsApp"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">💬</span>
                <span className="font-heading text-[9px] font-bold">WhatsApp</span>
              </a>

              {/* Telegram */}
              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-600 transition-all cursor-pointer group"
                title="Share on Telegram"
              >
                <Send className="w-5 h-5 text-sky-500 group-hover:scale-110 transition-transform" />
                <span className="font-heading text-[9px] font-bold">Telegram</span>
              </a>

              {/* Facebook */}
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-600 transition-all cursor-pointer group"
                title="Share on Facebook"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">📘</span>
                <span className="font-heading text-[9px] font-bold">Facebook</span>
              </a>

              {/* X / Twitter */}
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-foreground/10 hover:bg-foreground/20 border border-foreground/20 text-foreground transition-all cursor-pointer group"
                title="Share on X"
              >
                <span className="font-heading font-extrabold text-sm group-hover:scale-110 transition-transform">𝕏</span>
                <span className="font-heading text-[9px] font-bold">Twitter / X</span>
              </a>

              {/* Email */}
              <a
                href={socialLinks.email}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-muted/60 hover:bg-muted border border-border text-foreground transition-all cursor-pointer group"
                title="Share via Email"
              >
                <Mail className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-heading text-[9px] font-bold">Email</span>
              </a>
            </div>
          </div>

          {/* Copy Link Section */}
          <div className="space-y-1.5 pt-2 border-t border-border/50">
            <label className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-primary pl-0.5">
              Direct Property Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={url}
                className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2.5 text-xs font-body text-muted-foreground focus:outline-none select-all truncate"
              />
              <button
                type="button"
                data-no-intercept="true"
                onClick={handleCopy}
                className={cn(
                  "px-4 py-2.5 rounded-xl font-heading text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0 flex items-center gap-1.5",
                  hasCopied
                    ? "bg-emerald-600 text-white"
                    : "bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {hasCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  </Portal>
);
}
