"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Sparkles, Send, ShieldCheck, Camera, ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";
import { ReviewService } from "@/services/reviews";
import { useAuth } from "@/providers/auth-provider";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

import { useSmoothScroll } from "@/providers/smooth-scroll-provider";

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  onSuccess?: () => void;
}

const CATEGORY_KEYS = [
  { key: "cleanliness", label: "Cleanliness" },
  { key: "safety", label: "Safety" },
  { key: "location", label: "Location" },
  { key: "valueForMoney", label: "Value for Money" },
  { key: "foodQuality", label: "Food Quality" },
  { key: "wifi", label: "Wi-Fi" },
  { key: "management", label: "Management" },
] as const;

export function WriteReviewModal({ isOpen, onClose, propertyId, onSuccess }: WriteReviewModalProps) {
  const { user } = useAuth();
  const { lenis } = useSmoothScroll();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Section 1: Overall Rating
  const [overallRating, setOverallRating] = React.useState(5);
  const [hoverOverall, setHoverOverall] = React.useState(0);

  // Section 2: Category Ratings
  const [categoryScores, setCategoryScores] = React.useState<Record<string, number>>({
    cleanliness: 5,
    safety: 5,
    location: 5,
    valueForMoney: 5,
    foodQuality: 4,
    wifi: 5,
    management: 5,
  });

  // Section 3: Review Title
  const [title, setTitle] = React.useState("");

  // Section 4: Detailed Review
  const [content, setContent] = React.useState("");

  // Section 5: Real Image Uploader State
  const [imageUrls, setImageUrls] = React.useState<string[]>([]);

  // Section 6: Recommend
  const [recommend, setRecommend] = React.useState<boolean>(true);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Prevent body scrolling and stop Lenis wheel interception when modal is active
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [isOpen, lenis]);

  if (!isOpen) return null;

  const handleCategoryScoreChange = (catKey: string, score: number) => {
    setCategoryScores((prev) => ({ ...prev, [catKey]: score }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    
    // Check max count limit (5 images max)
    if (imageUrls.length + fileList.length > 5) {
      showToast.error("Limit Exceeded", "You can upload a maximum of 5 photos per review.");
      return;
    }

    const newUrls: string[] = [];
    for (const file of fileList) {
      // Validate max file size 5MB
      if (file.size > 5 * 1024 * 1024) {
        showToast.error("File Too Large", `${file.name} exceeds the 5 MB size limit.`);
        continue;
      }
      // Create local object URL preview
      const previewUrl = URL.createObjectURL(file);
      newUrls.push(previewUrl);
    }

    if (newUrls.length > 0) {
      setImageUrls((prev) => [...prev, ...newUrls]);
      showToast.success("Photos Added", `Successfully added ${newUrls.length} photo(s).`);
    }

    // Reset input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast.error("Title Required", "Please enter a brief title for your review.");
      return;
    }
    if (!content.trim()) {
      showToast.error("Review Required", "Please write a brief description of your stay experience.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      ReviewService.addReview(propertyId, {
        userName: user?.name || user?.email?.split("@")[0] || "Verified Stayyer",
        userAvatarUrl: user?.avatarUrl || `https://api.dicebear.com/8.x/lorelei/svg?seed=${user?.name || "Stayyer"}`,
        rating: overallRating,
        title: title.trim(),
        text: content.trim(),
        stayDate: new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
        recommend,
        isVerifiedStay: true,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      });

      setIsSubmitting(false);
      showToast.success("Review Submitted! 🎉", "Thank you for sharing your complete verified stay feedback.");
      onClose();
      if (onSuccess) onSuccess();
    }, 500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-modal flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-card border border-border/80 rounded-3xl shadow-2xl p-5 sm:p-7 my-auto max-h-[85vh] overflow-y-auto overscroll-contain space-y-6 text-left outline-none scrollbar-thin"
        >
          {/* Close Button */}
          <button
            type="button"
            data-no-intercept="true"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="space-y-1 pr-8">
            <span className="font-heading text-xs font-extrabold uppercase tracking-widest text-secondary flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Verified Feedback
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-primary">Write a Review</h3>
            <p className="font-body text-xs text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Verified Stay Reviews help students & working professionals find the best stays.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SECTION 1: Overall Experience Rating */}
            <div className="space-y-2 text-center bg-muted/30 border border-border/60 p-4 rounded-2xl">
              <label className="font-heading text-xs font-bold text-foreground block uppercase tracking-wider">
                Section 1: Overall Experience Rating
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    data-no-intercept="true"
                    onMouseEnter={() => setHoverOverall(star)}
                    onMouseLeave={() => setHoverOverall(0)}
                    onClick={() => setOverallRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={cn(
                        "w-7 h-7 transition-colors",
                        star <= (hoverOverall || overallRating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted-foreground/30"
                      )}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-heading font-extrabold text-secondary block">
                {overallRating === 5 ? "Excellent (5.0)" : overallRating === 4 ? "Very Good (4.0)" : overallRating === 3 ? "Good (3.0)" : "Average"}
              </span>
            </div>

            {/* SECTION 2: Category Ratings */}
            <div className="space-y-3 border-t border-border/60 pt-4">
              <label className="font-heading text-xs font-bold text-foreground block uppercase tracking-wider">
                Section 2: Category Ratings
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CATEGORY_KEYS.map(({ key, label }) => {
                  const currentScore = categoryScores[key] || 5;
                  return (
                    <div key={key} className="flex items-center justify-between bg-card border border-border/60 p-3 rounded-2xl">
                      <span className="font-body text-xs font-bold text-foreground">{label}</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            data-no-intercept="true"
                            onClick={() => handleCategoryScoreChange(key, s)}
                            className="p-0.5 focus:outline-none cursor-pointer"
                          >
                            <Star
                              className={cn(
                                "w-4 h-4 transition-colors",
                                s <= currentScore ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/30"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 3: Review Title */}
            <div className="space-y-1.5 border-t border-border/60 pt-4">
              <label className="font-heading text-xs font-bold text-foreground block uppercase tracking-wider">
                Section 3: Review Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Amazing stay with friendly management"
                className="w-full bg-background border border-border/80 rounded-2xl px-3.5 py-2.5 text-xs font-body text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground/60"
              />
            </div>

            {/* SECTION 4: Detailed Review */}
            <div className="space-y-1.5 border-t border-border/60 pt-4">
              <label className="font-heading text-xs font-bold text-foreground block uppercase tracking-wider">
                Section 4: Detailed Review
              </label>
              <textarea
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share specific details about room condition, food quality, Wi-Fi speed, security, and landlord responsiveness..."
                className="w-full bg-background border border-border/80 rounded-2xl p-3.5 text-xs font-body text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground/60 resize-none"
              />
            </div>

            {/* SECTION 5: Real Image Uploader */}
            <div className="space-y-3 border-t border-border/60 pt-4">
              <div className="flex items-center justify-between">
                <label className="font-heading text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-secondary" /> Section 5: Upload Photos
                </label>
                <span className="text-xs font-heading font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                  {imageUrls.length} / 5 Photos
                </span>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />

              <div className="flex flex-wrap items-center gap-3">
                {imageUrls.length < 5 && (
                  <button
                    type="button"
                    data-no-intercept="true"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-2xl border-2 border-dashed border-border/80 hover:border-primary bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary cursor-pointer select-none"
                  >
                    <Camera className="w-5 h-5" />
                    <span className="text-[10px] font-heading font-extrabold">Add Photo</span>
                  </button>
                )}

                {imageUrls.map((url, i) => (
                  <div key={i} className="relative group w-20 h-20 rounded-2xl overflow-hidden border border-border/80 shadow-xs shrink-0">
                    <img src={url} alt={`Uploaded ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      data-no-intercept="true"
                      onClick={() => handleRemovePhoto(i)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                    >
                      <Trash2 className="w-5 h-5 text-rose-400" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-body text-muted-foreground">
                Supported formats: JPG, JPEG, PNG, WEBP (Max 5 MB each, up to 5 photos).
              </p>
            </div>

            {/* SECTION 6: Recommend this Property? */}
            <div className="space-y-2 border-t border-border/60 pt-4">
              <label className="font-heading text-xs font-bold text-foreground block uppercase tracking-wider">
                Section 6: Recommend this Property?
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={() => setRecommend(true)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl border text-xs font-heading font-bold transition-all cursor-pointer flex items-center justify-center gap-2",
                    recommend
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 shadow-xs"
                      : "bg-muted/40 border-border/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ThumbsUp className="w-4 h-4" /> Yes, Highly Recommend
                </button>
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={() => setRecommend(false)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl border text-xs font-heading font-bold transition-all cursor-pointer flex items-center justify-center gap-2",
                    !recommend
                      ? "bg-rose-500/10 border-rose-500 text-rose-600 shadow-xs"
                      : "bg-muted/40 border-border/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ThumbsDown className="w-4 h-4" /> No
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-border/60 pt-4">
              <button
                type="button"
                data-no-intercept="true"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-border/80 text-muted-foreground hover:text-foreground font-heading text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                data-no-intercept="true"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground font-heading text-xs font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
