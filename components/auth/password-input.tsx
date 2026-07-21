"use client";

import * as React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export function PasswordInput({
  label,
  icon = <Lock className="w-4 h-4 text-muted-foreground" />,
  className,
  id,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="flex flex-col gap-1.5 text-left w-full">
      {label && (
        <label htmlFor={id} className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1 select-none">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && <div className="absolute left-3.5 flex items-center pointer-events-none">{icon}</div>}
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          className={cn(
            "w-full bg-card border border-border/80 rounded-xl pl-11 pr-11 py-3 text-sm font-semibold font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300",
            className
          )}
          {...props}
        />
        <button
          type="button"
          data-no-intercept="true"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowPassword((prev) => !prev);
          }}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3.5 p-1 rounded-md text-muted-foreground hover:text-primary transition-colors focus:outline-none cursor-pointer"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
