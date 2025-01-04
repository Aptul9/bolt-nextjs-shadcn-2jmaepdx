"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80"
          alt="Gym background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-40">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Smart Access Management for Modern Gyms
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Streamline your facility access, enhance security, and improve member experience with our comprehensive management system.
          </p>
<div className="flex flex-col gap-4 justify-center items-center px-10 sm:flex-row sm:gap-4 sm:space-y-0">
  <Button 
    size="lg" 
    className="bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
  >
    Get Started <ArrowRight className="ml-2 h-5 w-5" />
  </Button>
  <Button 
    size="lg" 
    variant="outline" 
    className="bg-white/10 hover:bg-white/20 text-white border-white/20 w-full sm:w-auto"
  >
    Book Demo
  </Button>
</div>

        </div>
      </div>
    </header>
  );
}