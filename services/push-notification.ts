/**
 * push-notification.ts
 * Frontend Web Push Notification manager for RoofOnClick.
 * Uses native W3C Push API and Service Workers.
 */

import { apiClient } from "@/lib/api-client";
import { showToast } from "@/lib/toast";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const PushNotificationService = {
  /**
   * Check if the browser supports Service Workers and Web Push.
   */
  isSupported(): boolean {
    return (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window
    );
  },

  /**
   * Get current browser notification permission status.
   */
  getPermission(): NotificationPermission | "unsupported" {
    if (!this.isSupported()) return "unsupported";
    return Notification.permission;
  },

  /**
   * Register the background Service Worker.
   */
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!this.isSupported()) return null;
    try {
      return await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    } catch (err) {
      console.error("[PushService] SW registration failed:", err);
      return null;
    }
  },

  /**
   * Get existing active PushSubscription if any.
   */
  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.isSupported()) return null;
    try {
      const registration = await navigator.serviceWorker.ready;
      return await registration.pushManager.getSubscription();
    } catch {
      return null;
    }
  },

  /**
   * Subscribe user device to Web Push notifications.
   */
  async subscribe(): Promise<boolean> {
    if (!this.isSupported()) {
      showToast.error("Not Supported", "Push notifications are not supported by your browser.");
      return false;
    }

    try {
      // 1. Request OS permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        if (permission === "denied") {
          showToast.warning("Permission Blocked", "Please allow notifications in your browser settings to receive alerts.");
        }
        return false;
      }

      // 2. Register Service Worker & wait for active state
      const registration = await this.registerServiceWorker();
      if (!registration) {
        throw new Error("Failed to register service worker.");
      }

      await navigator.serviceWorker.ready;

      // Ensure active worker is controlling the page
      if (registration.installing || registration.waiting) {
        await new Promise<void>((resolve) => {
          const checkState = () => {
            if (registration.active) resolve();
          };
          registration.addEventListener("updatefound", checkState);
          setTimeout(resolve, 600);
        });
      }

      // 3. Fetch VAPID public key from backend
      const keyRes = await apiClient.get<{ publicKey: string }>("/api/notifications/push/public-key");
      const publicKey = keyRes.data?.publicKey;
      if (!publicKey) {
        throw new Error("Could not retrieve VAPID key from server.");
      }

      // 4. Subscribe with PushManager (clean up stale subscription if present)
      const convertedVapidKey = urlBase64ToUint8Array(publicKey);
      let subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        try {
          await subscription.unsubscribe();
        } catch {
          // Ignored
        }
      }

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey as BufferSource,
      });

      // 5. Send subscription payload to backend
      const subscriptionJson = subscription.toJSON();
      await apiClient.post("/api/notifications/push/subscribe", {
        subscription: {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscriptionJson.keys?.p256dh,
            auth: subscriptionJson.keys?.auth,
          },
        },
        userAgent: navigator.userAgent,
      });

      showToast.success("Push Notifications Enabled", "You will now receive instant device alerts even when the app is closed.");
      return true;
    } catch (err: unknown) {
      console.error("[PushService] Subscription error:", err);

      let detailMsg = "Could not subscribe to device notifications.";
      if (err instanceof Error) {
        if (err.message.includes("push service error")) {
          // Check if Brave browser
          const isBrave = (navigator as unknown as { brave?: { isBrave?: () => Promise<boolean> } }).brave !== undefined;
          if (isBrave) {
            detailMsg = "Brave Browser requires enabling 'Use Google services for push messaging' in brave://settings/privacy.";
          } else {
            detailMsg = "Browser push service error. Please ensure Windows/Chrome notifications are enabled, or restart your browser.";
          }
        } else {
          detailMsg = err.message;
        }
      }

      showToast.error("Push Service Error", detailMsg);
      return false;
    }
  },

  /**
   * Unsubscribe user device from Web Push notifications.
   */
  async unsubscribe(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      const subscription = await this.getSubscription();
      if (subscription) {
        // Unregister on backend
        await apiClient.post("/api/notifications/push/unsubscribe", {
          endpoint: subscription.endpoint,
        });
        // Unsubscribe locally
        await subscription.unsubscribe();
      }
      showToast.info("Notifications Disabled", "Device push notifications have been turned off.");
      return true;
    } catch (err) {
      console.error("[PushService] Unsubscribe error:", err);
      return false;
    }
  },
};
