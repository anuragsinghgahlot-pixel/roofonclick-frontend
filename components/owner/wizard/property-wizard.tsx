"use client";

import * as React from "react";
import { WizardProvider, useWizard } from "./wizard-context";
import { WizardLayout } from "./wizard-layout";
import { StepBasicDetails } from "./step-basic-details";
import { StepLocation } from "./step-location";
import { StepRoomsPricing } from "./step-rooms-pricing";
import { StepAmenities } from "./step-amenities";
import { StepPhotos } from "./step-photos";
import { StepReview } from "./steps-placeholders";

function WizardContent() {
  const { currentStep } = useWizard();

  switch (currentStep) {
    case 1:
      return <StepBasicDetails />;
    case 2:
      return <StepLocation />;
    case 3:
      return <StepRoomsPricing />;
    case 4:
      return <StepAmenities />;
    case 5:
      return <StepPhotos />;
    case 6:
      return <StepReview />;
    default:
      return <StepBasicDetails />;
  }
}

export function PropertyWizard({ editPropertyId }: { editPropertyId?: string }) {
  return (
    <WizardProvider editPropertyId={editPropertyId}>
      <WizardLayout>
        <WizardContent />
      </WizardLayout>
    </WizardProvider>
  );
}

export default PropertyWizard;
