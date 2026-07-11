import * as React from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export function Testimonials() {
  return (
    <Section size="lg" className="border border-dashed border-border rounded-xl bg-card text-card-foreground">
      <Container>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-xl font-bold font-heading text-primary">Testimonials Section</h3>
          <p className="text-xs text-muted-foreground mt-2 max-w-md">
            {/* TODO: Review statements and comments carousel from occupants */}
            StayyNest Testimonials placeholder. No real UI yet.
          </p>
        </div>
      </Container>
    </Section>
  );
}
