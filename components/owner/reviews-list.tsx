"use client";

import * as React from "react";
import { Star, MessageSquare, CornerDownRight, CheckCircle2, Calendar, ThumbsUp, ChevronDown, SlidersHorizontal, Reply, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { PropertyService, Property } from "@/services/property";
import { ReviewService, Review } from "@/services/reviews";
import { cn } from "@/lib/utils";

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

export function OwnerReviewsList() {
  const [properties] = React.useState<Property[]>(() => {
    return PropertyService.getAllProperties();
  });

  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = React.useState<string>("ALL");
  const [replyInputs, setReplyInputs] = React.useState<Record<string, string>>({});
  const [submittingReplyId, setSubmittingReplyId] = React.useState<string | null>(null);

  // Load reviews for owner's properties
  const loadReviews = React.useCallback(() => {
    const propertyIds = properties.map((p) => p.id);
    const allOwnerReviews: Review[] = [];

    propertyIds.forEach((id) => {
      const list = ReviewService.getReviewsByPropertyId(id);
      allOwnerReviews.push(...list);
    });

    // Sort by most recent review date
    allOwnerReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setReviews(allOwnerReviews);
  }, [properties]);

  React.useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Handle Owner Reply Submit
  const handleReplySubmit = async (reviewId: string) => {
    const text = (replyInputs[reviewId] || "").trim();
    if (!text) {
      toast.error("Reply text cannot be empty.");
      return;
    }

    setSubmittingReplyId(reviewId);
    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 800));

      const res = ReviewService.addOwnerReply(reviewId, text);
      if (res.success) {
        toast.success("Reply submitted successfully!");
        setReplyInputs((prev) => ({ ...prev, [reviewId]: "" }));
        loadReviews();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to submit reply. Please try again.");
    } finally {
      setSubmittingReplyId(null);
    }
  };

  const handleReplyTextChange = (reviewId: string, val: string) => {
    setReplyInputs((prev) => ({
      ...prev,
      [reviewId]: val,
    }));
  };

  // Filter reviews
  const filteredReviews = React.useMemo(() => {
    if (selectedPropertyId === "ALL") return reviews;
    return reviews.filter((r) => r.propertyId === selectedPropertyId);
  }, [reviews, selectedPropertyId]);

  // Compute Stats
  const totalReviewsCount = filteredReviews.length;
  const avgRating = React.useMemo(() => {
    if (totalReviewsCount === 0) return 0;
    const sum = filteredReviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / totalReviewsCount) * 10) / 10;
  }, [filteredReviews, totalReviewsCount]);

  const pendingRepliesCount = React.useMemo(() => {
    return filteredReviews.filter((r) => !r.ownerReply).length;
  }, [filteredReviews]);

  return (
    <div className="space-y-8 text-left">
      
      {/* Page Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h2 className="font-heading text-xl font-extrabold text-primary">
            Customer Reviews
          </h2>
          <p className="font-body text-xs text-muted-foreground mt-0.5">
            Monitor stay reviews, view ratings breakdown, and respond directly to customer feedback.
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-body text-xs font-semibold text-muted-foreground">
            Filter by Property:
          </span>
          <div className="relative">
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="bg-card border border-border/80 rounded-xl px-3.5 py-1.5 font-heading text-xs font-bold text-primary appearance-none cursor-pointer focus:outline-none focus:border-primary pr-8 shadow-xs"
            >
              <option value="ALL">All Properties ({reviews.length})</option>
              {properties.map((p) => {
                const count = reviews.filter((r) => r.propertyId === p.id).length;
                return (
                  <option key={p.id} value={p.id}>
                    {p.propertyName} ({count})
                  </option>
                );
              })}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Reviews", value: totalReviewsCount.toString(), desc: "Across filtered properties" },
          { label: "Average Rating", value: avgRating > 0 ? `${avgRating} / 5.0` : "—", desc: "Out of 5 stars total" },
          { label: "Unreplied Reviews", value: pendingRepliesCount.toString(), desc: "Requires your response" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-card border border-border/80 rounded-2xl p-5 shadow-premium text-left"
          >
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              {stat.label}
            </span>
            <span className="font-heading text-2xl font-extrabold text-primary mt-1.5 block">
              {stat.value}
            </span>
            <span className="text-[10px] text-muted-foreground/80 mt-1 block leading-none">
              {stat.desc}
            </span>
          </div>
        ))}
      </div>

      {/* Reviews Cards List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review, idx) => {
              const property = properties.find((p) => p.id === review.propertyId);
              const hasReplied = !!review.ownerReply;

              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.45, ease: PREMIUM_EASE, delay: idx * 0.05 }}
                  className="bg-card border border-border/80 rounded-3xl p-6 shadow-xs flex flex-col gap-4 text-left"
                >
                  
                  {/* Property Name Header label */}
                  <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-3">
                    <span className="font-heading text-xs font-extrabold text-secondary">
                      📍 {property?.propertyName || "Listed Property"}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground/60">
                      Posted: {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  </div>

                  {/* Reviewer detail header */}
                  <div className="flex items-center gap-3">
                    <img
                      src={review.userAvatarUrl}
                      alt={review.userName}
                      className="w-10 h-10 rounded-full border border-border/40 object-cover bg-muted"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-xs font-bold text-primary">
                          {review.userName}
                        </span>
                        
                        {/* Verified Stay Badge */}
                        {review.isVerifiedStay && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-[9px] font-extrabold uppercase tracking-wide select-none">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Verified Stay</span>
                          </span>
                        )}

                        {/* Recommend badge */}
                        <span className={cn(
                          "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border select-none",
                          review.recommend
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                        )}>
                          {review.recommend ? "Recommends Stay" : "Not Recommended"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "w-3 h-3 fill-amber-400 text-amber-400",
                                star > review.rating && "opacity-25"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1 font-body">
                          <Calendar className="w-3.5 h-3.5 opacity-60" />
                          Stayed: {review.stayDate}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground/60 flex items-center gap-1">
                          • <ThumbsUp className="w-3 h-3 shrink-0 text-secondary" /> Helpful ({review.helpfulCount || 0})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="space-y-1.5">
                    <h4 className="font-heading text-sm font-extrabold text-primary">
                      {review.title}
                    </h4>
                    <p className="font-body text-xs sm:text-sm text-foreground/80 leading-relaxed">
                      {review.text}
                    </p>
                  </div>

                  {/* Review Attachments */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      {review.images.map((imgUrl, i) => (
                        <div
                          key={i}
                          className="relative w-16 h-16 rounded-xl overflow-hidden border border-border/80 shrink-0"
                        >
                          <img
                            src={imgUrl}
                            alt="Review attachment"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Owner Response block */}
                  <div className="mt-3 border-t border-border/60 pt-4">
                    {hasReplied ? (
                      // Show Existing Owner Reply
                      <div className="bg-muted/30 border border-border/50 rounded-2xl p-4 flex gap-3">
                        <CornerDownRight className="w-4 h-4 text-secondary shrink-0 mt-1" />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-heading text-xs font-bold text-primary">
                              Your Response
                            </span>
                            <span className="text-[9px] font-bold text-muted-foreground/60">
                              {new Date(review.ownerReply!.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                            </span>
                          </div>
                          <p className="font-body text-xs sm:text-sm text-foreground/75 leading-relaxed italic">
                            &quot;{review.ownerReply!.text}&quot;
                          </p>
                        </div>
                      </div>
                    ) : (
                      // Form for owner response
                      <div className="space-y-3">
                        <label className="font-heading text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
                          <Reply className="w-3.5 h-3.5 text-secondary" />
                          <span>Respond to this review</span>
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <textarea
                            rows={2}
                            placeholder="Type your reply to this review..."
                            value={replyInputs[review.id] || ""}
                            onChange={(e) => handleReplyTextChange(review.id, e.target.value)}
                            className="flex-grow bg-background border border-border/80 rounded-xl px-3.5 py-2.5 text-xs font-body text-foreground focus:outline-none focus:border-primary shadow-xs resize-none"
                          />
                          <button
                            onClick={() => handleReplySubmit(review.id)}
                            disabled={submittingReplyId === review.id}
                            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground font-heading text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50 shrink-0 self-end sm:self-center flex items-center justify-center gap-1.5"
                          >
                            {submittingReplyId === review.id ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Submitting...</span>
                              </>
                            ) : (
                              <span>Post Reply</span>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-muted/10 border border-dashed border-border/85 rounded-3xl">
              <MessageSquare className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2.5" />
              <p className="font-heading text-sm font-bold text-muted-foreground">No Reviews Found</p>
              <p className="font-body text-xs text-muted-foreground/75 mt-1">
                {selectedPropertyId === "ALL"
                  ? "Your listings don't have any reviews yet."
                  : "This property does not have any reviews yet."}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
