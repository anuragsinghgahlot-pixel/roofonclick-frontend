/**
 * Avatar storage service abstraction.
 * Currently converts uploaded images into compressed Data URLs for local persistence.
 * Can be effortlessly swapped with S3 / Cloudinary / Supabase cloud storage in the future.
 */

export const ALLOWED_AVATAR_FORMATS = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function validateAvatarFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_AVATAR_FORMATS.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: "Unsupported format. Please upload a JPG, JPEG, PNG, or WEBP image.",
    };
  }

  if (file.size > MAX_AVATAR_SIZE_BYTES) {
    return {
      valid: false,
      error: "Image size exceeds 5MB. Please choose a smaller file.",
    };
  }

  return { valid: true };
}

/**
 * Uploads/Processes avatar file into a Data URL.
 */
export async function processAvatarUpload(file: File): Promise<string> {
  const validation = validateAvatarFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || "Invalid file selection.");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read image content."));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file from disk."));
    reader.readAsDataURL(file);
  });
}
