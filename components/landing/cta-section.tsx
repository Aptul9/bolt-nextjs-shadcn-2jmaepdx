"use client";

import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="bg-primary text-primary-foreground py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Transform Your Gym Management?
        </h2>
        <p className="mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
          Join hundreds of gyms already using our platform to streamline their operations.
        </p>
        <Button size="lg" variant="secondary">
          Start Free Trial
        </Button>
      </div>
    </section>
  );
}