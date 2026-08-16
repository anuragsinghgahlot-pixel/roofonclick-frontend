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
      : "Submit for Admin Examination"
    : "Next";

  return (
    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border/60 pt-5 sm:pt-6 mt-5 sm:mt-6">
      {/* Previous Button */}
      <button
        type="button"
        disabled={isFirstStep}
        onClick={handlePrev}
        className={cn(
          "w-full sm:w-auto px-5 py-3 rounded-xl border border-border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 select-none min-h-[44px]",
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
          "w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 shadow-md select-none min-h-[44px]",
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
