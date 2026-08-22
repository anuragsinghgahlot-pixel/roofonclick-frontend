"use client";

import * as React from "react";

export function NavigationHandler() {
  React.useEffect(() => {
    const handleChunkError = (event: ErrorEvent | PromiseRejectionEvent) => {
      const errorMsg =
        event instanceof ErrorEvent
          ? event.message
          : (event.reason?.message || event.reason || "");

      if (/Loading chunk |ChunkLoadError|failed to fetch dynamically imported module/i.test(String(errorMsg))) {
        const lastReload = sessionStorage.getItem("chunk_reload_ts");
        const now = Date.now();
        if (!lastReload || now - Number(lastReload) > 10000) {
          sessionStorage.setItem("chunk_reload_ts", String(now));
          const cleanUrl = window.location.origin + window.location.pathname;
          window.location.href = cleanUrl;
        }
      }
    };

    window.addEventListener("error", handleChunkError);
    window.addEventListener("unhandledrejection", handleChunkError);
    return () => {
      window.removeEventListener("error", handleChunkError);
      window.removeEventListener("unhandledrejection", handleChunkError);
    };
  }, []);

  return null;
}

export default NavigationHandler;
