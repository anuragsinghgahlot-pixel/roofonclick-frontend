"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useWizard } from "./wizard-context";
import { cn } from "@/lib/utils";

export function NavigationButtons() {
  const { currentStep, handleNext, handlePrev, handlePublish, isStepValid, isEditMode } = useWizard();

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 6;

  const handleNextClick = () => {
    if (isLastStep) {
      handlePublish();
    } else {
      handleNext();
    }
  };

  const finalButtonText = isLastStep
    ? isEditMode
      ? "Save Changes"
      : "Publish Property"
    : "Next";

  return (
    <div className="flex items-center justify-between border-t border-border/60 pt-6 mt-6">
      {/* Previous Button */}
      <button
        type="button"
        disabled={isFirstStep}
        onClick={handlePrev}
        className={cn(
          "px-5 py-3 rounded-xl border border-border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 select-none",
          isFirstStep
            ? "bg-muted/20 text-muted-foreground/30 border-muted/10 cursor-not-allowed"
            : "bg-card hover:bg-muted/40 text-muted-foreground hover:text-primary cursor-pointer"
        )}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Previous
      </button>

      {/* Next / Submit Button */}
      <button
        type="button"
        onClick={handleNextClick}
        disabled={!isStepValid}
        className={cn(
          "px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 shadow-md select-none",
          isStepValid
            ? "bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground cursor-pointer shadow-primary/10"
            : "bg-muted text-muted-foreground/50 cursor-not-allowed shadow-none"
        )}
      >
        <span>{finalButtonText}</span>
        {!isLastStep && <ArrowRight className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
