import * as React from "react";
import { useWizard } from "./wizard-context";
import { Upload, X, Star, AlertCircle, RefreshCw, CheckCircle2, Loader2 } from "lucide-react";
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
  const [isDragOverImages, setIsDragOverImages] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const triggerImageUpload = () => fileInputRef.current?.click();

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

  // Set selected photo as cover photo
  const handleSetCover = (id: string) => {
    const updated = images.map((img) => ({
      ...img,
      isCover: img.id === id,
    }));
    setValue("images", updated, { shouldValidate: true });
    showToast.success("Cover Photo Updated", "This image will be shown as the primary listing card banner.");
  };

  // Remove photo item from gallery and delete from Cloudflare R2 if uploaded
  const handleRemoveImage = async (id: string) => {
    const target = images.find((img) => img.id === id);
    
    // Delete from R2 if key exists
    if (target?.key) {
      try {
        await ListingsAPI.deletePhoto(form.getValues("id") || "", target.key);
      } catch (e) {
        console.warn("R2 photo delete error:", e);
      }
    }

    const updated = images.filter((img) => img.id !== id);
    if (target?.isCover && updated.length > 0) {
      updated[0].isCover = true;
    }
    setValue("images", updated, { shouldValidate: true });
  };

  const validPhotosCount = images.filter(img => img.status === "success" || (!img.status && img.url)).length;
  const errorPhotosCount = images.filter(img => img.status === "error").length;

  return (
    <div className="space-y-6 text-left">

      {/* Step Header */}
      <div className="space-y-1">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary tracking-tight">
          Property Photos & Gallery
        </h2>
        <p className="font-body text-xs sm:text-sm text-muted-foreground">
          Upload clear high-quality photos of bedrooms, common areas, bathrooms, and exterior.
        </p>
      </div>

      {/* Photos Dropzone Box */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pl-1">
          <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
            <span>Property Gallery</span>
            <span className="text-rose-500">*</span>
            <span className="text-muted-foreground/80 font-semibold normal-case text-[11px]">
              (Min {MIN_PHOTOS}, Max {MAX_PHOTOS} photos)
            </span>
          </label>
          <span className={cn(
            "font-heading text-xs font-bold px-2 py-0.5 rounded-md border",
            validPhotosCount >= MIN_PHOTOS 
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
          )}>
            {validPhotosCount} / {MAX_PHOTOS} Uploaded
          </span>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (images.length < MAX_PHOTOS) setIsDragOverImages(true);
          }}
          onDragLeave={() => setIsDragOverImages(false)}
          onDrop={handleImageDrop}
          onClick={() => {
            if (images.length < MAX_PHOTOS) triggerImageUpload();
          }}
          className={cn(
            "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-2 transition-all duration-300 select-none text-center bg-card/65",
            images.length >= MAX_PHOTOS
              ? "opacity-50 cursor-not-allowed border-border"
              : "cursor-pointer",
            isDragOverImages && images.length < MAX_PHOTOS
              ? "border-primary bg-primary/5 scale-[0.99]"
              : "border-border hover:border-primary hover:bg-muted/10"
          )}
        >
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            ref={fileInputRef}
            disabled={images.length >= MAX_PHOTOS}
            onChange={(e) => handleAddImages(e.target.files)}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary shadow-sm">
            <Upload className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <p className="font-heading text-xs font-bold text-primary">
              {images.length >= MAX_PHOTOS 
                ? "Maximum 10 photos limit reached" 
                : "Drag & drop photos or click to browse"}
            </p>
            <p className="font-body text-[11px] text-muted-foreground">
              Supports JPEG, PNG, WEBP formats up to 5MB per file
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Photos Grid */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between pl-1">
            <p className="font-heading text-xs font-bold text-primary uppercase tracking-wider">
              Uploaded Photos
            </p>
            {errorPhotosCount > 0 && (
              <span className="bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errorPhotosCount} Photo(s) Failed Validation
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <AnimatePresence initial={false}>
              {images.map((img) => {
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
                    <img
                      src={img.url}
                      alt={img.name}
                      className={cn(
                        "w-full h-full object-cover select-none transition-all duration-300",
                        isUploading && "blur-[2px] opacity-70",
                        isError && "grayscale opacity-50"
                      )}
                    />

                    {/* Uploading Spinner Badge */}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center p-2 text-center space-y-1">
                        <Loader2 className="w-6 h-6 text-sky-400 animate-spin" />
                        <span className="font-heading text-[9px] font-bold text-white uppercase">Uploading...</span>
                      </div>
                    )}

                    {/* Success Badge */}
                    {isSuccess && (
                      <div className="absolute top-2 right-2 bg-emerald-500/90 text-white font-heading text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md shadow-md flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Uploaded
                      </div>
                    )}

                    {/* Error Overlay with Reason and Controls */}
                    {isError && (
                      <div className="absolute inset-0 bg-rose-950/80 backdrop-blur-sm p-3 flex flex-col items-center justify-center text-center space-y-1.5">
                        <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
                        <span className="font-heading text-[9px] font-extrabold text-rose-200 uppercase line-clamp-2">
                          {img.errorReason || "Upload Failed"}
                        </span>
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => executeSingleUpload(img)}
                            className="px-2 py-1 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-heading text-[9px] font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                            Retry
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(img.id)}
                            className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-heading text-[9px] font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-2.5 h-2.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Cover Photo Badge */}
                    {img.isCover && !isError && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground font-heading text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        Cover
                      </div>
                    )}

                    {/* Hover Action Overlay */}
                    {isSuccess && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-1.5">
                        {!img.isCover && (
                          <button
                            type="button"
                            onClick={() => handleSetCover(img.id)}
                            title="Set as Cover Photo"
                            className="p-1.5 rounded-lg bg-card border border-border text-muted-foreground hover:text-emerald-500 transition-colors cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          title="Delete Photo"
                          className="p-1.5 rounded-lg bg-card border border-border text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
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

    </div>
  );
}

export default StepPhotos;
