"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { evaluatePasswordStrength } from "@/lib/password-utils";
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password?: string;
  showChecklist?: boolean;
  className?: string;
}

export function PasswordStrengthMeter({
  password = "",
  showChecklist = true,
  className,
}: PasswordStrengthMeterProps) {
  const result = evaluatePasswordStrength(password);

  if (!password || password.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2.5 pt-1 text-left select-none", className)}>
      {/* Strength Bar & Level Label */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-heading font-bold">
          <span className="text-muted-foreground uppercase text-[10px] tracking-wider">
            Password Strength
          </span>
          <span className={cn("text-xs font-extrabold uppercase tracking-wider", result.textColor)}>
            {result.level}
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="h-1.5 w-full bg-muted/80 rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-300 rounded-full", result.color)}
            style={{ width: `${result.widthPercent}%` }}
          />
        </div>
      </div>

      {/* Requirement Checklist */}
      {showChecklist && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
          {result.requirements.map((req) => (
            <div
              key={req.id}
              className={cn(
                "flex items-center gap-1.5 text-[11px] font-body transition-colors duration-200",
                req.met ? "text-emerald-600 font-semibold" : "text-muted-foreground/60"
              )}
            >
              {req.met ? (
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <X className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
              )}
              <span>{req.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface ConfirmPasswordMessageProps {
  password?: string;
  confirmPassword?: string;
}

export function ConfirmPasswordMessage({
  password = "",
  confirmPassword = "",
}: ConfirmPasswordMessageProps) {
  if (!confirmPassword) return null;

  const matches = password === confirmPassword;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs font-heading font-bold pt-1 text-left select-none",
        matches ? "text-emerald-600" : "text-rose-500"
      )}
    >
      {matches ? (
        <>
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Passwords match</span>
        </>
      ) : (
        <>
          <X className="w-4 h-4 text-rose-500 shrink-0" />
          <span>Passwords do not match</span>
        </>
      )}
    </div>
  );
}
