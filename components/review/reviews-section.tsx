"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShieldCheck,
  Search,
  ThumbsUp,
  MessageSquare,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Camera,
  Filter,
} from "lucide-react";
import { Review, ReviewService } from "@/services/reviews";
import { EmptyState } from "@/components/shared/empty-state";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface ReviewsSectionProps {
  propertyId?: string;
  className?: string;
}

type FilterType =
  | "All"
  | "Newest"
  | "Highest Rated"
  | "Lowest Rated"
  | "With Photos"
  | "Verified Stay"
  | "5★"
  | "4★"
  | "3★";

import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { WriteReviewModal } from "./write-review-modal";
import { PenSquare, Lock } from "lucide-react";

export function ReviewsSection({ propertyId = "p1", className }: ReviewsSectionProps) {
  const router = useRouter();
  const { user, role } = useAuth();
  const isOwner = user !== null && (user.role === "owner" || role === "owner");
  const isAuthenticated = user !== null;

  // Check if buyer has completed a verified stay
  const hasVerifiedStay = true; // Buyers can submit reviews for verified bookings

  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [summary, setSummary] = React.useState<{ overallRating: number; totalReviews: number; totalVerifiedReviews: number; categoryBreakdown: Record<string, number> } | null>(null);
  const [activeFilter, setActiveFilter] = React.useState<FilterType>("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [visibleCount, setVisibleCount] = React.useState(3);
  const [activeLightboxImg, setActiveLightboxImg] = React.useState<string | null>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = React.useState(false);

  const refreshList = React.useCallback(() => {
    const list = ReviewService.getReviewsByPropertyId(propertyId);
    setReviews(list);
    const breakdown = ReviewService.getRatingBreakdown(propertyId);
    setSummary({
      overallRating: breakdown.overallRating,
      totalReviews: breakdown.totalReviews,
      totalVerifiedReviews: list.filter((r) => r.isVerifiedStay).length,
      categoryBreakdown: {},
    });
  }, [propertyId]);

  React.useEffect(() => {
    refreshList();
  }, [refreshList]);

  const handleHelpfulClick = (reviewId: string) => {
    const userEmail = "guest@roofonclick.com";
    ReviewService.incrementHelpfulCount(reviewId, userEmail);
    refreshList();
    showToast.success("Thanks for your feedback!", "Review marked as helpful.");
  };

  const filteredReviews = React.useMemo(() => {
    return reviews.filter((item) => {
      // Filter logic
      if (activeFilter === "With Photos" && (!item.images || item.images.length === 0)) return false;
      if (activeFilter === "Verified Stay" && !item.isVerifiedStay) return false;
      if (activeFilter === "5★" && item.rating !== 5) return false;
      if (activeFilter === "4★" && item.rating !== 4) return false;
      if (activeFilter === "3★" && item.rating !== 3) return false;

      // Search query logic
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const textMatch = item.text.toLowerCase().includes(query);
        const nameMatch = item.userName.toLowerCase().includes(query);
        return textMatch || nameMatch;
      }

      return true;
    });
  }, [reviews, activeFilter, searchQuery]);

  // Sort logic
  const sortedReviews = React.useMemo(() => {
    const list = [...filteredReviews];
    if (activeFilter === "Highest Rated") {
      return list.sort((a, b) => b.rating - a.rating);
    }
    if (activeFilter === "Lowest Rated") {
      return list.sort((a, b) => a.rating - b.rating);
    }
    return list; // Newest by default
  }, [filteredReviews, activeFilter]);

  if (!summary) return null;

  return (
    <div className={cn("space-y-8 text-left", className)}>
      {/* Header Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-heading text-xs font-extrabold uppercase tracking-widest text-secondary flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Tenant Experiences
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
            Reviews & Ratings
          </h2>
        </div>

        {/* Role-based Write Review Button */}
        {!isOwner && (
          <div className="flex flex-col sm:items-end gap-1">
            {!isAuthenticated ? (
              <button
                type="button"
                data-no-intercept="true"
                onClick={() => router.push("/login")}
                className="px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground hover:bg-secondary transition-colors font-heading text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm w-fit"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Login to Write a Review</span>
              </button>
            ) : hasVerifiedStay ? (
              <button
                type="button"
                data-no-intercept="true"
                onClick={() => setIsWriteModalOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground transition-all duration-200 font-heading text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-md w-fit"
              >
                <PenSquare className="w-4 h-4" />
                <span>Write a Review</span>
              </button>
            ) : (
              <div className="space-y-1">
                <button
                  type="button"
                  disabled
                  className="px-5 py-2.5 rounded-2xl bg-muted text-muted-foreground border border-border/60 text-xs font-heading font-bold flex items-center gap-2 cursor-not-allowed w-fit opacity-70"
                >
                  <PenSquare className="w-4 h-4" />
                  <span>Write a Review</span>
                </button>
                <span className="text-[10px] font-body text-muted-foreground block text-left sm:text-right">
                  Reviews can be submitted after a verified stay.
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rating Summary Card */}
      <div className="bg-card/90 border border-border/80 p-6 rounded-3xl shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Overall Score */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-2 border-b lg:border-b-0 lg:border-r border-border/60 pb-6 lg:pb-0 lg:pr-6">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-5xl font-extrabold text-primary tracking-tight">
              {summary.overallRating}
            </span>
            <span className="text-sm font-heading font-bold text-muted-foreground">/ 5.0</span>
          </div>

          <div className="flex items-center gap-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-5 h-5 fill-amber-400 text-amber-400",
                  star > Math.round(summary.overallRating) && "fill-muted text-muted"
                )}
              />
            ))}
          </div>

          <p className="font-body text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Based on <strong className="text-foreground">{summary.totalVerifiedReviews} Verified Reviews</strong>
          </p>
        </div>

        {/* Category Rating Progress Bars */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 font-body text-xs">
          {Object.entries(summary.categoryBreakdown).map(([category, score]) => (
            <div key={category} className="space-y-1">
              <div className="flex justify-between font-semibold text-foreground/90">
                <span className="capitalize">{category.replace(/([A-Z])/g, " $1")}</span>
                <span className="font-bold text-primary">{score.toFixed(1)}</span>
              </div>
              <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full transition-all duration-500"
                  style={{ width: `${(score / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs & Search Box */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-card/60 border border-border/70 p-3 rounded-2xl">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {(["All", "Newest", "Highest Rated", "Lowest Rated", "With Photos", "Verified Stay", "5★", "4★"] as FilterType[]).map((tab) => (
            <button
              key={tab}
              type="button"
              data-no-intercept="true"
              onClick={() => setActiveFilter(tab)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl font-heading text-xs font-bold transition-all shrink-0 cursor-pointer select-none",
                activeFilter === tab
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-60 shrink-0">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border/70 rounded-xl pl-8 pr-3 py-1.5 text-xs font-body text-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Review List */}
      {sortedReviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews found"
          description="No tenant reviews match your active filter or search keywords."
        />
      ) : (
        <div className="space-y-2.5">
          {sortedReviews.slice(0, visibleCount).map((review) => (
            <ReviewCardItem
              key={review.id}
              review={review}
              onHelpfulClick={handleHelpfulClick}
              onLightboxImg={setActiveLightboxImg}
            />
          ))}

          {/* Load More Button */}
          {visibleCount < sortedReviews.length && (
            <div className="text-center pt-2">
              <button
                type="button"
                data-no-intercept="true"
                onClick={() => setVisibleCount((prev) => prev + 3)}
                className="px-6 py-2.5 rounded-2xl bg-card border border-border/80 text-foreground hover:text-primary font-heading text-xs font-bold transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
              >
                <span>Load More Reviews</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Preview Modal */}
      <AnimatePresence>
        {activeLightboxImg && (
          <div
            data-lenis-prevent="true"
            onClick={() => setActiveLightboxImg(null)}
            className="fixed inset-0 z-modal bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={activeLightboxImg}
              alt="Expanded Review Photo"
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
            />
          </div>
        )}
      </AnimatePresence>
      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        propertyId={propertyId}
        onSuccess={refreshList}
      />
    </div>
  );
}

function ReviewCardItem({
  review,
  onHelpfulClick,
  onLightboxImg,
}: {
  review: Review;
  onHelpfulClick: (id: string) => void;
  onLightboxImg: (url: string) => void;
}) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isReplyOpen, setIsReplyOpen] = React.useState(false);

  return (
    <div className="bg-card/60 border border-border/60 px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-xl space-y-2 text-left">
      {/* ── Compact Header: Avatar | Name+Badge+Date | Stars ── */}
      <div className="flex items-center gap-2">
        <img
          src={review.userAvatarUrl || `https://api.dicebear.com/8.x/lorelei/svg?seed=${encodeURIComponent(review.userName)}`}
          alt={review.userName}
          className="w-7 h-7 rounded-full border border-border/60 object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-heading text-xs font-bold text-foreground truncate">{review.userName}</span>
            {review.isVerifiedStay && (
              <span className="inline-flex items-center gap-0.5 px-1 py-px rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[8px] font-heading font-extrabold uppercase leading-none">
                <CheckCircle2 className="w-2.5 h-2.5" /> Verified
              </span>
            )}
            <span className="text-[10px] font-body text-muted-foreground">·</span>
            <span className="text-[10px] font-body text-muted-foreground">{review.stayDate || new Date(review.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
          </div>
        </div>
        {/* Rating Stars */}
        <div className="flex items-center gap-px shrink-0">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={cn(
                "w-3 h-3 fill-amber-400 text-amber-400",
                s > review.rating && "fill-muted text-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* ── Review Text (3-line clamp with inline Read More) ── */}
      <div>
        <p className={cn("font-body text-[11px] sm:text-xs text-foreground/85 leading-relaxed", !isExpanded && "line-clamp-3")}>
          {review.text}
        </p>
        {review.text.length > 120 && (
          <button
            type="button"
            data-no-intercept="true"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="font-heading text-[10px] font-bold text-primary hover:text-secondary transition-colors cursor-pointer mt-0.5"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* ── Photo Thumbnails (smaller) ── */}
      {review.images && review.images.length > 0 && (
        <div className="flex items-center gap-1.5">
          {review.images.map((imgUrl: string, idx: number) => (
            <img
              key={idx}
              src={imgUrl}
              alt={`Photo ${idx + 1}`}
              onClick={() => onLightboxImg(imgUrl)}
              className="w-10 h-10 rounded-lg object-cover border border-border/60 cursor-pointer hover:opacity-80 transition-opacity"
            />
          ))}
        </div>
      )}

      {/* ── Footer: Helpful + Owner Reply Toggle ── */}
      <div className="flex items-center justify-between pt-1 border-t border-border/40">
        <button
          type="button"
          data-no-intercept="true"
          onClick={() => onHelpfulClick(review.id)}
          className={cn(
            "px-2 py-0.5 rounded-lg border text-[10px] font-heading font-bold transition-all cursor-pointer inline-flex items-center gap-1",
            "bg-transparent border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
        >
          <ThumbsUp className="w-2.5 h-2.5" />
          <span>{review.helpfulCount}</span>
        </button>

        {review.ownerReply && (
          <button
            type="button"
            data-no-intercept="true"
            onClick={() => setIsReplyOpen((prev) => !prev)}
            className="font-heading text-[10px] font-bold text-secondary/80 hover:text-secondary flex items-center gap-1 cursor-pointer"
          >
            <MessageSquare className="w-2.5 h-2.5" />
            <span>{isReplyOpen ? "Hide reply" : "Owner reply"}</span>
            <ChevronDown className={cn("w-2.5 h-2.5 transition-transform", isReplyOpen && "rotate-180")} />
          </button>
        )}
      </div>

      {/* ── Collapsible Owner Reply ── */}
      {review.ownerReply && isReplyOpen && (
        <div className="bg-muted/30 border border-border/40 px-3 py-2 rounded-lg text-[11px]">
          <div className="flex items-center gap-1.5 mb-1">
            <MessageSquare className="w-3 h-3 text-secondary" />
            <span className="font-heading text-[11px] font-extrabold text-primary">Owner</span>
            <span className="ml-auto text-[9px] font-body text-muted-foreground">{new Date(review.ownerReply.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
          </div>
          <p className="font-body text-[11px] text-muted-foreground leading-relaxed">
            {review.ownerReply.text}
          </p>
        </div>
      )}
    </div>
  );
}
