import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  size?: "sm" | "md" | "lg" | "xl" | "none";
}

export function Section({
  as: Component = "section",
  size = "md",
  className,
  children,
  ...props
}: SectionProps) {
  const sizeClasses = {
    none: "",
    sm: "py-6 md:py-8",
    md: "py-8 md:py-12",
    lg: "py-10 md:py-14",
    xl: "py-12 md:py-18",
  };

  return (
    <Component
      className={cn(sizeClasses[size], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
