"use client";

import * as React from "react";
import { Star, MessageSquare, Plus, X, Upload, Calendar, SlidersHorizontal, ChevronDown, CheckCircle2, ThumbsUp, ThumbsDown, Eye, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { ReviewService, Review } from "@/services/reviews";
import { LightboxModal } from "./gallery";
import { MediaTab } from "@/hooks/use-gallery";
import { Modal } from "@/components/shared/modal";
import { cn } from "@/lib/utils";

interface PropertyReviewsProps {
  propertyId: string;
  onReviewChange?: () => void;
}

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

export function PropertyReviews({ propertyId, onReviewChange }: PropertyReviewsProps) {
  const { user, role } = useAuth();
  
  // States
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [breakdownData, setBreakdownData] = React.useState<{
    overallRating: number;
    totalReviews: number;
    breakdown: Record<number, number>;
  }>({ overallRating: 0, totalReviews: 0, breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
  
  const [filterRating, setFilterRating] = React.useState<number | "All">("All");
  const [sortBy, setSortBy] = React.useState<"recent" | "highest" | "lowest">("recent");
  const [visibleCount, setVisibleCount] = React.useState(5);
  const [isWriteModalOpen, setIsWriteModalOpen] = React.useState(false);

  // Fullscreen Lightbox States
  const [lightboxImages, setLightboxImages] = React.useState<string[] | null>(null);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);
  const [lightboxZoom, setLightboxZoom] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState<MediaTab>("photos");

  // Form States
  const [formRating, setFormRating] = React.useState(0);
  const [formHoverRating, setFormHoverRating] = React.useState(0);
  const [formTitle, setFormTitle] = React.useState("");
  const [formText, setFormText] = React.useState("");
  const [formImages, setFormImages] = React.useState<string[]>([]);
  const [formStayDate, setFormStayDate] = React.useState("July 2026");
  const [formRecommend, setFormRecommend] = React.useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Stay Date Options
  const stayDateOptions = [
    "July 2026", "June 2026", "May 2026", "April 2026", "March 2026", "February 2026", "January 2026", "December 2025", "November 2025"
  ];

  // Load reviews on mount or update
  const refreshReviews = React.useCallback(() => {
    const list = ReviewService.getReviewsByPropertyId(propertyId);
    const breakdown = ReviewService.getRatingBreakdown(propertyId);
    setReviews(list);
    setBreakdownData(breakdown);
  }, [propertyId]);

  React.useEffect(() => {
    refreshReviews();
  }, [refreshReviews]);

  // Image Upload Handler (Convert to Base64 with Format & Max 5 validation)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (formImages.length + files.length > 5) {
      toast.error("You can upload a maximum of 5 photos per review.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        toast.error(`Format of "${file.name}" is not supported. Only JPG, PNG and WEBP files are allowed.`);
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error(`Image "${file.name}" exceeds 2MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormImages((prev) => {
            if (prev.length >= 5) return prev;
            return [...prev, reader.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = "";
  };

  const removeFormImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Review Handler
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formRating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    if (!formTitle.trim()) {
      toast.error("Please enter a review title.");
      return;
    }
    if (!formText.trim()) {
      toast.error("Please enter your review text.");
      return;
    }
    if (formText.trim().length < 20) {
      toast.error("Review must be at least 20 characters long.");
      return;
    }
    if (formText.trim().length > 1000) {
      toast.error("Review must not exceed 1000 characters.");
      return;
    }
    if (formImages.length > 5) {
      toast.error("You can upload a maximum of 5 photos.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 800));

      const avatarUrl = user?.avatarUrl || `https://api.dicebear.com/8.x/avataaars/svg?seed=${user?.name || "User"}`;

      ReviewService.addReview(propertyId, {
        userName: user?.name || user?.email || "Anonymous Stayyer",
        userAvatarUrl: avatarUrl,
        rating: formRating,
        title: formTitle.trim(),
        text: formText.trim(),
        images: formImages.length > 0 ? formImages : undefined,
        stayDate: formStayDate,
        isVerifiedStay: true, // Seeding verified stay as true for authenticated buyer reviews
        recommend: formRecommend,
      });

      toast.success("Review submitted successfully!");
      
      // Reset form
      setFormRating(0);
      setFormTitle("");
      setFormText("");
      setFormImages([]);
      setFormStayDate("July 2026");
      setFormRecommend(true);
      setIsWriteModalOpen(false);
      
      // Reload
      refreshReviews();
      if (onReviewChange) {
        onReviewChange();
      }
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helpful Button Handler
  const handleHelpfulClick = (reviewId: string) => {
    if (!user) {
      toast.error("Please sign in to mark reviews as helpful.");
      return;
    }
    const userEmail = user.email || "anonymous@example.com";
    const res = ReviewService.incrementHelpfulCount(reviewId, userEmail);
    if (res.success) {
      toast.success(res.message);
      refreshReviews();
    } else {
      toast.info(res.message);
    }
  };

  // Filter and Sort Logic
  const filteredAndSortedReviews = React.useMemo(() => {
    let result = [...reviews];

    // Filter by stars
    if (filterRating !== "All") {
      result = result.filter((r) => r.rating === filterRating);
    }

    // Sort by options
    if (sortBy === "recent") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "highest") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      result.sort((a, b) => a.rating - b.rating);
    }

    return result;
  }, [reviews, filterRating, sortBy]);

  // Paginated display
  const displayedReviews = React.useMemo(() => {
    return filteredAndSortedReviews.slice(0, visibleCount);
  }, [filteredAndSortedReviews, visibleCount]);

  const hasMore = filteredAndSortedReviews.length > visibleCount;

  // Format Date Helper
  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  const isOwner = user !== null && (role === "owner" || user?.role === "owner");

  return (
    <div className="flex flex-col gap-8 text-left mt-8 pt-8 border-t border-border/60">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary block">
            Reviews & Ratings
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            What Stayyers Say
          </h2>
        </div>

        <button
          onClick={() => {
            if (!user) {
              toast.error("Please sign in to write a review.");
            } else if (isOwner) {
              toast.error("Owners cannot review their own properties.");
            } else {
              setIsWriteModalOpen(true);
            }
          }}
          className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground font-heading text-xs font-bold transition-all duration-300 shadow-md cursor-pointer select-none"
        >
          <Plus className="w-4 h-4" />
          Write a Review
        </button>
      </div>

      {/* 1. Summary Breakdown Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* Left Side: Score card */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-border/60">
          <span className="font-heading text-6xl font-extrabold text-primary leading-none">
            {breakdownData.overallRating > 0 ? breakdownData.overallRating : "—"}
          </span>
          
          <div className="flex items-center gap-1.5 mt-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-4 h-4 shrink-0",
                  star <= Math.round(breakdownData.overallRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/35"
                )}
              />
            ))}
          </div>

          <span className="font-body text-xs text-muted-foreground mt-2 block font-semibold">
            Based on {breakdownData.totalReviews} {breakdownData.totalReviews === 1 ? "Review" : "Reviews"}
          </span>
        </div>

        {/* Right Side: Bars list */}
        <div className="md:col-span-8 flex flex-col justify-center gap-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = breakdownData.breakdown[rating] || 0;
            const percentage = breakdownData.totalReviews > 0
              ? Math.round((count / breakdownData.totalReviews) * 100)
              : 0;

            return (
              <div key={rating} className="flex items-center gap-3 w-full">
                <span className="font-heading text-xs font-bold text-primary shrink-0 w-10 text-right">
                  {rating} Star
                </span>
                
                <div className="flex-1 h-2 rounded-full bg-muted/60 overflow-hidden relative border border-border/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: PREMIUM_EASE }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
                  />
                </div>

                <span className="font-body text-[11px] font-bold text-muted-foreground shrink-0 w-12 text-left">
                  {percentage}% ({count})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Sorting & Filtering Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        
        {/* Filtering star buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-heading text-xs font-bold text-muted-foreground mr-1.5">
            Filter:
          </span>
          
          {(["All", 5, 4, 3, 2, 1] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setFilterRating(opt);
                setVisibleCount(5); // Reset display count
              }}
              className={cn(
                "px-3 py-1.5 rounded-xl font-heading text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border select-none",
                filterRating === opt
                  ? "bg-primary border-primary text-primary-foreground shadow-sm"
                  : "bg-card border-border/80 text-muted-foreground hover:text-primary hover:border-border"
              )}
            >
              {opt === "All" ? "All Stars" : `${opt} ⭐`}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown select */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-body text-xs text-muted-foreground font-semibold">
            Sort by:
          </span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-card border border-border/80 rounded-xl px-3.5 py-1.5 font-heading text-xs font-bold text-primary appearance-none cursor-pointer focus:outline-none focus:border-primary pr-8 shadow-xs"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. Review Cards List Display */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {displayedReviews.length > 0 ? (
            displayedReviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.45, ease: PREMIUM_EASE, delay: idx * 0.05 }}
                className="bg-card border border-border/60 rounded-3xl p-6 shadow-xs flex flex-col gap-4 text-left"
              >
                {/* Reviewer Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
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
                        
                        {/* Recommendation Badge */}
                        <span className={cn(
                          "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border select-none",
                          review.recommend
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                        )}>
                          {review.recommend ? (
                            <>
                              <ThumbsUp className="w-2.5 h-2.5 text-blue-500" />
                              <span>Recommends</span>
                            </>
                          ) : (
                            <>
                              <ThumbsDown className="w-2.5 h-2.5 text-rose-500" />
                              <span>Not Recommended</span>
                            </>
                          )}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1">
                        <div className="flex items-center gap-0.5">
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
                        <span className="text-[10px] font-bold text-muted-foreground/60">
                          • Reviewed: {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Helpful Button Counter */}
                  <button
                    onClick={() => handleHelpfulClick(review.id)}
                    className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 hover:border-primary/30 bg-card hover:bg-muted/40 text-muted-foreground hover:text-primary transition-all duration-200 text-[10px] font-extrabold uppercase tracking-wider cursor-pointer select-none"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-secondary" />
                    <span>Helpful ({review.helpfulCount || 0})</span>
                  </button>
                </div>

                {/* Review Body */}
                <div className="space-y-1.5">
                  <h3 className="font-heading text-sm font-extrabold text-primary">
                    {review.title}
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-foreground/80 leading-relaxed">
                    {review.text}
                  </p>
                </div>

                {/* Optional Review Images (Click opens Lightbox Modal) */}
                {review.images && review.images.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {review.images.map((imgUrl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setLightboxImages(review.images || []);
                          setLightboxIndex(i);
                        }}
                        className="relative w-20 h-20 rounded-xl overflow-hidden border border-border/80 group shrink-0 cursor-pointer shadow-xs"
                      >
                        <img
                          src={imgUrl}
                          alt="Review attachment"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs">
                          <Eye className="w-4 h-4" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Owner Reply Block */}
                {review.ownerReply && (
                  <div className="mt-2 bg-muted/40 border border-border/50 rounded-2xl p-4 text-left flex gap-3">
                    <span className="text-xl">🏢</span>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-xs font-bold text-primary">
                          Reply from Property Owner
                        </span>
                        <span className="text-[9px] font-bold text-muted-foreground/60">
                          {formatDate(review.ownerReply.createdAt)}
                        </span>
                      </div>
                      <p className="font-body text-xs sm:text-sm text-foreground/75 leading-relaxed italic">
                        &quot;{review.ownerReply.text}&quot;
                      </p>
                    </div>
                  </div>
                )}

              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-muted/10 border border-dashed border-border/85 rounded-3xl"
            >
              <MessageSquare className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2.5" />
              <p className="font-heading text-sm font-bold text-muted-foreground">No Reviews Found</p>
              <p className="font-body text-xs text-muted-foreground/75 mt-1 leading-snug">
                {filterRating === "All"
                  ? "Be the first to stay here and write a review!"
                  : `There are currently no ${filterRating}-star reviews listed.`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More Pagination Button */}
        {hasMore && (
          <div className="pt-4 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 5)}
              className="px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-primary font-heading text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs select-none"
            >
              Load More Reviews
            </button>
          </div>
        )}
      </div>

      {/* 4. Write Review Popup Dialog Overlay */}
      <Modal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        variant="large"
        className="max-w-[1100px]"
        title={
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary block mb-0.5">
              Share Your Experience
            </span>
            <h3 className="font-heading text-lg sm:text-xl font-extrabold text-primary leading-snug">
              Write a Review
            </h3>
          </div>
        }
        footer={
          <div className="flex items-center justify-end gap-3 max-w-xs sm:max-w-sm ml-auto">
            <button
              type="button"
              onClick={() => setIsWriteModalOpen(false)}
              className="flex-1 py-2.5 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-primary font-heading text-xs font-bold transition-all cursor-pointer text-center select-none"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="write-review-form"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-5 bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground font-heading text-xs font-bold transition-all duration-300 shadow-md cursor-pointer select-none disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Review</span>
              )}
            </button>
          </div>
        }
      >
        {/* Form Content Body Grid */}
        <form id="write-review-form" onSubmit={handleSubmitReview} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* Left Column: Rating, Dates, Title */}
          <div className="space-y-5">
            {/* Star selection rating */}
            <div className="space-y-1.5">
              <span className="font-heading text-xs font-bold text-primary block">
                Rating <strong className="text-rose-500">*</strong>
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormRating(star)}
                    onMouseEnter={() => setFormHoverRating(star)}
                    onMouseLeave={() => setFormHoverRating(0)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "w-7 h-7 shrink-0",
                        star <= (formHoverRating || formRating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Stay Date Selection */}
              <div className="space-y-1.5 text-left">
                <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
                  Stay Date <strong className="text-rose-500">*</strong>
                </label>
                <div className="relative">
                  <select
                    value={formStayDate}
                    onChange={(e) => setFormStayDate(e.target.value)}
                    className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2.5 text-xs font-body text-foreground focus:outline-none focus:border-primary shadow-xs"
                  >
                    {stayDateOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Recommendation Selection */}
              <div className="space-y-1.5 text-left">
                <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
                  Recommend Property? <strong className="text-rose-500">*</strong>
                </label>
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setFormRecommend(true)}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-xl border text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                      formRecommend === true
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-muted/30 border-border/80 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>YES</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormRecommend(false)}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-xl border text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                      formRecommend === false
                        ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                        : "bg-muted/30 border-border/80 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>NO</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Review Title Input */}
            <div className="space-y-1.5 text-left">
              <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
                Title <strong className="text-rose-500">*</strong>
              </label>
              <input
                type="text"
                required
                placeholder="Summarize your experience (e.g. Clean rooms, great food)..."
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2.5 text-xs font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary shadow-xs"
              />
            </div>
          </div>

          {/* Right Column: Review Text & Photo Uploads */}
          <div className="space-y-5">
            {/* Review Body Textarea */}
            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center px-1">
                <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider">
                  Review Text <strong className="text-rose-500">*</strong>
                </label>
              </div>
              <textarea
                required
                rows={5}
                minLength={20}
                maxLength={1000}
                placeholder="Describe your stay experience in detail (minimum 20 characters, maximum 1000)..."
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                className="w-full bg-background border border-border/80 rounded-xl p-3.5 text-xs font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary shadow-xs resize-none"
              />
              <div className="flex justify-between items-center text-[10px] text-muted-foreground px-1 pt-0.5">
                <span>Min 20, Max 1000 characters.</span>
                <span className={cn(formText.length < 20 && formText.length > 0 ? "text-rose-500 font-bold" : "")}>
                  {formText.length} / 1000 characters
                </span>
              </div>
            </div>

            {/* Image Upload Field */}
            <div className="space-y-2 text-left">
              <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider block pl-1">
                Upload Photos <span className="text-muted-foreground font-normal lowercase">(Optional, Maximum 5)</span>
              </label>

              <div className="flex items-center gap-3">
                <label className={cn(
                  "px-4 py-2 rounded-xl border border-dashed text-xs font-heading font-bold flex items-center gap-2 cursor-pointer transition-all shadow-xs select-none",
                  formImages.length >= 5
                    ? "bg-muted/20 border-border text-muted-foreground/40 cursor-not-allowed"
                    : "bg-muted/40 hover:bg-muted border-primary/40 text-primary"
                )}>
                  <Upload className="w-4 h-4" />
                  <span>Choose Images</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    disabled={formImages.length >= 5}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[10px] font-semibold text-muted-foreground">
                  Uploaded: {formImages.length}/5 • Max 2MB each
                </span>
              </div>

              {/* Attachment previews grid */}
              {formImages.length > 0 && (
                <div className="grid grid-cols-5 gap-2.5 pt-2">
                  {formImages.map((imgBase64, index) => (
                    <div
                      key={index}
                      className="relative w-full aspect-square rounded-xl overflow-hidden border border-border group"
                    >
                      <img
                        src={imgBase64}
                        alt="Upload preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFormImage(index)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-rose-500 text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>
      </Modal>

      {/* 5. Fullscreen Lightbox Modal (Reuses existing gallery component) */}
      <AnimatePresence>
        {lightboxImages && lightboxImages.length > 0 && (
          <LightboxModal
            images={lightboxImages}
            videos={[]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentIndex={lightboxIndex}
            zoomLevel={lightboxZoom}
            altPrefix="Review Image"
            onClose={() => {
              setLightboxImages(null);
              setLightboxZoom(1);
            }}
            onPrev={() => {
              setLightboxIndex((prev) => (prev > 0 ? prev - 1 : lightboxImages.length - 1));
              setLightboxZoom(1);
            }}
            onNext={() => {
              setLightboxIndex((prev) => (prev < lightboxImages.length - 1 ? prev + 1 : 0));
              setLightboxZoom(1);
            }}
            onGoTo={(idx) => {
              setLightboxIndex(idx);
              setLightboxZoom(1);
            }}
            onZoomIn={() => setLightboxZoom((prev) => Math.min(3, prev + 0.25))}
            onZoomOut={() => setLightboxZoom((prev) => Math.max(1, prev - 0.25))}
            onResetZoom={() => setLightboxZoom(1)}
            onToggleZoom={() => setLightboxZoom((prev) => (prev > 1 ? 1 : 2))}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
