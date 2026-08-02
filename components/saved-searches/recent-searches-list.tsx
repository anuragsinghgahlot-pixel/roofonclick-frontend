"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { History, Play, Bookmark, Trash2, Clock } from "lucide-react";
import { RecentSearchItem, SearchHistoryService } from "@/services/search-history";
import { SaveSearchModal } from "@/components/saved-searches/save-search-modal";
import { showToast } from "@/lib/toast";

export function RecentSearchesList({ onSaveSuccess }: { onSaveSuccess?: () => void }) {
  const [historyItems, setHistoryItems] = React.useState<RecentSearchItem[]>([]);
  const [saveModalTarget, setSaveModalTarget] = React.useState<RecentSearchItem | null>(null);

  const refreshHistory = React.useCallback(() => {
    setHistoryItems(SearchHistoryService.getRecentSearches());
  }, []);

  React.useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const handleDeleteItem = (id: string, summary: string) => {
    SearchHistoryService.deleteRecentSearch(id);
    showToast.info("Removed from History", `Removed "${summary}".`);
    refreshHistory();
  };

  const handleClearAll = () => {
    SearchHistoryService.clearSearchHistory();
    showToast.info("History Cleared", "Search history has been cleared.");
    refreshHistory();
  };

  if (historyItems.length === 0) return null;

  return (
    <div className="space-y-4 text-left border-t border-border/60 pt-8 mt-8">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            Activity Log
          </span>
          <h3 className="font-heading text-lg font-extrabold text-primary tracking-tight">
            Recent Searches
          </h3>
        </div>

        <button
          type="button"
          data-no-intercept="true"
          onClick={handleClearAll}
          className="text-xs font-heading font-bold text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
        >
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <AnimatePresence>
          {historyItems.map((item) => {
            const searchUrl = `/search?location=${encodeURIComponent(item.location || "")}&propertyType=${encodeURIComponent(item.propertyType || "")}&gender=${encodeURIComponent(item.gender || "")}`;
            const formattedTime = new Date(item.timestamp).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-card/70 border border-border/70 p-3.5 rounded-2xl flex items-center justify-between gap-3 hover:border-primary/40 transition-all select-none"
              >
                <div className="space-y-0.5 flex-1 min-w-0">
                  <h4 className="font-heading text-xs font-bold text-primary truncate">
                    {item.querySummary}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] font-body text-muted-foreground">
                    <Clock className="w-3 h-3 text-muted-foreground/60" />
                    <span>{formattedTime}</span>
                    {item.location && <span>• 📍 {item.location}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={searchUrl}
                    className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
                    title="Run Search Again"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </Link>

                  <button
                    type="button"
                    data-no-intercept="true"
                    onClick={() => setSaveModalTarget(item)}
                    className="p-2 rounded-lg bg-muted/60 text-muted-foreground hover:text-primary hover:bg-muted transition-colors cursor-pointer"
                    title="Save Search"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    data-no-intercept="true"
                    onClick={() => handleDeleteItem(item.id, item.querySummary)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {saveModalTarget && (
        <SaveSearchModal
          isOpen={Boolean(saveModalTarget)}
          onClose={() => setSaveModalTarget(null)}
          filters={{
            location: saveModalTarget.location,
            propertyType: saveModalTarget.propertyType,
            gender: saveModalTarget.gender,
            sharingType: saveModalTarget.sharingType,
            minRent: saveModalTarget.minRent,
            maxRent: saveModalTarget.maxRent,
          }}
          onSaved={() => {
            if (onSaveSuccess) onSaveSuccess();
          }}
        />
      )}
    </div>
  );
}
