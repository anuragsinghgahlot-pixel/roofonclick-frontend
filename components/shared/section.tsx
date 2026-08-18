import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id, ...props }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative py-8 sm:py-10 lg:py-12", className)}
      {...props}
    >
      {children}
    </section>
  );
}

export default Section;
