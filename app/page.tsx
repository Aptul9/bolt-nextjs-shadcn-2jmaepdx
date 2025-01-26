"use client";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CTASection } from "@/components/landing/cta-section";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { redirect } from "next/navigation";

export default function Home() {
  if (process.env.NEXT_PUBLIC_IS_LOCAL === "true") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="min-h-screen bg-background">
          <HeroSection />
          <FeaturesSection />
          <PricingSection />
          <CTASection />
        </div>
      </main>
      <Footer />
    </div>
  );
}