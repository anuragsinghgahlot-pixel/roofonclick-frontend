"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressTimelineProps {
  currentStep: number;
}

const STEPS = [
  { step: 1, label: "Basic Details" },
  { step: 2, label: "Location" },
  { step: 3, label: "Pricing & Sharing" },
  { step: 4, label: "Amenities" },
  { step: 5, label: "Photos & Media" },
  { step: 6, label: "Review & Publish" },
];

import { useWizard } from "./wizard-context";

export function ProgressTimeline({ currentStep }: ProgressTimelineProps) {
  const { setStep, isStepUnlocked } = useWizard();

  return (
    <div className="w-full">
      {/* Desktop Horizontal Timeline */}
      <div className="hidden md:flex items-center justify-between w-full relative mb-10 px-4 select-none">
        {/* Connecting progress line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2 -z-10 w-full" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 -z-10 transition-all duration-500 ease-out" 
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((s) => {
          const isCompleted = s.step < currentStep;
          const isActive = s.step === currentStep;
          const isFuture = s.step > currentStep;
          const isUnlocked = isStepUnlocked(s.step);

          return (
            <button
              key={s.step}
              type="button"
              disabled={!isUnlocked}
              onClick={() => isUnlocked && setStep(s.step)}
              className={cn(
                "flex flex-col items-center gap-2 relative bg-background px-3 transition-transform duration-200 border-none outline-none select-none",
                isUnlocked ? "cursor-pointer hover:scale-[1.05]" : "cursor-not-allowed opacity-65"
              )}
            >
              {/* Badge Circle */}
              <div
                className={cn(
                  "w-8.5 h-8.5 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-heading text-xs font-bold",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  isActive && "border-primary bg-primary/10 text-primary scale-110 shadow-sm",
                  isFuture && "border-border bg-card text-muted-foreground/60"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4.5 h-4.5 stroke-[3]" />
                ) : (
                  <span>{s.step}</span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "font-heading text-[10px] uppercase tracking-wider font-semibold whitespace-nowrap",
                  isActive ? "text-primary font-bold" : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile Vertical Timeline */}
      <div className="flex md:hidden flex-col gap-4 w-full mb-8 pl-2 text-left select-none">
        {STEPS.map((s) => {
          const isCompleted = s.step < currentStep;
          const isActive = s.step === currentStep;
          const isFuture = s.step > currentStep;
          const isUnlocked = isStepUnlocked(s.step);

          return (
            <button
              key={s.step}
              type="button"
              disabled={!isUnlocked}
              onClick={() => isUnlocked && setStep(s.step)}
              className={cn(
                "flex items-center gap-3.5 relative transition-all duration-200 border-none outline-none select-none text-left w-full",
                isUnlocked ? "cursor-pointer hover:translate-x-1" : "cursor-not-allowed opacity-65"
              )}
            >
              {/* Vertical connecting line */}
              {s.step < STEPS.length && (
                <div 
                  className={cn(
                    "absolute left-4.5 top-8.5 bottom-[-16px] w-[2px] bg-muted -z-10",
                    isCompleted && "bg-primary"
                  )} 
                />
              )}

              {/* Badge Circle */}
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-heading text-xs font-bold shrink-0",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  isActive && "border-primary bg-primary/10 text-primary scale-105",
                  isFuture && "border-border bg-card text-muted-foreground/60"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4.5 h-4.5 stroke-[3]" />
                ) : (
                  <span>{s.step}</span>
                )}
              </div>

              {/* Text */}
              <div className="flex flex-col gap-0.5">
                <span
                  className={cn(
                    "font-heading text-[10px] uppercase tracking-wider font-extrabold",
                    isActive ? "text-primary" : "text-muted-foreground/60"
                  )}
                >
                  Step {s.step}
                </span>
                <span
                  className={cn(
                    "font-heading text-sm font-bold",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
