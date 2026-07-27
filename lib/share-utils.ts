import { toast } from "sonner";

export interface ShareData {
  title: string;
  text?: string;
  url?: string;
}

export function canWebShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export async function shareProperty(data: ShareData): Promise<boolean> {
  const shareUrl = data.url || (typeof window !== "undefined" ? window.location.href : "");
  const shareTitle = data.title || "Check out this property on RoofOnClick";
  const shareText = data.text || `Find verified rooms and PG accommodation at ${shareTitle}`;

  if (canWebShare()) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      });
      return true;
    } catch (error) {
      // If user cancelled native share, do not trigger error
      if ((error as Error)?.name === "AbortError") {
        return true;
      }
      // Fallback if native share fails
      return false;
    }
  }

  return false;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }
    toast.success("Link copied to clipboard!");
    return true;
  } catch {
    toast.error("Failed to copy link.");
    return false;
  }
}

export function getSocialShareLinks(url: string, title: string, text: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${text}\n${url}`);
  const encodedTitle = encodeURIComponent(title);

  return {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(text)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedText}`,
  };
}
