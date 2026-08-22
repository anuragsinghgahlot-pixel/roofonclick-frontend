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
      {/* Desktop Horizontal Timeline (md+) */}
      <div className="hidden md:flex items-center justify-between w-full relative mb-10 px-4 select-none">
        {/* Connecting progress line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-border z-0" />
        <div
          className="absolute top-4 left-6 h-0.5 bg-primary z-0 transition-all duration-500 ease-out"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 92}%` }}
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
                "flex flex-col items-center gap-2 relative z-10 bg-background px-3 transition-transform duration-200 border-none outline-none select-none",
                isUnlocked ? "cursor-pointer hover:scale-[1.05]" : "cursor-not-allowed opacity-65"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-heading text-xs font-bold bg-card",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  isActive && "border-primary bg-primary/10 text-primary scale-110 shadow-sm",
                  isFuture && "border-border bg-card text-muted-foreground/60"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <span>{s.step}</span>
                )}
              </div>
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

      {/* Mobile: compact horizontal pill progress bar (below md) */}
      <div className="flex md:hidden flex-col gap-2.5 mb-4 select-none w-full max-w-full">
        {/* Step dots with connecting line */}
        <div className="relative flex items-center justify-between w-full px-1">
          <div className="absolute top-1/2 left-3 right-3 h-0.5 bg-border z-0" />
          <div
            className="absolute top-1/2 left-3 h-0.5 bg-primary z-0 transition-all duration-300 ease-out"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 92}%` }}
          />

          {STEPS.map((s) => {
            const isCompleted = s.step < currentStep;
            const isActive = s.step === currentStep;
            const isUnlocked = isStepUnlocked(s.step);

            return (
              <button
                key={s.step}
                type="button"
                disabled={!isUnlocked}
                onClick={() => isUnlocked && setStep(s.step)}
                title={s.label}
                aria-label={`Go to step ${s.step}: ${s.label}`}
                className={cn(
                  "rounded-full flex items-center justify-center border-2 transition-all duration-300 font-heading font-bold shrink-0 relative z-10 bg-background",
                  isActive
                    ? "w-6 h-6 border-primary bg-primary/10 text-primary text-[10px] shadow-xs scale-110"
                    : isCompleted
                    ? "w-5 h-5 border-primary bg-primary text-primary-foreground text-[9px]"
                    : "w-4.5 h-4.5 border-border bg-card text-muted-foreground/60 text-[8px]",
                  isUnlocked ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                )}
              >
                {isCompleted ? (
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                ) : (
                  <span>{s.step}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Current step label & completion */}
        <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground px-1">
          <span className="text-primary uppercase tracking-wide">
            {STEPS[currentStep - 1]?.label}
          </span>
          <span className="text-emerald-500 font-extrabold">
            {Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100)}% Complete
          </span>
        </div>
      </div>
    </div>
  );
}
