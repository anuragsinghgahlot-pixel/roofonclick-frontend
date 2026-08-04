"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export function ThemeToggle({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Prevent hydration mismatch
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div className={cn("w-9 h-9 rounded-full bg-muted/30 border border-border/40 shrink-0", className)} />
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size];

  const buttonSizes = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
    lg: "w-10 h-10",
  }[size];

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      aria-label={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      className={cn(
        buttonSizes,
        "rounded-full bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60 transition-all duration-300 flex items-center justify-center cursor-pointer shadow-xs active:scale-95 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      {isDark ? (
        <Sun className={cn(iconSizes, "text-amber-400 fill-amber-400/20 transition-transform hover:rotate-45")} />
      ) : (
        <Moon className={cn(iconSizes, "text-indigo-600 fill-indigo-600/10 transition-transform hover:-rotate-12")} />
      )}
    </button>
  );
}

export default ThemeToggle;
