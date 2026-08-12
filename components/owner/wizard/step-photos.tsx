import * as React from "react";
import { useWizard, isApartmentType } from "./wizard-context";
import { Upload, X, ArrowLeft, ArrowRight, Star, FileVideo, AlertCircle, RefreshCw, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { MediaImage } from "@/services/property";
import { showToast } from "@/lib/toast";
import { ListingsAPI } from "@/services/listings/listings.api";

const MAX_PHOTOS = 10;
const MIN_PHOTOS = 5;

export function StepPhotos() {
  const { form } = useWizard();
  const { watch, setValue } = form;

  const images: MediaImage[] = watch("images") || [];
  const video = watch("video") || null;

  const [isDragOverImages, setIsDragOverImages] = React.useState(false);
  const [isDragOverVideo, setIsDragOverVideo] = React.useState(false);
  
  // Simulated video upload progress state
  const [videoProgress, setVideoProgress] = React.useState<number | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

  const triggerImageUpload = () => fileInputRef.current?.click();
  const triggerVideoUpload = () => videoInputRef.current?.click();

  // Upload a single file to Cloudflare R2 and update item state
  const executeSingleUpload = React.useCallback(async (item: MediaImage) => {
    if (!item.rawFile) return;

    // Set uploading status
    setValue("images", (form.getValues("images") || []).map((img: MediaImage) => 
      img.id === item.id ? { ...img, status: "uploading", errorReason: undefined } : img
    ), { shouldValidate: true });

    try {
      const result = await ListingsAPI.uploadSingleImage(item.rawFile);
      // Update item with cloud R2 URL & key
      setValue("images", (form.getValues("images") || []).map((img: MediaImage) => 
        img.id === item.id ? {
          ...img,
          url: result.url,
          key: result.key,
          status: "success",
          errorReason: undefined,
        } : img
      ), { shouldValidate: true });
    } catch (err: any) {
      const errorMsg = err?.message || "Upload failed. File size > 5MB or invalid format.";
      setValue("images", (form.getValues("images") || []).map((img: MediaImage) => 
        img.id === item.id ? {
          ...img,
          status: "error",
          errorReason: errorMsg,
        } : img
      ), { shouldValidate: true });
    }
  }, [form, setValue]);

  // Add new image files and trigger parallel cloud uploads
  const handleAddImages = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const currentList: MediaImage[] = form.getValues("images") || [];
    if (currentList.length >= MAX_PHOTOS) {
      showToast.error("Limit Reached", `Maximum ${MAX_PHOTOS} photos allowed per listing.`);
      return;
    }

    const availableSlots = MAX_PHOTOS - currentList.length;
    const fileArray = Array.from(files);
    
    if (fileArray.length > availableSlots) {
      showToast.warning(
        "Photo Limit Exceeded",
        `Only the first ${availableSlots} photo(s) were selected. Maximum ${MAX_PHOTOS} photos allowed.`
      );
    }

    const selectedFiles = fileArray.slice(0, availableSlots);

    // Filter file size & client side sanity
    const newItems: MediaImage[] = selectedFiles.map((file) => {
      const isOverSize = file.size > 5 * 1024 * 1024;
      const isValidType = ["image/jpeg", "image/png", "image/webp"].includes(file.type);

      let initialStatus: "uploading" | "error" = "uploading";
      let errorReason: string | undefined = undefined;

      if (isOverSize) {
        initialStatus = "error";
        errorReason = `Exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB)`;
      } else if (!isValidType) {
        initialStatus = "error";
        errorReason = `Unsupported format (${file.type || 'unknown'})`;
      }

      return {
        id: Math.random().toString(36).substring(7),
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        isCover: false,
        status: initialStatus,
        errorReason,
        rawFile: file,
      };
    });

    const updated = [...currentList, ...newItems];

    // Automatically set the first image as cover if none exists
    const hasCover = updated.some((img) => img.isCover);
    if (!hasCover && updated.length > 0) {
      updated[0].isCover = true;
    }

    setValue("images", updated, { shouldValidate: true });

    // Trigger cloud upload for valid items
    newItems.forEach((item) => {
      if (item.status === "uploading" && item.rawFile) {
        executeSingleUpload(item);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag and drop image handlers
  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverImages(false);
    handleAddImages(e.dataTransfer.files);
  };

  // Add video file (simulating upload progress)
  const handleAddVideo = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.type !== "video/mp4") {
      showToast.error("Invalid Video Format", "Please upload a valid MP4 video file under 50MB.");
      return;
    }

    setVideoProgress(0);
    const interval = setInterval(() => {
      setVideoProgress((prev) => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          setValue("video", {
            url: URL.createObjectURL(file),
            name: file.name,
            size: Number((file.size / (1024 * 1024)).toFixed(1)),
          }, { shouldValidate: true });
          return null;
        }
        return prev + 20;
      });
    }, 200);
  };

  // Drag and drop video handlers
  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverVideo(false);
    handleAddVideo(e.dataTransfer.files);
  };

  // Remove image
  const handleRemoveImage = (id: string) => {
    const updated = images.filter((img: MediaImage) => img.id !== id);
    
    // If we removed the cover, set the new first image as cover
    const wasCover = images.find((img: MediaImage) => img.id === id)?.isCover;
    if (wasCover && updated.length > 0) {
      updated[0].isCover = true;
    }
    
    setValue("images", updated, { shouldValidate: true });
  };

  // Set cover photo
  const handleSetCover = (id: string) => {
    const target = images.find((img) => img.id === id);
    if (target?.status === "error") {
      showToast.error("Cannot Set Cover", "Please fix or remove broken photos before setting as cover.");
      return;
    }
    const updated = images.map((img: MediaImage) => ({
      ...img,
      isCover: img.id === id,
    }));
    setValue("images", updated, { shouldValidate: true });
  };

  // Reorder image: move index left (-1) or right (+1)
  const handleReorder = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;

    setValue("images", updated, { shouldValidate: true });
  };

  const propertyType = watch("propertyType") || "Hostel";
  const isApartment = isApartmentType(propertyType);
  const isMaxReached = images.length >= MAX_PHOTOS;
  const validUploadedCount = images.filter((img) => img.status === "success" || (!img.status && img.url)).length;
  const errorCount = images.filter((img) => img.status === "error").length;
  const uploadingCount = images.filter((img) => img.status === "uploading").length;

  return (
    <div className="flex flex-col gap-8 text-left">
      
      {/* Upload Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/40 border border-border/80 p-5 rounded-2xl">
        <div className="space-y-2">
          <h4 className="font-heading text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-secondary shrink-0" />
            Upload Guidelines ({propertyType})
          </h4>
          <ul className="list-disc pl-4 font-body text-[11px] text-muted-foreground space-y-1">
            <li>Upload between <strong>5 and 10 clear photos</strong> (JPEG, PNG, WebP up to 5MB each).</li>
            {isApartment ? (
              <li>Recommended shots: Living Room, Bedrooms, Kitchen, Balcony, Bathrooms, & Building Exterior.</li>
            ) : (
              <li>Recommended shots: Bedrooms, Mess & Dining Area, Bathrooms, Study Zone, & Building Front.</li>
            )}
            <li>Landscape aspect ratio (16:9) is highly recommended.</li>
          </ul>
        </div>
        <div className="space-y-2 border-t md:border-t-0 md:border-l border-border/60 pt-3 md:pt-0 md:pl-5">
          <h4 className="font-heading text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-4 h-4 text-emerald-500 shrink-0" />
            Cover Image Detail
          </h4>
          <p className="font-body text-[11px] text-muted-foreground leading-relaxed">
            The Cover Photo will serve as the primary banner image on Indore&apos;s Search Results list and Similar Stays cards. Click the star icon to select your preferred cover banner.
          </p>
        </div>
      </div>

      {/* Image Upload Zone */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pl-1">
          <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider">
            Photos <span className="text-rose-500">*</span>
            <span className="text-[10px] font-semibold text-muted-foreground normal-case ml-2">
              ({validUploadedCount} uploaded — min. {MIN_PHOTOS}, max. {MAX_PHOTOS})
            </span>
          </label>
          {errorCount > 0 && (
            <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errorCount} image(s) failed validation
            </span>
          )}
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); if (!isMaxReached) setIsDragOverImages(true); }}
          onDragLeave={() => setIsDragOverImages(false)}
          onDrop={(e) => { if (!isMaxReached) handleImageDrop(e); }}
          onClick={() => { if (!isMaxReached) triggerImageUpload(); }}
          className={cn(
            "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-2 transition-all duration-300 select-none text-center bg-card/65",
            isMaxReached
              ? "opacity-50 cursor-not-allowed border-border"
              : "cursor-pointer",
            isDragOverImages && !isMaxReached
              ? "border-primary bg-primary/5 shadow-inner scale-[0.99]"
              : "border-border hover:border-primary hover:bg-muted/10"
          )}
        >
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            ref={fileInputRef}
            disabled={isMaxReached}
            onChange={(e) => handleAddImages(e.target.files)}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary shadow-sm">
            <Upload className="w-5.5 h-5.5" />
          </div>
          <div className="space-y-1">
            <p className="font-heading text-xs font-bold text-primary">
              {isMaxReached ? "Maximum 10 photos reached" : "Drag & drop photos here or click to browse"}
            </p>
            <p className="font-body text-[10px] text-muted-foreground">
              Supports JPEG, PNG, WEBP formats up to 5MB per file (Max 10 photos)
            </p>
          </div>
        </div>
      </div>

      {/* Image Gallery with Status Badges */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between pl-1">
            <span className="font-heading text-[10px] font-extrabold uppercase tracking-widest text-secondary">
              Photo Upload Status ({validUploadedCount}/{images.length} Ready)
            </span>
            {uploadingCount > 0 && (
              <span className="text-[10px] font-bold text-sky-500 animate-pulse flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Uploading {uploadingCount} image(s)...
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <AnimatePresence initial={false}>
              {images.map((img: MediaImage, index: number) => {
                const isError = img.status === "error";
                const isUploading = img.status === "uploading";
                const isSuccess = img.status === "success" || (!img.status && Boolean(img.url));

                return (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    layout
                    className={cn(
                      "group relative aspect-video rounded-xl overflow-hidden border bg-muted flex items-center justify-center shadow-sm transition-all duration-300",
                      isError
                        ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-950/10"
                        : isUploading
                        ? "border-sky-500 ring-2 ring-sky-500/20"
                        : img.isCover
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border/80"
                    )}
                  >
                    {/* Thumbnail Preview */}
                    <img
                      src={img.url}
                      alt={img.name}
                      className={cn(
                        "w-full h-full object-cover select-none transition-all duration-300",
                        isUploading && "blur-[2px] opacity-70",
                        isError && "grayscale opacity-50"
                      )}
                    />

                    {/* Status Badge Overlays */}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center p-2 text-center space-y-1">
                        <Loader2 className="w-6 h-6 text-sky-400 animate-spin" />
                        <span className="font-heading text-[9px] font-bold text-white uppercase tracking-wider">
                          Uploading...
                        </span>
                      </div>
                    )}

                    {isSuccess && (
                      <div className="absolute top-2 right-2 bg-emerald-500/90 text-white font-heading text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow-md flex items-center gap-1 select-none backdrop-blur-sm">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Uploaded
                      </div>
                    )}

                    {isError && (
                      <div className="absolute inset-0 bg-rose-950/80 backdrop-blur-sm p-3 flex flex-col items-center justify-center text-center space-y-1.5">
                        <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
                        <span className="font-heading text-[9px] font-extrabold text-rose-200 uppercase tracking-wider line-clamp-2">
                          {img.errorReason || "Upload Failed"}
                        </span>
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => executeSingleUpload(img)}
                            className="px-2 py-1 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-heading text-[9px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                            Retry
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(img.id)}
                            className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-heading text-[9px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-2.5 h-2.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Cover Badge Overlay */}
                    {img.isCover && !isError && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground font-heading text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md flex items-center gap-1 select-none">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        Cover
                      </div>
                    )}

                    {/* Action overlays for successful images */}
                    {isSuccess && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-1.5">
                        {!img.isCover && (
                          <button
                            type="button"
                            onClick={() => handleSetCover(img.id)}
                            title="Set as Cover"
                            className="p-1.5 rounded-lg bg-card border border-border text-muted-foreground hover:text-emerald-500 transition-colors duration-200 cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        )}
                        
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => handleReorder(index, -1)}
                            title="Move Left"
                            className="p-1.5 rounded-lg bg-card border border-border text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {index < images.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handleReorder(index, 1)}
                            title="Move Right"
                            className="p-1.5 rounded-lg bg-card border border-border text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          title="Remove Photo"
                          className="p-1.5 rounded-lg bg-card border border-border text-muted-foreground hover:text-rose-500 transition-colors duration-200 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Video Upload Section */}
      <div className="space-y-3 pt-2">
        <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
          Walkthrough Video <span className="text-muted-foreground/50 font-normal normal-case ml-2">(Optional)</span>
        </label>

        {!video && videoProgress === null ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOverVideo(true); }}
            onDragLeave={() => setIsDragOverVideo(false)}
            onDrop={handleVideoDrop}
            onClick={triggerVideoUpload}
            className={cn(
              "border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 select-none text-center bg-card/65",
              isDragOverVideo
                ? "border-primary bg-primary/5 scale-[0.99]"
                : "border-border hover:border-primary hover:bg-muted/10"
            )}
          >
            <input
              type="file"
              accept="video/mp4"
              ref={videoInputRef}
              onChange={(e) => handleAddVideo(e.target.files)}
              className="hidden"
            />
            <FileVideo className="w-8 h-8 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="font-heading text-xs font-bold text-primary">
                Upload a property tour video
              </p>
              <p className="font-body text-[10px] text-muted-foreground">
                MP4 format only, maximum size limit 50MB
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-card/75 border border-border/80 rounded-2xl p-5 shadow-sm">
            {videoProgress !== null ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold font-heading">
                  <span className="text-primary">Uploading tour video...</span>
                  <span className="text-secondary">{videoProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <FileVideo className="w-6 h-6" />
                  </div>
                  <div className="text-left space-y-0.5">
                    <h5 className="font-heading text-xs font-bold text-primary truncate max-w-[200px] sm:max-w-sm">
                      {video?.name}
                    </h5>
                    <span className="font-body text-[10px] text-muted-foreground block">
                      Size: {video?.size} MB • Ready to upload
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                  <button
                    type="button"
                    onClick={() => setValue("video", null, { shouldValidate: true })}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-rose-500 text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
export default StepPhotos;
