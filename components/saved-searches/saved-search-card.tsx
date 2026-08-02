"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, MapPin, DollarSign, Building, ShieldCheck, Play, Edit2, Copy, Trash2, Calendar, Check, X } from "lucide-react";
import { SavedSearch, SavedSearchService, buildSearchSummary } from "@/services/saved-searches";
import { showToast } from "@/lib/toast";

interface SavedSearchCardProps {
  search: SavedSearch;
  onUpdate: () => void;
}

export function SavedSearchCard({ search, onUpdate }: SavedSearchCardProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState(search.name);

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    SavedSearchService.renameSearch(search.id, editName.trim());
    showToast.success("Search Renamed", `Search updated to "${editName.trim()}".`);
    setIsEditing(false);
    onUpdate();
  };

  const handleDelete = () => {
    SavedSearchService.deleteSearch(search.id);
    showToast.info("Search Deleted", `Deleted "${search.name}".`);
    onUpdate();
  };

  const handleDuplicate = () => {
    const dup = SavedSearchService.duplicateSearch(search.id);
    if (dup) {
      showToast.success("Search Duplicated", `Created "${dup.name}".`);
      onUpdate();
    }
  };

  const buildSearchUrl = () => {
    const params = new URLSearchParams();
    if (search.location) params.set("location", search.location);
    if (search.propertyType) params.set("propertyType", search.propertyType);
    if (search.gender) params.set("gender", search.gender);
    if (search.sharingType) params.set("sharingType", search.sharingType);
    if (search.minRent) params.set("minRent", search.minRent.toString());
    if (search.maxRent) params.set("maxRent", search.maxRent.toString());
    return `/search?${params.toString()}`;
  };

  const formattedDate = new Date(search.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/80 p-5 sm:p-6 rounded-3xl shadow-premium flex flex-col justify-between gap-5 text-left group hover:border-primary/40 transition-all select-none"
    >
      <div className="space-y-4">
        {/* Header: Title or Rename Input */}
        <div className="flex items-start justify-between gap-3">
          {isEditing ? (
            <form onSubmit={handleRename} className="flex items-center gap-2 flex-1">
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 bg-background border border-border/80 rounded-xl px-3 py-1.5 text-xs font-heading font-bold text-primary focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                data-no-intercept="true"
                className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-secondary cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                data-no-intercept="true"
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div className="space-y-1">
              <span className="font-heading text-[10px] font-extrabold uppercase tracking-widest text-secondary flex items-center gap-1">
                <Bookmark className="w-3 h-3" /> Saved Search
              </span>
              <h3 className="font-heading text-base font-extrabold text-primary tracking-tight">
                {search.name}
              </h3>
              <p className="font-body text-xs text-muted-foreground/80 font-medium">
                {search.querySummary || buildSearchSummary(search)}
              </p>
            </div>
          )}

          <span className="text-[10px] font-body text-muted-foreground flex items-center gap-1 shrink-0">
            <Calendar className="w-3 h-3 text-muted-foreground/60" />
            {formattedDate}
          </span>
        </div>

        {/* Filter Badges Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-body">
          {search.location && (
            <div className="bg-muted/30 border border-border/60 p-2 rounded-xl flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span className="truncate">{search.location}</span>
            </div>
          )}

          {(search.minRent || search.maxRent) && (
            <div className="bg-muted/30 border border-border/60 p-2 rounded-xl flex items-center gap-1.5 text-muted-foreground">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">₹{search.minRent || 0} - ₹{search.maxRent || "20k+"}</span>
            </div>
          )}

          {search.propertyType && (
            <div className="bg-muted/30 border border-border/60 p-2 rounded-xl flex items-center gap-1.5 text-muted-foreground">
              <Building className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{search.propertyType}</span>
            </div>
          )}

          {search.gender && (
            <div className="bg-muted/30 border border-border/60 p-2 rounded-xl flex items-center gap-1.5 text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span className="truncate">{search.gender}</span>
            </div>
          )}

          {search.sharingType && (
            <div className="bg-muted/30 border border-border/60 p-2 rounded-xl flex items-center gap-1.5 text-muted-foreground">
              <span className="font-bold text-primary">👥</span>
              <span className="truncate">{search.sharingType} Sharing</span>
            </div>
          )}
        </div>

        {/* Amenities Pills */}
        {search.amenities && search.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {search.amenities.map((amenity, idx) => (
              <span
                key={idx}
                className="bg-primary/5 text-primary border border-primary/15 text-[10px] font-extrabold px-2 py-0.5 rounded-md"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
        <Link
          href={buildSearchUrl()}
          className="bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground px-4 py-2 rounded-xl font-heading text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Run Search</span>
        </Link>

        <div className="flex items-center gap-1">
          <button
            type="button"
            data-no-intercept="true"
            onClick={() => setIsEditing(true)}
            title="Rename Search"
            className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-muted/60 transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            data-no-intercept="true"
            onClick={handleDuplicate}
            title="Duplicate Search"
            className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-muted/60 transition-colors cursor-pointer"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            type="button"
            data-no-intercept="true"
            onClick={handleDelete}
            title="Delete Search"
            className="p-2 rounded-xl text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
