export const STORAGE_KEYS = {
  PROPERTIES: "roofonclick_owner_published_properties",
  LEGACY_PROPERTIES: "owner_published_properties",
  PROPERTY_DRAFT: "roofonclick_property_wizard_draft",
  LEGACY_DRAFT: "property_listing_wizard_draft",
} as const;

/**
 * Safe getItem helper that handles SSR checks, missing keys, and invalid JSON
 */
export function safeGetItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(key);
    if (item === null || item === "undefined") return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`[StorageHelper] Error reading key "${key}":`, error);
    return fallback;
  }
}

/**
 * Safe setItem helper that handles quota errors and SSR checks
 */
export function safeSetItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
  } catch (error) {
    console.warn(`[StorageHelper] Error writing key "${key}":`, error);
  }
}

/**
 * Safe removeItem helper
 */
export function safeRemoveItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[StorageHelper] Error removing key "${key}":`, error);
  }
}
