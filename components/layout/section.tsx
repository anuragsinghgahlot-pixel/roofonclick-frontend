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
    sm: "py-8 md:py-12",
    md: "py-12 md:py-20",
    lg: "py-16 md:py-28",
    xl: "py-20 md:py-36",
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
