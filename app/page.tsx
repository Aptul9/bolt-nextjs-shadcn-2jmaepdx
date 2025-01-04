"use client";

import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CTASection } from "@/components/landing/cta-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
    </div>
  );
}